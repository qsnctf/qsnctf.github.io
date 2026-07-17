# Python3 MySQL(mysql-connector)

## 概念与用途

`mysql-connector-python` 是 MySQL 官方 Python 驱动，遵循 DB-API 风格，可执行查询、事务和预处理参数。安装命令为 `python -m pip install mysql-connector-python`。

## 核心 API

使用 `mysql.connector.connect()` 建立连接，`cursor.execute(sql, params)` 参数化执行，`commit()` 提交写操作。连接信息应来自环境变量或密钥系统。

```python
import os
import mysql.connector

with mysql.connector.connect(
    host=os.environ.get("MYSQL_HOST", "127.0.0.1"),
    user=os.environ["MYSQL_USER"],
    password=os.environ["MYSQL_PASSWORD"],
    database=os.environ["MYSQL_DATABASE"],
) as connection:
    with connection.cursor() as cursor:
        cursor.execute("SELECT %s + %s", (2, 3))
        print(cursor.fetchone()[0])
```

## 常见错误与安全注意

- 占位符是 `%s`，不能用 f-string 拼接 SQL；表名等标识符需白名单处理。
- 写操作必须明确提交或回滚，并缩短事务持锁时间。
- 生产环境使用最小权限账户、TLS、连接池和查询超时。
