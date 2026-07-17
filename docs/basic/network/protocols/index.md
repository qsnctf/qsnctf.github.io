# 网络协议

网络协议是设备在网络中交换数据时共同遵守的规则集合。它规定了数据如何封装、寻址、传输、确认、加密和解析。

学习网络协议时，不要只背端口号。更重要的是理解：协议工作在哪一层、解决什么问题、依赖哪些下层协议、常见报文结构是什么，以及在 CTF 和安全分析中通常从哪里观察证据。

## 阅读路线

1. [网络协议简介](introduction.md)
2. [网络通信基础](communication-basics.md)
3. [常见网络设备](network-devices.md)
4. 传输层：[TCP 协议](tcp.md)、[UDP 协议](udp.md)
5. 应用层：[HTTP 协议](http.md)、[HTTPS 协议](https.md)、[DNS 协议](dns.md)、[FTP 协议](ftp.md)、[SSH 协议](ssh.md)
6. 地址与控制：[ARP 协议](arp.md)、[ICMP 协议](icmp.md)、[DHCP 协议](dhcp.md)

## 常见协议速览

| 协议 | 常见层次 | 主要用途 |
| --- | --- | --- |
| TCP | 传输层 | 面向连接、可靠字节流 |
| UDP | 传输层 | 无连接数据报 |
| DNS | 应用层 | 域名解析 |
| HTTP | 应用层 | Web 请求与响应 |
| HTTPS | 应用层 | HTTP over TLS |
| SSH | 应用层 | 安全远程登录与隧道 |
| FTP | 应用层 | 文件传输 |
| ICMP | 网络层控制 | 差错报告和连通性诊断 |
| ARP | 链路层辅助 | IPv4 地址到 MAC 地址解析 |

协议分层是分析模型，不是抓包时看到的孤立文件。一次 Web 访问可能同时涉及 DNS、TCP、TLS、HTTP 和多种链路层机制。
