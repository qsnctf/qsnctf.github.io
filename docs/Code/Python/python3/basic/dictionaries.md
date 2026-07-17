# Python3 字典

## 概念与用途

字典保存键值映射并保持插入顺序，适合配置、索引和结构化记录。键必须可哈希，常见键类型是字符串、数字和只含不可变元素的元组。

## 核心 API

`get()` 提供缺省值，`items()` 遍历键值，`update()` 合并映射，`pop()` 删除并返回。`setdefault()` 可初始化缺失键，但复杂聚合通常使用 `defaultdict`。

```python
scores = {"Alice": 91, "Bob": 78}
scores["Carol"] = 88
for name, score in scores.items():
    print(name, score)
print("Dave:", scores.get("Dave", 0))
```

## API 选择

| API | 键缺失时 | 适用语义 |
| --- | --- | --- |
| `data[key]` | `KeyError` | 缺失是错误 |
| `data.get(key)` | 返回 `None`/默认值 | 缺失正常 |
| `setdefault()` | 写入默认值 | 简单初始化 |
| `pop()` | 删除或抛异常 | 取走所有权 |

## 示例：安全聚合

```python
from collections import defaultdict

groups: defaultdict[str, list[str]] = defaultdict(list)
for name, team in [("Alice", "red"), ("Bob", "blue"), ("Carol", "red")]:
    groups[team].append(name)
print(dict(groups))
```

字典推导式遇到重复键时后值覆盖前值，可能隐藏数据冲突。需要检测重复时应显式循环并在键已存在时抛错或记录冲突。

## 常见错误与工程注意

- `data[key]` 在键缺失时抛 `KeyError`，是否使用 `get()` 应取决于缺失是否正常。
- 不能在遍历 `dict` 时改变其大小，可遍历 `list(data)`。
- 合并外部配置时要限制允许键，避免不受控字段覆盖安全配置。
