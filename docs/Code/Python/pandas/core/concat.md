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

## 注意事项

循环中反复 `concat` 会重复复制，先把对象收集到列表再一次拼接。行拼接前检查列名和 dtype，列拼接前检查索引是否真正代表同一实体。`ignore_index=True` 会丢弃原行标签；需要追踪来源时用 `keys` 创建来源层级。
