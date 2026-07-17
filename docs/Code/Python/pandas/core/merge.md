# Pandas 数据合并

## 概念与用途

`merge` 按键执行类似 SQL 的 inner、left、right、outer 或 cross join。正确合并需要先定义键的唯一性、空值语义和预期结果粒度。

## 核心 API

`pd.merge`、`DataFrame.merge`、`DataFrame.join`；关键参数有 `on`、`left_on`、`right_on`、`how`、`validate`、`indicator`、`suffixes`。

## 可运行示例

```python
import pandas as pd

orders = pd.DataFrame({"order_id": [1, 2], "customer_id": [10, 20]})
customers = pd.DataFrame({"customer_id": [10, 20], "name": ["Ada", "Lin"]})
result = orders.merge(
    customers, on="customer_id", how="left", validate="many_to_one", indicator=True
)
print(result)
```

## 注意事项

多对多连接会产生笛卡尔放大，应使用 `validate` 声明关系并检查行数。Pandas 中两侧空键可能互相匹配，这与部分 SQL 语义不同，连接前按业务处理空键。键 dtype 必须兼容，字符串还需统一空白和大小写；同名非键列用后缀明确来源。
