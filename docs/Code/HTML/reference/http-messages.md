# HTTP 消息参考

HTTP 消息承载请求或响应。消息结构、状态码和方法语义是三个不同概念：
方法描述请求意图，状态码描述响应结果，消息头和消息体承载元数据与表示。

## 消息结构

| 部分 | 请求 | 响应 |
| --- | --- | --- |
| 起始行 | 方法、请求目标、HTTP 版本 | HTTP 版本、状态码、原因短语 |
| 头字段 | 主机、内容协商、认证、缓存条件等 | 内容类型、缓存策略、认证挑战等 |
| 空行 | 分隔头字段与消息体 | 分隔头字段与消息体 |
| 消息体 | 可选的提交内容 | 可选的资源表示或错误说明 |

HTTP/1.1 文本示意：

```http
GET /articles/42 HTTP/1.1
Host: example.com
Accept: text/html

```

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: max-age=300
Content-Length: 15

<h1>示例</h1>
```

HTTP/2 和 HTTP/3 在线路上不使用上述文本起始行，但方法、状态与字段语义基本延续。
原因短语不是机器判断依据，在 HTTP/2 和 HTTP/3 中也不再使用。

## 常见请求头

| 字段 | 作用 | 注意事项 |
| --- | --- | --- |
| `Host` | 指定目标主机和可选端口 | HTTP/1.1 请求必需，代理需防 Host 混淆 |
| `Accept` | 客户端可接受的媒体类型 | 服务端可据此内容协商 |
| `Accept-Language` | 自然语言偏好 | 偏好提示，不是身份或地区证明 |
| `Authorization` | 提交认证凭据 | 只经 HTTPS，限制日志和转发 |
| `Content-Type` | 请求体的媒体类型 | 必须与实际序列化格式一致 |
| `Content-Length` | 消息体字节长度 | 由客户端库或服务器正确生成 |
| `Cookie` | 向源发送 Cookie | 状态修改需考虑 CSRF |
| `If-None-Match` | 携带缓存实体标签 | 未变化时可返回 `304` |
| `Origin` | 请求来源 | 可用于 CORS 和部分 CSRF 检查 |
| `Referer` | 来源页面 URL | 可能受 Referrer-Policy 限制 |

## 常见响应头

| 字段 | 作用 | 注意事项 |
| --- | --- | --- |
| `Content-Type` | 响应表示的媒体类型和可选字符集 | HTML 推荐 `text/html; charset=utf-8` |
| `Content-Length` | 响应体字节长度 | 与字符数不同 |
| `Cache-Control` | 缓存许可、期限与重验证要求 | 敏感响应常需 `no-store` |
| `ETag` | 表示版本标识 | 配合条件请求和 `304` |
| `Location` | 重定向目标或新资源位置 | 常见于 `201`、`3xx` |
| `Set-Cookie` | 设置 Cookie | 考虑 `Secure`、`HttpOnly`、`SameSite` |
| `WWW-Authenticate` | 发起认证挑战 | 常与 `401` 同用 |
| `Vary` | 指明影响响应选择的请求头 | 影响共享缓存键 |
| `Content-Security-Policy` | 限制页面资源和脚本执行 | 属于纵深防护，不替代输出编码 |

## 状态码分类

| 范围 | 类别 | 含义 |
| --- | --- | --- |
| `1xx` | 信息 | 请求处理中或协议切换 |
| `2xx` | 成功 | 请求已成功接收、理解或处理 |
| `3xx` | 重定向 | 需跳转或使用缓存表示 |
| `4xx` | 客户端错误 | 请求无效、未认证、无权限或资源不存在 |
| `5xx` | 服务器错误 | 服务器处理有效请求时失败 |

## 常用状态码

| 状态码 | 名称 | 典型语义 |
| ---: | --- | --- |
| `200` | OK | 请求成功并返回表示 |
| `201` | Created | 创建成功，常通过 `Location` 指向新资源 |
| `204` | No Content | 成功但无响应体 |
| `206` | Partial Content | 返回范围请求的部分内容 |
| `301` / `308` | Permanent Redirect | 永久重定向；`308` 明确保留原方法和请求体 |
| `302` | Found | 临时重定向；历史客户端可能把 POST 改为 GET |
| `303` | See Other | 使用 GET 获取 `Location` 指向的另一资源 |
| `307` | Temporary Redirect | 临时重定向并保留原方法和请求体 |
| `304` | Not Modified | 缓存表示仍有效，不包含普通响应体 |
| `400` | Bad Request | 语法、格式或参数无效 |
| `401` | Unauthorized | 实际表示“未认证或认证失败”，通常带挑战 |
| `403` | Forbidden | 身份可能已知，但没有执行该操作的授权 |
| `404` | Not Found | 资源不存在，或为避免泄露而隐藏存在性 |
| `405` | Method Not Allowed | 资源不允许该方法，应返回 `Allow` |
| `409` | Conflict | 与资源当前状态冲突 |
| `412` | Precondition Failed | 条件请求前置条件不满足 |
| `415` | Unsupported Media Type | 请求体媒体类型不受支持 |
| `429` | Too Many Requests | 请求过多，可附 `Retry-After` |
| `500` | Internal Server Error | 未分类服务器错误 |
| `502` / `503` / `504` | 网关或可用性错误 | 上游错误、暂不可用或超时 |

## 认证、授权与缓存

- 认证回答“你是谁”，授权回答“你能否对这个对象执行该操作”；两者必须在服务端分别检查。
- `401` 主要表示需要认证，`403` 主要表示认证后仍不允许；名称 `Unauthorized` 容易误导。
- HTTPS 保护传输，不替代会话管理、对象级授权、CSRF 防护和输入验证。
- 缓存策略必须考虑用户身份、Cookie、`Authorization`、`Vary` 和敏感数据。
- `no-cache` 表示使用前通常要重验证；`no-store` 表示不应存储，两者并不相同。
- 方法是否可缓存由规范、响应指令和缓存实现共同决定，不能只凭状态码判断。

方法语义详见 [HTTP 方法](http-methods.md)，完整检查见[质量检查](validation-checklist.md)。
