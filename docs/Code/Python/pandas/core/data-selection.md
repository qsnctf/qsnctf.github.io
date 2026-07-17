# Pandas 数据选取

## 概念与用途

数据选取按列名、行标签、整数位置或布尔条件提取数据。`loc` 按标签，`iloc` 按位置；明确二者可避免整数索引下的歧义。

## 核心 API

列选择 `df["col"]`、`df[[...]]`，标签选择 `loc`，位置选择 `iloc`，标量访问 `at`/`iat`，类型选择 `select_dtypes`，标签过滤 `filter`。

## 可运行示例

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Lin", "Mo"], "score": [91, 78, 88]}, index=[101, 102, 103])
print(df.loc[[101, 103], ["name", "score"]])
print(df.iloc[:2, 1])
df.loc[df["score"].lt(80), "score"] = 80
print(df)
```

## 示例二：布尔掩码按标签对齐

```python
import pandas as pd

df = pd.DataFrame({"value": [10, 20]}, index=["b", "a"])
mask = pd.Series({"a": True, "b": False})
print(df.loc[mask])
print(df.iloc[[1]])
```

`loc` 会把布尔 Series 按标签重排后筛选；`iloc` 接受位置列表或同长度布尔数组，不接受带标签布尔 Series。索引集合不一致时应先 `mask.reindex(df.index, fill_value=False)`。

## 返回与复制语义

标量访问 `at/iat` 返回单值，单列返回 Series，多列返回 DataFrame。切片可能共享底层数据，也可能复制；不要修改切片并期待原表同步。需要结果独立时 `.copy()`，修改原表时使用一次 `.loc` 赋值。

## 注意事项

标签切片的结束标签通常包含在内，位置切片则右端不包含。单列与列列表返回类型不同。赋值时使用一次 `df.loc[mask, column] = value`，不要链式索引。频繁标量访问速度慢，应批量选择和计算。
