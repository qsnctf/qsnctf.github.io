# Pandas 窗口函数

## 概念与用途

窗口函数在相邻观测上计算统计量。`rolling` 使用固定条数或时间跨度，`expanding` 从起点累计，`ewm` 让近期值拥有更高权重。

## 核心 API

`rolling(window, min_periods, center, closed)`、`expanding`、`ewm`，以及窗口后的 `mean`、`sum`、`std`、`quantile`、`apply`。

## 可运行示例

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "A", "B", "B"], "score": [8, 10, 9, 6, 12]})
df["moving_mean"] = (
    df.groupby("team")["score"]
      .transform(lambda s: s.rolling(2, min_periods=1).mean())
)
df["expanding_max"] = df.groupby("team")["score"].cummax()
print(df)
```

## 注意事项

窗口依赖顺序，必须先按实体和时间排序。`min_periods` 决定开头是否为空；样本标准差默认 `ddof=1`，与部分工具不同。时间窗口要求日期型索引或 `on` 列，并需明确闭区间。自定义 `rolling.apply` 较慢，应优先内置聚合。
