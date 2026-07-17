# DHCP 协议

DHCP（Dynamic Host Configuration Protocol）用于自动分配 IP 地址和网络配置。常见端口是 UDP 67/68。

## 常见流程

```text
Discover -> Offer -> Request -> ACK
```

主机可以通过 DHCP 获得：

- IP 地址。
- 子网掩码。
- 默认网关。
- DNS 服务器。
- 租约时间。

## 安全注意

恶意 DHCP 服务器可能下发错误网关或 DNS。企业网络常使用 DHCP Snooping 等机制降低风险。抓包分析中可关注 Offer 和 ACK 中的配置项。
