# Pandas CSV

## 概念与用途

CSV 是通用纯文本交换格式，但标准较松散，分隔符、引号、编码、换行和空值规则必须与数据提供方约定。CSV 不保存 dtype、索引语义或时区元数据。

## 核心 API

`pd.read_csv` 的 `sep`、`encoding`、`dtype`、`usecols`、`parse_dates`、`na_values`、`chunksize`；`DataFrame.to_csv` 的 `index`、`columns`、`date_format`、`float_format`。

## 可运行示例

```python
from io import StringIO
import pandas as pd

csv_data = StringIO('id,name,score\n1,"Li, Ming",90\n2,Ada,NA\n')
df = pd.read_csv(csv_data, dtype={"id": "Int64"}, na_values=["NA"])
output = df.to_csv(index=False, na_rep="NA")
print(output)
```

## 注意事项

中文乱码先确认实际编码，不要盲目尝试；Excel 场景可能需要 `utf-8-sig`。用户可控单元格以 `=`, `+`, `-`, `@` 开头时，导出给电子表格软件可能触发公式注入，应按使用场景转义。超大 CSV 使用 `usecols`、明确 dtype 和分块读取，并检测坏行而非静默跳过。
