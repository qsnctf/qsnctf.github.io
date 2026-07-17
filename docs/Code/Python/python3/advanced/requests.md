# Python requests

## 概念与用途

Requests 是常用同步 HTTP 客户端，提供会话、认证、Cookie、JSON 和流式下载。安装命令为 `python -m pip install requests`。

本教程建议 `requests>=2.31`，并以 Python 3.10+ 为基线。运行真实示例需要可访问的 HTTPS 站点和有效系统 CA；生产依赖应锁定团队测试过的具体版本。

## 核心 API

`requests.get/post()` 发请求，`Session` 复用连接和公共头，`raise_for_status()` 检查 HTTP 错误。超时最好写成 `(连接超时, 读取超时)`。

```python
import requests

with requests.Session() as session:
    response = session.get("https://example.com", timeout=(3.05, 10))
    response.raise_for_status()
    print(response.status_code, response.headers.get("content-type"))
```

## 核心参数

| 参数/API | 用途 | 工程要求 |
| --- | --- | --- |
| `timeout=(c,r)` | 连接/读取超时 | 每次请求必设 |
| `Session` | 连接池和公共配置 | 用 `with`/`close()` |
| `stream=True` | 分块下载 | 关闭响应并限制总大小 |
| `raise_for_status()` | 4xx/5xx 转异常 | 仍需业务状态检查 |

## 示例：构造请求而不发送

```python
import requests

request = requests.Request("GET", "https://example.com/search", params={"q": "python"})
prepared = request.prepare()
print(prepared.method, prepared.url)
print("请求体:", prepared.body)
```

重试只适合明确可重放的幂等操作，并应限制次数、退避和总截止时间。服务端请求用户提供 URL 时还需防 SSRF、重定向到内网和超大响应。

## 常见错误与安全注意

- Requests 默认没有超时，所有生产请求都应显式设置。
- 不要使用 `verify=False` 绕过证书校验，应配置正确 CA。
- 下载大文件使用 `stream=True`、限制总大小，并避免把令牌记录到 URL 和日志。
