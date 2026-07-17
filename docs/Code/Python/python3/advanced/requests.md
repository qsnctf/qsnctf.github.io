# Python requests

## 概念与用途

Requests 是常用同步 HTTP 客户端，提供会话、认证、Cookie、JSON 和流式下载。安装命令为 `python -m pip install requests`。

## 核心 API

`requests.get/post()` 发请求，`Session` 复用连接和公共头，`raise_for_status()` 检查 HTTP 错误。超时最好写成 `(连接超时, 读取超时)`。

```python
import requests

with requests.Session() as session:
    response = session.get("https://example.com", timeout=(3.05, 10))
    response.raise_for_status()
    print(response.status_code, response.headers.get("content-type"))
```

## 常见错误与安全注意

- Requests 默认没有超时，所有生产请求都应显式设置。
- 不要使用 `verify=False` 绕过证书校验，应配置正确 CA。
- 下载大文件使用 `stream=True`、限制总大小，并避免把令牌记录到 URL 和日志。
