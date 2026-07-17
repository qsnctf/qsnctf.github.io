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

## 常见错误与安全注意

- 用户密码应使用 Argon2、scrypt、bcrypt 或 PBKDF2 加盐慢哈希。
- MD5、SHA-1 不适合抗碰撞安全用途，但可在非对抗兼容场景校验旧协议。
- 校验下载文件还需从可信渠道获得期望摘要，否则攻击者可同时替换两者。
