# Pandas 数据读写

## 概念与用途

可靠的数据读写不是一次 `read_*` 调用，而是“读取、规范类型、验证、处理、导出、复核”的边界流程。输入输出契约应明确列名、类型、空值、主键、时区和字符编码。

## 核心 API

`read_csv`、`read_excel`、`read_json`、`read_sql`、`read_parquet`，对应的 `to_*` 方法，以及 `dtype`、`usecols`、`parse_dates`、`nrows`、`chunksize` 等参数。

## 可运行示例

```python
from io import StringIO
import pandas as pd

text = StringIO("order_id,created_at,total\n1,2026-01-02,19.5\n")
orders = pd.read_csv(text, dtype={"order_id": "Int64"}, parse_dates=["created_at"])
assert orders["order_id"].is_unique
assert orders["total"].ge(0).all()
print(orders.dtypes)
```

## 示例二：读取后统一 schema

```python
from io import StringIO
import pandas as pd

source = StringIO("id,active,created\n1,true,2026-01-01T08:00:00+08:00\n2,,bad\n")
df = pd.read_csv(source, dtype={"id": "Int64", "active": "boolean"})
df["created"] = pd.to_datetime(df["created"], errors="coerce", utc=True)
bad_dates = df.loc[df["created"].isna(), "id"]
print(df.dtypes)
print("bad date ids:", bad_dates.tolist())
```

先以可控 dtype 读取，再对日期做显式转换，便于统计失败项。将转换后的 Series 赋回原表时按索引对齐。

## 引擎、分块与安全边界

Excel、Parquet、数据库和 HTML 分别可能依赖 `openpyxl`、`pyarrow`、SQLAlchemy/驱动、`lxml` 等可选包。`chunksize` 返回迭代器，跨块唯一性和排序需全局状态。编码应由数据契约声明；凭据通过环境或密钥管理提供，禁止把不可信 pickle 当作普通数据格式读取。

## 注意事项

采样推断可能让同一列在不同批次得到不同 dtype。文件路径、URL 和云存储凭据应来自配置并最小授权；不要读取不可信 pickle。大数据优先 Parquet 并下推列选择，流式文本可用 `chunksize`，但跨块去重和聚合需要保存全局状态。
