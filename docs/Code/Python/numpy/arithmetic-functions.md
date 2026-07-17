# NumPy 算术函数

算术 ufunc 对数组执行逐元素加减乘除、余数和幂运算。与 Python 运算符相比，函数形式还可使用 `out`、`where`、`dtype` 等参数，并提供 `reduce`、`accumulate` 等方法。

## 核心 API

| 运算符 | 函数 | 说明 |
| --- | --- | --- |
| `+` | `np.add` | 加法 |
| `-` | `np.subtract` | 减法 |
| `*` | `np.multiply` | 逐元素乘法 |
| `/` | `np.divide` / `np.true_divide` | 真除法 |
| `//` | `np.floor_divide` | 向下取整除法 |
| `%` | `np.remainder` | 余数 |
| `**` | `np.power` | 逐元素幂 |
| `@` | `np.matmul` | 矩阵乘法，不是逐元素运算 |

## 可运行示例

```python
import numpy as np

a = np.array([10, 20, 30])
b = np.array([3, 4, 5])
print(np.add(a, b))
print(np.divide(a, b))
print(np.floor_divide(a, b))
print(np.remainder(a, b))

print(np.add.reduce(a))
print(np.multiply.accumulate(b))
```

安全处理除数为零的位置：

```python
import numpy as np

numerator = np.array([10.0, 20.0, 30.0])
denominator = np.array([2.0, 0.0, 5.0])
result = np.full(3, np.nan)
np.divide(numerator, denominator, out=result, where=denominator != 0)
print(result)
```

## 运算语义

算术函数遵循广播和 dtype 提升规则。整数真除法产生浮点结果，整数的 `floor_divide` 对负数向负无穷取整。逐元素乘法与线性代数乘法必须明确区分。

## 常见错误与性能注意事项

- 固定宽度整数算术可能溢出；求和等聚合可显式指定更宽 `dtype`。
- 除零通常发出运行时警告并产生 `inf` 或 `nan`；用 `where`、输入验证或局部 `errstate` 处理，而非忽略所有警告。
- 原地操作 `a += b` 必须能把结果转换回 `a.dtype`，例如整数数组原地加浮点数会失败或丢失语义。
- `np.mod` / `remainder` 与某些语言对负数余数的定义不同，跨语言协议应添加负数测试。
- `sum(a * b)` 会物化中间数组；向量内积可用 `np.dot`，大规模张量收缩考虑 `einsum` 并验证性能。
- 使用 `out` 可减少分配，但输出与输入重叠时必须确认 ufunc 支持预期别名行为。
