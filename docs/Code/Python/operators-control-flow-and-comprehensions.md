# 运算符、控制流与推导式
控制流应让程序意图显而易见。优先使用清晰条件、提前返回和小范围循环，
不要用复杂表达式压缩本应展开的业务规则。
## 算术与整除
```python
a + b       # 加
a - b       # 减
a * b       # 乘
a / b       # 真除法，结果通常为 float
a // b      # 向负无穷取整的整除
a % b       # 模
a ** b      # 幂
```
`divmod(a, b)` 同时返回商和余数：
```python
quotient, remainder = divmod(17, 5)
```
除数为零会抛出 `ZeroDivisionError`。不要用宽泛异常把数据错误隐藏起来。
## 比较与链式比较
比较运算包括 `==`、`!=`、`<`、`<=`、`>`、`>=`。
Python 支持数学式链式比较：
```python
if 0 <= score <= 100:
    print("valid")
```
这不同于 `(0 <= score) <= 100` 的逐步手写形式，中间表达式只求值一次。
成员运算使用 `in` / `not in`，身份比较使用 `is` / `is not`：
```python
if suffix in {".jpg", ".png"}:
    ...
if result is not None:
    ...
```
## 逻辑运算与短路
优先级从高到低是 `not`、`and`、`or`。
`and` 和 `or` 返回参与运算的对象，不保证返回 `bool`：
```python
name = supplied_name or "anonymous"
```
如果空字符串是合法值，上述默认写法就不合适，应显式判断 `None`。
短路意味着后半部分可能不执行：
```python
if user is not None and user.is_active:
    grant_access()
```
不要在逻辑表达式右侧隐藏重要副作用。
## 位运算
位运算处理整数：`&`、`|`、`^`、`~`、`<<`、`>>`。
```python
flags = 0b0101
has_read = bool(flags & 0b0001)
toggled = flags ^ 0b0100
```
`^` 是按位 XOR，不是乘方；乘方是 `**`。
字节逐位运算需要逐个取出整数，详见 CTF 专题。
## 优先级与括号
不要靠记忆所有优先级。混合比较、位运算和布尔运算时使用括号表达意图：
```python
allowed = is_owner or (is_member and not is_blocked)
```
常见事实：`**` 高于一元负号，所以 `-2**2` 等于 `-(2**2)`，结果为 `-4`。
## if / elif / else
```python
if score >= 90:
    grade = "A"
elif score >= 60:
    grade = "pass"
else:
    grade = "fail"
```
条件按顺序判断，命中一个分支后跳过其余分支。
复杂嵌套通常可用提前返回简化：
```python
def validate_age(age: int) -> str:
    if age < 0:
        return "invalid"
    if age < 18:
        return "minor"
    return "adult"
```
条件表达式适合简单二选一：
```python
label = "even" if number % 2 == 0 else "odd"
```
不要嵌套多层条件表达式。
## for 与 range
`for` 遍历可迭代对象，而不是传统意义上的计数器语法：
```python
for item in items:
    process(item)
```
需要索引时用 `enumerate()`：
```python
for index, item in enumerate(items, start=1):
    print(index, item)
```
并行遍历用 `zip()`：
```python
for name, score in zip(names, scores, strict=True):
    print(name, score)
```
`strict=True` 从 Python 3.10 起可用，长度不一致时抛出 `ValueError`，可避免静默截断。
`range(stop)` 惰性表示整数区间，不会预先创建完整列表：
```python
for value in range(0, 10, 2):
    print(value)
```
步长不能为零。
## while
`while` 适合终止条件不由固定序列决定的场景：
```python
attempts = 3
while attempts > 0:
    if check_once():
        break
    attempts -= 1
```
循环条件和状态更新必须能保证终止；长期服务的无限循环也应设计退出、异常和资源清理路径。
## break、continue 与循环 else
`break` 退出最近一层循环，`continue` 进入下一次迭代。
循环 `else` 仅在循环未被 `break` 终止时执行：
```python
for item in items:
    if matches(item):
        found = item
        break
else:
    found = None
```
它不是“循环条件为假时执行”的普通 `if else`，而是“未提前找到/终止”的分支。
## match / case
Python 3.10 引入结构化模式匹配：
```python
def describe(message: object) -> str:
    match message:
        case {"type": "ping", "id": request_id}:
            return f"ping {request_id}"
        case ["move", x, y]:
            return f"move to {x}, {y}"
        case str() as text if text:
            return text
        case _:
            return "unknown"
```
裸名称模式会捕获值，而不是与同名变量比较。
常量匹配应使用字面量、枚举成员或带限定名的常量。
## 推导式
列表、集合和字典推导式适合从一个可读表达式构造容器：
```python
squares = [n * n for n in range(10)]
evens = {n for n in numbers if n % 2 == 0}
lengths = {word: len(word) for word in words}
```
生成器表达式不立即创建完整列表：
```python
total = sum(n * n for n in range(1_000_000))
```
推导式内部名称在 Python 3 中有独立作用域，不会泄漏到外层。
## 多层推导式的边界
顺序与等价嵌套循环一致：
```python
pairs = [(x, y) for x in range(3) for y in range(2)]
```
如果包含多层循环、多个条件或副作用，应改写为普通循环：
```python
results = []
for record in records:
    if not record.is_valid:
        continue
    results.append(transform(record))
```
推导式用于构造值，不用于调用 `print()` 或修改外部状态。
## 迭代时修改容器
遍历列表时删除元素容易跳过数据，遍历字典时改变大小会抛出错误。
可遍历副本或构造新容器：
```python
items = [item for item in items if keep(item)]
for key in list(mapping):
    if should_remove(key):
        del mapping[key]
```
若只修改字典现有键对应的值而不改变大小，通常可行，但仍应保持逻辑清晰。
## 异常不是普通分支的替代品
对于映射查找等场景，直接尝试并捕获具体异常常符合 Python 风格：
```python
try:
    value = mapping[key]
except KeyError:
    value = default
```
但不要用异常处理可轻易、清晰检查的常规循环条件。
完整异常语义见模块与异常专题。
## 小结
清晰控制流依赖明确的真值语义、正确的短路预期和可读的迭代方式。
当循环逻辑需要复用或隔离状态时，应提取为函数。
