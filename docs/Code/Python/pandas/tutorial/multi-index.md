# Pandas 多层索引

## 概念与适用边界

`MultiIndex` 在一个轴上保存多个标签层级，可表达地区-产品、实体-日期等复合键。它常由 `set_index`、多键 `groupby`、`pivot_table` 或 `stack` 产生。

MultiIndex 适合内部层级分析，但数据库、CSV、JSON API 和部分可视化工具对它支持有限。对外交换时通常应 `reset_index()` 恢复普通列。

## 关键 API 与参数

- `MultiIndex.from_arrays/from_tuples/from_product`：从不同结构构造层级索引。
- `set_index(keys, append=False, verify_integrity=False)`：把列移入索引。
- `xs(key, axis=0, level=None, drop_level=True)`：按指定层级横截。
- `swaplevel(i=-2, j=-1)`、`reorder_levels(order)`：调整层级顺序。
- `sort_index(level=None, sort_remaining=True)`：为层级切片建立可预测顺序。
- `stack`/`unstack(level=-1, fill_value=None)`：在行列层级之间移动。

层级名称可通过 `index.names` 查看。使用名称比层级数字更稳定，因为重排层级后数字位置会变化。

## 示例一：层级选择和分组

```python
import pandas as pd

df = pd.DataFrame({
    "region": ["N", "N", "S", "S"],
    "year": [2025, 2026, 2025, 2026],
    "sales": [8, 10, 9, 12],
}).set_index(["region", "year"]).sort_index()

print(df.loc[("N", 2025), "sales"])
print(df.xs(2026, level="year"))
print(df.groupby(level="region")["sales"].sum())
```

## 示例二：宽长重塑

```python
import pandas as pd

long = pd.DataFrame({"id": [1, 1, 2, 2], "metric": ["x", "y", "x", "y"], "value": [10, 20, 30, 40]})
indexed = long.set_index(["id", "metric"])
wide = indexed["value"].unstack("metric")
restored = wide.stack().rename("value").reset_index()
print(wide)
print(restored)
```

`unstack` 要求被展开组合唯一；重复键会报错，应先明确聚合规则，而不是随意删除重复行。

## 示例三：IndexSlice 范围选择

```python
import pandas as pd

idx = pd.MultiIndex.from_product([["A", "B"], [1, 2, 3]], names=["group", "step"])
s = pd.Series(range(6), index=idx).sort_index()
key = pd.IndexSlice
print(s.loc[key["A", 2:3]])
```

## 复制、排序与性能

层级切片通常要求字典序排序；未排序索引可能报 `UnsortedIndexError` 或退化为较慢路径。`stack`、`unstack` 会重排并可能复制大量数据，层级基数高时宽表可能急剧膨胀。

## 常见错误与工程注意事项

- 元组标签顺序必须与 `index.names` 一致。
- `xs(..., drop_level=True)` 默认删除已选择层级；后续若仍需该层级，设置 `drop_level=False`。
- CSV 多行表头和 MultiIndex 列回读需要明确 `header=[...]`，否则层级可能丢失。
- 对复合主键使用 `verify_integrity=True` 或显式检查 `index.is_unique`。
- 外部接口优先使用普通列，减少序列化和跨语言歧义。
