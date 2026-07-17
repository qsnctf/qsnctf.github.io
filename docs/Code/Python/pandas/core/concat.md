# Pandas 数据拼接

## 概念与用途

`concat` 沿行或列组合多个 Series/DataFrame，适合追加同 schema 批次或并排对齐特征。它按另一轴标签对齐，不执行数据库式键连接。

## 核心 API

`pd.concat(objs, axis=0, join="outer", ignore_index=False, keys=None, verify_integrity=False)`。

## 可运行示例

```python
import pandas as pd

jan = pd.DataFrame({"id": [1], "amount": [10]})
feb = pd.DataFrame({"id": [2], "amount": [15]})
all_sales = pd.concat([jan, feb], ignore_index=True, verify_integrity=True)
features = pd.concat([all_sales.set_index("id"), pd.Series({1: "A", 2: "B"}, name="segment")], axis=1)
print(features)
```

## 示例二：保留来源并检查 schema

```python
import pandas as pd

first = pd.DataFrame({"id": [1], "value": pd.Series([10], dtype="Int64")})
second = pd.DataFrame({"id": [2], "value": pd.Series([20], dtype="Int64")})
combined = pd.concat({"first": first, "second": second}, names=["source", "row"])
print(combined)
print(combined.dtypes)
```

字典键形成外层索引，便于追踪来源。`keys` 不等于业务主键，输出前可 `reset_index()`。

## 示例三：inner 列交集

```python
import pandas as pd

a = pd.DataFrame({"id": [1], "x": [10]})
b = pd.DataFrame({"id": [2], "y": [20]})
print(pd.concat([a, b], join="inner", ignore_index=True))
```

按行拼接时 `join="inner"` 只保留共同列，此例只剩 `id`；默认 outer 会产生带空值的 `x/y`。

## 复制与性能

`concat` 通常创建新对象并复制或重组数据块，`copy` 参数也不是稳定零复制承诺。一次拼接列表比循环追加更高效。拼接后检查 dtype 是否因缺列、空值或类别集合不同而提升为浮点或 `object`。

## 注意事项

循环中反复 `concat` 会重复复制，先把对象收集到列表再一次拼接。行拼接前检查列名和 dtype，列拼接前检查索引是否真正代表同一实体。`ignore_index=True` 会丢弃原行标签；需要追踪来源时用 `keys` 创建来源层级。
