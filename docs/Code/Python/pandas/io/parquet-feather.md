# Pandas Parquet / Feather

## 概念与用途

Parquet 和 Feather 都是高效列式二进制格式。Parquet 支持压缩、分区和分析引擎生态，适合数据湖与长期交换；Feather 基于 Arrow IPC，适合快速的本地中间数据交换。

## 核心 API

`pd.read_parquet`、`DataFrame.to_parquet`、`pd.read_feather`、`DataFrame.to_feather`；常用参数包括 `columns`、`filters`、`engine`、`compression`、`partition_cols` 和 `dtype_backend`。

## 可运行示例

```python
from pathlib import Path
from tempfile import TemporaryDirectory
import pandas as pd

with TemporaryDirectory() as folder:
    path = Path(folder) / "sales.parquet"
    df = pd.DataFrame({"city": ["A", "B"], "amount": [12, 18]})
    df.to_parquet(path, index=False, compression="snappy")
    print(pd.read_parquet(path, columns=["amount"]))
```

## 注意事项

示例需要 `pyarrow` 或兼容引擎。消费者之间应统一引擎和 schema，特别是时区、decimal、分类和嵌套类型。分区列基数不能过高，否则产生大量小文件。Parquet 支持列裁剪和过滤下推，应在读取时指定 `columns`/`filters`，而不是载入后才筛选。
