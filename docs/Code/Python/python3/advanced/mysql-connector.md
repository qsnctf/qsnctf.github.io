# Python3 MySQL(mysql-connector)

## 概念与用途

`mysql-connector-python` 是 MySQL 官方 Python 驱动，遵循 DB-API 风格，可执行查询、事务和预处理参数。本教程建议 `python -m pip install "mysql-connector-python>=8.2"`，运行示例需要可访问的 MySQL 8.x、数据库和最小权限账户。

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

## 关键配置

| 配置/API | 作用 | 工程要求 |
| --- | --- | --- |
| `connection_timeout` | 建立连接上限 | 必须有限值 |
| `autocommit` | 自动提交 | 写业务通常显式事务 |
| `cursor()` | 创建游标 | 用上下文关闭 |
| `rollback()` | 撤销当前事务 | 异常路径调用 |

## 示例：事务异常模板

```python
def transfer(connection, cursor, source: int, target: int, amount: int) -> None:
    try:
        cursor.execute("UPDATE account SET balance=balance-%s WHERE id=%s", (amount, source))
        cursor.execute("UPDATE account SET balance=balance+%s WHERE id=%s", (amount, target))
        connection.commit()
    except Exception:
        connection.rollback()
        raise
```

模板需在真实连接中调用，且应检查更新行数、余额约束和隔离级别。连接池归还前必须结束事务；查询与锁等待超时还需在服务端或会话层配置。

## 常见错误与安全注意

- 占位符是 `%s`，不能用 f-string 拼接 SQL；表名等标识符需白名单处理。
- 写操作必须明确提交或回滚，并缩短事务持锁时间。
- 生产环境使用最小权限账户、TLS、连接池和查询超时。
