# MIME 类型

MIME 类型描述数据的媒体格式，常用于 HTTP、邮件和文件处理。

## 格式

```text
type/subtype
```

例如：

| MIME 类型 | 含义 |
| --- | --- |
| `text/html` | HTML 文档 |
| `text/plain` | 纯文本 |
| `application/json` | JSON 数据 |
| `image/png` | PNG 图片 |
| `application/pdf` | PDF 文件 |
| `multipart/form-data` | 表单文件上传 |

## 安全注意

MIME 嗅探可能让浏览器忽略声明类型。服务端可使用 `X-Content-Type-Options: nosniff` 降低风险。上传文件时应验证内容、扩展名、类型和存储位置。
