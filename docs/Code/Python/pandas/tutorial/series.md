# Pandas Series

## 概念与用途

`Series` 是带索引的一维数组，由值、`dtype`、索引和可选名称组成。它可表示表的一列、时间序列或键值映射，并在计算时按标签自动对齐。

## 核心 API

- 构造：`pd.Series(data, index=..., dtype=..., name=...)`。
- 选择：`s.loc[label]`、`s.iloc[position]`、布尔掩码。
- 统计与映射：`sum`、`mean`、`value_counts`、`map`、`astype`。
- 缺失值：`isna`、`fillna`、`dropna`。

## 可运行示例

```python
import pandas as pd

price = pd.Series([12.5, None, 18.0], index=["A", "B", "C"], name="price")
clean = price.fillna(price.median())
discounted = clean.mul(0.9).round(2)
print(discounted.loc[["A", "C"]])
```

## 示例二：对齐后比较

```python
import pandas as pd

left = pd.Series([10, 20], index=["x", "y"])
right = pd.Series([20, 30], index=["y", "z"])
left_aligned, right_aligned = left.align(right, join="inner")
print(left_aligned)
print(right_aligned)
print(left_aligned.eq(right_aligned))
```

`align` 返回两个新 Series；`join="inner"` 只保留共同标签。若希望保留左侧粒度，使用 `join="left"` 并明确空值填充策略。

## 返回与复制语义

归约如 `sum()` 返回标量，`value_counts()` 返回以取值为索引的新 Series，布尔筛选返回子集。切片是否共享底层内存不应作为业务契约；需要隔离修改时显式 `copy()`，赋值时使用 `.loc`。

## 注意事项

`s[0]` 的标签/位置含义容易混淆，工程代码应明确使用 `loc` 或 `iloc`。两个 Series 索引不同会按标签对齐并产生空值，必要时先 `align` 或 `reset_index`。混合类型可能退化为 `object`，降低速度并隐藏脏数据，应使用 nullable dtype 或显式转换。
