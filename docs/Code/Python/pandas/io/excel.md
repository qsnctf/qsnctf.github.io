# Pandas Excel

## 概念与用途

Excel 适合人工审阅、多工作表报表和业务交换。Pandas 通过引擎读取或写入工作簿；`.xlsx` 常用 `openpyxl`，大批量分析通常应转换为列式格式。

## 核心 API

`pd.read_excel`、`pd.ExcelFile`、`pd.ExcelWriter`、`DataFrame.to_excel`；常用参数有 `sheet_name`、`usecols`、`skiprows`、`dtype`、`parse_dates`、`index`。

## 可运行示例

```python
from pathlib import Path
from tempfile import TemporaryDirectory
import pandas as pd

with TemporaryDirectory() as folder:
    path = Path(folder) / "report.xlsx"
    source = pd.DataFrame({"name": ["Ada", "Lin"], "score": [92, 88]})
    source.to_excel(path, sheet_name="Scores", index=False)
    loaded = pd.read_excel(path, sheet_name="Scores")
    print(loaded)
```

## 注意事项

示例需要 `openpyxl`。合并单元格、公式、隐藏行和展示格式可能让读取结果与视觉内容不同；Pandas 读取的是缓存值而非计算公式。Excel 有行数限制且内存开销大，不适合海量数据。导出用户输入时同样要防公式注入，并用 `ExcelWriter` 一次管理多工作表。
