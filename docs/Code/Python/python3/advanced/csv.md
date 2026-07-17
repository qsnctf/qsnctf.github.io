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

## 核心选项

| 选项 | 用途 | 注意 |
| --- | --- | --- |
| `delimiter` | 指定分隔符 | CSV 不一定使用逗号 |
| `quotechar` | 包裹特殊字段 | 不要手工拼接引号 |
| `newline=""` | 交给 csv 管理换行 | 打开文件时设置 |
| `extrasaction` | 处理额外字典键 | 可设为 `ignore` 或报错 |

## 示例：校验字段与数字

```python
import csv
from io import StringIO

source = StringIO("name,score\nAlice,95\nBob,not-a-number\n")
for row_number, row in enumerate(csv.DictReader(source), start=2):
    try:
        score = int(row["score"])
    except (KeyError, ValueError):
        print(f"第 {row_number} 行无效")
    else:
        print(row["name"], score)
```

`csv` 属于标准库，无需安装第三方包。文件仍需限制大小和字段长度；可通过 `csv.field_size_limit()` 调整上限，但提高前应评估内存风险。

## 常见错误与安全注意

- Excel 打开以 `= + - @` 开头的单元格可能执行公式，导出不可信文本时需防 CSV 注入。
- CSV 没有类型信息，读取后需按 schema 校验和转换。
- 超大文件应逐行处理，不要一次性转成列表。
