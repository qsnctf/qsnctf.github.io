# Pandas 时间序列分析

## 概念与用途

时间序列分析关注按时间排序的观测，可进行频率转换、滞后、变化率、滚动统计和区间切片。常见前提是时间索引已解析、排序且粒度明确。

## 核心 API

`set_index`、`resample`、`asfreq`、`shift`、`diff`、`pct_change`、`rolling`、`expanding`、基于日期的 `.loc` 切片。

## 可运行示例

```python
import pandas as pd

s = pd.Series([10, 12, 9, 15], index=pd.date_range("2026-01-01", periods=4, freq="D"))
result = pd.DataFrame({
    "value": s,
    "change": s.diff(),
    "rolling_mean": s.rolling("2D").mean(),
})
print(result)
```

## 注意事项

`resample` 按时间桶聚合，`asfreq` 只改变频率并可能引入空值。计算滞后或滚动前按实体和时间排序，防止跨实体串值。区间边界、标签位置和闭区间选项会影响结果；业务日历与自然日不同，应使用合适频率或自定义偏移。
