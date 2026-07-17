# Python3 lambda

## 概念与用途

`lambda` 创建只包含一个表达式的匿名函数，适合作为 `sorted()`、`min()`、`map()` 等 API 的短小回调。复杂业务逻辑应使用具名函数，以便测试、注释和复用。

## 核心语法

形式为 `lambda 参数: 表达式`，表达式结果自动作为返回值。lambda 支持默认参数和关键字参数，但不能包含普通赋值、`try` 或多条语句。

```python
users = [
    {"name": "Alice", "score": 88},
    {"name": "Bob", "score": 95},
    {"name": "Carol", "score": 88},
]
ordered = sorted(users, key=lambda user: (-user["score"], user["name"]))
print(ordered)
```

## 规则与替代方案

| 需求 | 推荐 | 原因 |
| --- | --- | --- |
| 简单排序字段 | lambda/itemgetter | 就地可读 |
| 多步计算 | `def` | 可测试和注释 |
| 重复使用 | `def` | 有稳定名称 |
| 仅调用方法 | `methodcaller` | 表意明确 |

## 示例：修复循环晚绑定

```python
wrong = [lambda: value for value in range(3)]
fixed = [lambda value=value: value for value in range(3)]
print([function() for function in wrong])
print([function() for function in fixed])
```

第一个列表中的函数都在调用时读取同一个循环变量，第二个列表通过默认参数在创建时绑定值。更复杂的工厂应使用具名函数，避免依赖这一技巧。

## 常见错误与工程注意

- lambda 过长会降低可读性，不能因为“少一行”而隐藏复杂规则。
- 循环中创建 lambda 会晚绑定变量，可用默认参数绑定当前值。
- 已有 `operator.itemgetter()` 或具名函数时，通常比 lambda 更清楚。
