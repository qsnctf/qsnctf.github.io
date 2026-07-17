# SFTP 协议

SFTP（SSH File Transfer Protocol）是在 SSH 之上运行的文件传输协议，常用 TCP 22。

## 与 FTP 的区别

| 项目 | FTP | SFTP |
| --- | --- | --- |
| 加密 | 传统 FTP 无加密 | 由 SSH 提供加密 |
| 端口 | 控制连接 21，数据连接另开 | 通常 22 |
| 认证 | 用户名密码等 | SSH 认证体系 |
| 连接模型 | 控制/数据连接分离 | 单 SSH 连接内多通道 |

SFTP 不是“FTP 加 TLS”。FTP over TLS 通常称为 FTPS。

## 安全注意

使用 SFTP 时仍应验证主机密钥，保护私钥文件，并限制账户权限。
