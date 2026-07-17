# Python3 网络编程

## 概念与用途

`socket` 提供 TCP、UDP 和 Unix socket 等底层网络接口。TCP 是可靠字节流，没有消息边界；应用必须自行定义长度、分隔符或固定结构协议。

## 核心 API

服务端通常执行 `socket()`、`bind()`、`listen()`、`accept()`，客户端执行 `connect()`；`sendall()` 发送全部缓冲，`recv()` 可能只返回部分数据。

```python
import socket

left, right = socket.socketpair()
try:
    left.sendall("hello".encode("utf-8"))
    data = right.recv(1024)
    print(data.decode("utf-8"))
finally:
    left.close()
    right.close()
```

## 常见错误与安全注意

- 所有外部连接都应配置超时，并限制消息长度以防内存耗尽。
- `recv(1024)` 不保证得到完整消息，需要循环读取并处理半包、粘包。
- 不要自创加密协议；敏感通信应使用经过验证的 TLS 实现。
