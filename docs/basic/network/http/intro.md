# HTTP/HTTPS 简介

HTTP（HyperText Transfer Protocol）用于客户端和服务端之间传输 Web 资源。HTTPS 是 HTTP over TLS，为 HTTP 增加加密、完整性和身份验证。

## HTTP 特点

- 请求-响应模型。
- 无状态，状态通常由 Cookie、Session 或 Token 维护。
- 文本头部加可选消息体。
- 可被代理、缓存和网关处理。

## HTTPS 增加什么

- 通过 TLS 加密传输内容。
- 验证服务端证书和域名。
- 防止中间人直接篡改或读取内容。

HTTPS 保护传输过程，不自动修复 SQL 注入、XSS、权限绕过等应用漏洞。
