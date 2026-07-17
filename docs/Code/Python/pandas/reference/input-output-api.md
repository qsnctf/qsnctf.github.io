# Pandas Input/Output API

## 概念与用途

I/O API 负责从文本、二进制文件、数据库和网页创建 Pandas 对象，以及将对象写回外部系统。多数格式依赖独立解析引擎。

## 核心 API

| 格式 | 读取 | 写出 |
| --- | --- | --- |
| CSV/文本 | `read_csv`、`read_table`、`read_fwf` | `to_csv` |
| Excel | `read_excel`、`ExcelFile` | `to_excel`、`ExcelWriter` |
| JSON/HTML/XML | `read_json`、`read_html`、`read_xml` | `to_json`、`to_html`、`to_xml` |
| SQL | `read_sql`、`read_sql_query`、`read_sql_table` | `to_sql` |
| Arrow 列式 | `read_parquet`、`read_feather`、`read_orc` | `to_parquet`、`to_feather`、`to_orc` |
| Pandas/统计格式 | `read_pickle`、`read_hdf`、`read_stata`、`read_sas`、`read_spss` | `to_pickle`、`to_hdf`、`to_stata` |

## 可运行示例

```python
from io import StringIO
import pandas as pd

df = pd.read_csv(StringIO("id,value\n1,2.5\n2,3.0\n"), dtype={"id": "Int64"})
print(df.to_json(orient="table", index=False))
```

## 注意事项

可选引擎缺失会产生导入错误，应将其声明为项目依赖。不要反序列化不可信 pickle，它可执行任意代码。读取大数据时用 `usecols`、过滤下推或 `chunksize`；I/O 边界必须验证 schema、编码、日期、时区、精度和空值表示。
