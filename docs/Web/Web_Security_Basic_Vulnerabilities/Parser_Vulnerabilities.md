# 解析器与服务器配置差异：诊断和现代加固

本文面向授权 CTF、隔离靶场和本地配置审计。涉及的许多案例来自旧版本或特定错误配置，不能当成所有 Apache、Nginx、IIS、Tomcat 或 PHP 环境的通用行为。分析前必须记录实际组件、版本、模块和配置。

相关主题：

- [文件上传漏洞](File_Upload.md)
- [文件包含漏洞](File_Inclusion.md)

## 一、漏洞常出现在“解释权”不一致处

一个请求可能被多层组件依次解释：

```text
客户端
-> CDN/WAF/反向代理
-> Web 服务器
-> 路由或重写规则
-> CGI/FastCGI/应用运行时
-> 文件系统
```

每一层都可能回答不同问题：

- URL 是否已经解码，解码了几次？
- `//`、`.`、`..`、反斜杠和分号如何处理？
- 哪一部分是脚本名，哪一部分是 `PATH_INFO`？
- 文件扩展名由最左、最右还是某个已注册后缀决定？
- 路径是否区分大小写，末尾点或空格是否保留？
- 请求应作为静态文件返回，还是交给 PHP、CGI、JSP 等运行时？

当安全校验看到的是字符串 A，而最终处理器执行的是资源 B，就形成解析边界问题。文件内容本身未必特殊，危险来自组件对“同一个请求”的不同理解。

## 二、先建立可验证的诊断模型

不要从一个历史 payload 推断整套服务器行为。授权实验中应建立最小矩阵：

| 层 | 要记录的内容 |
| --- | --- |
| 入口代理 | 原始请求目标、Host、Content-Length/Transfer-Encoding、规范化后的上游 URI |
| Web 服务器 | 命中的 location/directory、重写结果、静态或动态处理器 |
| FastCGI/CGI | `SCRIPT_FILENAME`、`SCRIPT_NAME`、`PATH_INFO`、`DOCUMENT_ROOT` |
| 应用 | 框架路由参数和最终打开的资源 |
| 文件系统 | 规范路径、文件类型、大小写及符号链接解析结果 |

在本地 PHP-FPM 诊断页中可以临时输出无敏感字段：

```php
<?php
header('Content-Type: text/plain; charset=utf-8');
foreach (['REQUEST_URI', 'SCRIPT_NAME', 'SCRIPT_FILENAME', 'PATH_INFO'] as $key) {
    printf("%s=%s\n", $key, $_SERVER[$key] ?? '(unset)');
}
```

只在隔离环境使用，并在验证后删除。生产环境应将必要字段写入访问受控的结构化日志，不能向客户端泄露绝对路径或环境变量。

诊断时使用自己创建的无害文件，例如 `probe.txt`、`probe.php`（只输出固定字符串）和一张真实图片。比较状态码、响应头、响应体、各层日志与进程访问记录。只看到 `200` 不代表脚本执行，可能只是错误页、前端路由回退或静态返回。

## 三、Apache：多扩展名和处理器映射

Apache 支持按文件名后缀关联媒体类型、语言、编码和处理器。历史配置中，`mod_mime` 的多扩展名语义、`AddHandler`、`SetHandler`、内容协商和目录级覆盖可能组合出意外结果。

例如，管理员若宽泛地把某后缀注册为脚本处理器，带多个扩展名的文件是否执行将取决于：

- 使用的是 `AddHandler`、`AddType`、`SetHandler` 还是代理到 PHP-FPM 的规则。
- 各模块和 Apache 版本的实际语义。
- 是否启用 `MultiViews` 或其他内容协商。
- `<FilesMatch>` 正则是否锚定到文件名末尾。
- 子目录中的 `.htaccess` 是否允许覆盖配置。

因此，“Apache 总是从左向右识别扩展名”或“最后一个扩展名永远决定处理器”都不严谨。必须查看最终处理器映射。

一个更明确的 PHP-FPM 思路是只匹配以 `.php` 结尾的真实文件，并禁止上传目录进入该规则。下面是示意配置，实际 socket、权限和 Apache 版本需按部署调整：

```apache
AllowOverride None
Options -MultiViews -ExecCGI

<FilesMatch "(?i)\.php$">
    SetHandler "proxy:unix:/run/php/php-fpm.sock|fcgi://localhost/"
</FilesMatch>

<Directory "/srv/app/uploads">
    AllowOverride None
    Options -ExecCGI -Indexes
    <FilesMatch "(?i)\.(php|phtml|phar)$">
        Require all denied
    </FilesMatch>
</Directory>
```

仅拒绝几个后缀不是上传安全边界。更可靠的方案仍是把文件放到 Web 根目录之外，并由下载控制器提供，参见[文件上传漏洞](File_Upload.md)。

### Apache 诊断清单

- 使用 `apachectl -M` 或平台等价命令确认加载模块。
- 使用 `apachectl -S`、配置转储和虚拟主机日志确认命中站点。
- 搜索 `AddHandler`、`AddType`、`SetHandler`、`FilesMatch`、`MultiViews` 和 `AllowOverride`。
- 检查父目录与子目录配置是否叠加。
- 确认 PHP 运行方式是模块、CGI 还是代理到 FastCGI。

## 四、Nginx 与 PHP-FPM：历史 PATH_INFO 错配

Nginx 本身不执行 PHP，它根据 `location` 和 `fastcgi_pass` 把请求交给 PHP-FPM。历史上常见的危险配置是正则 location 过宽，并通过 `fastcgi_split_path_info` 或字符串拼接构造 `SCRIPT_FILENAME`。在某些旧 PHP/PHP-FPM 配置中，`cgi.fix_pathinfo` 还可能尝试沿路径寻找已有脚本。

旧教程常描述“图片名后追加 `/x.php` 就会执行”。这不是现代 Nginx/PHP-FPM 的固有功能，而是特定 location、FastCGI 参数、文件存在检查和旧版运行时行为共同导致的结果。

一个较严格的示意配置：

```nginx
server {
    root /srv/app/public;

    location /uploads/ {
        try_files $uri =404;
        types { }
        default_type application/octet-stream;
        add_header X-Content-Type-Options nosniff always;
    }

    location ~ \.php$ {
        try_files $uri =404;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param SCRIPT_NAME $fastcgi_script_name;
        fastcgi_pass unix:/run/php/php-fpm.sock;
    }
}
```

还应在 PHP 配置中评估并通常设置：

```ini
cgi.fix_pathinfo=0
```

配置片段不是可直接复制到所有发行版的完整方案。`alias` 与 `root` 的路径计算不同；`try_files`、符号链接、前端控制器路由和发行版自带的 `fastcgi.conf` 也会改变结果。上线前用 `nginx -T` 查看合并配置，并针对每个上传路径验证最终 `SCRIPT_FILENAME`。

## 五、IIS：遗留分号与脚本映射行为

旧版 IIS、旧 ASP/ASP.NET 处理链以及特定脚本映射曾出现对分号、PATH_INFO 或文件名后缀理解不一致的案例。某层可能把分号后的部分视为路径参数，另一层却按前面的脚本后缀选择处理器。

这些行为高度依赖：

- IIS 主版本、经典或集成管道模式。
- 请求筛选（Request Filtering）设置。
- 通配符脚本映射、处理程序映射和 ASP.NET 版本。
- Windows 文件系统规范化及应用自己的路由逻辑。

不能把“文件名中加入分号即可绕过”描述为现代 IIS 通用结论。对受支持版本的 IIS，应删除遗留通配符映射，仅为明确路径和扩展名注册必要处理器；启用请求筛选，拒绝双重转义和不需要的高风险序列；上传存储放在站点目录之外。

诊断时查看 IIS Failed Request Tracing、处理程序映射、请求筛选日志和应用路由日志，确认请求究竟由 StaticFile、ASP.NET、FastCGI 还是其他模块处理。

## 六、Tomcat/JSP：遗留后缀与映射案例

Tomcat 根据 Servlet 映射决定请求交给 DefaultServlet、JspServlet 还是应用 Servlet。旧版本、特定连接器和错误映射中，曾有末尾斜杠、分号路径参数、大小写、特殊后缀或 JSP 映射边界方面的安全问题。

现代分析应从实际映射出发：

```xml
<servlet-mapping>
    <servlet-name>jsp</servlet-name>
    <url-pattern>*.jsp</url-pattern>
</servlet-mapping>
```

需要确认：

- Tomcat/JDK 版本是否仍受支持并已安装安全更新。
- 应用或全局 `web.xml` 是否增加了宽泛映射。
- 前置 Apache/Nginx/AJP 连接器是否先改写或解码路径。
- 上传目录是否位于展开后的 Web 应用中。
- 应用是否允许覆盖 JSP、类文件或配置。

“某个特殊尾缀必然按 JSP 执行”通常只对某段历史版本和配置成立。硬化重点是更新容器、移除默认示例、禁用不需要的 AJP/管理端点、收紧 Servlet 映射，并把用户文件移出 webapp 与 JSP 编译范围。

## 七、CGI/FastCGI 错配

CGI 和 FastCGI 的安全边界是 Web 服务器如何选择可执行程序，以及向它传递哪些元变量。常见配置错误包括：

- 把整个可写目录标记为 CGI 可执行目录。
- 使用未锚定的后缀正则，将额外路径也交给脚本运行时。
- 直接基于未经规范化的 URI 构造 `SCRIPT_FILENAME`。
- 允许客户端可控请求头覆盖本应由服务器设置的 CGI 变量。
- 运行时账户对应用、上传和配置目录拥有过多写权限。
- 使用已停止维护的 CGI 包装器或运行时版本。

安全原则是“先由服务器确定一个存在、受信任的脚本，再把有限的路由信息交给它”，而不是让运行时自行猜测磁盘脚本。

对于 PHP-FPM：

- 使用独立 pool 和最小权限账户。
- socket 只允许对应 Web 服务器访问，不暴露到不可信网络。
- 限制可执行脚本目录，设置合理的超时、内存和进程上限。
- 明确 FastCGI 参数来源，不从客户端请求头透传关键变量。
- 将上传、缓存、日志和会话目录置于脚本根目录之外。

## 八、文件系统差异与路径规范化

即使代理和运行时规则相同，底层文件系统也可能改变结果：

| 差异 | 可能影响 |
| --- | --- |
| 大小写敏感性 | 校验拒绝 `.php`，文件系统或处理器却接受大小写变体 |
| 末尾点/空格 | 某层保留，另一层创建或打开文件时裁剪 |
| 路径分隔符 | 反斜杠在一层是普通字符，在另一层是目录分隔符 |
| Unicode 规范化 | 视觉相同名称在不同层归一化为相同或不同文件 |
| 符号链接/连接点 | 字符串位于允许目录，实际资源却指向目录外 |
| 8.3 短文件名等遗留特性 | 旧 Windows 配置中可能产生额外别名 |

防御不能只依赖字符串替换。应尽早做一次明确的 URI 解析和规范化，拒绝不符合路由语法的输入；文件访问使用固定根目录、服务端生成名称和最小权限；跨 Windows/Linux 部署时在两类平台分别测试。

需要特别区分：URL 路径规范化、应用路由规范化和文件系统规范化不是同一步。代理提前解码 `%2F`，应用再次解码，可能让两层看到不同段数。应记录原始请求目标和规范化结果，并确保入口层与应用层采用一致策略。

## 九、请求走私只作为边界背景

请求走私也属于“组件解析不一致”，但对象是 HTTP 消息边界，而不是文件扩展名。前端代理与后端若对 `Content-Length`、`Transfer-Encoding`、HTTP/1.1 与 HTTP/2 转换的理解不同，可能把同一字节流切分成不同请求。

它与本章的联系在于诊断方法：明确每一层的输入、规范化和转发结果。但请求走私是独立且高影响的测试领域，不应通过随意向生产连接发送歧义报文来验证。

现代防御包括：

- 更新代理、负载均衡器和 Web 服务器。
- 在入口拒绝歧义或畸形的消息长度组合。
- 规范化后重新生成上游请求，不原样转发冲突头。
- 尽量减少不同 HTTP 实现的复杂链路，并启用厂商推荐的严格模式。
- 仅在隔离测试环境使用专门工具验证，生产侧优先依靠配置审计、版本核对和供应商指导。

## 十、系统化诊断流程

### 1. 盘点真实栈

记录 CDN、WAF、代理、Web 服务器、连接器、运行时、框架和文件系统，不要只记录响应头中的品牌。响应头可能被隐藏或伪装。

### 2. 导出有效配置

查看合并后的配置，而非只看某个片段：Nginx 使用 `nginx -T`，Apache 使用配置转储和模块列表，IIS 导出站点与处理器设置，Tomcat 同时检查全局和应用 `web.xml`。

### 3. 构建无害探针矩阵

测试正常静态文件、正常脚本、多个点号、大小写、末尾分隔符、PATH_INFO 和编码路径。探针只输出固定标记，不执行命令或访问敏感文件。

### 4. 关联各层日志

为请求加入实验请求 ID，在代理、Web 服务器、FastCGI 和应用日志中关联。重点比较原始 URI、重写后 URI、处理器、脚本文件名和响应类型。

### 5. 从操作系统确认资源

在本地可使用进程监控、审计日志或系统调用跟踪确认最终打开的文件。不要仅凭扩展名和响应内容推断。

### 6. 修复后做负向测试

确认非脚本路径不会进入运行时、上传目录没有处理器、非法规范化路径得到一致的 `400` 或 `404`，并把这些请求加入自动化回归测试。

## 十一、现代硬化基线

- 只运行受支持且已更新的代理、服务器、运行时和解析库。
- 减少处理器数量，删除示例、遗留 CGI、通配符映射和不需要的模块。
- 脚本映射使用锚定规则，并在转发前确认目标是预期脚本文件。
- 上传、日志、缓存、会话和用户内容位于 Web 根目录及脚本根目录之外。
- 用户内容使用独立域名或下载服务，不携带主站 Cookie，设置 `X-Content-Type-Options: nosniff`。
- 部署目录只读；Web 与运行时账户遵循最小权限，不能修改配置和代码。
- 统一代理与应用对解码、斜杠、大小写、分号和非法路径的处理策略。
- 禁止目录级配置覆盖，或只开放经过审查的最小指令集合。
- 生产环境隐藏详细错误，但保留可关联的结构化安全日志。
- 对多扩展名、PATH_INFO、编码路径和跨平台差异建立回归测试。

## 十二、检查清单

### 识别

- [ ] 已确认每个组件的产品、版本、模块、运行模式和支持状态。
- [ ] 已导出并审查合并后的有效配置。
- [ ] 已画出 URI 从入口到文件系统的解码、重写和路由过程。
- [ ] 已记录最终处理器以及 CGI/FastCGI 关键变量。
- [ ] 历史案例均已核对版本和配置前提，没有当作普遍行为。

### 验证

- [ ] 只在授权环境使用无害固定标记探针。
- [ ] 测试覆盖多扩展、大小写、末尾字符、PATH_INFO 和编码路径。
- [ ] 已关联代理、服务器、运行时和应用日志。
- [ ] 已区分静态返回、脚本执行、错误页和前端路由回退。
- [ ] 已在实际文件系统与部署平台验证路径语义。

### 加固

- [ ] 只有明确脚本目录和锚定后缀会进入运行时。
- [ ] 转发 FastCGI/CGI 前验证脚本真实存在且位于固定根目录。
- [ ] 上传与其他可写目录不在脚本映射和 Web 根目录内。
- [ ] Apache 覆盖配置、Nginx PATH_INFO、IIS 处理器和 Tomcat Servlet 映射已最小化。
- [ ] 请求规范化策略在入口与应用之间一致。
- [ ] 修复已转化为自动化负向测试和部署配置检查。

解析器硬化只能解决“文件如何被解释”。上传入口还需要内容验证、随机命名和私有存储，参见[文件上传漏洞](File_Upload.md)；动态模板或文件路径则应使用固定映射，参见[文件包含漏洞](File_Inclusion.md)。
