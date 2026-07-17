# Pandas 数据清洗

## 概念与用途

数据清洗把原始字段转换成可验证、类型稳定、含义一致的数据集。典型步骤包括统一列名、解析类型、处理空值和重复值、约束范围及记录异常。

## 核心 API

`rename`、`astype`、`pd.to_numeric`、`pd.to_datetime`、`isna`、`fillna`、`dropna`、`duplicated`、`drop_duplicates`、`clip` 和字符串 `str` 访问器。

## 可运行示例

```python
import pandas as pd

raw = pd.DataFrame({" User ": [" Alice ", "Alice", "Bob"], "age": ["20", "20", "unknown"]})
clean = raw.rename(columns=lambda c: c.strip().lower())
clean["user"] = clean["user"].str.strip()
clean["age"] = pd.to_numeric(clean["age"], errors="coerce").astype("Int64")
clean = clean.drop_duplicates(subset=["user"], keep="last")
print(clean)
```

## 示例二：保留异常记录

```python
import pandas as pd

raw = pd.DataFrame({"id": [1, 2, 3], "amount": ["12.5", "bad", "-4"]})
parsed = pd.to_numeric(raw["amount"], errors="coerce")
invalid_mask = parsed.isna() | parsed.lt(0)
invalid = raw.loc[invalid_mask].copy()
valid = raw.loc[~invalid_mask].assign(amount=parsed)
print("valid:\n", valid)
print("quarantine:\n", invalid)
```

这里没有静默删除坏值，而是形成隔离表。`assign(amount=parsed)` 会按原索引对齐；若此前只重置了一侧索引，可能把数值写到错误行。

## 工程边界

清洗不等于猜测业务事实。重复键保留哪条、缺失值如何填充、负数是否合法，都应来自数据契约。每批记录输入行数、输出行数、异常数和规则版本，必要时保留原始列以支持追溯。

## 注意事项

不要用 `errors="coerce"` 后静默丢弃坏值；应统计转换前后新增的空值并输出质量报告。填充策略必须有业务依据，均值填充可能扭曲分布。清洗流程应保持幂等，保存原始数据，并对行数、唯一键、类型和合法范围编写断言或数据契约。
