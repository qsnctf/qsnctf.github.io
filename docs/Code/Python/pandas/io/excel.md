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

## 示例二：一次读取多个工作表

```python
from pathlib import Path
from tempfile import TemporaryDirectory
import pandas as pd

with TemporaryDirectory() as folder:
    path = Path(folder) / "book.xlsx"
    with pd.ExcelWriter(path, engine="openpyxl") as writer:
        pd.DataFrame({"id": [1], "day": ["2026-01-01"]}).to_excel(writer, "Orders", index=False)
        pd.DataFrame({"id": [1], "name": ["Ada"]}).to_excel(writer, "Users", index=False)
    sheets = pd.read_excel(path, sheet_name=None, dtype={"id": "Int64"})
    sheets["Orders"]["day"] = pd.to_datetime(sheets["Orders"]["day"])
    print(sheets.keys())
```

`sheet_name=None` 返回以工作表名为键的字典，不是单个 DataFrame。日期列若包含混合 Excel 日期和文本，显式读取后转换更便于审计失败值。

## 可选依赖与工程边界

`.xlsx` 常用 `openpyxl`，`.xls` 可能需要 `xlrd`，`.xlsb` 需要相应二进制工作簿引擎；引擎能力和支持格式不同。读取多个工作表可复用 `ExcelFile` 减少重复打开文件，但整个工作簿仍可能消耗较多内存。

## 注意事项

示例需要 `openpyxl`。合并单元格、公式、隐藏行和展示格式可能让读取结果与视觉内容不同；Pandas 读取的是缓存值而非计算公式。Excel 有行数限制且内存开销大，不适合海量数据。导出用户输入时同样要防公式注入，并用 `ExcelWriter` 一次管理多工作表。
