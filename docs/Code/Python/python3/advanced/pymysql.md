# Python3 MySQL(PyMySQL)

## 概念与用途

PyMySQL 是纯 Python 的 MySQL/MariaDB 客户端，接口接近 Python DB-API，安装命令为 `python -m pip install PyMySQL`。它适合脚本和框架适配，但仍需外部数据库服务。

## 核心 API

`pymysql.connect()` 创建连接，`DictCursor` 以字典形式返回行，游标的 `execute()` 接受参数元组。连接和游标都应及时关闭。

```python
import os
import pymysql

connection = pymysql.connect(
    host=os.environ.get("MYSQL_HOST", "localhost"),
    user=os.environ["MYSQL_USER"],
    password=os.environ["MYSQL_PASSWORD"],
    database=os.environ["MYSQL_DATABASE"],
)
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT %s AS answer", (42,))
        print(cursor.fetchone()[0])
finally:
    connection.close()
```

## 常见错误与安全注意

- 单参数元组必须写 `(42,)`，参数化查询不能用 Python 字符串格式化替代。
- 默认事务行为应明确配置，异常路径必须回滚。
- 连接断开重试不能盲目重放非幂等写操作。
