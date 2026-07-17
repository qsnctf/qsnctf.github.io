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

## 示例二：日期、编码与分块聚合

```python
from io import StringIO
import pandas as pd

text = StringIO("day,city,amount\n2026-01-01,A,10\n2026-01-02,A,12\n2026-01-02,B,8\n")
totals = []
for chunk in pd.read_csv(
    text,
    parse_dates=["day"],
    dtype={"city": "string", "amount": "Int64"},
    chunksize=2,
):
    totals.append(chunk.groupby("city")["amount"].sum())
result = pd.concat(totals, axis=1).fillna(0).sum(axis=1)
print(result)
```

`TextFileReader` 逐块返回 DataFrame。跨块去重、排序和中位数不能只处理各块后直接相加，需要维护全局状态或改用数据库/列式引擎。

## 参数与依赖

`engine` 可选择 C、Python 或 pyarrow 解析器，支持参数并不完全一致；pyarrow 引擎需要相应可选依赖。`encoding_errors` 控制解码错误，但生产流程不应以忽略坏字节代替定位源编码。`on_bad_lines` 应记录坏行，不能默认丢弃。

## 注意事项

中文乱码先确认实际编码，不要盲目尝试；Excel 场景可能需要 `utf-8-sig`。用户可控单元格以 `=`, `+`, `-`, `@` 开头时，导出给电子表格软件可能触发公式注入，应按使用场景转义。超大 CSV 使用 `usecols`、明确 dtype 和分块读取，并检测坏行而非静默跳过。
