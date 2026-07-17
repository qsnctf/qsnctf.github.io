# Python3 基本数据类型

## 概念与用途

Python 内置标量类型包括 `int`、`float`、`complex`、`bool` 和 `NoneType`；容器包括 `str`、`bytes`、`list`、`tuple`、`dict`、`set`。列表、字典和集合可变，字符串、数字与元组不可变。

## 核心 API

使用 `type(obj)` 查看精确类型，使用 `isinstance(obj, T)` 做兼容继承的类型判断。`None` 表示“没有值”，应使用 `is None` 判断。

```python
values = [42, 3.14, True, None, "python", [1, 2], {"ok": True}]
for value in values:
    print(repr(value), type(value).__name__)

print(isinstance(True, int))  # bool 是 int 的子类
```

## 类型特征表

| 类型 | 可变 | 有序 | 可哈希 |
| --- | --- | --- | --- |
| `str` / `tuple` | 否 | 是 | 元素可哈希时是 |
| `list` | 是 | 是 | 否 |
| `dict` | 是 | 保持插入顺序 | 否 |
| `set` | 是 | 否 | 否 |
| `frozenset` | 否 | 否 | 是 |

## 示例：引用与可变性

```python
original = [1, 2]
alias = original
copy = original.copy()
alias.append(3)
print(original, alias, copy)

text = "py"
changed = text.upper()
print(text, changed)
```

赋值复制的是对象引用而非深层数据。嵌套容器需要根据所有权选择浅拷贝、`copy.deepcopy()` 或重新构造；盲目深拷贝也可能昂贵且复制不应复制的资源。

## 常见错误与工程注意

- 默认参数不要使用可变对象，例如 `def f(items=[])`，否则多次调用会共享状态。
- `bool("False")` 仍为 `True`，因为非空字符串都是真值。
- 序列化前要确认对方是否支持 `set`、`complex` 等 Python 特有类型。
