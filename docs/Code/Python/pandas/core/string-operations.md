# Pandas 字符串操作

## 概念与用途

`str` 访问器对 Series 执行向量化字符串清洗、匹配、提取、拆分和替换。使用 Pandas `string` dtype 可获得统一的 `pd.NA` 缺失语义。

## 核心 API

`str.strip`、`lower`、`contains`、`match`、`extract`、`replace`、`split`、`get_dummies`、`len`。

## 可运行示例

```python
import pandas as pd

s = pd.Series(["  Alice <a@example.com> ", None], dtype="string")
clean = s.str.strip()
email = clean.str.extract(r"<([^>]+)>", expand=False)
name = clean.str.replace(r"\s*<.*>$", "", regex=True).str.lower()
print(pd.DataFrame({"name": name, "email": email}))
```

## 注意事项

明确 `regex=True/False`，避免版本差异或特殊字符被当作正则。`str.contains` 遇到空值可用 `na=False` 控制掩码。复杂或用户提供的正则可能造成灾难性回溯；限制模式和输入长度。Unicode 大小写、空白和规范化有语言差异，身份匹配不能只靠 `lower()`。
