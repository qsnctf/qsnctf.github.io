# NumPy Ndarray 对象

`numpy.ndarray` 是固定维数、同构元素组成的多维容器。它将一块数据缓冲区与形状、数据类型、步长等元数据结合，使切片、转置和批量计算不必逐个处理 Python 对象。

## 核心结构

数组的重要组成包括：

| 内容 | 说明 |
| --- | --- |
| data | 原始元素所在的内存缓冲区 |
| `dtype` | 每个元素的解释方式和字节数 |
| `shape` | 各维长度 |
| `strides` | 每一维前进一步需要跨过的字节数 |
| `ndim` | 维度数量 |

通常通过 `np.array` 等工厂函数创建数组，而不是直接调用 `np.ndarray` 构造器。

## 可运行示例

```python
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.int32)
print(type(a))
print(a.shape, a.dtype, a.strides)

# 通用函数按元素工作，聚合函数可指定轴。
print(np.square(a))
print(a.sum(axis=0))

# 转置通常只改变元数据并共享缓冲区。
t = a.T
t[0, 0] = 99
print(a)
print(np.shares_memory(a, t))
```

## 数组与 Python 序列

Python 列表可保存不同类型对象，`+` 表示拼接；数组通常保存同一 dtype，`+` 表示逐元素加法。数组维度必须规则，不能把参差不齐的嵌套列表直接当作普通二维数值数组。

```python
import numpy as np

print([1, 2] + [3, 4])
print(np.array([1, 2]) + np.array([3, 4]))
```

## 常见错误与性能注意事项

- `ndarray` 同构不等于值不可变；dtype 固定，但元素可以修改。
- `a * b` 是逐元素乘法，矩阵乘法使用 `a @ b` 或 `np.matmul`。
- `object` 数组保存 Python 对象指针，计算通常回到 Python 层，速度和内存效率显著下降。
- 非连续数组可以正常参与多数运算，但传给本地库时可能触发隐式复制；用 `flags` 检查布局。
- 不要用 `if a:` 判断多元素数组，语义不明确会抛出异常；根据意图使用 `a.any()`、`a.all()` 或 `a.size > 0`。
- 公开函数参数应说明预期 shape 和 dtype，并在边界处用 `np.asarray` 规范输入。
