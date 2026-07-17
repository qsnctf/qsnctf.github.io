# Pandas 数据导出

## 概念与用途

导出是把分析结果交给人、服务、数据库或后续计算引擎。应根据消费者选择格式：人工审阅常用 Excel/CSV，服务交换常用 JSON，分析管道优先 Parquet，数据库落地使用受控批量写入。

## 核心 API

`to_csv`、`to_excel`、`to_json`、`to_parquet`、`to_feather`、`to_sql`、`to_clipboard` 和 `to_dict`。

## 可运行示例

```python
from pathlib import Path
from tempfile import TemporaryDirectory
import pandas as pd

df = pd.DataFrame({"id": [1, 2], "amount": [10.5, None]})
with TemporaryDirectory() as folder:
    path = Path(folder) / "result.csv"
    df.to_csv(path, index=False, encoding="utf-8", na_rep="NULL")
    checked = pd.read_csv(path, na_values=["NULL"])
    print(checked)
```

## 示例二：JSON 与 schema 回读

```python
from io import StringIO
import pandas as pd

df = pd.DataFrame({"id": pd.Series([1, 2], dtype="Int64"), "day": pd.to_datetime(["2026-01-01", "2026-01-02"], utc=True)})
payload = df.to_json(orient="table", date_format="iso", index=False)
checked = pd.read_json(StringIO(payload), orient="table")
print(checked)
print(checked.dtypes)
```

`orient="table"` 携带 Pandas schema，适合受控往返；公共 API 是否采用它需与消费者约定。任何格式都应回读检查列顺序、空值、时区和精度。

## 依赖、原子性与安全

Excel 和 Parquet 分别需要相应写入引擎；数据库写出需要驱动和事务。大文件可压缩或分区，但 CSV/JSON 的流式写出不自动保证跨进程原子性。先写临时位置、校验行数和哈希，再原子替换或发布新版本；敏感数据导出还要执行字段级授权与脱敏。

## 注意事项

默认索引是否写出必须明确，否则常出现多余 `Unnamed: 0` 列。导出前固定列顺序、数值精度、日期格式、时区和空值表示；写入临时文件并原子替换可降低半成品风险。敏感字段需脱敏或删除，公式注入和 CSV 编码也要按目标软件处理，完成后做回读校验和校验和记录。
