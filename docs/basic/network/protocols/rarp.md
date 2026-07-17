# RARP 协议

RARP（Reverse Address Resolution Protocol）用于根据 MAC 地址获取 IP 地址，是 ARP 的反向思路。

## 历史用途

RARP 曾用于无盘工作站启动时获取自己的 IP 地址。它功能有限，后来被 BOOTP 和 DHCP 取代。

## 与 ARP 的区别

| 协议 | 查询方向 |
| --- | --- |
| ARP | IP 地址 -> MAC 地址 |
| RARP | MAC 地址 -> IP 地址 |

现代网络中很少直接使用 RARP。学习它主要是理解地址解析协议的历史演进。
