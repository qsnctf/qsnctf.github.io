# SSH 协议

SSH（Secure Shell）用于安全远程登录、命令执行、端口转发和文件传输。默认端口通常是 TCP 22。

## SSH 提供什么

- 服务端身份验证。
- 密钥交换和加密通信。
- 用户认证，例如密码、公钥或多因素认证。
- 会话完整性保护。
- 通道复用，例如终端、SFTP、端口转发。

## 常见用途

```bash
ssh user@example.test
scp file user@example.test:/tmp/
sftp user@example.test
```

## 安全注意

首次连接时应确认主机指纹。不要忽略主机密钥变化提示。CTF 中如果给出 SSH 私钥，应注意文件权限和授权范围，不要上传私钥到仓库。
