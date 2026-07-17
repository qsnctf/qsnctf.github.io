# Python hashlib

## 概念与用途

`hashlib` 提供 SHA-2、SHA-3、BLAKE2 等密码学摘要，用于完整性校验、内容寻址和签名流程的预处理。摘要不可替代加密，也不能单独安全存储用户密码。

## 核心 API

通过 `hashlib.sha256(data)` 一次计算，或创建对象后多次 `update()` 流式处理。`hexdigest()` 返回十六进制文本；比较认证标签使用 `hmac.compare_digest()`。

```python
import hashlib

hasher = hashlib.sha256()
for chunk in (b"large ", b"file ", b"content"):
    hasher.update(chunk)
print(hasher.hexdigest())
```

## 算法与 API

| API | 场景 | 注意 |
| --- | --- | --- |
| `sha256()` | 通用完整性摘要 | 不能隐藏内容 |
| `blake2b()` | 快速、可加 key 摘要 | 配置摘要长度 |
| `file_digest()` | 文件流摘要 | Python 3.11+ |
| `pbkdf2_hmac()` | 兼容型密码派生 | 参数需按策略更新 |

## 示例：分块校验文件式数据

```python
import hashlib
from io import BytesIO

stream = BytesIO(b"a" * 10_000)
digest = hashlib.sha256()
while chunk := stream.read(4096):
    digest.update(chunk)
print(digest.hexdigest())
```

`hashlib` 是标准库，无需安装。读取真实文件应使用 `with` 关闭句柄；比较安全标签用 `hmac.compare_digest()`，避免普通字符串比较暴露时序差异。

## 常见错误与安全注意

- 用户密码应使用 Argon2、scrypt、bcrypt 或 PBKDF2 加盐慢哈希。
- MD5、SHA-1 不适合抗碰撞安全用途，但可在非对抗兼容场景校验旧协议。
- 校验下载文件还需从可信渠道获得期望摘要，否则攻击者可同时替换两者。
