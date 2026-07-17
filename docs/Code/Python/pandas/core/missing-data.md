# Pandas 缺失值处理

## 概念与用途

Pandas 使用 `NaN`、`NaT` 和 `pd.NA` 表示不同 dtype 的缺失值。处理方式取决于缺失机制和业务含义，可以删除、常量填充、统计填充、前后传播或保留并建模。

## 核心 API

`isna`、`notna`、`dropna`、`fillna`、`ffill`、`bfill`、`interpolate`、`combine_first`。

## 可运行示例

```python
import pandas as pd

df = pd.DataFrame({"group": ["A", "A", "B"], "value": [10.0, None, 30.0]})
df["value"] = df["value"].fillna(df.groupby("group")["value"].transform("median"))
df["value"] = df["value"].fillna(df["value"].median())
print(df)
```

## 示例二：按时间插值并限制传播

```python
import pandas as pd

s = pd.Series(
    [1.0, None, 3.0, None],
    index=pd.to_datetime(["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-10"]),
)
interpolated = s.interpolate(method="time", limit=1, limit_area="inside")
print(interpolated)
```

`method="time"` 使用日期间距而非行位置；`limit_area="inside"` 不外推边界空值。结果保留原索引并返回新 Series。

## dtype、对齐与工程语义

可空整数、布尔和字符串优先使用 `Int64`、`boolean`、`string` 与 `pd.NA`。用另一个 Series 填充时会按索引对齐。分组填充前检查空分组键；时间前向填充必须在实体内排序，设置 `limit` 防止跨越过长缺口。

## 注意事项

不要用 `== None` 或 `== float("nan")` 检测缺失，应使用 `isna`。前向填充前必须排序，并限制跨实体传播；时间插值需正确时间索引。删除行可能引入样本偏差，填充也会改变统计分布，应记录缺失率、方法和影响。
