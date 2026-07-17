# Python3 urllib

## 概念与用途

`urllib` 是标准库 URL 与 HTTP 工具集合，包括 `request`、`parse`、`error` 和 `robotparser`。它无需第三方依赖，适合简单请求和 URL 编解码。

## 核心 API

`urlencode()` 构造查询串，`urlparse()` 拆分 URL，`urlopen()` 发起请求。请求必须设置超时，并通过上下文管理器关闭响应。

```python
from urllib.parse import urlencode, urlparse, parse_qs

query = urlencode({"q": "Python 教程", "page": 1})
url = f"https://example.com/search?{query}"
parsed = urlparse(url)
print(parsed.scheme, parsed.netloc, parse_qs(parsed.query))
```

## 常见错误与安全注意

- 服务器端请求用户 URL 时要防 SSRF，限制协议、目标主机和重定向。
- `HTTPError` 既是异常也是响应对象，应按状态码读取有限错误体。
- URL 编码不等于 HTML 或 SQL 转义，必须在对应上下文使用正确机制。
