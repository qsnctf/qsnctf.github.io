# Python Markdown

## 概念与用途

Python-Markdown 将 Markdown 文本转换为 HTML，并通过扩展支持表格、目录、代码块等语法。MkDocs 等文档工具使用这一生态，但 Markdown 本身不是安全的 HTML 清洗器。

## 核心 API

安装 `python -m pip install Markdown`。`markdown.markdown(text, extensions=...)` 返回 HTML；命令行可用 `python -m markdown input.md`。

```python
import markdown

source = """# 标题

| 名称 | 分数 |
| --- | ---: |
| Alice | 95 |
"""
html = markdown.markdown(source, extensions=["tables"])
print(html)
```

## 常见错误与安全注意

- 不可信 Markdown 转出的 HTML 仍可能包含危险标签或链接，展示前使用专业 HTML 清洗器。
- 扩展组合会改变语法行为，项目应固定扩展列表和版本。
- 相对链接和资源路径取决于最终发布位置，构建时应检查死链。
