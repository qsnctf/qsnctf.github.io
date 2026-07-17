# HTTP 消息结构

HTTP 消息由起始行、头部、空行和可选正文组成。

## 请求示例

```http
GET /index.html HTTP/1.1
Host: example.com
User-Agent: demo-client

```

## 响应示例

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 12

Hello World!
```

## 组成部分

| 部分 | 说明 |
| --- | --- |
| 请求行 | 方法、路径、版本 |
| 状态行 | 版本、状态码、原因短语 |
| 头部 | 键值形式的元数据 |
| 空行 | 分隔头部和正文 |
| 正文 | 提交或返回的数据 |

分析 HTTP 时要保留原始换行和编码，避免把正文误当头部。
