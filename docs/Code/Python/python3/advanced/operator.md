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

## 常见错误与工程注意

- `itemgetter(1)` 对缺少索引的数据会抛异常，输入结构需先验证。
- 多字段 getter 返回元组，排序方向若各字段不同仍需显式 key。
- 不要为了函数式风格牺牲清晰度，复杂规则使用具名函数。
