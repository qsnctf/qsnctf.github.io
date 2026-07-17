# SSL 协议

SSL（Secure Sockets Layer）是 TLS 的前身。SSL 2.0 和 SSL 3.0 已被认为不安全，现代系统应使用 TLS。

## 历史定位

- SSL 2.0：早期版本，存在严重设计问题。
- SSL 3.0：改进版本，但也已废弃。
- TLS：SSL 的继任者，现代安全通信主要使用 TLS 1.2 和 TLS 1.3。

## 安全注意

实际配置中应禁用 SSLv2、SSLv3 和弱密码套件。看到“SSL 证书”这个说法时，很多时候实际指的是 TLS 使用的 X.509 证书。

更现代的协议见 [TLS 协议](tls.md)。
