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

## 注意事项

Python 的 `and`/`or` 不能组合 Series，应使用 `&`/`|` 并给每个条件加括号。空值参与比较通常得到 false 或可空布尔值，要明确保留策略。不要把不可信文本拼入 `query`；动态值用 `@变量`，动态列名使用白名单。
