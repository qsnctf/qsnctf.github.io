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

## 示例二：按实体计算滞后

```python
import pandas as pd

df = pd.DataFrame({"id": ["A", "B", "A", "B"], "day": [1, 1, 2, 2], "value": [10, 20, 13, 18]})
df = df.sort_values(["id", "day"])
df["previous"] = df.groupby("id")["value"].shift(1)
df["change"] = df["value"].sub(df["previous"])
print(df)
```

`shift` 保留原索引与行数，只移动组内值；未排序会得到逻辑错误但通常不报异常。

## 示例三：重采样边界

```python
import pandas as pd

s = pd.Series([1, 2, 3], index=pd.to_datetime(["2026-01-01", "2026-01-02", "2026-01-08"]))
weekly = s.resample("W", label="right", closed="right").sum()
print(weekly)
```

## 索引、空值与性能

时间索引重复时聚合和选择可能返回多行，应明确同一时间戳的粒度。`pct_change`、`diff` 和窗口会引入边界空值。长表多实体分析应分组后运算；大规模不规则时间序列先裁剪日期和列，避免全表重采样产生大量空桶。

## 注意事项

`resample` 按时间桶聚合，`asfreq` 只改变频率并可能引入空值。计算滞后或滚动前按实体和时间排序，防止跨实体串值。区间边界、标签位置和闭区间选项会影响结果；业务日历与自然日不同，应使用合适频率或自定义偏移。
