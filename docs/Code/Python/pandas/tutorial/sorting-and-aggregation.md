# Pandas 数据排序与聚合

## 概念与用途

排序决定展示和后续顺序计算，聚合把多行压缩成统计结果。常见场景是按地区、产品和日期汇总金额、数量及唯一用户数。

## 核心 API

`sort_values`、`sort_index`、`nlargest`、`nsmallest`、`groupby`、`agg`、`NamedAgg`、`pivot_table`。

## 可运行示例

```python
import pandas as pd

orders = pd.DataFrame({"city": ["A", "A", "B"], "amount": [100, 70, 120], "user": [1, 2, 1]})
report = (orders.groupby("city", as_index=False)
                .agg(revenue=("amount", "sum"), users=("user", "nunique"))
                .sort_values(["revenue", "city"], ascending=[False, True]))
print(report)
```

## 示例二：稳定排序与返回形状

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [9, 9, 8], "seq": [2, 1, 3]})
ordered = df.sort_values("score", ascending=False, kind="stable")
series_result = df.groupby("team")["score"].mean()
frame_result = df.groupby("team", as_index=False).agg(mean_score=("score", "mean"))
print(ordered)
print(series_result)
print(frame_result)
```

`as_index` 决定分组键成为索引还是普通列。稳定排序只保证相同排序键保留原顺序；若业务要求明确次序，应提供第二排序键。

## 空值与性能

`sort_values(na_position="first"/"last")` 控制空值位置；聚合函数通常跳过空值，`size` 与 `count` 语义不同。只需前 N 条时使用 `nlargest`/`nsmallest`，避免完整排序。

## 注意事项

多键排序要明确每个键的升降序和空值位置；需要稳定保持同值原顺序时指定 `kind="stable"`。`groupby` 默认丢弃分组键中的空值，可按需求设置 `dropna=False`。类别字段分组应关注 `observed`，避免产生未出现组合或未来默认值变化。
