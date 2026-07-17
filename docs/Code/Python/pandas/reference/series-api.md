# Pandas Series API 手册

## 概念与适用边界

`Series(data=None, index=None, dtype=None, name=None, copy=None)` 是一维带标签容器。它适合表示表的一列、时间序列或键值映射；元素通常共享一个 dtype，混合值可能退化为 `object`。

Series 运算默认按索引标签对齐，而不是按当前显示位置计算。索引可重复，但重复标签会让标量选择返回多个值，并限制部分 `reindex` 操作。

## 关键 API 与签名

- `s.loc[label_or_mask]`、`s.iloc[position_or_mask]`：标签与位置选择。
- `s.map(arg, na_action=None) -> Series`：接受函数、映射或 Series；缺失映射键通常得到 `NaN`。
- `s.apply(func, convert_dtype=..., args=(), **kwargs) -> Series/DataFrame`：返回形状取决于函数结果。
- `s.astype(dtype, copy=None, errors="raise") -> Series`：转换失败默认抛错。
- `s.reindex(index=None, method=None, fill_value=..., limit=None) -> Series`：按新标签重排。
- `s.align(other, join="outer", axis=None, level=None, copy=None, fill_value=None)`：返回两个已对齐对象的元组。
- `s.value_counts(normalize=False, sort=True, ascending=False, bins=None, dropna=True)`。
- `s.nlargest(n=5, keep="first")`、`s.nsmallest(...)`：避免全量排序的 Top-N。

## 返回类型和访问器

归约方法如 `sum`、`mean` 通常返回标量；`rank`、`shift`、`fillna` 返回 Series；`agg` 可能返回标量或 Series。`str`、`dt`、`cat` 访问器只对兼容 dtype 开放，类型错误应先修正数据而非捕获后忽略。

`s.array` 返回保留扩展 dtype 的数组，`s.to_numpy()` 面向 NumPy 互操作，可能复制或转换 dtype。`s.item()` 仅允许长度恰好为 1。

## 示例一：显式对齐与填充值

```python
import pandas as pd

left = pd.Series({"A": 10, "B": 20}, dtype="Int64")
right = pd.Series({"B": 2, "C": 3}, dtype="Int64")
plain = left + right
filled = left.add(right, fill_value=0)
print(plain)
print(filled)
```

普通加法仅在共同标签 `B` 有值；`add(fill_value=0)` 在运算前补齐单侧缺失。若两侧同一标签都缺失，结果仍为空。

## 示例二：映射、可空类型和统计

```python
import pandas as pd

codes = pd.Series([1, 2, None, 9], dtype="Int64")
labels = codes.map({1: "new", 2: "paid"}).astype("string")
unknown = labels.isna() & codes.notna()
print(labels)
print("unmapped codes:", codes[unknown].tolist())
print(codes.value_counts(dropna=False))
```

## 复制和赋值语义

切片、构造和类型转换是否共享底层数据取决于 dtype、操作与 Copy-on-Write 模式，不应把 `copy=False` 当作契约。要修改原 Series，使用明确的 `.loc[...] = ...`；要隔离后续修改，使用 `copy()` 并编写测试。

## 常见错误与工程注意事项

- 整数索引下不要用 `s[0]` 猜测标签或位置，明确使用 `loc`/`iloc`。
- `map` 未命中的键会产生缺失值；映射后统计未命中项。
- 聚合通常跳过空值，关键指标显式指定 `skipna` 或先校验缺失率。
- 普通 `int64` 不能表示空值，使用 Pandas 可空整数 `Int64`。
- Top-N 使用 `nlargest`/`nsmallest` 通常比完整 `sort_values` 更省时。
- 对不同索引的 Series 做算术前，先确认希望使用 outer、inner、left 还是 right 对齐。
