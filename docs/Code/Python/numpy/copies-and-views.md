# NumPy 副本和视图

副本拥有独立数据缓冲区，视图共享已有缓冲区但拥有自己的 shape、strides 和 dtype 等元数据。理解两者是避免意外修改、内存滞留和不必要复制的关键。

## 常见产生方式

| 操作 | 通常结果 |
| --- | --- |
| 赋值 `b = a` | 同一个对象的新名称 |
| 基本切片 `a[1:5]` | 视图 |
| 转置 `a.T` | 视图 |
| `reshape` | 尽可能为视图，必要时可能复制 |
| 高级索引 `a[[1, 3]]` | 副本 |
| `a.copy()` | 副本 |
| dtype 转换 `astype` | 通常为副本 |

## 可运行示例

```python
import numpy as np

a = np.arange(6)
alias = a
view = a[1:4]
copy = a[1:4].copy()

view[0] = 99
copy[1] = -1
print(a)
print(alias is a)
print(np.shares_memory(a, view))
print(np.shares_memory(a, copy))
```

`view()` 还能用相同字节创建不同 dtype 解释，但必须确保元素宽度与布局符合目标语义：

```python
import numpy as np

floats = np.array([1.0], dtype=np.float32)
bits = floats.view(np.uint32)
print(hex(int(bits[0])))
```

## 内存共享判断

`np.shares_memory(a, b)` 给出精确判断，但极复杂 stride 情况可能计算昂贵；`np.may_share_memory` 是保守快速判断，返回真不代表一定重叠。`base` 属性只适合辅助观察，不应作为通用判据。

## 常见错误与工程注意事项

- `b = a` 不会复制；任何原地修改都对两个名称可见。
- 切片结果的修改会传播回原数组。函数若不能修改调用者数据，应在入口复制或保持只读操作。
- 小视图会持有整个大数组缓冲区。长期缓存一个小窗口时，复制反而可以释放大内存。
- `reshape`、`ravel` 的复制行为受布局影响；需要强语义时显式 `copy()`，而不是依赖当前输入恰好连续。
- 浅复制 `object` 数组只复制对象引用，不复制其中的可变 Python 对象。
- 过度防御性复制会增加内存峰值和延迟。公共 API 应明确所有权和可变性约定，在边界而非每一步复制。
