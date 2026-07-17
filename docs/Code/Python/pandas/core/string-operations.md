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

## 示例二：拆分并保留索引

```python
import pandas as pd

s = pd.Series(["A-100", "B-205", None], index=[10, 20, 30], dtype="string")
parts = s.str.extract(r"^(?P<group>[A-Z])-(?P<number>\d+)$")
parts["number"] = pd.to_numeric(parts["number"], errors="coerce").astype("Int64")
print(parts)
assert parts.index.equals(s.index)
```

`str.extract(expand=True)` 返回 DataFrame 并保留原索引；没有匹配的行填充缺失值。命名捕获组直接成为列名。

## dtype、空值与性能

`StringDtype` 使用 `pd.NA`，`object` 列则可能混入非字符串对象。`str.split(expand=True)` 的列数由最大拆分数决定，宽度不受控时可能占用大量内存。固定字符串替换应使用 `regex=False`，复杂正则应预先编译或限制模式与输入长度。

## 注意事项

明确 `regex=True/False`，避免版本差异或特殊字符被当作正则。`str.contains` 遇到空值可用 `na=False` 控制掩码。复杂或用户提供的正则可能造成灾难性回溯；限制模式和输入长度。Unicode 大小写、空白和规范化有语言差异，身份匹配不能只靠 `lower()`。
