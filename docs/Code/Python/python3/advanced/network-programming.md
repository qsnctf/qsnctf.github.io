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

## Socket 规则

| API | 作用 | 工程要求 |
| --- | --- | --- |
| `settimeout()` | 限制阻塞等待 | 客户端和服务端都设置 |
| `sendall()` | 循环发送全部数据 | 仍可能超时/断开 |
| `recv(n)` | 最多读取 n 字节 | 0 字节表示对端关闭 |
| `shutdown()` | 关闭方向 | 与 close 语义不同 |

## 示例：长度前缀协议

```python
import struct

message = "hello".encode("utf-8")
frame = struct.pack("!I", len(message)) + message
size = struct.unpack("!I", frame[:4])[0]
payload = frame[4:4 + size]
print(size, payload.decode("utf-8"))
```

`socket` 和 `struct` 都是标准库，无需安装。真实接收必须循环凑满 4 字节头和声明的正文，并在分配内存前拒绝超过协议上限的长度。

## 常见错误与安全注意

- 所有外部连接都应配置超时，并限制消息长度以防内存耗尽。
- `recv(1024)` 不保证得到完整消息，需要循环读取并处理半包、粘包。
- 不要自创加密协议；敏感通信应使用经过验证的 TLS 实现。
