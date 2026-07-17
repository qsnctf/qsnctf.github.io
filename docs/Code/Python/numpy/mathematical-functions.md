# NumPy 数学函数

NumPy 数学函数大多是通用函数（ufunc），能够逐元素计算并支持广播、类型转换、条件执行和预分配输出。常用于三角、指数、对数、取整和数值稳定变换。

## 常用函数

| 类别 | 函数示例 |
| --- | --- |
| 三角函数 | `sin`、`cos`、`tan`、`arctan2` |
| 角度转换 | `deg2rad`、`rad2deg` |
| 指数与对数 | `exp`、`expm1`、`log`、`log1p`、`log2`、`log10` |
| 幂与根 | `sqrt`、`square`、`power`、`cbrt` |
| 取整 | `floor`、`ceil`、`trunc`、`rint` |
| 绝对值与符号 | `abs`、`sign`、`copysign` |
| 有限性 | `isfinite`、`isnan`、`isinf` |

## 可运行示例

```python
import numpy as np

angles = np.deg2rad(np.array([0.0, 30.0, 90.0]))
print(np.sin(angles))

x = np.array([0.0, 1e-12, 1.0])
print(np.log1p(x))
print(np.expm1(x))

values = np.array([-1.2, 1.5, 2.8, np.nan])
print(np.floor(values))
print(np.isfinite(values))
```

使用 ufunc 的 `out` 与 `where`：

```python
import numpy as np

x = np.array([-1.0, 0.0, 4.0, 9.0])
out = np.full_like(x, np.nan)
np.sqrt(x, out=out, where=x >= 0)
print(out)
```

## 定义域与浮点策略

实数 dtype 上对负数开平方、对非正数取对数会产生 `nan` 或 `-inf` 并发出警告，而不是总抛异常。可用 `np.errstate` 在局部控制行为，或使用复数 dtype 表达复数结果。

## 常见错误与性能注意事项

- 三角函数接收弧度，不是角度；输入角度时先调用 `deg2rad`。
- 小量计算中 `log1p(x)` 比 `log(1+x)`、`expm1(x)` 比 `exp(x)-1` 更稳定。
- 浮点值不应直接严格相等比较，使用 `np.isclose` / `np.allclose` 并根据业务尺度设置容差。
- 链式表达式会创建临时数组；内存敏感路径可复用 `out`，但要保证别名不会改变计算语义。
- 全局修改 `np.seterr` 会影响进程内其他代码，库函数更适合使用局部 `np.errstate`。
- 对极大输入计算 `exp` 会溢出。概率和优化代码通常应使用 log-domain 算法或专用稳定函数。
