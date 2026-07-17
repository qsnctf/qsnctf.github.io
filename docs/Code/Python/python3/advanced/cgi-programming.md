# Python3 CGI编程

## 概念与用途

CGI 让 Web 服务器为每个请求启动程序，并通过环境变量、标准输入输出交换 HTTP 数据。它有助于理解 HTTP 响应，但进程开销大，现代项目应采用 WSGI/ASGI 框架。标准库 `cgi` 在 Python 3.10 仍可用、3.11 起依照 PEP 594 弃用、3.12 是最后包含它的版本，并在 Python 3.13 移除；本页示例刻意不依赖该模块。

## 核心协议

程序必须先输出响应头、空行，再输出正文。请求方法、查询串和内容长度来自 `REQUEST_METHOD`、`QUERY_STRING`、`CONTENT_LENGTH` 等环境变量。

| 输入/输出 | 来源 | 处理要求 |
| --- | --- | --- |
| 查询参数 | `QUERY_STRING` | URL 解码、长度和字段白名单 |
| 请求正文 | 标准输入 | 按 `CONTENT_LENGTH` 限量读取 |
| 响应头 | 标准输出首部 | 每行合法，之后输出空行 |
| 响应正文 | 标准输出 | 与声明的 Content-Type 一致 |

```python
#!/usr/bin/env python3
import html
import os
from urllib.parse import parse_qs

params = parse_qs(os.environ.get("QUERY_STRING", ""))
name = html.escape(params.get("name", ["访客"])[0])
print("Content-Type: text/html; charset=utf-8")
print()
print(f"<h1>Hello, {name}</h1>")
```

## 示例：生成 JSON 响应

下面示例可直接运行，它展示 CGI 响应格式而不要求 Web 服务器。部署时服务器负责设置环境变量并执行脚本。

```python
#!/usr/bin/env python3
import json
import os

payload = {
    "method": os.environ.get("REQUEST_METHOD", "GET"),
    "status": "ok",
}
body = json.dumps(payload, ensure_ascii=False)
print("Status: 200 OK")
print("Content-Type: application/json; charset=utf-8")
print(f"Content-Length: {len(body.encode('utf-8'))}")
print()
print(body)
```

CGI 脚本还依赖服务器执行权限、shebang、工作目录和超时配置。上传文件与 multipart 解析不应自行草率实现；遗留系统若仍依赖已移除的 `cgi`，应固定受支持运行环境或迁移到维护中的框架/第三方替代，而不是复制旧模块代码。

## 常见错误与安全注意

- 输出 HTML 前必须转义用户输入，并对参数长度、类型和数量设限。
- 不要把异常堆栈、环境变量或服务器路径返回客户端。
- CGI 是遗留部署方式；新系统优先 Flask、Django、FastAPI 等受维护方案。
- 请求体读取必须设置上限，脚本执行应使用低权限账户并由服务器限制运行时间。
