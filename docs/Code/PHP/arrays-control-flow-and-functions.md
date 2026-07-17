# 数组、控制流与函数
本篇介绍 PHP 8.1+ 的数组模型、分支循环、函数、作用域、闭包和文件加载。
## 数组的本质
PHP 数组是保持插入顺序的映射，键只能是 `int` 或 `string`。
```php
$list = ['red', 'green'];
$user = ['id' => 7, 'name' => 'Ada'];
```
未指定键时使用下一个整数键，但删除元素后不保证重新连续编号。
数字字符串键可能转为整数，例如 `'8'`；带前导零的字符串通常保持字符串键。
## 列表与关联数组
```php
var_dump(array_is_list(['a', 'b']));       // true
var_dump(array_is_list([1 => 'a', 2 => 'b'])); // false
```
访问前检查键：
```php
if (array_key_exists('nickname', $user)) {
    $nickname = $user['nickname'];
}
```
`isset()` 会把值为 `null` 的键视为不存在。
## 增删改查
```php
$items[] = 'new';
$items['status'] = 'ready';
unset($items['status']);
```
`unset()` 删除列表元素后会留下键间隙；需要连续索引时可用 `array_values()`。
读取不存在的键会产生警告，不应靠 `null` 结果继续运行。
## 解构与展开
```php
[$first, $second] = ['a', 'b'];
$merged = [...$left, ...$right];
```
字符串键展开在现代 PHP 中可用，后出现的同名字符串键覆盖前值。
整数键会重新编号；若要保留特定合并语义，应明确选择 `+` 或 `array_merge()`。
数组联合运算符 `+` 保留左侧已有键，不等于递归合并。
## 遍历
```php
foreach ($user as $key => $value) {
    echo $key, ': ', $value, PHP_EOL;
}
```
需要原地修改时可按引用遍历：
```php
foreach ($numbers as &$number) {
    $number *= 2;
}
unset($number);
```
循环后必须 `unset()` 引用变量，避免后续赋值意外修改最后一个元素。
## 常用数组函数
```php
$squares = array_map(fn (int $n): int => $n * $n, $numbers);
$even = array_filter($numbers, fn (int $n): bool => $n % 2 === 0);
$sum = array_reduce($numbers, fn (int $carry, int $n): int => $carry + $n, 0);
```
`array_filter()` 保留原键；若需要 JSON 数组，应在过滤后调用 `array_values()`。
`in_array()` 默认宽松比较，处理外部数据时传入第三个参数 `true`：
```php
if (in_array($role, ['reader', 'editor'], true)) {
    // 允许的角色
}
```
`array_search()` 也应传严格模式，并用 `!== false` 判断返回值。
## 排序
`sort()` 按值排序并重建整数键，`asort()` 按值排序且保留键，`ksort()` 按键排序。
自定义比较器返回负数、零或正数：
```php
usort($users, fn (array $a, array $b): int => $a['id'] <=> $b['id']);
```
比较器应稳定表达全序，不要返回布尔值。
## 条件分支
```php
if ($score >= 90) {
    $grade = 'A';
} elseif ($score >= 60) {
    $grade = 'P';
} else {
    $grade = 'F';
}
```
条件会进行布尔转换，业务判断应尽量写出明确比较。
## switch 与 match
`switch` 的 `case` 比较历史上采用宽松语义，并需注意 `break` 防止贯穿。
PHP 8 的 `match` 使用严格比较、返回值且不贯穿：
```php
$label = match ($status) {
    'draft' => '草稿',
    'published' => '已发布',
    default => '未知',
};
```
没有匹配且无 `default` 会抛出 `UnhandledMatchError`。
对有限状态优先结合枚举与 `match`，让遗漏更容易暴露。
## 循环
```php
for ($i = 0; $i < 3; $i++) {
    echo $i, PHP_EOL;
}
while ($queue !== []) {
    $item = array_shift($queue);
}
do {
    $attempt++;
} while ($attempt < $limit);
```
`do...while` 至少执行一次。
对大数组频繁 `array_shift()` 会移动键，队列场景可使用 `SplQueue`。
外部输入控制循环次数、递归深度或分页大小时必须设置上限。
## break 与 continue
`break` 结束当前循环，`continue` 跳到下一轮。
PHP 允许指定层数，如 `break 2`，但深层跳转会降低可读性。
## 函数声明
```php
function formatUser(string $name, int $id): string
{
    return sprintf('%s (#%d)', $name, $id);
}
```
函数应职责单一，并通过参数和返回值表达依赖。
`void` 表示不返回有意义的值，`never` 表示函数不会正常返回。
## 参数传递
参数默认按值传递；数组使用写时复制，对象变量复制的是对象句柄。
引用参数用 `&` 标记，会让调用者状态被修改：
```php
function increment(int &$value): void
{
    $value++;
}
```
除非 API 的目的就是修改调用者变量，否则优先返回新值。
## 命名参数与可变参数
```php
function connect(string $host, int $port = 443, bool $tls = true): void {}
connect(host: 'localhost', tls: false);
```
公开 API 的参数名因此可能成为兼容性的一部分，重命名前需评估调用方。
可变参数：
```php
function total(int ...$values): int
{
    return array_sum($values);
}
```
## 作用域
函数内部默认看不到外部局部变量：
```php
$prefix = 'ID';
function showId(int $id): string
{
    return (string) $id;
}
```
应通过参数传递依赖，而不是使用 `global`。
`$GLOBALS` 和全局状态会增加测试难度，并可能在长生命周期运行模式中产生污染。
## 匿名函数与箭头函数
闭包显式捕获外部变量：
```php
$prefix = 'user';
$format = function (int $id) use ($prefix): string {
    return $prefix . ':' . $id;
};
```
默认按值捕获；`use (&$value)` 按引用捕获，应谨慎使用。
箭头函数自动按值捕获：
```php
$double = fn (int $value): int => $value * 2;
```
回调来自外部输入时，不要直接将任意字符串交给 `call_user_func()`。
## 生成器
生成器使用 `yield` 惰性产生值，适合流式处理大数据：
```php
function lines(string $path): Generator
{
    $handle = fopen($path, 'rb');
    if ($handle === false) {
        throw new RuntimeException('无法打开文件');
    }
    try {
        while (($line = fgets($handle)) !== false) {
            yield rtrim($line, "\r\n");
        }
    } finally {
        fclose($handle);
    }
}
```
生成器不会自动消除资源风险，仍需限制输入大小并在所有路径关闭句柄。
## include 与 require
```php
require __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/functions.php';
```
`include` 失败产生警告并继续，`require` 失败会终止当前执行。
`*_once` 避免同一文件重复加载，但不应替代清晰依赖结构。
相对路径受当前工作目录与 `include_path` 影响，使用 `__DIR__` 更稳定。
绝不能把 `$_GET` 等外部输入拼进包含路径。
## Composer 自动加载
现代项目通常用 Composer PSR-4 自动加载类：
```php
require dirname(__DIR__) . '/vendor/autoload.php';
```
应用代码不应自行遍历目录并动态包含任意文件。
依赖安装使用锁文件，并在部署中校验来源与完整性。
## 小结
PHP 数组兼具列表与映射语义，严格查找和明确键策略能避免大量边界错误。
函数应通过类型、参数和返回值表达依赖；文件加载只能选择应用已知路径。
下一篇进入 HTTP 请求生命周期、状态管理与上传安全。
