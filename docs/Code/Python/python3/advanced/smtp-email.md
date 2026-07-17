# Python3 SMTP发送邮件

## 概念与用途

`smtplib` 实现 SMTP 客户端，`email.message.EmailMessage` 构造包含文本、HTML 和附件的 MIME 消息。真实发送需要邮件服务商地址、端口和凭据。

## 核心 API

常见安全方式是端口 465 的 `SMTP_SSL`，或连接后调用 `starttls()`。使用 `send_message()` 发送结构化消息，密码从环境变量读取。

```python
from email.message import EmailMessage

message = EmailMessage()
message["From"] = "sender@example.com"
message["To"] = "receiver@example.com"
message["Subject"] = "测试邮件"
message.set_content("这是一封 UTF-8 文本邮件。")
print(message.as_string())  # 无需服务器即可运行并检查 MIME
```

## 常见错误与安全注意

- 不要把 SMTP 密码写入源码；优先应用专用密码或短期凭据。
- 收件人、主题等头字段要防止换行注入，`EmailMessage` 会拒绝部分非法值。
- 批量发送需限速、处理退信并遵守反垃圾邮件法规。
