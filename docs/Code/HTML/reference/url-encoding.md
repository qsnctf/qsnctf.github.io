# HTML URL 编码参考

URL 编码通常指百分号编码：把组件中不能直接出现的字节写成 `%HH`。
URL 由多个组件组成；应先确定数据位于路径、查询、片段还是表单体，再选择 API。

## URL 结构

```text
https://user@example.com:8443/docs/a%20b?q=html%20url#result
\___/   \__/ \_________/ \__/ \__________/ \__________/ \____/
scheme  userinfo   host   port      path        query     fragment
```

片段通常只由客户端处理，不随 HTTP 请求发送给服务器。
用户名密码形式的 userinfo 容易泄露和混淆，不应承载现代认证凭据。

## 常见 ASCII 编码

| 字符 | UTF-8 百分号编码 | 常见原因 |
| :---: | --- | --- |
| 空格 | `%20` | URL 组件中不能直接使用普通空格 |
| `!` | `%21` | 需要作为数据而非保留字符时 |
| `#` | `%23` | 避免开始片段 |
| `$` | `%24` | 需要作为普通数据时 |
| `%` | `%25` | 显示字面百分号 |
| `&` | `%26` | 避免分隔查询参数 |
| `+` | `%2B` | 避免在表单编码中被解释为空格 |
| `/` | `%2F` | 避免在路径中分隔层级；服务器可能拒绝 |
| `:` | `%3A` | 需要作为普通数据时 |
| `=` | `%3D` | 避免分隔查询参数名和值 |
| `?` | `%3F` | 避免开始查询部分 |
| `@` | `%40` | 需要作为普通数据时 |

非 ASCII 字符先编码为 UTF-8 字节，再逐字节百分号编码。
例如“中”的 UTF-8 字节为 `E4 B8 AD`，编码结果是 `%E4%B8%AD`。

## JavaScript API

| API | 适用场景 | 注意事项 |
| --- | --- | --- |
| `new URL(value, base)` | 解析、规范化和组合完整 URL | 读取 `protocol`、`host`、`pathname` 等组件 |
| `URLSearchParams` | 构造和读取查询参数 | 自动处理分隔符和重复键 |
| `encodeURIComponent()` | 编码单个组件值 | 不要用它编码完整 URL |
| `encodeURI()` | 编码近似完整的 URI 字符串 | 会保留许多分隔符，组合数据时不够安全 |
| `decodeURIComponent()` | 解码单个百分号编码组件 | 非法序列会抛出异常 |

```js
const url = new URL("/search", "https://example.com");
url.searchParams.set("q", "HTML & CSS");
url.searchParams.set("page", "2");
// https://example.com/search?q=HTML+%26+CSS&page=2
```

不要先手工编码再交给 `URLSearchParams`，否则可能把 `%` 再编码为 `%25`。

## 表单编码与空格

| 内容类型 | 空格表示 | 典型用途 |
| --- | --- | --- |
| URL 路径或一般组件 | `%20` | 页面路径、路径段 |
| `application/x-www-form-urlencoded` | `+`，也可识别 `%20` | HTML 表单和查询参数序列化 |
| `multipart/form-data` | 由 multipart 语法承载 | 文件与复杂表单上传 |
| `application/json` | JSON 字符串转义，不是 URL 编码 | API 请求体 |

`+` 在普通路径中通常就是加号；只在表单式解析规则中常被还原为空格。

## HTML 与 URL 的双重上下文

```html
<a href="/search?q=fish%20%26%20chips&amp;page=2">搜索</a>
```

这里 `%20` 和 `%26` 属于 URL 编码，`&amp;` 属于 HTML 字符引用。
浏览器解析属性后，请求目标是 `/search?q=fish%20%26%20chips&page=2`。

## 安全与规范化

- URL 编码不验证目标可信度，也不是认证、授权或 XSS 防护。
- 只允许预期的 `https:` 等方案；警惕 `javascript:`、用户信息和相似域名。
- 路径校验应在服务器完成规范化后进行，防止重复编码和路径穿越差异。
- 不要反复解码未知输入；`%252F` 解码一次和两次结果不同。
- 查询参数可能进入历史、日志、缓存键和 Referer，不放密码或长期令牌。
- 签名与缓存必须约定统一的参数顺序、编码方式和规范化规则。

## 快速检查

| 问题 | 建议 |
| --- | --- |
| 拼查询字符串 | 使用 `URLSearchParams` |
| 拼相对或绝对 URL | 使用 `URL` |
| 编码单个值 | 使用 `encodeURIComponent()` 或组件专用 API |
| 写进 HTML 属性 | 再执行 HTML 属性上下文编码 |
| 接收服务器参数 | 解码后继续做类型、长度、权限和业务验证 |

相关参考：[字符实体](entities.md) · [HTTP 消息](http-messages.md) · [质量检查](validation-checklist.md)
