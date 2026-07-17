# 环境、语法与类型
本篇介绍 PHP 8.1+ 的运行方式、基本语法、类型系统、字符串与异常基础。
## 安装与确认
优先使用 PHP 官方支持渠道、操作系统包管理器或可信开发环境。
```bash
php --version
php --ini
php -r "echo PHP_VERSION, PHP_EOL;"
```
`php --ini` 可确认实际加载的 `php.ini`，避免修改了错误配置文件。
用 `php -m` 查看扩展，用 `php --ri pdo` 查看扩展配置。
不同 SAPI（CLI、FPM、Apache 模块）可能加载不同配置。
## CLI 常用方式
执行文件：
```bash
php script.php
```
检查语法但不执行：
```bash
php -l script.php
```
执行短代码：
```bash
php -r "echo 2 ** 10, PHP_EOL;"
```
读取标准输入时可使用 `STDIN`，输出使用 `STDOUT` 与 `STDERR`。
```php
$line = fgets(STDIN);
fwrite(STDOUT, trim((string) $line) . PHP_EOL);
```
CLI 参数位于 `$argv`，数量位于 `$argc`；Web SAPI 不应假设它们存在。
## 内置开发服务器
```bash
php -S 127.0.0.1:8000 -t public
```
`-t` 指定文档根目录。目录必须存在，且不应包含秘密配置或上传原件。
可提供路由脚本，但它仍只是开发工具，不应暴露到公网或用于生产。
## PHP 标签与语句
使用标准 `<?php` 标签；输出简写 `<?= $value ?>` 在现代 PHP 中始终可用。
```php
<?php
declare(strict_types=1);

$message = 'hello';
echo $message, PHP_EOL;
```
语句通常以分号结束，代码块由花括号界定。
纯 PHP 文件省略闭合标签可避免尾随空白污染输出。
## 注释与命名
```php
// 单行注释
# 也可单行，但项目通常统一使用 //
/* 多行注释 */
```
变量区分大小写，函数和类名的大小写行为不应被当作编码风格依据。
类使用 `PascalCase`，方法和变量常用 `camelCase`，常量常用 `UPPER_CASE`。
遵循项目既有规范；现代项目通常参考 PSR-12。
## 变量与常量
变量以 `$` 开头，无需提前声明：
```php
$name = 'Ada';
$age = 30;
```
读取未定义变量会产生警告并得到 `null`，不应依赖这种容错。
常量可用 `const` 或 `define()`：
```php
const MAX_RETRIES = 3;
define('APP_ENV', 'local');
```
`const` 更适合源码中静态定义；配置值通常不应伪装成全局常量。
## 标量与复合类型
常用类型包括：
- `bool`：`true` 或 `false`。
- `int`：大小依赖平台，现代 64 位环境通常为 64 位。
- `float`：IEEE 754 浮点数，不适合直接表示精确金额。
- `string`：字节序列。
- `array`：有序映射。
- `object`：类实例。
- `callable`、`iterable`：可调用值与可迭代值的类型约束。
- `null`：表示无值。
- `resource`：文件句柄等外部资源。
用 `get_debug_type()` 或 `var_dump()` 查看运行时类型。
## 类型声明
```php
function add(int $left, int $right): int
{
    return $left + $right;
}
```
PHP 8 支持联合类型，PHP 8.1 支持交叉类型和 `never`：
```php
function normalize(int|string $value): string
{
    return (string) $value;
}
```
可空类型 `?string` 等价于 `string|null`，但不能写成隐含默认空值的模糊接口。
属性也可声明类型，未初始化的类型属性不能直接读取。
`mixed` 表示允许任意类型；它不是跳过思考的默认选择。
## 严格类型的边界
文件开头可声明：
```php
declare(strict_types=1);
```
它主要决定从该文件发起的用户定义函数调用是否允许标量强制转换。
属性赋值、内部函数和其他语言行为有各自规则，因此仍需显式验证外部输入。
调用方文件决定参数是否按严格模式检查，而不是被调用函数所在文件。
## 布尔转换与空值
以下值在布尔上下文中为假：`false`、`0`、`0.0`、`''`、`'0'`、空数组和 `null`。
因此业务字段不能仅靠 `if ($value)` 判断是否存在或有效。
```php
if ($value === null) {
    // 明确处理缺失值
}
```
使用 `isset($array['key'])` 时，键不存在或值为 `null` 都返回 `false`。
需要区分两者时使用 `array_key_exists()`。
## 比较运算
`===` 和 `!==` 同时比较类型和值，应作为安全判断默认选项。
```php
var_dump('10' === 10); // false
var_dump('10' == 10);  // true
```
宽松比较 `==` 会进行类型转换，边界情况随版本规则变化且容易误判。
排序可使用 `<=>`，返回负数、零或正数。
不要用宽松比较验证哈希、令牌、角色、验证码或数据库标识符。
固定长度秘密比较可使用 `hash_equals()`，避免普通字符串比较的时序差异。
## 数值
```php
$decimal = 1_000_000;
$hex = 0xFF;
$binary = 0b1010;
$result = intdiv(7, 2);
```
除数为零会抛出错误。整数溢出可能转为浮点数，不能忽略范围检查。
金额优先使用最小货币单位整数或经过设计的十进制定点方案。
外部数字字符串可用 `filter_var()`、`ctype_digit()` 或明确正则按语义验证。
## 字符串字面量
单引号仅处理少量转义，双引号会插值变量并处理更多转义：
```php
$name = 'Lin';
$plain = 'Hello $name';
$expanded = "Hello {$name}";
```
复杂表达式不要埋入插值，先计算再拼接更清晰。
字符串连接使用 `.`，不是 `+`：
```php
$fullName = $first . ' ' . $last;
```
Heredoc 类似双引号字符串，Nowdoc 类似单引号字符串。
## 字符串是字节序列
```php
$text = '中文';
echo strlen($text);            // UTF-8 字节数
echo mb_strlen($text, 'UTF-8'); // 字符数量
```
`mbstring` 是扩展，部署前确认已安装。
不要用 `substr()` 随意截断 UTF-8 文本；使用 `mb_substr()` 并指定编码。
二进制数据可安全存入字符串，但输出和日志应使用十六进制等可控表示。
## 常用字符串操作
```php
$clean = trim($input);
$parts = explode(',', $clean);
$joined = implode(', ', $parts);
$found = str_contains($clean, 'php');
```
`trim()` 只处理指定字符集合，不等于输入验证或 HTML 安全处理。
搜索返回位置时必须严格判断：
```php
$position = strpos($text, 'a');
if ($position !== false) {
    echo $position;
}
```
位置 `0` 是有效结果，宽松判断会误认为未找到。
## 空合并与可选访问
```php
$name = $_GET['name'] ?? 'guest';
$country = $user?->profile?->country;
```
`??` 只解决缺失或 `null`，不会验证字符串长度、格式和权限。
空安全运算符 `?->` 在左侧为 `null` 时短路，不会吞掉其他异常。
## 枚举与只读属性
PHP 8.1 支持枚举，适合表达有限状态：
```php
enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';
}
```
使用 `Status::tryFrom($input)` 安全解析外部值，失败时返回 `null`。
`readonly` 属性只能初始化一次，但对象内部引用的可变对象仍需单独设计。
## 异常与 Throwable
```php
try {
    $value = riskyOperation();
} catch (DomainException $exception) {
    report($exception);
} finally {
    closeResource();
}
```
`Throwable` 是 `Exception` 与 `Error` 的共同接口。
库和领域代码应抛出语义明确的异常；入口层统一转换为安全响应和日志。
不要用空 `catch` 隐藏错误，也不要向用户展示堆栈、SQL、路径或秘密。
需要保留根因时，将原异常作为 `$previous` 传给新异常。
## 小结
可靠 PHP 程序从确认 SAPI 与配置开始，以严格比较、明确类型和上下文处理输入。
下一篇将学习 PHP 数组、控制流、函数、作用域与文件加载。
