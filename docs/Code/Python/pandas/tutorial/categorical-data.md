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

## 注意事项

赋入未注册类别会得到空值，需先 `add_categories` 或更新 dtype。合并两个类别集合不同的列可能退化为 `object`。低基数重复文本通常节省内存，高基数唯一值则未必。分组时关注 `observed` 是否包含未出现类别，模型训练中还要固定训练和推理的类别词表。
