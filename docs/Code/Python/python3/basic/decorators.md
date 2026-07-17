# Python3 装饰器

## 概念与用途

装饰器接收可调用对象并返回替代对象，用于日志、鉴权、重试、缓存和注册。`@decorator` 等价于在定义后执行 `function = decorator(function)`。

## 核心语法与 API

包装函数应使用 `functools.wraps` 保留名称、文档字符串和类型工具所需元数据。带参数装饰器通常有三层函数：配置层、接收函数层、包装调用层。

```python
from functools import wraps
from time import perf_counter

def timed(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        started = perf_counter()
        try:
            return function(*args, **kwargs)
        finally:
            print(function.__name__, perf_counter() - started)
    return wrapper

@timed
def work() -> int:
    return sum(range(1000))

print(work())
```

## 装饰器规则

| 类型 | 形态 | 用途 |
| --- | --- | --- |
| 无参数 | `@decorator` | 统一包装策略 |
| 带参数 | `@retry(times=3)` | 配置包装行为 |
| 类装饰器 | 接收并返回类 | 注册、数据类转换 |
| 多装饰器 | 从下向上应用 | 顺序影响语义 |

## 示例：带参数装饰器

```python
from functools import wraps

def repeat(times: int):
    def decorate(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            return [function(*args, **kwargs) for _ in range(times)]
        return wrapper
    return decorate

@repeat(times=3)
def greet(name: str) -> str:
    return f"Hello, {name}"

print(greet("Alice"))
```

包装同步函数、生成器和异步函数的方式不同。通用基础设施若不保留签名或错误地把协程当普通值返回，会破坏调用契约，应分别测试。

## 常见错误与工程注意

- 忘记 `return function(...)` 会让原返回值变成 `None`。
- 装饰器顺序从下向上应用、调用时从外向内执行。
- 鉴权装饰器必须默认拒绝，并避免在日志中泄漏令牌和敏感参数。
