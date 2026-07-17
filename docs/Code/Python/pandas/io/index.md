# 数据读写

## 概念与用途

Pandas I/O 把外部文件、数据库或网页表格转换为 DataFrame，再按下游系统要求导出。格式选择要同时考虑类型保真、体积、速度、并发、跨语言兼容和人工可读性。

## 核心 API

- 文本：`read_csv`、`read_json`、`to_csv`、`to_json`。
- 表格与网页：`read_excel`、`read_html`、`to_excel`。
- 数据库：`read_sql`、`read_sql_query`、`to_sql`。
- 列式格式：`read_parquet`、`read_feather`、`to_parquet`、`to_feather`。

## 可运行示例

```python
from io import StringIO
import pandas as pd

source = StringIO("id,amount\n1,12.5\n2,18.0\n")
df = pd.read_csv(source, dtype={"id": "Int64"})
print(df.to_json(orient="records"))
```

## 页面导航

- [Pandas 数据读写](data-io.md)：统一流程和格式选择。
- [Pandas CSV](csv.md)、[Pandas Excel](excel.md)、[Pandas JSON](json.md)。
- [Pandas 读取 SQL](sql.md)、[Pandas 读取 HTML](html.md)。
- [Pandas Parquet / Feather](parquet-feather.md)、[Pandas 数据导出](data-export.md)。

## 注意事项

不要完全依赖类型推断；关键列应声明 dtype、日期、空值和编码。读取后校验 schema、行数和主键，写出后检查目标是否保留索引、时区和精度。对大文件使用列裁剪、行过滤或分块，不要一次性载入超出内存的数据。
