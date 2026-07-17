# pandas 简介

## 概念与用途

Pandas 在 NumPy 之上提供带标签的一维 `Series` 和二维 `DataFrame`。它适合清洗表格、连接多数据源、分组统计和时间序列分析；标签对齐是其区别于普通二维数组的重要语义。

## 核心 API

- `pd.Series`、`pd.DataFrame`：核心容器。
- `read_*`、`to_*`：读取和写出数据。
- `loc`、`iloc`、`query`：选取数据。
- `groupby`、`agg`、`merge`、`pivot_table`：汇总、连接和重塑。

## 可运行示例

```python
import pandas as pd

sales = pd.DataFrame({
    "city": ["北京", "上海", "北京"],
    "amount": [120, 180, 90],
})
result = sales.groupby("city", as_index=False)["amount"].sum()
print(result.sort_values("amount", ascending=False))
```

## 示例二：观察标签对齐

```python
import pandas as pd

budget = pd.Series({"A": 100, "B": 200})
actual = pd.Series({"B": 180, "C": 90})
print(budget - actual)
print(budget.sub(actual, fill_value=0))
```

第一个结果只在共同标签 `B` 上有值；第二个结果用 `fill_value` 补齐单侧缺失。错误索引也会静默扩大结果标签集合，因此计算前要检查 `index`。

## 适用边界与返回语义

选择单列通常返回 Series，选择列列表返回 DataFrame；聚合可能返回标量、Series 或 DataFrame。将结果传给下游前应检查类型、索引和 dtype。对于事务查询、并发写入、超内存数据和严格 schema 持久化，应使用数据库或其他执行引擎配合 Pandas。

## 注意事项

Pandas 适合内存可容纳的数据，不是数据库或分布式计算引擎。二元运算会按索引对齐，不一致的标签可能产生 `NaN`；读取外部数据后先检查 `shape`、`dtypes`、空值和主键。避免逐行 Python 循环，优先使用向量化、分组和连接 API。
