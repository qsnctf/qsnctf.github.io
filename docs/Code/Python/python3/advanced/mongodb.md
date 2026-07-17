# Python3 MongoDB

## 概念与用途

MongoDB 是文档数据库，PyMongo 是官方 Python 驱动。文档以 BSON 存储，适合结构可演进的数据，但仍需设计 schema、索引和一致性边界。

## 核心 API

安装 `python -m pip install pymongo`，使用 `MongoClient`、数据库、集合三级对象。`find_one()` 查询，`insert_one()` 写入，`update_one()` 更新；URI 从环境变量读取。

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

## 常见错误与安全注意

- 不要将用户提供的 JSON 直接作为查询条件，操作符注入可能绕过预期过滤。
- 查询应设置投影、限制数量并为高频条件建立索引。
- 使用认证、TLS、最小权限和网络访问控制，禁止数据库直接暴露公网。
