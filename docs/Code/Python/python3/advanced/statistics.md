# Python statistics

## 概念与用途

`statistics` 为普通数字序列提供均值、中位数、众数、方差、分位数和相关系数等基础统计。它适合小中型标量数据；大型数组与缺失值处理通常使用 NumPy/Pandas。

## 核心 API

常用函数有 `mean()`、`fmean()`、`median()`、`multimode()`、`variance()`、`stdev()` 和 `quantiles()`。样本方差与总体方差分别使用 `variance()` 和 `pvariance()`。

```python
from statistics import fmean, median, pstdev, quantiles

values = [12, 15, 18, 18, 21, 24]
print("均值", fmean(values))
print("中位数", median(values))
print("总体标准差", pstdev(values))
print("四分位", quantiles(values, n=4))
```

## 函数选择

| 指标 | API | 适用说明 |
| --- | --- | --- |
| 算术均值 | `fmean` | 快速转为浮点 |
| 中位数 | `median` | 对异常值更稳健 |
| 样本方差 | `variance` | 分母 n-1 |
| 总体方差 | `pvariance` | 分母 n |

## 示例：均值与中位数对异常值

```python
from statistics import fmean, median

normal = [10, 11, 12, 13, 14]
with_outlier = normal + [1000]
print(fmean(normal), median(normal))
print(fmean(with_outlier), median(with_outlier))
```

`statistics` 是标准库，无需安装。缺失值、NaN、权重和分组逻辑需要在计算前明确处理；统计结果应附样本量与数据口径，而不是只输出单个数字。

## 常见错误与工程注意

- 空数据或样本量不足会抛 `StatisticsError`，边界应提前检查。
- 先明确数据是样本还是总体，否则方差分母会选错。
- 异常值会显著影响均值和标准差，报告时应结合分布与稳健统计量。
