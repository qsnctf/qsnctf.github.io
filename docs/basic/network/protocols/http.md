# HTTP 协议

HTTP（HyperText Transfer Protocol）是 Web 的核心应用层协议，采用请求-响应模型。

## 基本结构

```text
请求行 / 状态行
Header: value
Header: value

消息体
```

HTTP 本身不要求加密。HTTPS 是在 TLS 保护下传输 HTTP。

## 常见方法

| 方法 | 含义 |
| --- | --- |
| GET | 获取资源 |
| POST | 提交数据 |
| PUT | 上传或替换资源 |
| DELETE | 删除资源 |
| HEAD | 只获取响应头 |
| OPTIONS | 查询支持的方法 |

## 安全关注

Web 安全分析常关注请求方法、Host、Cookie、Authorization、Content-Type、重定向、缓存头和响应状态码。更系统内容见 [HTTP 教程](../http/index.md)。
