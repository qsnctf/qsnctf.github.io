# Pandas Index 对象

## 概念与用途

`Index` 是不可变的轴标签集合。具体类型包括 `RangeIndex`、`DatetimeIndex`、`TimedeltaIndex`、`PeriodIndex`、`IntervalIndex`、`CategoricalIndex` 和 `MultiIndex`。

## 核心 API

构造 `pd.Index`、`date_range`、`period_range`、`interval_range`；属性 `name`、`dtype`、`is_unique`、`has_duplicates`；操作 `get_loc`、`get_indexer`、`union`、`intersection`、`difference`、`sort_values`、`duplicated`。

## 可运行示例

```python
import pandas as pd

left = pd.Index(["a", "b", "c"], name="key")
right = pd.Index(["b", "c", "d"], name="key")
print(left.intersection(right))
print(left.union(right))
print(left.get_indexer(["c", "x"]))
```

## 注意事项

`get_indexer` 用 `-1` 表示未找到，使用结果做位置索引前必须检查。索引允许重复，但许多对齐和重索引操作要求唯一。Index 不可变是指标签不能原地改写，不代表其引用的数据永不复制。大索引集合运算也有内存成本，应避免不必要的来回转换。
