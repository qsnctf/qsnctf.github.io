# SMTP 协议

SMTP（Simple Mail Transfer Protocol）用于邮件发送和服务器之间转发。常见端口包括 TCP 25、587 和 465。

## 基本流程

```text
HELO/EHLO
MAIL FROM
RCPT TO
DATA
QUIT
```

## 端口说明

| 端口 | 常见用途 |
| --- | --- |
| 25 | 邮件服务器之间传递 |
| 587 | 邮件客户端提交，通常配合认证和 STARTTLS |
| 465 | SMTPS，历史上常见的 TLS 封装端口 |

## 安全注意

SMTP 早期设计默认信任较多。现代邮件系统依赖 SPF、DKIM、DMARC、TLS 和反垃圾策略提高可信度。CTF 流量题中可关注邮件头、发件人、收件人和附件编码。
