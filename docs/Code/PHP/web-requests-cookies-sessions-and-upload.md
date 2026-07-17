# Web 请求、Cookie、Session 与上传
本篇以传统 PHP Web 请求为主线，介绍超全局变量、响应、Cookie、Session 和文件上传。
所有示例仅用于本机开发，生产系统还应结合框架、中间件、反向代理和部署加固。
## 请求生命周期
一次典型请求依次经过客户端、反向代理或 Web 服务器、PHP-FPM 和入口脚本。
服务器根据方法、路径、请求头和请求体构造 PHP 可见的请求数据。
入口脚本验证输入、执行授权、调用业务与数据层，然后生成状态码、响应头和响应体。
脚本结束后普通变量被释放；数据库、缓存和 Session 才用于跨请求状态。
任何输出一旦发送，都可能使后续 `header()` 或 `setcookie()` 失败。
## 本地请求实验
建立仅含学习文件的目录后运行：
```bash
php -S 127.0.0.1:8000 -t public
```
内置服务器不是生产服务器，不要绑定公网地址。
可用浏览器或固定本机地址的 HTTP 客户端验证请求，不进行扫描或批量探测。
## 常用超全局变量
- `$_GET`：查询字符串参数。
- `$_POST`：通常由表单编码或 multipart 请求解析出的字段。
- `$_FILES`：multipart 上传文件元数据。
- `$_COOKIE`：客户端提交的 Cookie。
- `$_SERVER`：请求方法、服务器信息和部分请求头。
- `$_SESSION`：启动 Session 后的服务端会话数据。
- `$_ENV`：是否填充取决于配置，不宜假定完整。
- `$_REQUEST`：混合多个来源，来源优先级受配置影响，通常应避免。
超全局变量可在任意作用域访问，但最好在入口层读取并转换为明确的数据对象。
## 请求方法与路径
```php
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit;
}
```
方法检查不能代替 CSRF 防护、认证和授权。
`REQUEST_URI` 可能含查询字符串与编码字符，路由器应使用经过定义的解析规则。
反向代理提供的转发头只有在代理可信且服务器正确配置时才能采用。
不要直接信任 `X-Forwarded-For` 判断客户端身份或权限。
## 查询与表单输入
```php
$page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1, 'max_range' => 1000],
]);
if ($page === false || $page === null) {
    $page = 1;
}
```
`filter_input()` 读取原始请求输入，并不提供适合所有字段的通用过滤。
名称、邮箱、枚举、金额和日期应各自采用明确的格式、长度与范围规则。
验证失败应返回可控错误，不要让无效值静默进入数据库。
## 读取 JSON 请求体
`$_POST` 不会自动解析 `application/json`：
```php
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$mediaType = strtolower(trim(explode(';', $contentType, 2)[0]));
if ($mediaType !== 'application/json' && !str_ends_with($mediaType, '+json')) {
    http_response_code(415);
    exit;
}
$raw = file_get_contents('php://input', false, null, 0, 1_000_001);
if ($raw === false || strlen($raw) > 1_000_000) {
    http_response_code(413);
    exit;
}
try {
    $data = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    http_response_code(400);
    exit;
}
```
Web 服务器和 PHP 配置也应限制请求体大小，应用层限制是纵深防御。
确认解码结果结构、必填字段和字段类型，不能只判断 JSON 语法正确。
## 响应状态与响应头
```php
http_response_code(201);
header('Content-Type: application/json; charset=UTF-8');
echo json_encode(['id' => 7], JSON_THROW_ON_ERROR);
```
在输出正文前设置响应头。
不要把未经验证的外部文本直接放入响应头，避免换行与响应拆分风险。
下载响应还需设置安全的内容类型，并谨慎生成 `Content-Disposition` 文件名。
生产错误响应不应泄露堆栈、绝对路径、SQL 或配置。
## HTML 输出编码
```php
function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
echo '<p>' . e($displayName) . '</p>';
```
编码必须发生在输出边界，并匹配 HTML 文本、属性、URL、JavaScript 等具体上下文。
不要先全局转义再存数据库，否则会造成双重编码和数据语义混乱。
现代模板引擎的自动转义也需确认上下文和显式关闭转义的位置。
## Cookie 基础
Cookie 保存在客户端，每次匹配域、路径和策略的请求会自动携带。
因此 Cookie 可被用户修改，不能直接存放可信角色或授权结论。
```php
setcookie('preferences', 'compact', [
    'expires' => time() + 86400,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax',
]);
```
`Secure` 要求 HTTPS，`HttpOnly` 限制脚本读取，`SameSite` 减少部分跨站请求风险。
这些属性是纵深防御，不能代替 XSS 修复和 CSRF 令牌。
删除 Cookie 时应使用相同的名称、路径和域，并设置过去的过期时间。
## Session 工作方式
PHP Session 通常只把随机会话标识放在 Cookie 中，数据存于服务端。
```php
$isHttps = filter_var(getenv('APP_HTTPS') ?: 'false', FILTER_VALIDATE_BOOL);

session_start([
    'cookie_secure' => $isHttps,
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'use_strict_mode' => true,
]);
$_SESSION['user_id'] = 42;
```
`$isHttps` 应由可信的部署配置给出，不能直接相信客户端伪造的请求头。本地 `http://127.0.0.1` 实验需要设为 `false`，否则浏览器不会回传 Secure Cookie；生产认证站点必须使用 HTTPS 并设为 `true`。
登录成功、权限提升等身份边界应重新生成会话 ID：
```php
session_regenerate_id(true);
```
注销时清空会话数据、删除会话 Cookie，并销毁服务端会话。
## Session 安全与并发
会话标识必须随机、不可预测且不得进入 URL、日志或错误页。
设置空闲超时和绝对超时，敏感操作可要求重新认证。
默认文件型 Session 会在请求期间加锁；长请求可在完成写入后调用 `session_write_close()`。
分布式部署需要共享且受保护的 Session 存储，并考虑过期、锁和故障策略。
不要在 Session 中保存密码、完整支付数据或巨大对象图。
## CSRF 防护
Cookie 会被浏览器自动附带，因此改变状态的请求需要防范跨站请求伪造。
生成随机令牌并绑定当前 Session：
```php
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));
```
提交时使用 `hash_equals()` 严格比较，并在失败时拒绝请求。
令牌不应出现在 URL；敏感操作还应检查方法、来源策略和用户权限。
`SameSite` 可降低风险，但浏览器兼容、子域和业务流程使其不能单独承担防护。
## 上传请求结构
表单需使用 `multipart/form-data`，上传结果位于 `$_FILES`：
```php
$file = $_FILES['document'] ?? null;
if (!is_array($file) || $file['error'] !== UPLOAD_ERR_OK) {
    throw new RuntimeException('上传失败');
}
```
必须分别处理 `UPLOAD_ERR_INI_SIZE`、`UPLOAD_ERR_PARTIAL` 等错误。
客户端文件名、扩展名、MIME 和路径信息全部不可信。
## 上传大小与数量限制
同时配置 Web 服务器、`post_max_size`、`upload_max_filesize` 和应用层上限。
```php
if ($file['size'] < 1 || $file['size'] > 2 * 1024 * 1024) {
    throw new RuntimeException('文件大小不符合要求');
}
```
`$_FILES['size']` 仍应结合实际临时文件检查。
限制单请求文件数量、图片尺寸、压缩展开量和后续处理时间。
超出 `post_max_size` 时 `$_POST` 与 `$_FILES` 可能为空，入口层要能识别。
## 类型识别
不要信任客户端提供的 `type`：
```php
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
$allowed = [
    'image/png' => 'png',
    'image/jpeg' => 'jpg',
];
if (!is_string($mime) || !isset($allowed[$mime])) {
    throw new RuntimeException('不支持的文件类型');
}
```
MIME 探测也不是恶意内容检测；高风险格式需专门解析、重编码或隔离扫描。
图片可在资源限制下解码并重新编码，不能仅检查文件头。
## 安全保存上传文件
目标应位于 Web 根目录之外，文件名由服务端随机生成：
```php
$name = bin2hex(random_bytes(16)) . '.' . $allowed[$mime];
$target = $uploadDirectory . DIRECTORY_SEPARATOR . $name;
if (!move_uploaded_file($file['tmp_name'], $target)) {
    throw new RuntimeException('无法保存上传文件');
}
```
启动时确认上传目录是预期固定目录、权限最小且不可执行脚本。
不要用原始文件名作为磁盘路径，也不要允许覆盖已有文件。
下载时通过记录 ID 查找服务端路径，并再次执行授权，而不是公开真实路径。
## 上传处理清单
- 拒绝非预期方法和字段结构。
- 检查 PHP 上传错误、总大小、单文件大小和文件数量。
- 使用允许列表识别必要类型，并限制解析资源。
- 随机命名，保存到 Web 根目录之外，不授予执行权限。
- 将原始显示名作为普通元数据保存并在输出时转义。
- 对下载执行认证、对象级授权和安全响应头设置。
- 定期清理孤立临时文件和过期对象。
## 小结
HTTP 输入的来源与语义必须明确，Cookie 是客户端状态，Session 是服务端状态映射。
安全上传依赖多层大小限制、内容识别、随机命名、隔离存储和下载授权。
下一篇将使用 PDO 安全访问关系型数据库。
