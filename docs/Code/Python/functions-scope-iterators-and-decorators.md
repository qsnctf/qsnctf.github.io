# 函数、作用域、迭代器与装饰器
函数封装行为，作用域决定名称解析，迭代协议支持惰性数据流，
装饰器则在不改调用点的情况下包装可调用对象。
## 定义与返回
```python
def area(width: float, height: float) -> float:
    """返回矩形面积。"""
    return width * height
```
函数调用会创建局部作用域。没有显式 `return`，或执行 `return` 不带值时，返回 `None`。
所谓“返回多个值”实际是返回一个元组：
```python
def bounds(values: list[int]) -> tuple[int, int]:
    return min(values), max(values)
```
## 参数种类
`/` 左侧仅限位置参数，`*` 右侧仅限关键字参数：
```python
def connect(host: str, /, port: int = 443, *, timeout: float = 5.0) -> None:
    ...
connect("example.test", port=8443, timeout=2.0)
```
仅关键字参数能让布尔选项和单位更清晰。
公共 API 使用仅位置参数时，调用者不依赖参数名，未来可更安全地改名。
## *args 与 **kwargs
```python
def collect(prefix: str, *values: int, **metadata: str) -> dict[str, object]:
    return {"prefix": prefix, "values": values, "metadata": metadata}
```
`args` 是元组，`kwargs` 是字典。名称只是约定，星号语法才决定行为。
调用时也可解包：
```python
position = (10, 20)
options = {"color": "red"}
draw(*position, **options)
```
重复提供同一参数或缺失必需参数会抛出 `TypeError`。
## 默认参数只求值一次
默认值在执行 `def` 时创建，不是在每次调用时创建：
```python
def append_item(item: int, target: list[int] | None = None) -> list[int]:
    if target is None:
        target = []
    target.append(item)
    return target
```
不要把可变列表、字典或集合直接作为默认值，除非明确需要跨调用共享状态并有文档说明。
时间相关默认值也有同样问题：
```python
from datetime import datetime
def create_record(created_at: datetime | None = None) -> datetime:
    return datetime.now() if created_at is None else created_at
```
## 参数传递与副作用
调用时，形参与实参对象建立新的名称绑定：
```python
def clear(values: list[int]) -> None:
    values.clear()  # 修改调用者可见的对象
def replace(values: list[int]) -> None:
    values = []     # 仅重新绑定局部名称
```
公共函数应说明是否修改传入对象。无法从函数名预期的副作用尤其需要文档。
## LEGB 名称解析
名称按以下顺序解析：
- Local：当前函数局部作用域。
- Enclosing：外层函数作用域。
- Global：当前模块全局作用域。
- Builtins：内置名称作用域。
```python
label = "global"
def outer() -> str:
    label = "enclosing"
    def inner() -> str:
        label = "local"
        return label
    return inner()
```
赋值默认创建局部名称，因此在赋值前读取同名局部变量会触发 `UnboundLocalError`。
## global 与 nonlocal
`global` 声明名称属于模块作用域，`nonlocal` 声明名称来自最近的外层函数：
```python
def make_counter():
    count = 0
    def next_value() -> int:
        nonlocal count
        count += 1
        return count
    return next_value
```
大量使用 `global` 往往表示状态管理需要重新设计。
对可变外层对象调用方法不需要 `nonlocal`，只有重新绑定名称时才需要。
## 闭包
闭包保留定义时外层作用域中的引用：
```python
def multiplier(factor: int):
    def multiply(value: int) -> int:
        return value * factor
    return multiply
double = multiplier(2)
```
循环创建闭包时注意晚绑定：
```python
functions = [lambda value, factor=factor: value * factor for factor in range(3)]
```
默认参数在创建 lambda 时捕获当前值；否则调用时才查找最终的 `factor`。
## lambda 的适用范围
lambda 只能包含一个表达式，适合作为短小排序键：
```python
records.sort(key=lambda record: record["score"], reverse=True)
```
需要注解、文档、异常处理或多步逻辑时使用普通 `def`。
命名后长期复用的 lambda 通常也应改为 `def`。
## 可迭代对象与迭代器
可迭代对象能提供迭代器；迭代器实现 `__next__()` 并保存遍历状态：
```python
values = [10, 20]
iterator = iter(values)
print(next(iterator))
print(next(iterator))
```
耗尽后 `next()` 抛出 `StopIteration`。可提供默认值避免异常：
```python
next(iterator, None)
```
列表可重复迭代，而多数迭代器是一次性的。
## 生成器函数
包含 `yield` 的函数调用后返回生成器，函数体不会立即完整执行：
```python
def countdown(start: int):
    current = start
    while current > 0:
        yield current
        current -= 1
```
每次 `next()` 从上次暂停处继续。生成器适合流式处理大数据，但资源生命周期也可能延长。
`yield from` 可委托另一个可迭代对象：
```python
def flatten(groups: list[list[int]]):
    for group in groups:
        yield from group
```
生成器表达式是更紧凑的惰性形式：
```python
lines = (line.strip() for line in stream if line.strip())
```
## 生成器与资源
若生成器内部打开文件，调用者未耗尽或关闭生成器时，资源可能保持打开。
更简单的方式是由调用者管理资源：
```python
def nonempty_lines(stream):
    for line in stream:
        if stripped := line.strip():
            yield stripped
with open("input.txt", encoding="utf-8") as stream:
    for line in nonempty_lines(stream):
        process(line)
```
## 函数也是对象
函数可赋值、放入容器、作为参数传递或作为返回值：
```python
def apply(value: int, operation) -> int:
    return operation(value)
```
生产代码应为高阶函数补充 `Callable` 等类型注解，详见类型注解专题。
## 装饰器基础
装饰器接收可调用对象并返回替代对象：
```python
from functools import wraps
def trace(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        print(f"calling {function.__name__}")
        return function(*args, **kwargs)
    return wrapper
@trace
def add(a: int, b: int) -> int:
    return a + b
```
`@trace` 等价于 `add = trace(add)`。
`functools.wraps` 保留名称、文档和 `__wrapped__` 等元数据，便于调试和工具分析。
## 带参数装饰器
带参数装饰器多一层函数：
```python
from functools import wraps
def repeat(times: int):
    if times < 1:
        raise ValueError("times must be positive")
    def decorate(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = function(*args, **kwargs)
            return result
        return wrapper
    return decorate
```
装饰器在函数定义阶段应用。不要在装饰阶段执行昂贵或依赖运行环境的工作。
## 装饰器注意事项
- 明确包装是否改变返回值、异常、同步/异步性质或调用签名。
- 多个装饰器从下往上应用，调用时形成嵌套包装。
- 缓存要求参数可哈希，并需要考虑内存和过期策略。
- 权限检查不能只靠隐藏属性，应在可信边界验证真实身份和授权。
- 异步函数需要异步包装器并 `await` 原函数。
## 小结
函数参数定义 API，LEGB 解释名称来源，生成器提供惰性执行，装饰器组合横切行为。
这些能力应服务于清晰结构，而不是追求语法技巧。
