# Python 类型注解

## 概念与用途

类型注解描述参数、返回值和变量的预期类型，供 IDE、静态检查器和读者使用。Python 默认不会在运行时强制检查注解，因此输入校验仍是程序职责。

## 核心语法与 API

常见写法有 `list[str]`、`dict[str, int]`、`str | None`、`Callable` 和 `Protocol`。`typing.get_type_hints()` 可在运行时解析注解。

```python
from collections.abc import Iterable

def average(values: Iterable[float]) -> float:
    numbers = list(values)
    if not numbers:
        raise ValueError("values 不能为空")
    return sum(numbers) / len(numbers)

print(average([1, 2.5, 4]))
```

## 常用类型工具

| 类型 | 用途 | 示例 |
| --- | --- | --- |
| `T | None` | 可缺失值 | `str | None` |
| `Literal` | 限定常量集合 | 模式、状态 |
| `Protocol` | 结构化接口 | 依赖抽象 |
| `TypeVar` | 泛型关系 | 输入输出同类型 |

## 示例：Protocol 定义最小能力

```python
from typing import Protocol

class Closable(Protocol):
    def close(self) -> None: ...

def close_resource(resource: Closable) -> None:
    resource.close()

class Demo:
    def close(self) -> None:
        print("closed")

close_resource(Demo())
```

Protocol 关注对象能做什么而不是继承自谁，有利于测试替身和解耦。类型检查器配置与 Python 版本应纳入项目配置，避免不同开发者得到不同结论。

## 常见错误与工程注意

- `list[int]` 不会自动拒绝字符串元素，边界数据仍需运行时验证。
- 避免用 `Any` 快速消除所有检查，它会让错误继续传播。
- 公共库修改类型签名可能影响使用者的静态检查，应像 API 变更一样评审。
