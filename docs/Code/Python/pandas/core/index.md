# 数据处理核心

## 概念与用途

Pandas 数据处理遵循“选取、过滤、清洗、转换、组合、重塑、分组、窗口计算”的主线。本组页面关注这些操作的标签语义、空值行为和可扩展写法。

## 核心 API

`loc`、`iloc`、`query`、`dropna`、`fillna`、`drop_duplicates`、`str`、`dt`、`map`、`merge`、`concat`、`pivot`、`groupby`、`rolling`。

## 可运行示例

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [8, None, 10]})
result = (df.assign(score=lambda x: x["score"].fillna(0))
            .groupby("team", as_index=False)
            .agg(total=("score", "sum")))
print(result)
```

## 页面导航

- [数据选取](data-selection.md)、[过滤与条件查询](filtering-query.md)。
- [缺失值](missing-data.md)、[重复数据](duplicates.md)、[字符串](string-operations.md)。
- [日期与时间](datetime.md)、[时间序列](time-series.md)、[apply / map / applymap](apply-map-applymap.md)。
- [数据合并](merge.md)、[数据拼接](concat.md)、[数据重塑](reshaping.md)。
- [分组操作](groupby.md)、[窗口函数](window-functions.md)。

## 注意事项

每一步都应明确输入输出粒度、排序、索引和空值策略。链式处理便于组合，但关键边界要验证行数、唯一键和类型。能用向量化、连接或分组完成时，不使用 Python 逐行循环。
