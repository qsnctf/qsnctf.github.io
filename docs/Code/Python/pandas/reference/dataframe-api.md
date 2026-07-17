# Pandas DataFrame API 手册

## 概念与适用边界

`DataFrame(data=None, index=None, columns=None, dtype=None, copy=None)` 是二维、列类型可不同的带标签容器。它适合内存内的表格转换与分析，不负责事务、约束持久化或超内存分布式执行。

构造时字典键成为列名，Series 字典会按各自索引对齐。`copy=None` 是否复制取决于输入类型；不要把构造器视为稳定的零复制接口。

## 选择与赋值签名

- `df.loc[row_labels, column_labels]`：按标签选择；标签切片通常包含右端。
- `df.iloc[row_positions, column_positions]`：按整数位置选择；切片右端不包含。
- `df.get(key, default=None)`：列不存在时返回默认值，不抛 `KeyError`。
- `df.assign(**kwargs) -> DataFrame`：返回包含新列的新对象；后一个表达式可引用前面刚创建的列。
- `df.drop(labels=None, axis=0, index=None, columns=None, errors="raise") -> DataFrame`。
- `df.rename(mapper=None, index=None, columns=None, axis=None, copy=None, inplace=False, errors="ignore")`。

`df["x"]` 返回 Series，`df[["x"]]` 返回 DataFrame。布尔 Series 作为行掩码时会先按索引对齐；索引不匹配会报错或产生非预期筛选，位置掩码可显式使用同长度 NumPy 数组。

## 聚合、组合与重塑

- `df.agg(func=None, axis=0, *args, **kwargs)`：返回标量、Series 或 DataFrame，取决于函数数量和轴。
- `df.groupby(by=None, level=None, as_index=True, sort=True, dropna=True, observed=...)`：返回延迟分组对象。
- `df.merge(right, how="inner", on=None, left_on=None, right_on=None, validate=None, indicator=False)`：返回新 DataFrame。
- `df.join(other, on=None, how="left", lsuffix="", rsuffix="", validate=None)`：默认按索引连接。
- `df.pivot(index=None, columns=None, values=None)`：重复键会报错；需要聚合时用 `pivot_table`。
- `df.reindex(labels=None, index=None, columns=None, method=None, fill_value=...)`：按新标签重排，缺失标签产生空值。

## 示例一：赋值和标签对齐

```python
import pandas as pd

df = pd.DataFrame({"score": [80, 90]}, index=["u2", "u1"])
bonus = pd.Series({"u1": 5, "u2": 2})
result = df.assign(final=df["score"] + bonus)
print(result)
assert result.loc["u1", "final"] == 95
```

`bonus` 的顺序与 `df` 不同，但加法按标签而非位置执行。这是 Pandas 可靠对齐的优势，也是索引错误时产生空值的来源。

## 示例二：受验证的连接与命名聚合

```python
import pandas as pd

orders = pd.DataFrame({"customer_id": [1, 1, 2], "amount": [10, 15, 20]})
customers = pd.DataFrame({"customer_id": [1, 2], "segment": ["A", "B"]})
joined = orders.merge(customers, on="customer_id", validate="many_to_one")
report = joined.groupby("segment", as_index=False).agg(
    orders=("amount", "size"), revenue=("amount", "sum")
)
print(report)
```

## 返回值、视图与复制语义

大多数转换方法返回新对象，但底层数据是否共享属于实现细节。切片可能共享内存，也可能复制；开启 Copy-on-Write 后，派生对象通常在写入时再复制。Pandas 2.x 中可用 `pd.options.mode.copy_on_write = True` 评估该模式，但项目应测试所锁定版本。

不要依赖 `inplace=True` 节省内存，它通常不保证零复制，而且返回 `None`。稳定写法是把结果重新赋给变量。需要与 NumPy/第三方库隔离时显式 `df.copy(deep=True)`，但对象 dtype 中嵌套的 Python 对象仍不一定被递归复制。

## 常见错误与工程注意事项

- 链式赋值 `df[mask]["x"] = ...` 可能写入临时对象；使用 `df.loc[mask, "x"] = ...`。
- `axis=0` 通常沿行聚合得到每列结果，`axis=1` 横跨列得到每行结果。
- `merge` 前用 `validate` 声明键关系，并检查空键、重复键和连接后行数。
- `groupby` 默认不包含空分组键；需要时设置 `dropna=False`。
- 大表只选择必要列，避免逐行 `apply(axis=1)`，使用向量化、连接、`agg` 或 `transform`。
- API 参考应与项目 Pandas 版本匹配；返回 dtype 和默认参数可能随版本调整。
