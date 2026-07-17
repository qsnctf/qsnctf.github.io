# Python3 operator

## 概念与用途

`operator` 将 Python 运算符和取值操作封装为函数，适合排序 key、归约和函数式 API。它常比简单 lambda 更简洁，并明确表达“取字段”或“执行运算”。

## 核心 API

`itemgetter()` 按索引或键取值，`attrgetter()` 取属性，`methodcaller()` 调用方法；`add`、`mul`、`contains` 等对应常见运算符。

```python
from operator import itemgetter, methodcaller

records = [("Alice", 88), ("Bob", 95), ("Carol", 80)]
print(sorted(records, key=itemgetter(1), reverse=True))
clean = methodcaller("strip")
print(clean("  Python  "))
```

## 常用函数

| 函数 | 等价操作 | 典型用途 |
| --- | --- | --- |
| `itemgetter(k)` | `obj[k]` | 字典/元组排序 |
| `attrgetter(name)` | `obj.name` | 对象排序 |
| `methodcaller(name)` | `obj.name()` | 批量调用方法 |
| `add/mul` | `a + b` / `a * b` | 归约操作 |

## 示例：对象属性排序

```python
from dataclasses import dataclass
from operator import attrgetter

@dataclass
class Job:
    priority: int
    name: str

jobs = [Job(2, "docs"), Job(1, "build"), Job(2, "test")]
print(sorted(jobs, key=attrgetter("priority", "name")))
```

`operator` 是标准库，无需安装。getter 使用的字段名仍需来自可信程序配置；让用户任意选择深层属性可能暴露本不应公开的数据。

## 常见错误与工程注意

- `itemgetter(1)` 对缺少索引的数据会抛异常，输入结构需先验证。
- 多字段 getter 返回元组，排序方向若各字段不同仍需显式 key。
- 不要为了函数式风格牺牲清晰度，复杂规则使用具名函数。
