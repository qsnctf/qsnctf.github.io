# Pandas 过滤与条件查询

## 概念与用途

过滤用布尔掩码保留满足条件的行。多个条件可组合，`query` 则提供更接近表达式的可读语法，适合列名规则简单的筛选。

## 核心 API

比较方法 `eq`、`gt`、`between`、`isin`，逻辑运算 `&`、`|`、`~`，以及 `query`、`where`、`mask`。

## 可运行示例

```python
import pandas as pd

df = pd.DataFrame({"city": ["A", "B", "A"], "amount": [50, 120, 180]})
selected = df[(df["city"].eq("A")) & (df["amount"].between(100, 200))]
minimum = 100
same = df.query("city == 'A' and amount >= @minimum")
print(selected)
print(same)
```

## 示例二：where 与 mask 保持原形状

```python
import pandas as pd

s = pd.Series([5, None, 15], index=["a", "b", "c"], dtype="Float64")
kept_shape = s.where(s.ge(10), other=0)
replaced_high = s.mask(s.ge(10), other=99)
print(kept_shape)
print(replaced_high)
```

布尔筛选会减少行数，`where`/`mask` 保持原索引和形状并替换不满足/满足条件的位置。条件 Series 会按标签对齐，错位索引可能产生意外替换。

## 空值、返回与性能

可空布尔条件中的 `pd.NA` 需要明确处理，例如 `.fillna(False)`。`query` 返回新 DataFrame，不应依赖其为视图。简单筛选直接布尔表达式通常足够；仅在大表复杂数值表达式上评估 `query/numexpr` 的性能收益。

## 注意事项

Python 的 `and`/`or` 不能组合 Series，应使用 `&`/`|` 并给每个条件加括号。空值参与比较通常得到 false 或可空布尔值，要明确保留策略。不要把不可信文本拼入 `query`；动态值用 `@变量`，动态列名使用白名单。
