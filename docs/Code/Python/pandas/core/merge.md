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

## 示例二：审计未匹配键

```python
import pandas as pd

left = pd.DataFrame({"id": [1, 2, 3], "value": [10, 20, 30]})
right = pd.DataFrame({"id": [1, 3], "label": ["A", "C"]})
joined = left.merge(right, on="id", how="left", validate="one_to_one", indicator=True)
unmatched = joined.loc[joined["_merge"].eq("left_only"), "id"]
print(joined)
print("unmatched:", unmatched.tolist())
```

`indicator=True` 增加类别列 `_merge`，适合质量审计。合并返回新 DataFrame，通常不保留简单位置索引，应依赖明确业务键。

## 示例三：索引连接

```python
import pandas as pd

facts = pd.DataFrame({"amount": [5, 8]}, index=pd.Index([10, 20], name="id"))
labels = pd.Series({10: "x", 20: "y"}, name="label")
print(facts.join(labels, validate="one_to_one"))
```

## 性能与复制语义

连接会分配结果数据，不能视为零复制。提前只保留必要列，并将键 dtype 规范一致；类别键是否提速需基准验证。多对多连接的结果规模可能是两侧重复数乘积，执行前先统计键频数。

## 注意事项

多对多连接会产生笛卡尔放大，应使用 `validate` 声明关系并检查行数。Pandas 中两侧空键可能互相匹配，这与部分 SQL 语义不同，连接前按业务处理空键。键 dtype 必须兼容，字符串还需统一空白和大小写；同名非键列用后缀明确来源。
