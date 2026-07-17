# Python Pickle 模块

## 概念与用途

`pickle` 将 Python 对象图序列化为字节，并能恢复共享引用和自定义类型。它适合同一可信系统内部的短期缓存，不是跨语言、长期稳定或不可信数据格式。

## 核心 API

`pickle.dumps()`、`loads()` 操作字节，`dump()`、`load()` 操作文件。协议版本影响性能和兼容性，通常使用 `pickle.HIGHEST_PROTOCOL`。

```python
import pickle

data = {"name": "Alice", "scores": [88, 95]}
payload = pickle.dumps(data, protocol=pickle.HIGHEST_PROTOCOL)
restored = pickle.loads(payload)  # 仅演示本进程刚生成的可信数据
print(restored)
```

## 常见错误与安全注意

- 绝不能反序列化不可信 pickle，它可在加载期间执行任意代码。
- 类路径变化会导致旧数据无法恢复，长期存储优先 JSON、数据库或定义明确的 schema。
- 签名只能验证来源，不能让来源本身不可信的 pickle 变安全。
