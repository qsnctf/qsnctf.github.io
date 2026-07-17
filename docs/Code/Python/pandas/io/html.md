# Pandas 读取 HTML

## 概念与用途

`read_html` 从 HTML 的 `<table>` 元素提取表格，返回 DataFrame 列表。它适合结构稳定的公开表格，不是通用网页爬虫或 JavaScript 渲染器。

## 核心 API

`pd.read_html`；常用参数有 `match`、`attrs`、`header`、`index_col`、`displayed_only`、`decimal` 和 `thousands`。解析通常需要 `lxml`、BeautifulSoup 或 html5lib。

## 可运行示例

```python
from io import StringIO
import pandas as pd

html = """<table id="scores"><tr><th>Name</th><th>Score</th></tr>
<tr><td>Ada</td><td>95</td></tr></table>"""
tables = pd.read_html(StringIO(html), attrs={"id": "scores"})
print(tables[0])
```

## 示例二：匹配目标表并解析数值

```python
from io import StringIO
import pandas as pd

html = """<table><caption>Revenue</caption><tr><th>Year</th><th>Amount</th></tr>
<tr><td>2026</td><td>1,234.5</td></tr></table>"""
table = pd.read_html(StringIO(html), match="Revenue", thousands=",", decimal=".")[0]
table = table.astype({"Year": "Int64", "Amount": "Float64"})
print(table.dtypes)
```

`read_html` 始终返回列表，即使只匹配一个表。`match` 和 `attrs` 能缩小目标范围，但仍应检查列表长度、列名和 dtype。

## 依赖、编码与安全边界

解析通常需要 `lxml`，也可使用 BeautifulSoup/html5lib 组合；不同解析器对破损 HTML 的容错可能不同。远程页面的 HTTP 编码声明可能错误，可靠流程应保存原始响应并明确解码。HTML 表格内容是不可信输入，后续导出 Excel 时仍需处理公式注入。

## 注意事项

显式传入 HTML 字符串时用 `StringIO`。网页布局变化、跨行表头和合并单元格会改变结果，读取后应规范列名并验证 schema。不要把 `read_html` 当成绕过访问控制的工具；遵守授权、服务条款和限速。动态网页需通过合规 API 或浏览器渲染后再解析。
