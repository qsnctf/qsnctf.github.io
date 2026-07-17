# Pandas 测验

## 概念与用途

本页通过短题检查对象模型、索引、清洗、合并、分组、时间序列和 I/O 理解。先独立作答，再运行练习代码和查看答案。

## 核心 API 范围

`Series`、`DataFrame`、`loc`、`iloc`、`fillna`、`drop_duplicates`、`merge`、`concat`、`groupby`、`pivot_table`、`rolling`、`read_csv`、`to_parquet`。

## 题目

1. `loc` 与 `iloc` 的切片语义有什么不同？
2. 为什么两个 Series 相加可能出现 `NaN`？
3. `groupby().agg()` 与 `groupby().transform()` 的输出粒度有什么区别？
4. 如何检测一次连接是否意外成为多对多连接？
5. CSV 与 Parquet 在类型保真和分析性能上有何差异？
6. 为什么时间窗口计算前必须排序？

## 可运行练习

```python
import pandas as pd

orders = pd.DataFrame({"customer": ["A", "A", "B"], "amount": [10, None, 30]})
# 练习：按客户中位数填充空值，再添加每笔金额占客户总额的比例。
orders["amount"] = orders["amount"].fillna(
    orders.groupby("customer")["amount"].transform("median")
)
orders["share"] = orders["amount"] / orders.groupby("customer")["amount"].transform("sum")
print(orders)
```

## 可运行练习二：验证连接粒度

```python
import pandas as pd

orders = pd.DataFrame({"order_id": [1, 2], "customer_id": [10, 20]})
customers = pd.DataFrame({"customer_id": [10, 20], "name": ["Ada", "Lin"]})
joined = orders.merge(customers, on="customer_id", how="left", validate="many_to_one", indicator=True)
assert len(joined) == len(orders)
assert joined["_merge"].eq("both").all()
print(joined)
```

尝试在 `customers` 中加入重复 `customer_id`，观察 `validate="many_to_one"` 如何阻止结果行数膨胀。再加入缺失客户，观察 `_merge` 的变化。

## 参考答案与注意事项

1. `loc` 按标签且标签切片通常包含右端；`iloc` 按整数位置且右端不包含。
2. Series 按索引对齐，任一侧缺少标签时结果为空。
3. `agg` 每组输出汇总行，`transform` 返回与原组等长结果。
4. 在 `merge` 使用 `validate="one_to_one"`、`one_to_many` 或 `many_to_one`，并检查行数。
5. CSV 是无 schema 文本；Parquet 保存更多类型信息并支持压缩、列裁剪和过滤下推。
6. 窗口依赖相邻顺序，未排序会把错误记录纳入窗口。真实工程还要验证空键、重复键、时区、dtype 和结果行数，不能只验证代码能运行。
