# SSRF：服务端请求伪造

> 本文只讨论自有系统、明确授权环境和本地 CTF 靶场中的安全测试。示例不会提供云凭据获取、`gopher` 利用链或针对真实内网的操作步骤。

## 一、SSRF 的本质

SSRF（Server-Side Request Forgery，服务端请求伪造）发生在应用根据用户可控数据，由**服务器**向另一个地址发起请求时。攻击者不能直接访问的目标，可能对应用服务器可见，因此服务端请求跨越了原本的网络信任边界。

可以将数据流概括为：

```text
用户输入 URL/主机/路径
        ↓
业务代码或网络库
        ↓
DNS、代理、重定向、协议处理
        ↓
内部服务或外部服务
```

SSRF 与命令注入不同：前者的危险汇点是网络客户端，后者的危险汇点是 Shell 或解释器。若网络请求结果又被交给命令行工具处理，风险可能串联，参见[命令执行漏洞](./Command_Execution.md)。

## 二、Source 与 Sink

### 2.1 常见输入源（Source）

- 图片、头像、文档“从 URL 导入”功能。
- Webhook、回调地址、通知地址和 OAuth 配置。
- 链接预览、网页截图、PDF 转换和爬虫。
- 代理、镜像、包下载、Feed/RSS 导入。
- 用户可控的 `Host`、`X-Forwarded-Host` 或重定向目标。
- XML、媒体文件、模板等内容中间接引用的外部资源。
- 只允许输入“主机名”或“路径”，但最终仍被拼成 URL 的字段。

输入不一定直接来自 HTTP 参数。数据库记录、消息队列、上传文件中的 URL 以及第三方 API 返回值，都可能是不可信数据。

### 2.2 常见危险汇点（Sink）

- PHP cURL、`file_get_contents()` 的 URL 包装器、Guzzle 等 HTTP 客户端。
- Python `requests`、Node.js `fetch`、Java URL/HTTP 客户端。
- Headless 浏览器、截图服务和文档渲染器。
- 调用 `curl`、`wget` 等外部程序的封装。
- 支持多种协议的通用 URL 打开函数。

审计时要从输入一路追踪到最终建立连接的位置，同时检查代理、DNS 缓存、重试和自动重定向行为。

## 三、回显型与盲 SSRF

### 3.1 回显型（In-band）

服务端把目标响应的正文、状态码、响应头或错误信息返回给用户。测试者可直接比较结果，风险也更容易被发现。即使正文不返回，响应时间和错误类型仍可能泄露网络信息。

### 3.2 盲 SSRF（Blind）

服务端发起请求，但前端只显示“任务已提交”或统一错误。是否发生请求需要通过自有的本地监听服务、应用日志、关联 ID 或测试环境中的网络遥测确认。

盲 SSRF 不代表危害较低。它仍可能触发内部有副作用的 GET 接口、向受信任服务发送请求或造成资源消耗。测试时应使用自己控制的本地接收端，并限制请求次数和超时。

## 四、主要风险

### 4.1 内部服务

应用服务器往往能访问数据库管理面板、容器服务、监控端点、服务发现或只监听回环地址的管理接口。这些服务可能依赖“网络位置可信”，缺少强认证。SSRF 会破坏这一假设。

防御上不能只依赖内部服务“不可从公网访问”。内部服务仍应认证、授权并使用 TLS；网络层还应限制发起请求的工作负载能够访问哪些目的地。

### 4.2 云实例元数据

主流云平台通常提供链路本地的实例元数据服务，用于实例配置和短期身份。若应用能任意请求该服务，可能导致敏感信息暴露。本文不提供访问路径或凭据获取步骤。

应采用云平台提供的强化元数据协议、禁用不需要的元数据访问、限制工作负载到元数据地址的网络路径，并为实例身份授予最小权限。即使凭据被暴露，权限边界和短有效期也应限制影响。

### 4.3 其他影响

- 绕过基于来源 IP 的访问控制。
- 探测内部网络服务和端口状态。
- 访问本机或编排平台控制面。
- 消耗连接、带宽、CPU 和存储，形成拒绝服务。
- 将响应内容带入解析器，引发后续漏洞。

## 五、URL 解析与规范化

“URL 是字符串”的直觉是 SSRF 防护失败的常见原因。一个 URL 至少包含协议、用户信息、主机、端口、路径、查询和片段，不同解析器对边界与非法字符的处理可能不同。

以下模式都需要在设计和测试中考虑，但不应通过手写字符串规则解决：

- 用户信息段让 `@` 前后的文本产生视觉混淆。
- 反斜杠、重复斜杠、控制字符和百分号编码造成解析差异。
- 主机名大小写、末尾点、国际化域名及 Unicode 同形字符。
- 空端口、默认端口、超大端口和协议相对 URL。
- URL 解析器与实际 HTTP 客户端采用不同语法。
- 应用先解码一次，后续组件再次解码。

可靠流程是：**只解析一次，拒绝歧义输入，提取结构化字段，规范化后按字段验证，再把验证结果绑定到实际连接。** 不要用 `startsWith("https://trusted.example")` 或正则替代 URL 解析器。

## 六、地址表示与绕过类别

只拦截字符串 `127.0.0.1` 或 `localhost` 远远不够。IP 地址可能存在多种表示和映射关系：

- IPv4 的十进制、历史上的整数/八进制/十六进制或省略段表示。
- IPv6 压缩写法、IPv4 映射 IPv6、链路本地地址和作用域标识。
- 主机名解析到回环、私有、链路本地、保留、多播或不可路由地址。
- 公网主机名包含多个 A/AAAA 记录，其中一个指向禁止网段。
- 国际化域名、大小写和末尾点在不同层被规范化。

不要尝试枚举“危险字符串”。应让成熟的 URL/DNS/IP 库完成解析，把结果转换为二进制 IP，再根据地址分类和业务允许范围判定。IPv4 与 IPv6 必须采用同一安全策略。

## 七、重定向、DNS Rebinding 与 TOCTOU

### 7.1 重定向

初始 URL 可以是允许的公网地址，但它返回的 `Location` 可能指向禁止地址。若客户端自动跟随重定向，只检查第一次 URL 就失去意义。

应关闭自动重定向，逐跳解析相对地址并重新执行完整验证，同时限制最大跳数。协议降级、跨主机跳转和非常规端口应按业务策略拒绝。

### 7.2 DNS Rebinding

域名第一次解析为允许地址，随后又解析为内部地址，这类“检查时安全、使用时危险”的变化可绕过先解析后请求的代码。低 TTL、多记录轮换以及应用与代理各自解析都可能造成类似效果。

### 7.3 TOCTOU

TOCTOU（Time Of Check To Time Of Use）指验证和实际连接之间存在时间或组件差异。仅执行一次 `gethostbyname()` 再把原域名交给 HTTP 客户端，会让客户端重新解析。

防御方法是：

1. 解析主机的全部 A/AAAA 地址，任一地址不允许就整体拒绝。
2. 从已验证地址中选择一个，并将该地址固定到本次连接。
3. TLS 仍使用原始规范化主机名完成 SNI 与证书验证。
4. 每次重定向都重新解析、验证并固定。
5. 若请求经过代理，确保代理执行等价验证，或只允许访问代理的受控目标。

## 八、协议与目标允许策略

协议应采用允许列表，通常业务只需要 `https`，本地开发最多再允许 `http`。明确拒绝文件、数据、FTP 以及 HTTP 客户端支持的其他协议。不要依靠一个不断扩大的协议黑名单。

目标策略按业务需求从强到弱可分为：

1. **固定目标映射**：用户提交资源 ID，服务端映射到预定义 URL，最可靠。
2. **精确主机允许列表**：仅允许已登记供应商域名、HTTPS 和固定端口。
3. **任意公网 HTTP(S)**：只在链接预览等确有需要的功能使用，并配合 IP 分类、重定向复验、大小/时间限制和网络出口控制。

如果业务根本不需要用户选择主机，就不要接受完整 URL。

## 九、安全 PHP 客户端示例

下面示例适合本地教学，展示“解析 URL、解析全部 IP、拒绝非公网地址、固定连接 IP、逐跳验证”的基本结构。生产环境还需结合代理架构、DNSSEC/可信解析器、响应大小限制、日志脱敏和业务允许列表。

示例故意只允许 `http`/`https`，拒绝用户信息和非常规端口，并禁用自动重定向：

```php
<?php

function isPublicIp(string $ip): bool
{
    return filter_var(
        $ip,
        FILTER_VALIDATE_IP,
        FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
    ) !== false;
}

function resolveAndValidate(string $host): array
{
    if (filter_var($host, FILTER_VALIDATE_IP) !== false) {
        $ips = [$host];
    } else {
        // 教学示例拒绝非 ASCII 域名；生产环境应明确执行 IDNA 规范化。
        if (!preg_match('/\A(?=.{1,253}\z)[A-Za-z0-9.-]+\z/', $host)) {
            throw new InvalidArgumentException('Invalid hostname');
        }

        $records = dns_get_record($host, DNS_A | DNS_AAAA);
        $ips = [];
        foreach ($records as $record) {
            if (isset($record['ip'])) {
                $ips[] = $record['ip'];
            }
            if (isset($record['ipv6'])) {
                $ips[] = $record['ipv6'];
            }
        }
    }

    $ips = array_values(array_unique($ips));
    if ($ips === []) {
        throw new RuntimeException('Hostname did not resolve');
    }
    foreach ($ips as $ip) {
        if (!isPublicIp($ip)) {
            throw new RuntimeException('Non-public destination rejected');
        }
    }
    return $ips;
}

function validateUrl(string $url): array
{
    if (strlen($url) > 2048 || preg_match('/[\x00-\x20\x7f]/', $url)) {
        throw new InvalidArgumentException('Invalid URL characters');
    }

    $parts = parse_url($url);
    if ($parts === false || !isset($parts['scheme'], $parts['host'])) {
        throw new InvalidArgumentException('Absolute URL required');
    }
    if (isset($parts['user']) || isset($parts['pass'])) {
        throw new InvalidArgumentException('User information is not allowed');
    }

    $scheme = strtolower($parts['scheme']);
    $host = strtolower(rtrim($parts['host'], '.'));
    if (!in_array($scheme, ['http', 'https'], true) || $host === '') {
        throw new InvalidArgumentException('Only HTTP(S) is allowed');
    }

    $port = $parts['port'] ?? ($scheme === 'https' ? 443 : 80);
    if (!in_array($port, [80, 443], true)) {
        throw new InvalidArgumentException('Port is not allowed');
    }

    return [$scheme, $host, $port, resolveAndValidate($host)];
}

function absoluteRedirect(string $baseUrl, string $location): string
{
    if (parse_url($location, PHP_URL_SCHEME) !== null) {
        return $location;
    }

    $base = parse_url($baseUrl);
    if (str_starts_with($location, '//')) {
        return $base['scheme'] . ':' . $location;
    }

    $origin = $base['scheme'] . '://' . $base['host'];
    if (isset($base['port'])) {
        $origin .= ':' . $base['port'];
    }
    if (str_starts_with($location, '/')) {
        return $origin . $location;
    }

    $path = $base['path'] ?? '/';
    return $origin . substr($path, 0, strrpos($path, '/') + 1) . $location;
}

function safeFetch(string $url, int $maxRedirects = 3): string
{
    for ($hop = 0; $hop <= $maxRedirects; $hop++) {
        [$scheme, $host, $port, $ips] = validateUrl($url);
        $ip = $ips[0];
        $pinnedIp = str_contains($ip, ':') ? "[$ip]" : $ip;

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => true,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
            CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
            CURLOPT_RESOLVE => ["{$host}:{$port}:{$pinnedIp}"],
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_USERAGENT => 'SafeFetcher/1.0',
        ]);

        $raw = curl_exec($ch);
        if ($raw === false) {
            throw new RuntimeException(curl_error($ch));
        }
        $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $headers = substr($raw, 0, $headerSize);
        $body = substr($raw, $headerSize);
        curl_close($ch);

        if ($status < 300 || $status >= 400) {
            if (strlen($body) > 1024 * 1024) {
                throw new RuntimeException('Response is too large');
            }
            return $body;
        }

        if (!preg_match('/^Location:\s*(.+)$/mi', $headers, $match)) {
            throw new RuntimeException('Redirect without Location');
        }
        $url = absoluteRedirect($url, trim($match[1]));
    }

    throw new RuntimeException('Too many redirects');
}
```

这个示例的关键点不是某个正则，而是连接过程与验证结果绑定。生产代码更适合使用经过安全评审的集中式出站请求服务；相对 URL 解析也应交给符合 RFC 的 URI 库，而不是自行拼接。

## 十、网络与运行时防御

应用层验证可能因库升级、代理或解析差异失效，必须配合基础设施控制：

- 默认拒绝工作负载的任意出站访问，只开放业务必需目标和端口。
- 通过受控 egress proxy 发起外部请求，并在代理层重复执行域名和 IP 策略。
- 将管理面、数据库、编排控制面和元数据服务放在独立网络边界。
- 内部服务实施双向 TLS、服务身份和细粒度授权，不信任来源 IP 本身。
- 限制连接超时、总超时、响应大小、重定向次数、并发和下载速率。
- 不把目标的任意响应头原样转发给客户端，避免 Cookie 或安全头混淆。
- 记录规范化目标、解析 IP、最终 IP、重定向链和策略拒绝原因，但不记录敏感查询参数。

## 十一、本地测试清单

仅使用自有监听器和隔离靶场：

- [ ] 列出所有直接或间接接收 URL、主机、端口、路径的功能。
- [ ] 确认只允许业务需要的协议、域名和端口。
- [ ] 测试用户信息段、末尾点、大小写、编码、超长 URL 和控制字符是否被一致拒绝。
- [ ] 覆盖 IPv4、IPv6、IPv4 映射 IPv6 和各种非公网地址分类。
- [ ] 确认解析并检查全部 A/AAAA 记录，而不是只检查第一个。
- [ ] 确认实际连接固定到已验证 IP，不会发生二次 DNS 解析。
- [ ] 测试每一跳重定向都重新验证，且存在明确跳数上限。
- [ ] 检查 HTTP 客户端、代理和 Headless 浏览器是否支持额外协议或自动跳转。
- [ ] 用本地接收端验证盲请求，并检查超时、并发和响应大小限制。
- [ ] 确认网络出口策略能独立阻断回环、私有、链路本地和控制面网段。
- [ ] 确认内部服务仍要求认证授权，不以“仅内网可达”作为安全边界。
- [ ] 检查日志是否足以关联请求，又不会保存令牌、凭据和敏感 URL 参数。

## 十二、总结

SSRF 防护不能简化为拦截几个 IP 字符串。正确模型是控制完整的服务端连接生命周期：缩小可选目标，结构化解析 URL，解析并分类全部地址，将已验证 IP 固定到连接，逐跳复验重定向，再用网络出口策略和内部服务认证提供独立保护。
