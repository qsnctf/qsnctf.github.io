# NumPy 教程

NumPy 是 Python 科学计算的基础库，提供高性能多维数组、向量化计算、广播、线性代数和文件读写能力。

## NumPy 安装

```bash
python -m pip install numpy
```

建议在虚拟环境中安装，并确认版本：

```python
import numpy as np
print(np.__version__)
```

## NumPy Ndarray 对象

`ndarray` 是 NumPy 的核心对象，表示同类型元素组成的多维数组。

```python
import numpy as np
a = np.array([1, 2, 3])
```

## NumPy 数据类型

NumPy 数组有明确 dtype，例如 `int32`、`int64`、`float32`、`float64`、`bool_`、`datetime64`。

## NumPy 数组属性

常用属性包括 `shape`、`ndim`、`size`、`dtype`、`itemsize`。

## NumPy 创建数组

```python
np.zeros((2, 3))
np.ones((2, 3))
np.empty((2, 3))
np.full((2, 3), 7)
```

## NumPy 从已有的数组创建数组

```python
np.asarray([1, 2, 3])
np.copy(a)
```

要区分视图和副本，避免修改一个数组时意外影响另一个对象。

## NumPy 从数值范围创建数组

```python
np.arange(0, 10, 2)
np.linspace(0, 1, 5)
```

## NumPy 切片和索引

切片通常返回视图：

```python
a[1:4]
a[:, 0]
```

## NumPy 高级索引

高级索引包括整数数组索引和布尔索引，通常返回副本。

```python
a[a > 0]
```

## NumPy 广播(Broadcast)

广播让不同形状数组在兼容维度上自动扩展。

```python
np.array([1, 2, 3]) + 10
```

## NumPy 迭代数组

可使用普通循环、`np.nditer` 或向量化操作。优先使用向量化而不是 Python 层循环。

## Numpy 数组操作

常见操作包括 `reshape`、`ravel`、`transpose`、`concatenate`、`stack`、`split`。

## NumPy 位运算

位运算函数包括 `bitwise_and`、`bitwise_or`、`invert`、`left_shift`、`right_shift`。

## NumPy 字符串函数

`np.char` 提供向量化字符串操作，例如 `np.char.lower`、`np.char.find`。

## NumPy 数学函数

常用函数包括 `sin`、`cos`、`exp`、`log`、`sqrt`。

## NumPy 算术函数

`add`、`subtract`、`multiply`、`divide` 等 ufunc 支持数组级运算。

## NumPy 统计函数

```python
np.mean(a)
np.median(a)
np.std(a)
np.percentile(a, 90)
```

## NumPy 排序、条件筛选函数

常用函数包括 `sort`、`argsort`、`where`、`nonzero`、`argmax`、`argmin`。

## NumPy 字节交换

`byteswap` 和 dtype 字节序用于处理跨平台二进制数据。

## NumPy 副本和视图

切片多为视图，高级索引多为副本。可用 `np.shares_memory` 辅助判断。

## NumPy 矩阵库(Matrix)

`numpy.matrix` 已不推荐作为新代码首选。建议使用 `ndarray` 和 `@` 矩阵乘法。

## NumPy 线性代数

`np.linalg` 提供矩阵分解、求逆、解线性方程、特征值等能力。

## NumPy IO

```python
np.save("a.npy", a)
np.load("a.npy")
np.savetxt("a.csv", a, delimiter=",")
```

## NumPy Matplotlib

NumPy 常与 Matplotlib 搭配绘图：

```python
import matplotlib.pyplot as plt
x = np.linspace(0, 1, 100)
plt.plot(x, np.sin(2 * np.pi * x))
plt.show()
```

## Numpy 测验

自检问题：广播规则是什么？切片和高级索引的副本行为有什么区别？`axis=0` 和 `axis=1` 分别代表什么？
