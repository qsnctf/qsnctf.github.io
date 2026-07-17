# Pandas 常用函数

## 概念与用途

本页汇总日常探索、转换和分析中高频 API。它同时作为教程与参考手册中的“Pandas 常用函数”页面。

## 核心 API

| 类别 | 常用 API | 用途 |
| --- | --- | --- |
| 检查 | `head`、`sample`、`info`、`describe` | 理解规模、类型和分布 |
| 计数 | `value_counts`、`nunique`、`isna` | 检查类别与质量 |
| 转换 | `assign`、`astype`、`replace`、`rename` | 生成或规范字段 |
| 排序汇总 | `sort_values`、`nlargest`、`agg`、`groupby` | 排序和统计 |
| 组合 | `merge`、`concat`、`pivot_table` | 连接与重塑 |

## 可运行示例

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [8, 10, 7]})
summary = (df.groupby("team")["score"]
             .agg(count="size", mean="mean", best="max")
             .sort_values("mean", ascending=False))
print(summary)
```

## 示例二：检查数据质量

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 1, 2], "status": ["new", None, "paid"]})
quality = {
    "rows": len(df),
    "duplicate_ids": int(df["id"].duplicated().sum()),
    "missing_status": int(df["status"].isna().sum()),
    "status_counts": df["status"].value_counts(dropna=False).to_dict(),
}
print(quality)
```

## 返回类型与对齐速记

`head` 返回同类对象，`info` 打印摘要并返回 `None`，`describe` 返回 DataFrame，`nunique` 对 Series 返回整数、对 DataFrame 返回 Series。`assign` 中新 Series 和 `concat(axis=1)` 都按索引对齐，不按当前行位置盲目拼接。

排序和去重通常返回新对象，但底层复制不是稳定契约。需要唯一键时在操作后显式断言，而不是依赖当前排序或 `inplace=True`。

## 注意事项

`inplace=True` 通常不减少峰值内存，也不利于链式表达；优先赋值结果。`describe` 只是概览，不能替代约束检查。聚合时明确 `numeric_only` 和空值策略；大表避免全量 `apply(axis=1)`，先寻找向量化、`map`、`transform` 或合并方案。
