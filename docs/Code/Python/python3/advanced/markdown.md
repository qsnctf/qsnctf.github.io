# Python Markdown

## 概念与用途

Python-Markdown 将 Markdown 文本转换为 HTML，并通过扩展支持表格、目录、代码块等语法。MkDocs 等文档工具使用这一生态，但 Markdown 本身不是安全的 HTML 清洗器。

## 核心 API

本教程建议安装 `python -m pip install "Markdown>=3.5"`。它只需要本地 Python 环境，不依赖外部服务；`markdown.markdown(text, extensions=...)` 返回 HTML。

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

## 核心配置

| 参数 | 用途 | 注意 |
| --- | --- | --- |
| `extensions` | 启用表格、目录等 | 固定列表与版本 |
| `extension_configs` | 扩展参数 | 配置属于构建契约 |
| `output_format` | HTML/XHTML 风格 | 与下游模板一致 |
| `Markdown.reset()` | 复用实例前重置 | 防跨文档状态残留 |

## 示例：复用转换器

```python
import markdown

converter = markdown.Markdown(extensions=["fenced_code"])
for source in ("# First", "```python\nprint('ok')\n```"):
    print(converter.convert(source))
    converter.reset()
```

转换过程无网络超时问题，但输入大小和扩展执行时间仍需限制。若扩展会读取文件或执行外部程序，应把它视为代码依赖并审查其权限与资源清理。

## 常见错误与安全注意

- 不可信 Markdown 转出的 HTML 仍可能包含危险标签或链接，展示前使用专业 HTML 清洗器。
- 扩展组合会改变语法行为，项目应固定扩展列表和版本。
- 相对链接和资源路径取决于最终发布位置，构建时应检查死链。
