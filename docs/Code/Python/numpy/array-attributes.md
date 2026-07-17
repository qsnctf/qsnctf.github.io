# NumPy 数组属性

数组属性描述 `ndarray` 的逻辑结构和物理布局。理解这些元数据有助于检查数据契约、定位维度错误，并判断某个操作是否可能产生复制。

## 常用属性

| 属性 | 含义 |
| --- | --- |
| `ndim` | 维数 |
| `shape` | 各维长度组成的元组 |
| `size` | 元素总数 |
| `dtype` | 元素数据类型 |
| `itemsize` | 单个元素字节数 |
| `nbytes` | 元素缓冲区的逻辑字节数 |
| `strides` | 各维移动一步的字节跨度 |
| `flags` | 连续性、可写性和所有权等标志 |
| `T` | 转置视图的快捷属性 |
| `base` | 视图所引用的底层对象（若有） |

## 可运行示例

```python
import numpy as np

a = np.arange(12, dtype=np.float32).reshape(3, 4)
print("ndim:", a.ndim)
print("shape:", a.shape)
print("size:", a.size)
print("dtype/itemsize:", a.dtype, a.itemsize)
print("nbytes:", a.nbytes)
print("strides:", a.strides)
print("C contiguous:", a.flags.c_contiguous)

b = a[:, ::2]
print("sliced strides:", b.strides)
print("contiguous:", b.flags.c_contiguous)
```

`shape` 可以赋值，但更推荐调用 `reshape`，因为意图更清晰且失败行为更容易理解：

```python
import numpy as np

a = np.arange(6)
b = a.reshape(2, 3)
print(b)
```

## 形状约定

标量数组 shape 为 `()`，一维数组为 `(n,)`，列向量通常表示为 `(n, 1)`。`(n,)` 与 `(n, 1)` 在广播和矩阵乘法中行为不同，不应混用。

## 常见错误与工程注意事项

- `nbytes` 不包含 Python 对象本身的管理开销；对 `object` 数组也不包含所引用对象的内存。
- `T` 对一维数组没有视觉变化；要得到列向量可用 `a[:, None]` 或 `a.reshape(-1, 1)`。
- 非连续不代表错误，但某些 C/Fortran 接口要求特定布局，可用 `np.ascontiguousarray` 或 `np.asfortranarray` 显式转换。
- `base is other` 不是可靠的共享内存通用判断，因为视图链可能跨多个对象；使用 `np.shares_memory`。
- 修改 `shape` 或依赖具体 `strides` 的代码较脆弱。公共接口应验证维数和关键轴长度，而非假设输入布局。
- 超大数组计算前可用 `size * dtype.itemsize` 估算最小缓冲区，但还要为临时结果预留内存。
