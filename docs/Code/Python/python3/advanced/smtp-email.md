# Python3 SMTP发送邮件

## 概念与用途

`smtplib` 实现 SMTP 客户端，`email.message.EmailMessage` 构造包含文本、HTML 和附件的 MIME 消息。真实发送需要邮件服务商地址、端口和凭据。

两个模块都属于标准库，无需安装第三方包。外部依赖是 SMTP 服务、DNS、TLS 证书和授权凭据；服务商还可能要求应用密码或 OAuth。

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

## 连接选择

| 方式 | 常见端口 | 安全要求 |
| --- | --- | --- |
| `SMTP_SSL` | 465 | 连接即 TLS |
| `SMTP` + `starttls` | 587 | EHLO、升级 TLS、再次 EHLO |
| 本地中继 | 25 | 仅可信网络和严格中继策略 |
| `send_message` | 任意连接 | 使用 EmailMessage |

## 示例：安全连接模板

```python
import os
import smtplib
import ssl

host = os.environ.get("SMTP_HOST", "smtp.example.com")
print("将连接:", host, 465)
# with smtplib.SMTP_SSL(host, 465, timeout=10, context=ssl.create_default_context()) as client:
#     client.login(os.environ["SMTP_USER"], os.environ["SMTP_PASSWORD"])
#     client.send_message(message)
```

真实连接必须设置超时并用 `with` 发送 QUIT/关闭 socket。发送结果只能证明服务器接收，不能证明最终投递；批量系统需跟踪 message ID、退信和幂等键。

## 常见错误与安全注意

- 不要把 SMTP 密码写入源码；优先应用专用密码或短期凭据。
- 收件人、主题等头字段要防止换行注入，`EmailMessage` 会拒绝部分非法值。
- 批量发送需限速、处理退信并遵守反垃圾邮件法规。
