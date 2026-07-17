# NumPy 迭代数组

数组可以像序列一样迭代，但 Python 层循环会逐个创建标量对象，通常比 NumPy 向量化慢。迭代适合包含外部副作用、无法向量化的算法或分块处理。

## 基本迭代规则

直接迭代多维数组时，每次得到第 0 轴的一个子数组。`flat` 按 C 顺序提供一维迭代器，`np.nditer` 可控制顺序、读写模式和多数组同步迭代。

```python
import numpy as np

a = np.arange(6).reshape(2, 3)
for row in a:
    print("row:", row)

for value in a.flat:
    print(int(value), end=" ")
print()
```

## `nditer` 与 `ndenumerate`

```python
import numpy as np

a = np.arange(6, dtype=np.float64).reshape(2, 3)
with np.nditer(a, op_flags=["readwrite"]) as it:
    for value in it:
        value[...] = value * 2
print(a)

for index, value in np.ndenumerate(a):
    if value > 5:
        print(index, value)
```

多个数组可借助广播同步迭代，但普通运算往往更清晰：

```python
import numpy as np

a = np.array([[1], [2]])
b = np.array([10, 20, 30])
print(a + b)
```

## 性能与工程注意事项

- 优先尝试 ufunc、聚合、广播、布尔索引或矩阵运算，而非逐元素 Python 循环。
- 不能一次载入内存的数据应按文件块或轴分块处理；分块大小需兼顾缓存、I/O 和临时数组。
- `np.vectorize` 主要改善调用形式，默认仍执行 Python 函数，不是性能优化工具。
- `nditer` 的写操作必须声明 `readwrite` 或 `writeonly`，并通过 `value[...]` 修改零维视图。
- 迭代顺序影响缓存局部性。默认遵循内存布局；强制错误顺序可能显著降低性能。
- 循环包含日志、网络或数据库写入时，不应假设数组优化能解决瓶颈；应批量化外部操作并处理失败重试。
