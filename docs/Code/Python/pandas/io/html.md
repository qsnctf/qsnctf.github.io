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

## 注意事项

显式传入 HTML 字符串时用 `StringIO`。网页布局变化、跨行表头和合并单元格会改变结果，读取后应规范列名并验证 schema。不要把 `read_html` 当成绕过访问控制的工具；遵守授权、服务条款和限速。动态网页需通过合规 API 或浏览器渲染后再解析。
