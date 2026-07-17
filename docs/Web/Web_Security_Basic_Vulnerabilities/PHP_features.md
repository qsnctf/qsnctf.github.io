# PHP 特性与 Web 安全

PHP 语法基础可以参考[PHP 编程章节](../../Code/PHP/index.md)。本章关注 CTF、代码审计和安全开发中容易形成边界错误的语言特性。

!!! warning "仅限授权环境"

    文中的输入样例只用于本地程序、课程靶场和明确授权的 CTF。不同 PHP 版本、扩展及服务器配置会改变结果，分析题目前应先确认实际环境。

## 一、动态类型不等于弱类型

“动态类型”和“弱类型”描述的是两个不同维度：

| 概念 | 关注点 | PHP 中的表现 |
| --- | --- | --- |
| 动态类型 | 类型何时确定、变量能否绑定不同类型的值 | 类型主要在运行时确定；同一变量可以先后保存整数和字符串 |
| 类型强弱 | 不同类型参与运算或比较时，是否发生较多隐式转换 | `==`、算术和字符串上下文中存在类型转换 |

PHP 变量不必先声明类型：

```php
$a = 10;       // int
$b = "hello";  // string
$c = 3.14;     // float
$d = true;     // bool

$a = "ten";    // 同一变量现在保存 string
```

变量可以改绑到不同类型的值，这是**动态类型**的表现，不能单独据此断言语言是弱类型。PHP 通常也被称为弱类型语言，主要原因是它在特定运算中允许隐式转换：

```php
echo "10" + 5; // 15
```

现代 PHP 同时支持参数、返回值、属性和常量的类型声明。文件开头的严格类型声明会改变标量参数和返回值的强制转换规则：

```php
<?php
declare(strict_types=1);

function addOne(int $value): int
{
    return $value + 1;
}

addOne("41"); // TypeError
```

需要注意：`strict_types=1` **不会**把 `==` 变成 `===`，也不会自动校验数组内部元素。它主要影响当前文件发起的用户定义函数标量参数调用；函数返回值是否允许标量强制转换，则由函数声明所在文件的严格模式决定。内部函数还可能有各自规则。

## 二、严格比较与宽松比较

PHP 有两组常见比较运算符：

| 运算符 | 含义 |
| --- | --- |
| `===`、`!==` | 类型和值都参与判断，不进行宽松类型转换 |
| `==`、`!=` | 必要时先按比较规则转换类型，再比较值 |

在本地用当前 PHP 版本运行下面的代码，可以直接观察差异：

```php
$samples = [
    [0, "0"],
    [false, "0"],
    [null, ""],
    ["10", 10],
];

foreach ($samples as [$left, $right]) {
    var_dump($left == $right, $left === $right);
}
```

安全判断中应明确类型，而不是靠输入“碰巧”转换成预期值：

```php
// 不安全：输入类型和转换规则会参与认证判断
if ($_POST['token'] == $storedToken) {
    grantAccess();
}

// 更明确：先确认类型，再进行常量时间字符串比较
if (is_string($storedToken)
    && is_string($_POST['token'] ?? null)
    && hash_equals($storedToken, $_POST['token'])) {
    grantAccess();
}
```

`in_array()` 和 `array_search()` 也有宽松与严格模式。处理身份、权限、状态枚举时应使用第三个参数 `true`：

```php
$allowed = ["0", "1", "2"];
var_dump(in_array(0, $allowed));       // 宽松比较
var_dump(in_array(0, $allowed, true)); // 严格比较
```

`switch` 在传统写法中采用宽松匹配语义；PHP 8 引入的 `match` 使用严格比较，并且要求分支覆盖或提供 `default`：

```php
$role = match ($input) {
    "admin" => 1,
    "user" => 2,
    default => 0,
};
```

## 三、数字字符串、`0e` 与版本差异

### 3.1 什么是数字字符串

完整数字字符串是去掉允许的空白后，整体符合整数或浮点数格式的字符串，例如：

```text
"42"
" 42"
"-3.5"
"1.2e3"
```

`"10abc"` 只有一个数字开头，并不是完整数字字符串。它在部分数值上下文中可能仍提取前导数字，但会产生警告；完全非数字字符串在 PHP 8 的算术中通常抛出 `TypeError`。不要把旧教程中的输出当作跨版本保证：

| 表达式 | PHP 7.x 的典型结果 | PHP 8.x 的典型结果 |
| --- | --- | --- |
| `"10" + 5` | `15` | `15` |
| `"10abc" + 5` | 得到 `15`，并可能报告 notice/warning | 得到 `15`，并报告 warning |
| `"abc" + 5` | 常得到 `5` 并报告 warning | 抛出 `TypeError` |
| `0 == "abc"` | `true` | `false` |

最后一行来自 PHP 8 的字符串与数字比较规则调整：当字符串不是数字字符串时，数字会转成字符串后再按字符串比较。具体小版本和错误级别会影响诊断信息，审计时应在目标解释器上复现。

显式转换同样可能截断内容：

```php
var_dump((int) "123abc"); // 123
var_dump((int) "abc");    // 0
```

业务代码不应使用强制转换代替格式验证。需要整数时可使用：

```php
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if ($id === false || $id === null || $id < 1) {
    http_response_code(400);
    exit('invalid id');
}
```

### 3.2 `0e` 形式

类似 `"0e12345"` 的字符串符合科学计数法，数值为 `0 * 10^12345`。两个都被识别为数字字符串的 `0e...` 值进行 `==` 比较时，可能都转换为数值零：

```php
var_dump("0e123" == "0e456");  // true
var_dump("0e123" === "0e456"); // false
```

这通常被称为“魔术哈希”问题，但漏洞根因不是哈希算法本身，而是**将摘要当作数字字符串宽松比较**。不要写：

```php
if (md5($input) == $expectedDigest) {
    // ...
}
```

应固定算法和编码形式，并使用 `hash_equals()`：

```php
$actual = hash('sha256', $input);
if (is_string($expectedDigest) && hash_equals($expectedDigest, $actual)) {
    // ...
}
```

密码不应直接保存摘要，应使用 `password_hash()` 和 `password_verify()`。PHP 8 改变了若干非数字字符串比较规则，但只要双方仍是数字字符串，`0e` 宽松比较风险就不能视为“已由升级自动修复”。

## 四、数组、参数污染与类型混淆

HTTP 参数进入 PHP 后不一定是字符串。方括号语法可生成数组：

```text
GET /lab.php?role[]=admin&role[]=user
```

此时 `$_GET['role']` 是数组。如果代码只假定它是字符串，字符串函数可能报警或抛出 `TypeError`：

```php
$role = $_GET['role'] ?? '';
if (!is_string($role)) {
    http_response_code(400);
    exit('role must be a string');
}
```

重复键也会形成参数污染：

```text
?id=1&id=2
?id[]=1&id[]=2
```

PHP、Web 服务器、反向代理、WAF 和其他后端框架对重复键可能采用“第一个”“最后一个”或“全部值”等不同策略。若安全设备检查第一个值、应用使用最后一个值，就会出现解析差异。应在入口层拒绝不符合接口模式的重复参数，并让网关与应用采用一致解析规则。

还应注意：

- PHP 会把外部变量名中的空格和点转换为下划线，例如表单字段 `user.name` 可能成为 `user_name`。
- `parse_str()` 会采用 PHP 的查询字符串解析规则；不要把不可信字符串直接解析进当前符号表。
- `$_REQUEST` 的来源和覆盖顺序受配置影响，不适合表达“参数必须来自 POST”之类的安全约束。
- JSON 请求体可携带布尔值、数字、数组、对象和 `null`，不能沿用“所有输入都是字符串”的假设。

对数组应同时验证容器类型、键集合、数量和每个元素：

```php
$tags = $_POST['tags'] ?? null;
if (!is_array($tags) || count($tags) > 10) {
    exit('invalid tags');
}

foreach ($tags as $key => $tag) {
    if (!is_int($key) || !is_string($tag) || strlen($tag) > 30) {
        exit('invalid tag');
    }
}
```

## 五、`empty()`、`isset()` 与存在性判断

这些函数回答的问题并不相同：

| 写法 | 变量不存在 | 值为 `null` | 值为 `0`、`"0"`、`false`、`[]`、`""` |
| --- | --- | --- | --- |
| `isset($x)` | `false` | `false` | `true` |
| `array_key_exists('x', $a)` | `false` | `true` | `true` |
| `empty($x)` | `true` | `true` | `true` |

`empty("0")` 为 `true`，所以“不能为空”的检查可能意外拒绝合法编号 `0`：

```php
// 含义模糊
if (empty($_POST['code'])) {
    exit('missing code');
}

// 分开表达字段存在、类型和格式
if (!array_key_exists('code', $_POST) || !is_string($_POST['code'])) {
    exit('missing code');
}
if ($_POST['code'] === '' || !preg_match('/^[0-9]+$/D', $_POST['code'])) {
    exit('invalid code');
}
```

空合并运算符 `??` 使用类似 `isset()` 的语义，键不存在或值为 `null` 时采用默认值。它适合默认值，但不能替代必填字段校验。

## 六、字符串与数字转换边界

不同 API 对输入的解释可能不同：数据库把 `001` 当数字，文件系统把它当文件名，业务层又可能把它当字符串标识。安全代码应先确定领域类型：

- 数据库主键：验证为有限范围内的整数。
- 金额：使用最小货币单位的整数或十进制定点库，不使用二进制浮点数做精确比较。
- 电话、邮编、订单号：通常应保留为字符串，避免丢失前导零。
- 布尔值：明确接受集合，例如 `true`、`false`，不要直接用 `(bool) $_GET['enabled']`，因为 `(bool) "false"` 是 `true`。

浮点数还存在 `NAN`、无穷值和精度问题。授权题目中看到金额或阈值比较时，应检查类型和边界；生产代码则应使用明确的数据模型和范围检查。

## 七、可变变量与动态回调

可变变量把一个字符串再次解释为变量名：

```php
$name = 'status';
$status = 'guest';
echo $$name; // guest
```

它容易隐藏数据流。若变量名来自请求，输入就可能选择程序中的其他变量。不要用可变变量实现字段绑定，改用键固定的数组：

```php
$profile = [
    'display_name' => '',
    'bio' => '',
];

foreach (array_keys($profile) as $field) {
    if (isset($_POST[$field]) && is_string($_POST[$field])) {
        $profile[$field] = $_POST[$field];
    }
}
```

PHP 的 callable 可以是函数名、闭包、对象方法数组或可调用对象。下列模式让输入决定执行哪个函数，风险很高：

```php
$callback = $_GET['action'];
$callback($_POST['value']);
```

安全做法是使用固定映射，并验证参数类型：

```php
$actions = [
    'lower' => static fn(string $value): string => strtolower($value),
    'upper' => static fn(string $value): string => strtoupper($value),
];

$action = $_GET['action'] ?? '';
$value = $_POST['value'] ?? null;
if (!isset($actions[$action]) || !is_string($value)) {
    exit('invalid request');
}

echo htmlspecialchars($actions[$action]($value), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
```

同样需要审计 `call_user_func()`、`call_user_func_array()`、动态方法名和基于输入的类名实例化。

## 八、流封装器与文件操作

PHP 的流封装器（stream wrapper）让同一组文件 API 可以访问不同数据源。常见概念包括：

| 封装器 | 常见用途 | 审计关注点 |
| --- | --- | --- |
| `file://` | 本地文件，通常也是默认方式 | 路径穿越、权限和符号链接 |
| `php://input` | 读取原始请求体 | 大小限制、只能按预期格式解析 |
| `php://memory`、`php://temp` | 内存或临时流 | 资源上限和敏感数据生命周期 |
| `php://filter` | 在读写时应用编码或转换过滤器 | 用户是否能控制资源和过滤器链 |
| `data://` | 内联数据 | 配置和调用点是否把数据当代码解释 |
| `http://`、`https://` | URL 流，取决于配置 | SSRF、重定向、内网和响应大小 |
| `phar://` | 访问 PHAR 归档 | 归档元数据、版本差异及不可信文件 |

在授权本地实验中，可以用无敏感内容的文本文件理解读取与转换；不要把服务器文件读取技巧用于真实站点。真正的风险取决于**用户控制了哪一部分**以及结果是否进入 `include`、反序列化、模板或命令执行等危险汇点。

`include`/`require` 会把目标作为 PHP 文件处理，不应接受用户提供的路径：

```php
// 危险：输入直接参与包含路径
include $_GET['page'];

// 安全：路由名只映射到固定文件
$pages = [
    'home' => __DIR__ . '/pages/home.php',
    'help' => __DIR__ . '/pages/help.php',
];
$page = $_GET['page'] ?? 'home';
if (!isset($pages[$page])) {
    http_response_code(404);
    exit;
}
require $pages[$page];
```

普通文件读写也要考虑：

1. 使用固定根目录和服务器生成的文件名，避免直接拼接 `../` 等路径片段。
2. 仅靠 `basename()` 不能解决所有编码、符号链接、扩展名和竞态问题。
3. 上传文件应限制大小、内容类型和允许格式，重命名后存到 Web 根目录之外。
4. 不让上传目录执行脚本，不信任客户端提供的 MIME 和扩展名。
5. URL 抓取应使用协议与主机允许列表，解析 DNS 后校验目标地址，并限制重定向、超时和响应大小。
6. 文件写入注意锁、原子替换、权限和敏感信息泄漏。

`allow_url_fopen` 与 `allow_url_include` 是不同配置，后者不应开启。配置只能降低风险，不能替代固定映射和输入验证。

## 九、序列化与魔术方法

`serialize()` 会保存 PHP 值及对象结构，`unserialize()` 会按数据重建对象。反序列化对象时可能触发或最终触发魔术方法，例如：

- `__wakeup()`：传统反序列化恢复阶段可能调用。
- `__unserialize()`：类定义该方法时用于恢复状态。
- `__destruct()`：对象销毁时调用。
- `__toString()`：对象被当作字符串时调用。
- `__call()`、`__get()`、`__set()`：访问不存在的方法或属性时调用。

如果项目依赖中存在可组合的危险魔术方法，不可信序列化数据可能形成“对象注入”。不要对 Cookie、请求参数、队列消息等不可信数据调用 `unserialize()`。

```php
// 首选：只交换数据，不恢复 PHP 对象
$data = json_decode($body, true, 16, JSON_THROW_ON_ERROR);
if (!is_array($data)) {
    throw new InvalidArgumentException('object expected');
}
```

遗留格式无法立即迁移时，`allowed_classes => false` 可以阻止对象实例化，但仍要限制输入大小、深度和允许的数据结构：

```php
$value = unserialize($storedValue, ['allowed_classes' => false]);
```

这只是收缩风险面，不应被视为处理任意敌对数据的完整方案。完整性敏感的数据还需要服务端存储或经过认证的消息签名，并正确管理密钥。

`phar://` 在旧版 PHP 和特定文件 API 组合中曾因自动处理 PHAR 元数据而与对象注入相关。PHP 8 对自动元数据反序列化行为已有变化，但归档元数据仍可被显式读取；审计时必须结合 PHP 精确版本、调用 API 和依赖类，不能照搬旧利用结论。

## 十、错误、异常与信息泄漏

开发环境需要完整错误信息，生产环境不应把堆栈、SQL、路径、配置和密钥返回给用户：

```ini
; production php.ini 示例方向
display_errors = Off
log_errors = On
```

应用层应记录带请求标识的内部错误，向客户端返回稳定且不泄漏细节的消息：

```php
try {
    $result = $service->handle($request);
} catch (Throwable $error) {
    $requestId = bin2hex(random_bytes(8));
    error_log($requestId . ' ' . $error);
    http_response_code(500);
    echo 'internal error; request=' . htmlspecialchars($requestId, ENT_QUOTES, 'UTF-8');
}
```

不要用 `@` 长期压制错误。它会隐藏真实缺陷，却不会修复失败后的状态。PHP 8 将许多旧 warning 提升为 `TypeError`、`ValueError` 或其他异常，升级时应运行测试并检查错误处理分支，不能假设代码仅会“多一条警告”。

日志本身也要防护：不要记录密码、完整令牌、Session ID 或不必要的个人数据；对换行等日志控制字符进行结构化处理，并配置权限、轮转和保留周期。

## 十一、授权 CTF 中的审计顺序

拿到 PHP 源码和本地附件后，可以按以下顺序分析：

1. 确认 PHP 精确版本、SAPI、扩展和关键 `php.ini` 配置。
2. 标记输入源：`$_GET`、`$_POST`、Cookie、请求头、JSON、上传文件和数据库数据。
3. 跟踪输入是否改变类型，特别是 `[]` 参数、JSON 类型和显式强制转换。
4. 查找 `==`、`empty()`、动态回调、动态包含、文件 API 和 `unserialize()`。
5. 区分校验、规范化和实际使用是否采用相同数据；注意代理与 PHP 的解析差异。
6. 用最小本地样例验证假设，同时记录输出、错误级别和版本。
7. 最后再形成漏洞结论，并给出严格比较、固定映射、类型验证或安全 API 等修复方式。

## 十二、安全编码检查清单

- [ ] 对参数声明预期来源、容器类型、元素类型、长度、格式和范围。
- [ ] 身份、权限、摘要和状态值使用严格比较；秘密值使用 `hash_equals()`。
- [ ] 密码使用 `password_hash()` 与 `password_verify()`。
- [ ] 不依赖 `empty()` 同时表达“存在”和“有效”。
- [ ] 拒绝意外数组、重复参数和未知 JSON 字段。
- [ ] 不让输入决定变量名、函数名、类名、方法名或包含路径。
- [ ] 文件和页面使用固定标识到固定资源的映射。
- [ ] 上传文件限制格式与大小，随机重命名并存放在不可执行目录。
- [ ] 不对不可信数据使用 `unserialize()`，优先使用 JSON 和显式数据模型。
- [ ] 数据库使用参数化查询，输出到 HTML 时按上下文编码。
- [ ] 生产环境关闭错误展示、开启受控日志，并避免记录秘密。
- [ ] 在项目支持的 PHP 版本矩阵上测试转换、异常和边界输入。
- [ ] 以最小权限运行 PHP 和数据库账户，保持 PHP、框架与依赖更新。

PHP 特性本身不是漏洞。漏洞通常产生于程序把“某种输入会保持某种类型”“某个字符串一定按某种方式转换”当作安全边界，而真实运行时并不保证这些假设。
