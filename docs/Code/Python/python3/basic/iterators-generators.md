# Python3 迭代器与生成器

## 概念与用途

可迭代对象能被 `for` 遍历；迭代器保存遍历状态并通过 `__next__()` 逐项返回，结束时抛出 `StopIteration`。生成器是用 `yield` 编写迭代器的简洁方式，适合流式读取和大规模序列。

## 核心 API

`iter(obj)` 获取迭代器，`next(it, default)` 取下一项。生成器函数调用时不会立即执行函数体，而是在每次迭代时恢复到上次 `yield` 的位置。

```python
def countdown(start: int):
    while start > 0:
        yield start
        start -= 1

numbers = countdown(3)
print(next(numbers))
for number in numbers:
    print(number)
```

## 协议规则

| 对象 | 方法/行为 | 可否重复遍历 |
| --- | --- | --- |
| 可迭代对象 | `__iter__()` 返回迭代器 | 通常可以 |
| 迭代器 | `__next__()` 返回下一项 | 通常一次性 |
| 生成器函数 | 包含 `yield` | 每次调用创建新生成器 |
| 生成器表达式 | 惰性表达式 | 一次性 |

## 示例：流式读取固定块

```python
from io import BytesIO

def read_chunks(stream, size: int):
    while chunk := stream.read(size):
        yield chunk

source = BytesIO(b"abcdefghij")
for chunk in read_chunks(source, 4):
    print(chunk)
```

生成器把控制权和状态保存在暂停点，异常也会在消费时而非创建时出现。调用方必须在正确边界处理异常和关闭底层流，不能因为构造生成器成功便认为操作已完成。

## 常见错误与工程注意

- 迭代器通常是一次性的，耗尽后需要重新创建。
- 不要用 `list(generator)` 处理无限生成器或超大数据流。
- 生成器持有局部状态和资源；提前停止时可调用 `close()`，资源管理优先结合 `with`。
