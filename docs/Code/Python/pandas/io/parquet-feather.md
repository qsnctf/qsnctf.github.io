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

## 示例二：过滤下推与 Arrow dtype

```python
from pathlib import Path
from tempfile import TemporaryDirectory
import pandas as pd

with TemporaryDirectory() as folder:
    path = Path(folder) / "events.parquet"
    df = pd.DataFrame({"year": [2025, 2026, 2026], "value": [1, 2, 3]})
    df.to_parquet(path, engine="pyarrow", index=False)
    selected = pd.read_parquet(
        path, engine="pyarrow", columns=["value"], filters=[[('year', '==', 2026)]]
    )
    print(selected)
```

`columns` 和 `filters` 可减少读取数据，但是否真正下推取决于引擎、文件统计信息与数据集布局。`dtype_backend="pyarrow"` 可保留 Arrow-backed dtype，第三方库兼容性需测试。

## 依赖、schema 与分区

Parquet 通常使用 `pyarrow` 或 `fastparquet`，Feather 通常依赖 `pyarrow`；引擎间嵌套类型支持可能不同。分区目录名是 schema 的一部分，修改分区类型会导致读取漂移。写入数据集时控制小文件数量，并用临时路径完成后再发布清单或原子切换。

## 注意事项

示例需要 `pyarrow` 或兼容引擎。消费者之间应统一引擎和 schema，特别是时区、decimal、分类和嵌套类型。分区列基数不能过高，否则产生大量小文件。Parquet 支持列裁剪和过滤下推，应在读取时指定 `columns`/`filters`，而不是载入后才筛选。
