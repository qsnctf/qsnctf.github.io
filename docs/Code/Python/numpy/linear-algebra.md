# NumPy 线性代数

`numpy.linalg` 基于 BLAS/LAPACK 提供线性方程、矩阵分解、范数、行列式、特征值和奇异值分解。它适合中小规模稠密数组；大型稀疏或高级科学计算通常使用 SciPy。

## 核心 API

| API | 用途 |
| --- | --- |
| `solve` | 求解方阵线性系统 |
| `lstsq` | 最小二乘解 |
| `inv` / `pinv` | 逆矩阵 / 伪逆 |
| `det` / `slogdet` | 行列式 / 稳定对数行列式 |
| `norm` | 向量或矩阵范数 |
| `eig` / `eigh` | 一般矩阵 / 对称或 Hermitian 矩阵特征分解 |
| `svd` | 奇异值分解 |
| `qr` / `cholesky` | QR / Cholesky 分解 |
| `matrix_rank` / `cond` | 秩 / 条件数 |

## 解线性方程

```python
import numpy as np

a = np.array([[3.0, 1.0], [1.0, 2.0]])
b = np.array([9.0, 8.0])
x = np.linalg.solve(a, b)
print(x)
print(np.allclose(a @ x, b))
print("condition number:", np.linalg.cond(a))
```

## 最小二乘与 SVD

```python
import numpy as np

x = np.arange(5.0)
design = np.column_stack([x, np.ones_like(x)])
y = np.array([0.9, 3.1, 5.0, 7.2, 8.9])
coef, residuals, rank, singular_values = np.linalg.lstsq(design, y, rcond=None)
print(coef, residuals, rank, singular_values)

u, s, vh = np.linalg.svd(design, full_matrices=False)
print(u.shape, s.shape, vh.shape)
```

## 数值稳定性与性能

- 求解系统优先 `solve`，不要显式求逆；最小二乘优先 `lstsq`，不要手写正规方程。
- 对称/Hermitian 矩阵使用 `eigh`，其结果为实特征值且通常更快、更稳定。
- 行列式极大或极小时使用 `slogdet` 避免上溢/下溢。
- 病态矩阵可能产生看似正常但误差巨大的结果；结合 `cond`、残差和领域尺度判断。
- 整数输入会转换到浮点；高精度需求不能仅靠 NumPy 标准 dtype 解决。
- BLAS 可能自行使用多线程。并发服务或多进程任务中应配置线程数，避免线程过度订阅。
- 输入含 `nan`/`inf`、shape 不匹配或矩阵奇异时会失败或传播无效值；接口边界应验证并捕获 `LinAlgError`。
