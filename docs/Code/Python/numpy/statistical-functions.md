# NumPy 统计函数

统计函数沿指定轴汇总数组，用于描述中心、离散程度、分位数和相关关系。正确选择 `axis`、dtype、自由度和缺失值策略比调用函数本身更重要。

## 核心 API

| 类别 | API |
| --- | --- |
| 极值 | `min`、`max`、`ptp`、`argmin`、`argmax` |
| 中心 | `mean`、`median`、`average` |
| 离散 | `var`、`std` |
| 分位数 | `percentile`、`quantile` |
| 关系 | `cov`、`corrcoef` |
| 忽略 NaN | `nanmean`、`nanstd`、`nanquantile` 等 |

## 可运行示例

```python
import numpy as np

scores = np.array([[80.0, 90.0, np.nan], [70.0, 95.0, 85.0]])
print(np.nanmean(scores, axis=0))
print(np.nanmedian(scores, axis=1))
print(np.nanstd(scores, axis=0, ddof=1))
print(np.nanquantile(scores, [0.25, 0.5, 0.75]))

values = np.array([1.0, 2.0, 10.0])
weights = np.array([1.0, 1.0, 0.5])
print(np.average(values, weights=weights))
```

`axis=None` 聚合全部元素；`axis=0` 对二维数组逐列汇总；`keepdims=True` 可保留长度为 1 的轴，便于继续广播。

## 方差与自由度

`std` 和 `var` 默认 `ddof=0`，分母为 `N`。样本统计常使用 `ddof=1`，但应由统计模型决定，不应机械套用。有效样本数不大于 `ddof` 时结果无定义。

## 常见错误与性能注意事项

- 普通函数遇到 `nan` 通常传播 `nan`；使用 `nan*` 系列前先确认缺失是否可被忽略，而非数据质量错误。
- 整数输入的均值通常提升为浮点，但某些聚合的中间 dtype 仍需关注；大整数求和显式指定 `dtype=np.int64` 或更合适类型。
- `argmax` 返回位置而不是最大值，多维结果还需结合轴或 `unravel_index` 解释。
- 分位数的插值/方法选择会影响小样本结果，跨工具对比时显式设置 `method`。
- 相关系数不代表因果，常量列会导致除零和 `nan`；分析前检查方差和样本量。
- 大数组的精确分位数需要排序或选择并消耗内存；流式数据应使用在线统计或近似分位数算法。
