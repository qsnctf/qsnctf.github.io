# Pandas 数据类型

## 概念与用途

dtype 决定值的表示、可用操作、空值语义、内存和序列化结果。除 NumPy 类型外，Pandas 提供可空整数 `Int64`、布尔 `boolean`、`string`、类别、日期时间和扩展数组类型。

## 核心 API

`dtypes`、`astype`、`convert_dtypes`、`pd.to_numeric`、`pd.to_datetime`、`pd.to_timedelta`、`select_dtypes` 和 `infer_objects`。

## 可运行示例

```python
import pandas as pd

raw = pd.DataFrame({"count": ["1", None, "3"], "active": [True, None, False], "day": ["2026-01-01"] * 3})
raw["count"] = pd.to_numeric(raw["count"]).astype("Int64")
raw["active"] = raw["active"].astype("boolean")
raw["day"] = pd.to_datetime(raw["day"])
print(raw.dtypes)
```

## 示例二：转换失败审计与降位

```python
import pandas as pd

raw = pd.Series(["1", "2", "bad", None], dtype="string")
parsed = pd.to_numeric(raw, errors="coerce", downcast="integer")
failed = raw[raw.notna() & parsed.isna()]
print(parsed, parsed.dtype)
print("failed:", failed.tolist())
```

`to_numeric` 返回 Series 或数组，`downcast` 只在可表示时尝试更小 dtype。含空值的结果可能仍为浮点，也可后续转换为可空整数 `Int64`。

## 类型与对齐边界

赋值给 DataFrame 列时，Series 会按索引对齐，不能只比较长度。连接键一侧为字符串、一侧为整数时应先规范。decimal、时区日期和 Arrow dtype 写出到不同格式时需做回读测试；`astype(copy=False)` 也不保证稳定共享内存。

## 注意事项

`object` 可能混合字符串、数字和任意 Python 对象，应尽早规范。普通 NumPy 整数不能表示 `NaN`，含空值时使用 `Int64`。`astype(int)` 遇到坏值会失败；需要容错时先 `to_numeric(errors="coerce")` 并审计失败数。格式交换前确认时区、小数精度和可空类型是否被目标系统保留。
