# Python3 数字(Number)

## 概念与用途

Python 数字包括任意精度整数 `int`、双精度浮点数 `float` 和复数 `complex`。整数适合计数和位运算，浮点数适合一般科学计算，金额等十进制精确场景应使用 `decimal.Decimal`。

## 核心 API

`abs()`、`round()`、`pow()` 提供常用运算；`divmod(a, b)` 同时返回商和余数。`Decimal` 应从字符串构造，`fractions.Fraction` 可表示精确分数。

```python
from decimal import Decimal
from fractions import Fraction

print(divmod(17, 5))
print(0.1 + 0.2)
print(Decimal("0.1") + Decimal("0.2"))
print(Fraction(1, 3) + Fraction(1, 6))
```

## 类型选择

| 类型 | 优点 | 典型边界 |
| --- | --- | --- |
| `int` | 任意精度、精确 | 大整数计算仍消耗资源 |
| `float` | 快、生态广 | 二进制表示误差 |
| `Decimal` | 十进制定点规则 | 不要从 float 构造 |
| `Fraction` | 精确有理数 | 分子分母可能快速增长 |

## 示例：浮点容差

```python
import math

actual = sum([0.1, 0.1, 0.1])
expected = 0.3
print(actual == expected)
print(math.isclose(actual, expected, rel_tol=1e-9, abs_tol=0.0))
```

容差应来自业务精度，而不是机械复制固定值。处理外部 `nan` 和无穷值时可用 `math.isfinite()` 拒绝非有限数字，防止后续排序和聚合出现意外。

## 常见错误与工程注意

- 不要用 `==` 判断浮点计算结果，使用 `math.isclose()` 或业务容差。
- `round()` 采用银行家舍入等规则，不应未经确认直接用于财务结算。
- 除法前检查零值；处理巨大外部整数时还要考虑资源消耗。
