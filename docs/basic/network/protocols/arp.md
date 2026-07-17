# ARP 协议

ARP（Address Resolution Protocol）用于在 IPv4 局域网中把 IP 地址解析为 MAC 地址。

## 基本过程

```text
谁拥有 192.168.1.1？请告诉 192.168.1.100
192.168.1.1 在 aa:bb:cc:dd:ee:ff
```

ARP 请求通常是广播，ARP 响应通常是单播。

## ARP 缓存

主机会缓存 IP 到 MAC 的映射，减少重复查询。

```bash
arp -a
ip neigh
```

## 安全注意

ARP 本身缺少认证，容易受到 ARP 欺骗影响。局域网安全分析中应关注网关 MAC 是否异常变化。
