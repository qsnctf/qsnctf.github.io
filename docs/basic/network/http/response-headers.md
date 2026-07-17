# HTTP 响应头信息

响应头描述响应正文、缓存策略、安全策略和连接行为。

## 常见响应头

| 头部 | 作用 |
| --- | --- |
| `Content-Type` | 正文媒体类型和编码 |
| `Content-Length` | 正文长度 |
| `Set-Cookie` | 设置 Cookie |
| `Location` | 重定向目标 |
| `Cache-Control` | 缓存策略 |
| `Server` | 服务端软件信息 |
| `Content-Security-Policy` | 内容安全策略 |
| `Strict-Transport-Security` | 强制 HTTPS |

## 安全关注

响应头配置错误可能导致缓存敏感数据、Cookie 被窃取、XSS 防护缺失或降级到 HTTP。分析时应结合请求路径和响应正文判断。
