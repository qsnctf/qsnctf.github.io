# 文件上传漏洞：验证边界、存储设计与防御

本文只讨论授权 CTF、隔离靶场和本地开发环境。生产环境验证应使用无害测试文件，禁止上传可执行载荷、覆盖他人文件或读取未授权数据。

相关主题：

- [文件包含漏洞](File_Inclusion.md)
- [解析器与服务器配置差异](Parser_Vulnerabilities.md)

## 一、上传安全不是“检查扩展名”

一个上传请求通常经过：

```text
浏览器 -> 反向代理 -> Web 服务器 -> 框架/SAPI -> 校验逻辑
       -> 临时文件 -> 最终存储 -> 下载或处理服务
```

每一层都可能对文件名、大小、内容类型和路径作出不同解释。风险不仅是“上传脚本并执行”，还包括：

- 覆盖已有文件或写到预期目录之外。
- 存储型 XSS、恶意 HTML/SVG 或内容嗅探。
- 图片、文档解析库的资源耗尽和已知漏洞。
- 压缩炸弹、归档路径穿越（Zip Slip）和符号链接落地。
- 公开对象存储泄露、越权下载和长期保存敏感数据。
- 文件名进入日志、命令、数据库或响应头后引发二次问题。
- 临时文件与异步扫描之间的竞态。

安全设计应把上传文件当成不可信字节流，而不是“用户给出的文件”。

## 二、`multipart/form-data` 的基本结构

浏览器表单示例：

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="document" accept="image/png,image/jpeg">
  <button type="submit">上传</button>
</form>
```

对应请求经过简化后类似：

```http
POST /upload HTTP/1.1
Host: lab.local
Content-Type: multipart/form-data; boundary=LabBoundary42

--LabBoundary42
Content-Disposition: form-data; name="document"; filename="photo.png"
Content-Type: image/png

[文件字节]
--LabBoundary42--
```

这里至少有三种独立信息：客户端文件名、分段中的 `Content-Type`、文件实际字节。`accept` 只改善浏览器选择体验，客户端可以绕过或重写；请求里的文件名和 `Content-Type` 也都是客户端声明，不能作为最终安全结论。

在 PHP 中还要检查上传错误，而不是假定临时文件总是完整：

```php
<?php
if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    exit('Upload failed');
}

if (!is_uploaded_file($_FILES['document']['tmp_name'])) {
    http_response_code(400);
    exit('Invalid upload');
}
```

同时在代理、Web 服务器和应用层设置一致的请求体与文件大小上限，避免前一层接收巨量数据后才由后一层拒绝。

## 三、常见验证为什么会失败

### 1. 只依赖客户端检查

JavaScript、`accept` 属性和前端文件名检查都可以被自定义 HTTP 请求绕过。它们适合提前提示用户，但服务端必须重新验证。

### 2. 只信任 `Content-Type`

分段中的 `Content-Type` 是提交者提供的元数据。例如，声明为 `image/png` 不代表字节一定是 PNG。服务端应使用受维护的内容识别库，并把识别结果与允许类型比较。

### 3. 只检查扩展名

不同层对文件名的解释可能不同，测试时应覆盖：

- 替代后缀和服务器可能注册的脚本后缀。
- 大小写变体，尤其是大小写不敏感的文件系统。
- 双扩展名，如 `report.php.jpg`，以及多扩展名处理规则。
- 末尾的点、空格或其他会被文件系统/框架裁剪的字符。
- Unicode 规范化、外观相似字符和不同分隔符。
- 无扩展名、隐藏文件和超长文件名。

这些不是一张通用“绕过字典”。现代 Linux、Windows、对象存储、Apache、Nginx 和应用框架的行为不同，应在与生产一致的栈上验证。最终存储名不应继续使用客户端文件名。

### 4. 只检查文件签名

文件头或 magic bytes 能排除一部分明显伪装，但不能证明整个文件安全。一个文件可能具有合法签名，同时包含：

- 解析器忽略的附加数据。
- 会被浏览器作为主动内容处理的格式特性。
- 触发解码器缺陷或资源耗尽的畸形结构。
- 多种解析器分别接受的复合格式。

验证必须与后续用途一致：头像应解码并重新编码为受控图片；文档归档应在隔离环境扫描和转换；仅供下载的文件也要使用固定下载响应头。

### 5. “能打开图片”不等于安全

尺寸探测函数只解析部分元数据。更可靠的图片流程是：限制总字节、限制像素数和帧数、使用更新的解码库完整解码、创建新的像素画布并重新编码为固定格式，同时删除不需要的元数据。

重新编码能消除许多附加内容，但不能修复解码库自身漏洞，也不能替代资源限制。SVG 是 XML 主动内容，不应按普通位图处理；若业务不需要，应禁用。确需 SVG 时，应使用专用净化器，并通过独立媒体域和严格响应头提供。

## 四、服务器端文件名、路径和权限风险

直接拼接客户端文件名是高风险设计：

```php
<?php
// 故意脆弱，仅用于代码审计示例。
$target = __DIR__ . '/uploads/' . $_FILES['document']['name'];
move_uploaded_file($_FILES['document']['tmp_name'], $target);
```

问题包括目录分隔符、名称冲突、覆盖、特殊设备名、日志污染和解析器差异。`basename()` 只能处理一部分路径问题，也不能解决覆盖、Unicode、保留名或执行风险。

稳妥方案是：

1. 客户端原名只作为经过长度限制和转义的展示元数据。
2. 服务端生成不可预测且不含业务语义的存储标识。
3. 扩展名由服务端根据确认后的媒体类型决定。
4. 文件存储在 Web 根目录之外，且该目录不可执行。
5. 数据库保存所有者、存储标识、确认类型、大小、哈希和扫描状态。
6. 下载必须经过鉴权控制器或受控对象存储签名 URL。

目录权限也要最小化：上传进程只需创建文件，不应修改应用代码、服务器配置或模板；提供静态文件的进程不应有写权限；异步转换服务应在隔离账户或沙箱中运行。

## 五、`.htaccess` 与 `.user.ini` 的配置前提

这两类文件经常出现在旧靶场，但绝不是所有服务器都有效。

### `.htaccess`

它是 Apache 的目录级配置机制。只有在以下条件成立时才可能影响行为：

- 请求确实由 Apache 处理，而不是 Nginx、IIS 或对象存储直接提供。
- 目标目录启用了允许覆盖的 `AllowOverride` 类别。
- 对应指令允许出现在目录上下文，且所需模块已加载。
- Apache 进程会读取该文件，文件名没有在上传时被改写。

生产环境应优先在主配置中使用 `AllowOverride None`，并显式配置上传目录不可执行、不可解释，避免让可写目录控制服务器行为。

### `.user.ini`

它主要影响 CGI/FastCGI SAPI 下的每目录 PHP 配置；Apache 模块模式、其他运行时或禁用该机制的环境行为不同。可修改的指令范围受 `PHP_INI_PERDIR`、`PHP_INI_USER` 等模式限制，并且存在缓存刷新周期。它不能任意改写所有 PHP 配置。

生产环境应确保上传目录不进入 PHP-FPM 的脚本映射范围，按需设置 `user_ini.filename`，并使用只读部署和独立存储。不要依赖“过滤掉这两个固定文件名”作为主要防线。

## 六、一个更稳健的 PHP 图片上传示例

下面示例只接受 PNG/JPEG，存储在 Web 根目录之外。它展示控制点，不替代恶意文件扫描、配额、鉴权和隔离转换。

```php
<?php
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
$storage = dirname(__DIR__) . '/private-uploads';

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    exit('Upload failed');
}

$tmp = $_FILES['image']['tmp_name'];
$size = (int) $_FILES['image']['size'];
if ($size < 1 || $size > MAX_UPLOAD_BYTES || !is_uploaded_file($tmp)) {
    http_response_code(400);
    exit('Invalid size');
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($tmp);
$extensions = [
    'image/png' => 'png',
    'image/jpeg' => 'jpg',
];

if (!isset($extensions[$mime])) {
    http_response_code(415);
    exit('Unsupported media type');
}

$imageInfo = getimagesize($tmp);
if ($imageInfo === false || $imageInfo[0] > 6000 || $imageInfo[1] > 6000) {
    http_response_code(400);
    exit('Invalid dimensions');
}

if (!is_dir($storage) || !is_writable($storage)) {
    http_response_code(500);
    exit('Storage unavailable');
}

$id = bin2hex(random_bytes(16));
$target = $storage . DIRECTORY_SEPARATOR . $id . '.' . $extensions[$mime];

if (!move_uploaded_file($tmp, $target)) {
    http_response_code(500);
    exit('Storage failed');
}

chmod($target, 0640);
echo $id;
```

若业务要求“安全头像”，应在隔离的处理服务中用 GD、Imagick 或其他受维护库完整解码并重新编码，再把新生成文件标记为可用。原始文件应保持隔离，不要在扫描完成前公开。

下载控制器示例：

```php
<?php
// $record 必须来自按当前用户鉴权后的数据库查询。
$path = $storage . DIRECTORY_SEPARATOR . $record['stored_name'];
if (!is_file($path)) {
    http_response_code(404);
    exit;
}

header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="download.bin"');
header('X-Content-Type-Options: nosniff');
header('Content-Length: ' . filesize($path));
readfile($path);
```

不要把未经清理的原始文件名直接拼入 `Content-Disposition`。需要保留国际化显示名时，使用框架提供的响应头 API 正确编码。

## 七、归档解压与 Zip Slip

归档内的条目名同样是不可信输入。脆弱逻辑会直接把条目名拼到目标目录：

```php
<?php
// 故意脆弱：条目名可能越过 $destination。
$zip->extractTo($destination);
```

安全处理需要逐项验证，并同时限制文件数量、展开后总大小、压缩比、嵌套深度和支持的条目类型：

```php
<?php
$root = realpath($destination);
if ($root === false) {
    throw new RuntimeException('Missing destination');
}

for ($i = 0; $i < $zip->numFiles; $i++) {
    $entry = $zip->getNameIndex($i);
    $normalized = str_replace('\\', '/', $entry);

    if ($normalized === '' || str_starts_with($normalized, '/') ||
        preg_match('/\A[A-Za-z]:\//', $normalized) ||
        in_array('..', explode('/', $normalized), true)) {
        throw new RuntimeException('Unsafe archive path');
    }

    // 实际实现还必须拒绝符号链接等特殊条目，并在写入时防止竞态。
}
```

仅做字符串检查仍不够。成熟实现应使用能检查条目类型和属性的归档库，在新建的隔离目录中解包，拒绝符号链接、硬链接和设备文件，达到任一资源上限立即终止，再把通过验证的结果移动到最终存储。不要让解压目录位于 Web 根目录或应用代码目录。

## 八、竞态条件与异步处理

典型危险流程是：

```text
上传 -> 放入公开目录 -> 异步扫描 -> 扫描失败后删除
```

在扫描完成前，文件已经存在可访问窗口。另一个常见问题是先按路径验证文件，随后转换器打开同一路径；若路径可被替换或指向符号链接，验证对象和处理对象可能不同。

更安全的状态机是：

```text
接收至私有隔离区
-> 计算哈希并记录 pending
-> 在受限进程中验证/扫描/转换
-> 生成新的安全派生文件
-> 原子发布并标记 ready
-> 仅允许下载 ready 对象
```

每一步使用不可预测标识和最小权限。后台任务从数据库记录或受控文件句柄获取对象，不信任队列消息携带的任意路径。失败、超时和重复任务都要进入确定状态并清理残留。

## 九、与解析器和文件包含的组合风险

上传文件能否执行，不只由扩展名决定，还由 Web 服务器、PHP-FPM、容器挂载和目录配置共同决定。详情参见[解析器与服务器配置差异](Parser_Vulnerabilities.md)。

即使上传目录不可通过 URL 访问，如果应用存在动态 `include`，上传文件、临时文件或处理产物仍可能成为本地包含目标。详情参见[文件包含漏洞](File_Inclusion.md)。因此需要同时满足：

- 上传存储与模板、日志、会话和应用代码隔离。
- Web 服务器不把存储目录映射到脚本运行时。
- 应用不存在用户可控的动态包含路径。
- 文件服务域不携带主站 Cookie，并设置 `nosniff` 与合适的下载策略。

## 十、检查清单

### 接收与验证

- [ ] 已在代理、Web 服务器和应用层设置一致的请求大小限制。
- [ ] 已检查 multipart 解析错误、文件数量、空文件和截断。
- [ ] 不信任客户端文件名、`Content-Type` 或前端 `accept`。
- [ ] 验证方式与业务用途一致，而不是只看扩展名或文件头。
- [ ] 图片限制字节、像素、帧数，并在隔离环境完整解码和重新编码。
- [ ] 解析器和扫描工具有补丁、超时、内存与 CPU 限制。

### 命名与存储

- [ ] 使用服务端随机标识和由服务端确定的扩展名。
- [ ] 客户端原名仅作受限展示元数据，不参与路径计算。
- [ ] 文件位于 Web 根目录之外，目录明确不可执行。
- [ ] 上传账户不能修改应用代码、模板和服务器配置。
- [ ] 下载经过对象级鉴权，并使用固定安全响应头。
- [ ] 私有对象、扫描状态和生命周期清理都有审计记录。

### 归档与并发

- [ ] 归档逐项验证路径和条目类型，拒绝链接及特殊文件。
- [ ] 限制条目数、展开总大小、压缩比和嵌套深度。
- [ ] 解压发生在隔离目录，不直接写入发布目录。
- [ ] 扫描完成前对象不可公开，发布使用明确状态和原子操作。
- [ ] 验证与处理之间不会因路径替换或符号链接产生竞态。

### 部署

- [ ] 已确认 Apache、Nginx、IIS、PHP-FPM 等实际解析映射。
- [ ] Apache 上传目录不允许 `.htaccess` 覆盖配置。
- [ ] PHP-FPM 不把上传路径当脚本，`.user.ini` 不构成配置入口。
- [ ] 自动化测试覆盖大小写、双扩展、末尾字符和平台路径差异。
