# ICMP 协议

ICMP（Internet Control Message Protocol）用于网络层差错报告和诊断。

## 常见用途

- `ping` 使用 Echo Request / Echo Reply 检测连通性。
- 路由器用 Destination Unreachable 报告不可达。
- TTL 过期消息支持 `traceroute` 判断路径。

## 注意事项

ICMP 不是传输层协议，没有端口。防火墙可能限制 ICMP，导致 `ping` 不通并不一定代表 TCP 服务不可达。

## 安全注意

ICMP 可用于网络诊断，也可能泄露网络结构。安全配置应在可观测性和暴露面之间平衡。
