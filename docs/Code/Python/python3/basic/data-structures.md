# Python3 数据结构

## 概念与用途

选择数据结构决定操作的语义和复杂度：列表适合有序序列，集合适合成员测试，字典适合键查找，元组适合固定记录。标准库 `collections` 提供面向队列、计数和缺省映射的结构。

## 核心 API

`deque` 支持两端近似 O(1) 增删，`Counter` 统计频次，`defaultdict` 自动创建缺省值。优先根据访问模式选择结构，而不是统一使用列表。

```python
from collections import Counter, deque

events = deque(["login", "read", "read"], maxlen=5)
events.append("logout")
counts = Counter(events)
print(events.popleft())
print(counts.most_common())
```

## 选型速查

| 需求 | 结构 | 关键操作 |
| --- | --- | --- |
| 保序、按下标 | list | `append`, index |
| 键到值映射 | dict | `get`, `items` |
| 去重和成员测试 | set | `in`, 交并差 |
| 两端队列 | deque | `append`, `popleft` |
| 频次统计 | Counter | `update`, `most_common` |

## 示例：有界历史记录

```python
from collections import deque

history = deque(maxlen=3)
for event in ["login", "read", "write", "logout"]:
    history.append(event)
    print(list(history))
```

有界 deque 自动丢弃最旧元素，适合近期窗口但不是持久审计日志。数据结构应让非法状态难以表达，例如唯一成员直接用 set，而不是每次手工检查列表重复。

## 常见错误与工程注意

- 用列表头部 `pop(0)` 实现高频队列会产生 O(n) 移动，应使用 `deque.popleft()`。
- 大 O 复杂度不是唯一标准，还要考虑内存、顺序和并发安全。
- `defaultdict` 读取缺失键会改变字典，序列化前应理解这一副作用。
