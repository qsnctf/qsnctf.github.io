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

## 注意事项

读写两端必须约定相同 `orient`，否则结构无法正确还原。普通 JSON 浮点数可能损失高精度，时间戳单位也要明确。深层嵌套和不规则数组不适合直接 DataFrame 化；先验证 JSON schema。大文件优先 `lines=True` 配合 `chunksize`，避免一次解析完整文档。
