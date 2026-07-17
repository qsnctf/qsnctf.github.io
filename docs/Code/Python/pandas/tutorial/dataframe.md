# Pandas DataFrame

## 概念与用途

`DataFrame` 是行列均有标签的二维表，每列可有独立数据类型。它是读取文件、关系连接、特征工程和统计报表的主要对象。

## 核心 API

- 构造与检查：`pd.DataFrame`、`shape`、`columns`、`dtypes`、`info`。
- 选择与赋值：`loc`、`iloc`、`assign`、列索引。
- 汇总：`describe`、`agg`、`groupby`。
- 结构操作：`rename`、`drop`、`set_index`、`reset_index`。

## 可运行示例

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Lin"], "score": [88, 95]})
result = (
    df.assign(passed=df["score"].ge(90))
      .rename(columns={"score": "final_score"})
)
print(result.loc[:, ["name", "final_score", "passed"]])
```

## 示例二：Series 输入按索引对齐

```python
import pandas as pd

scores = pd.Series({"u2": 80, "u1": 95})
teams = pd.Series({"u1": "A", "u2": "B"})
df = pd.DataFrame({"score": scores, "team": teams})
df["rank"] = df.groupby("team")["score"].rank(ascending=False)
print(df)
```

构造器把两个 Series 按标签对齐，而不是按原顺序拼接。字典中的普通等长列表则按位置构造；混用输入形式前应先明确期望索引。

## 参数、返回与复制

`assign`、`rename`、`drop` 默认返回新 DataFrame，`inplace=True` 返回 `None` 且不保证节省内存。布尔 Series 掩码会按索引对齐。Copy-on-Write 行为与版本和配置有关，代码不应依赖切片必然是视图或副本。

## 注意事项

`df["col"]` 返回 Series，`df[["col"]]` 返回 DataFrame。链式赋值可能修改临时对象，应使用一次 `loc` 赋值或 `assign`。频繁逐列插入会造成内存碎片；批量构造列或一次 `concat` 更稳妥。业务表应明确主键而不是依赖默认 `RangeIndex`。
