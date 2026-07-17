# Python for 循环

> 本页在 [Python3 循环语句](../basic/loops.md) 基础上讲解迭代协议、组合工具和批处理模式；条件未知的重试循环见 [Python while 循环](while-loop.md)。

## 概念与用途

Python `for` 不依赖手动下标，而是通过迭代协议逐项消费对象。它适合序列、映射、文件、生成器和自定义可迭代对象，通常比索引式循环更安全。

## 核心语法与 API

`enumerate()` 提供序号，`zip()` 并行配对，`reversed()` 反向迭代，`itertools` 提供链式和组合工具。循环也支持解包和未 `break` 时执行的 `else`。

| 工具 | 作用 | 是否惰性 |
| --- | --- | --- |
| `enumerate()` | 添加序号 | 是 |
| `zip()` | 并行组合 | 是 |
| `itertools.chain()` | 串联多个输入 | 是 |
| `sorted()` | 生成排序列表 | 否 |

```python
names = ["Alice", "Bob", "Carol"]
scores = [88, 95, 91]
for rank, (name, score) in enumerate(
    sorted(zip(names, scores, strict=True), key=lambda item: item[1], reverse=True),
    start=1,
):
    print(rank, name, score)
```

## 示例：按固定大小分批

Python 3.10 没有 `itertools.batched()`，可用 `islice()` 编写惰性批处理器。

```python
from itertools import islice

def batched(values, size: int):
    iterator = iter(values)
    while batch := tuple(islice(iterator, size)):
        yield batch

for batch in batched(range(8), 3):
    print(batch)
```

自定义可迭代对象应遵循一次性迭代器与可重复可迭代对象的区别。流式数据不要先转列表；需要并行处理时还应限制批大小，避免一次提交无限任务。

## 常见错误与工程注意

- 仅为下标使用 `range(len(items))` 通常不如 `enumerate(items)` 清楚。
- `zip()` 默认截断，数据必须等长时使用 `strict=True`。
- 循环变量在循环后仍存在，闭包捕获时要注意晚绑定。
