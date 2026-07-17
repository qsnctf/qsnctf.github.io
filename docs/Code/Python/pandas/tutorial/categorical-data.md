# Pandas 类别类型

## 概念与用途

`Categorical` 用整数编码保存有限取值集合，适合重复度高的地区、状态和等级字段。类别可有顺序，使排序和比较遵循业务顺序而非字典序。

## 核心 API

`astype("category")`、`pd.CategoricalDtype`、`Series.cat.categories`、`cat.codes`、`cat.add_categories`、`cat.remove_unused_categories` 和 `cat.reorder_categories`。

## 可运行示例

```python
import pandas as pd

level_type = pd.CategoricalDtype(["low", "medium", "high"], ordered=True)
df = pd.DataFrame({"level": ["high", "low", "medium", "low"]})
df["level"] = df["level"].astype(level_type)
print(df.sort_values("level"))
print(df["level"].value_counts(sort=False))
```

## 示例二：合并类别词表

```python
import pandas as pd
from pandas.api.types import union_categoricals

left = pd.Categorical(["A", "B"], categories=["A", "B"])
right = pd.Categorical(["B", "C"], categories=["B", "C"])
combined = union_categoricals([left, right])
print(combined)
print(combined.categories)
```

直接拼接类别集合不同的 Series 可能退化为 `object`；`union_categoricals` 显式构造并集。对有序类别，顺序不一致时需要先统一业务顺序。

## 参数与性能边界

`cat.codes` 中缺失值编码为 `-1`，不能当作合法类别编号。过滤后未使用类别可调用 `remove_unused_categories()`。高基数字段未必省内存，应比较转换前后的 `memory_usage(deep=True)`；结果赋回列时仍按索引对齐。

## 注意事项

赋入未注册类别会得到空值，需先 `add_categories` 或更新 dtype。合并两个类别集合不同的列可能退化为 `object`。低基数重复文本通常节省内存，高基数唯一值则未必。分组时关注 `observed` 是否包含未出现类别，模型训练中还要固定训练和推理的类别词表。
