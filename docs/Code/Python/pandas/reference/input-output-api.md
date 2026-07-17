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

## 示例二：分块文本读取

```python
from io import StringIO
import pandas as pd

source = StringIO("id,day,value\n1,2026-01-01,10\n2,2026-01-02,20\n")
reader = pd.read_csv(
    source,
    dtype={"id": "Int64", "value": "Float64"},
    parse_dates=["day"],
    chunksize=1,
)
for chunk in reader:
    print(chunk.dtypes)
```

传入 `chunksize` 返回 `TextFileReader`，每次迭代得到 DataFrame；这与默认直接返回 DataFrame 的签名分支不同。

## 关键参数与依赖

- 文本读取关注 `encoding`、`encoding_errors`、`sep`、`dtype`、`parse_dates`、`na_values`、`usecols`、`chunksize`。
- Excel 通常需要 `openpyxl`，旧格式和二进制工作簿可能需要其他引擎。
- Parquet/Feather 通常需要 `pyarrow`，Parquet 还可使用兼容引擎。
- SQL 通常需要 SQLAlchemy 和数据库驱动；`params` 应用于参数化查询。
- HTML/XML 常依赖 `lxml` 或其他解析器，远程内容还涉及编码和访问控制。

## 返回与 schema 语义

`read_html` 返回 DataFrame 列表，`read_excel(sheet_name=None)` 返回字典，分块读取返回迭代器，其余大多数 `read_*` 返回单个对象。CSV/JSON 不一定保存 dtype，Parquet 更适合类型保真，但时区、decimal 和扩展 dtype 仍需跨引擎回读测试。

## 注意事项

可选引擎缺失会产生导入错误，应将其声明为项目依赖。不要反序列化不可信 pickle，它可执行任意代码。读取大数据时用 `usecols`、过滤下推或 `chunksize`；I/O 边界必须验证 schema、编码、日期、时区、精度和空值表示。
