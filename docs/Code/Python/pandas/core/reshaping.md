# Pandas 数据重塑

## 概念与用途

重塑在宽表和长表之间转换。长表适合分组和统计绘图，宽表适合矩阵计算与报表；操作不应改变事实含义或无意聚合重复记录。

## 核心 API

`pivot`、`pivot_table`、`melt`、`stack`、`unstack`、`wide_to_long`、`explode`、`crosstab`。

## 可运行示例

```python
import pandas as pd

wide = pd.DataFrame({"id": [1, 2], "sales_2025": [10, 20], "sales_2026": [12, 24]})
long = wide.melt(id_vars="id", var_name="year", value_name="sales")
long["year"] = long["year"].str.extract(r"(\d{4})").astype(int)
restored = long.pivot(index="id", columns="year", values="sales")
print(long)
print(restored)
```

## 注意事项

`pivot` 要求索引-列组合唯一，重复时应先处理或使用带明确 `aggfunc` 的 `pivot_table`。重塑可能产生大量稀疏列并消耗内存。`explode` 会复制其他列且空列表、空值语义不同；操作前后检查行数、唯一键和汇总值。
