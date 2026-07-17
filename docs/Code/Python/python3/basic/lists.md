# Python3 列表

## 概念与用途

列表是可变、有序、可重复的对象序列，适合保存会增删或重排的数据。索引和尾部追加通常高效，而在头部插入会移动后续元素。

## 核心 API

`append()` 添加单个元素，`extend()` 添加可迭代对象，`insert()` 指定位置插入；`pop()` 删除并返回，`remove()` 按值删除。`sort()` 原地排序，`sorted()` 返回新列表。

```python
tasks = ["test", "deploy"]
tasks.insert(0, "build")
tasks.extend(["monitor", "report"])
completed = tasks.pop(0)
tasks.sort(key=len)
print(completed, tasks)
```

## 操作复杂度

| 操作 | 平均复杂度 | 说明 |
| --- | --- | --- |
| `items[i]` | O(1) | 支持负索引 |
| `append/pop()` 尾部 | 摊销 O(1) | 栈式操作 |
| `insert(0, x)` | O(n) | 需要移动元素 |
| `x in items` | O(n) | 高频成员测试考虑 set |

## 示例：复制与切片

```python
numbers = [1, 2, 3, 4, 5]
copy = numbers[:]
copy[1:4] = [20, 30]
print(numbers)
print(copy)
print(numbers[::-1])
```

切片创建浅拷贝，内部可变对象仍共享。排序 key 应返回可比较且稳定的值；若数据量大且只需前几个结果，可使用 `heapq.nsmallest()`/`nlargest()`。

## 常见错误与工程注意

- `append([1, 2])` 添加一个嵌套列表，展开元素应使用 `extend([1, 2])`。
- 遍历时直接删除元素会跳项，可遍历副本或用推导式生成新列表。
- `matrix = [[0] * 3] * 3` 会共享内层列表，应使用推导式逐行创建。
