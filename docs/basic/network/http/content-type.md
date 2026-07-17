# HTTP content-type

`Content-Type` 用于说明 HTTP 消息体的媒体类型和可选编码。

## 常见示例

```http
Content-Type: text/html; charset=utf-8
Content-Type: application/json
Content-Type: application/x-www-form-urlencoded
Content-Type: multipart/form-data; boundary=----demo
```

## 请求中的作用

服务端会根据 `Content-Type` 选择解析方式。例如 JSON、表单和文件上传的解析逻辑不同。

## 响应中的作用

浏览器会根据 `Content-Type` 决定如何处理正文。错误的类型可能造成下载异常、乱码或安全风险。

## 安全注意

不要只相信扩展名。服务端应同时控制文件内容、下载头和 MIME 类型，避免用户上传内容被浏览器当作脚本执行。
