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

## 示例二：时间窗口与闭区间

```python
import pandas as pd

df = pd.DataFrame({
    "time": pd.to_datetime(["2026-01-01", "2026-01-02", "2026-01-04"]),
    "value": [1, 2, 4],
}).set_index("time")
df["sum_2d"] = df["value"].rolling("2D", closed="both", min_periods=1).sum()
print(df)
```

时间窗口按实际时间跨度，不等于固定两行；`closed` 决定边界是否纳入。

## 示例三：指数加权

```python
import pandas as pd

s = pd.Series([10.0, 20.0, 15.0, 30.0])
print(s.ewm(span=3, adjust=False).mean())
```

`ewm` 返回窗口对象，聚合后结果与原索引对齐。`adjust` 会改变权重计算定义，应在指标文档中固定。

## 空值、复制与性能

窗口结果是新对象，前 `min_periods - 1` 个位置常为空。空值是否参与由具体聚合决定。自定义 `rolling.apply` 每窗口调用函数，成本高；优先内置方法。按组窗口前排序并确保重复时间戳的顺序有业务定义。

## 注意事项

窗口依赖顺序，必须先按实体和时间排序。`min_periods` 决定开头是否为空；样本标准差默认 `ddof=1`，与部分工具不同。时间窗口要求日期型索引或 `on` 列，并需明确闭区间。自定义 `rolling.apply` 较慢，应优先内置聚合。
