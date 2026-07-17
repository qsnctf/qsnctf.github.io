# NumPy 从已有的数组创建数组

已有数据可能来自 Python 序列、另一个 NumPy 数组、迭代器或二进制缓冲区。不同构造函数在是否复制、类型转换和内存所有权方面存在重要差异。

## 核心 API 与规则

| API | 典型用途 |
| --- | --- |
| `np.array(obj)` | 创建数组，常用于需要独立结果的边界 |
| `np.asarray(obj)` | 接受 array-like，满足要求时避免复制 |
| `np.copy(a)` / `a.copy()` | 显式复制数据 |
| `np.fromiter(iterable, dtype)` | 从迭代器创建一维数组 |
| `np.frombuffer(buffer, dtype)` | 将缓冲区解释为一维数组，通常共享内存 |
| `np.from_dlpack(obj)` | 与支持 DLPack 的数组库交换数据 |

## 可运行示例

```python
import numpy as np

source = np.array([1, 2, 3], dtype=np.int32)
same_if_possible = np.asarray(source)
converted = np.asarray(source, dtype=np.float64)
independent = source.copy()

source[0] = 99
print(same_if_possible)
print(converted)
print(independent)

generated = np.fromiter((x * x for x in range(5)), dtype=np.int64, count=5)
print(generated)
```

从可变字节缓冲区创建共享视图：

```python
import numpy as np

raw = bytearray([1, 2, 3, 4])
view = np.frombuffer(raw, dtype=np.uint8)
view[0] = 10
print(raw)
```

## 复制语义

`np.asarray` 的目标是规范输入，并不保证副本。需要隔离后续修改时，应明确调用 `copy()`。反之，`frombuffer` 依赖外部缓冲区的生命周期、可写性、字节序和对齐，适合受控的零复制接口。

## 常见错误与工程注意事项

- 将不可信字节直接 `frombuffer` 不会验证结构，应先检查长度、协议版本和元素数量。
- `fromiter` 必须指定 dtype；已知元素数时传 `count` 可避免动态扩容。
- `np.array` 对嵌套数组可能复制和堆叠数据，批量组合应根据目标维度考虑 `stack` 或 `concatenate`。
- `asarray` 可能返回调用者原数组；库函数若要原地修改，必须在 API 中声明或先复制。
- 从只读 `bytes` 创建的数组不可写；不要通过底层技巧绕过只读标志。
- 零复制并非总是更快：跨设备、非连续布局或 dtype 不匹配时，显式转换能让后续密集计算更稳定。
