# Python3 MongoDB

## 概念与用途

MongoDB 是文档数据库，PyMongo 是官方 Python 驱动。文档以 BSON 存储，适合结构可演进的数据，但仍需设计 schema、索引和一致性边界。

## 核心 API

安装 `python -m pip install "pymongo>=4.6"`，使用 `MongoClient`、数据库、集合三级对象。运行连接示例需要 MongoDB 4.4+ 或兼容服务、网络访问和凭据；URI 从环境变量读取。

```python
import os
from pymongo import MongoClient

client = MongoClient(os.environ["MONGODB_URI"], serverSelectionTimeoutMS=3000)
try:
    print(client.admin.command("ping"))
    user = client.demo.users.find_one({"name": "Alice"}, {"_id": 0})
    print(user)
finally:
    client.close()
```

## 连接与查询规则

| 配置/API | 用途 | 边界 |
| --- | --- | --- |
| `serverSelectionTimeoutMS` | 服务发现上限 | 避免启动永久等待 |
| `connectTimeoutMS` | 建连上限 | 与查询超时不同 |
| `maxTimeMS` | 服务端查询上限 | 长查询必须限制 |
| `projection` | 限制返回字段 | 避免过量敏感数据 |

## 示例：生成安全过滤条件

```python
def user_filter(name: str) -> dict[str, object]:
    if not name or len(name) > 64:
        raise ValueError("名称长度无效")
    if name.startswith("$"):
        raise ValueError("名称不能以 $ 开头")
    return {"name": name, "active": True}

print(user_filter("Alice"))
```

`MongoClient` 设计为长期复用且内部维护连接池，不应每次查询新建。应用关闭时调用 `close()`；事务和写重试必须理解幂等性与集群能力。

## 常见错误与安全注意

- 不要将用户提供的 JSON 直接作为查询条件，操作符注入可能绕过预期过滤。
- 查询应设置投影、限制数量并为高频条件建立索引。
- 使用认证、TLS、最小权限和网络访问控制，禁止数据库直接暴露公网。
