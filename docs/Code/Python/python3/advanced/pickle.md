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

## 协议规则

| API/概念 | 用途 | 边界 |
| --- | --- | --- |
| `dump/load` | 文件对象 | 必须二进制模式 |
| `dumps/loads` | 内存字节 | 仍可执行代码 |
| protocol | 编码版本 | 新协议不兼容旧 Python |
| `__reduce__` | 自定义恢复 | 也是代码执行机制 |

## 示例：可信缓存文件

```python
import pickle
from io import BytesIO

buffer = BytesIO()
pickle.dump([1, 2, 3], buffer, protocol=pickle.HIGHEST_PROTOCOL)
buffer.seek(0)
result = pickle.load(buffer)  # 仅加载本进程创建的可信数据
print(result)
```

`pickle` 是标准库，无需安装，也没有超时或安全模式。跨权限边界一律改用非可执行格式并做 schema 校验；缓存损坏时应允许删除和重建，而非让服务永久启动失败。

## 常见错误与安全注意

- 绝不能反序列化不可信 pickle，它可在加载期间执行任意代码。
- 类路径变化会导致旧数据无法恢复，长期存储优先 JSON、数据库或定义明确的 schema。
- 签名只能验证来源，不能让来源本身不可信的 pickle 变安全。
