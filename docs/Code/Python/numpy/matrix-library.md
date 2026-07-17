# NumPy 矩阵库(Matrix)

`numpy.matrix` 是历史上的二维矩阵子类，会改变 `*`、`**` 和索引行为。新代码不推荐使用它，应使用普通 `ndarray` 配合 `@`、`np.matmul` 和 `np.linalg`。本页重点说明现代矩阵计算方式及迁移规则。

## `ndarray` 矩阵运算

```python
import numpy as np

a = np.array([[1.0, 2.0], [3.0, 4.0]])
b = np.array([[2.0, 0.0], [1.0, 2.0]])

print(a * b)       # 逐元素乘法
print(a @ b)       # 矩阵乘法
print(a.T)         # 转置
print(np.linalg.matrix_power(a, 2))
```

矩阵与向量相乘时，shape 会按一维向量规则变化：

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
x = np.array([10, 20])
column = x[:, None]
print((a @ x).shape)
print((a @ column).shape)
```

## 历史 `matrix` 的差异

`np.matrix` 始终是二维；`*` 表示矩阵乘法，`.A` 转为 ndarray，`.I` 表示逆矩阵。混用 `matrix` 与 `ndarray` 会触发不直观的类型传播和运算符语义，因此迁移时应尽快统一成 `ndarray`。

典型迁移：

| 旧写法 | 推荐写法 |
| --- | --- |
| `np.matrix(data)` | `np.asarray(data)` |
| `a * b` | `a @ b` |
| `a.I` | `np.linalg.inv(a)`，更常见是 `solve` |
| `a.H` | `a.conj().T` |
| `a.A` | `np.asarray(a)` |

## 常见错误与工程注意事项

- 不要把 `*` 当矩阵乘法；对 ndarray 它始终逐元素计算。
- 一维数组转置 `x.T` 仍是一维。需要列向量时显式使用 `x[:, None]`。
- 解 `A @ x = b` 不应先算 `inv(A) @ b`，直接使用 `np.linalg.solve(A, b)` 更快且数值更稳定。
- `@` 对高维数组执行批量矩阵乘法，最后两轴是矩阵轴，前导轴参与广播。
- `np.matlib` 和 `np.matrix` 主要用于维护遗留代码，不应成为新接口的返回类型。
- 线性代数代码应断言最后两轴 shape，并为奇异、病态和空矩阵添加测试。
