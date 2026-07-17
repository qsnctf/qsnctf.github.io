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

## 示例二：区间索引查找

```python
import pandas as pd

bins = pd.IntervalIndex.from_breaks([0, 10, 20], closed="right")
print(bins)
print(bins.get_indexer([5, 10, 15, 25]))
```

`IntervalIndex.get_indexer` 返回每个点所属区间的位置，未匹配为 `-1`。边界是否包含由 `closed` 决定。

## 示例三：日期索引对齐

```python
import pandas as pd

idx = pd.date_range("2026-01-01", periods=3, freq="D", name="day")
s = pd.Series([10, 20], index=idx[[0, 2]])
print(s.reindex(idx, fill_value=0))
```

`reindex` 创建完整日期轴并返回新 Series。索引频率元数据是否保留取决于结果是否仍为规则序列。

## 类型、返回与性能

`get_loc` 对唯一标签常返回整数，对切片或重复标签可能返回 slice/布尔数组；调用方不能总是假设标量。集合操作返回新 Index，并可能排序或统一 dtype。高基数对象索引占用可观内存，实体键适合规范为紧凑稳定 dtype。

## 注意事项

`get_indexer` 用 `-1` 表示未找到，使用结果做位置索引前必须检查。索引允许重复，但许多对齐和重索引操作要求唯一。Index 不可变是指标签不能原地改写，不代表其引用的数据永不复制。大索引集合运算也有内存成本，应避免不必要的来回转换。
