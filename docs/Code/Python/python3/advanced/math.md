# Python math

## 概念与用途

`math` 提供实数数学函数和常量，底层通常映射到平台 C 数学库。它适合标量计算；数组运算通常使用 NumPy，复数运算使用 `cmath`。

## 核心 API

常见函数有 `sqrt()`、`isqrt()`、`sin()`、`log()`、`ceil()`、`floor()`、`gcd()`、`comb()`、`isclose()`，常量包括 `pi`、`e`、`inf` 和 `nan`。

```python
import math

radius = 3
area = math.pi * radius ** 2
print(f"面积: {area:.2f}")
print(math.gcd(84, 30), math.comb(5, 2))
print(math.isclose(0.1 + 0.2, 0.3))
```

## API 分类

| 类别 | API | 边界 |
| --- | --- | --- |
| 取整 | `floor/ceil/trunc` | 负数方向不同 |
| 组合 | `factorial/comb/perm` | 输入需为非负整数 |
| 对数 | `log/log2/log10` | 输入必须为正 |
| 精确求和 | `fsum` | 比普通 sum 减少误差 |

## 示例：稳定浮点求和

```python
import math

values = [1e16, 1.0, -1e16]
print("sum:", sum(values))
print("fsum:", math.fsum(values))
print("有限值:", [math.isfinite(value) for value in (1.0, math.inf, math.nan)])
```

`math` 是标准库，无需安装。输入来自外部时应先拒绝 NaN/Infinity 和越界值；数学定义域错误属于可预期输入错误，而不是应忽略的运行故障。

## 常见错误与工程注意

- `math.sqrt(-1)` 抛 `ValueError`，复数场景使用 `cmath.sqrt()`。
- 弧度与角度不要混用，可用 `radians()` 和 `degrees()` 转换。
- NaN 不等于自身，数据清洗应使用 `math.isnan()` 检查。
