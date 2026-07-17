# Python csv 模块

## 概念与用途

CSV 是表格交换格式，但分隔符、引号和换行存在方言差异。标准库 `csv` 能正确处理这些细节，优于手工 `split(',')`。

## 核心 API

`csv.reader/writer` 处理行列表，`DictReader/DictWriter` 处理字段名映射。打开文件时指定 `newline=""`，文本编码通常显式使用 UTF-8。

```python
import csv
from io import StringIO

buffer = StringIO(newline="")
writer = csv.DictWriter(buffer, fieldnames=["name", "note"])
writer.writeheader()
writer.writerow({"name": "Alice", "note": "包含,逗号"})
buffer.seek(0)
print(list(csv.DictReader(buffer)))
```

## 常见错误与安全注意

- Excel 打开以 `= + - @` 开头的单元格可能执行公式，导出不可信文本时需防 CSV 注入。
- CSV 没有类型信息，读取后需按 schema 校验和转换。
- 超大文件应逐行处理，不要一次性转成列表。
