# Pandas JSON

## 概念与用途

JSON 适合 Web API 和半结构化数据。Pandas 支持多种 `orient`；嵌套对象通常先用 `json_normalize` 展平，逐行 JSON（JSON Lines）更适合流式处理。

## 核心 API

`pd.read_json`、`DataFrame.to_json`、`pd.json_normalize`；关键参数包括 `orient`、`lines`、`dtype`、`convert_dates`、`date_format` 和 `force_ascii`。

## 可运行示例

```python
import pandas as pd

records = [{"id": 1, "profile": {"city": "北京"}}, {"id": 2, "profile": {"city": "上海"}}]
df = pd.json_normalize(records, sep="_")
text = df.to_json(orient="records", force_ascii=False)
round_trip = pd.read_json(text, orient="records")
print(round_trip)
```

## 示例二：逐行 JSON 分块读取

```python
from io import StringIO
import pandas as pd

source = StringIO('{"id":1,"time":"2026-01-01T00:00:00Z"}\n{"id":2,"time":"2026-01-02T00:00:00Z"}\n')
chunks = pd.read_json(source, lines=True, chunksize=1, dtype={"id": "Int64"}, convert_dates=["time"])
for chunk in chunks:
    chunk["time"] = pd.to_datetime(chunk["time"], utc=True)
    print(chunk.dtypes)
```

分块迭代只适用于 `lines=True` 等支持模式。跨块 schema 可能漂移，生产流程应对每块强制相同列和 dtype，并汇总转换失败。

## orient、精度与安全

`orient="table"` 会携带 schema，适合 Pandas 往返，但其他消费者未必支持。`double_precision` 不能替代 decimal 精度要求；金额可先保存为字符串或使用支持 decimal 的列式格式。JSON 解析不是代码执行，但不可信超深嵌套或超大对象仍可造成资源耗尽，应限制大小和深度。

## 注意事项

读写两端必须约定相同 `orient`，否则结构无法正确还原。普通 JSON 浮点数可能损失高精度，时间戳单位也要明确。深层嵌套和不规则数组不适合直接 DataFrame 化；先验证 JSON schema。大文件优先 `lines=True` 配合 `chunksize`，避免一次解析完整文档。
