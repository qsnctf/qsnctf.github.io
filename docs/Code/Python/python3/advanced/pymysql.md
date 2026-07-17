# Python3 MySQL(PyMySQL)

## 概念与用途

PyMySQL 是纯 Python 的 MySQL/MariaDB 客户端，接口接近 Python DB-API。本教程建议 `python -m pip install "PyMySQL>=1.1"`；运行连接示例需要兼容数据库、网络和凭据。

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

## 连接参数

| 参数 | 用途 | 建议 |
| --- | --- | --- |
| `connect_timeout` | 建连上限 | 必须设置 |
| `read_timeout` | 读取上限 | 按查询预算设置 |
| `write_timeout` | 写入上限 | 防网络永久阻塞 |
| `cursorclass` | 行返回形式 | DictCursor 更可读但稍有开销 |

## 示例：参数化批量插入

```python
rows = [("Alice", 91), ("Bob", 88)]
sql = "INSERT INTO score(name, value) VALUES (%s, %s)"
print(sql)
print("待插入参数:", rows)
# with connection.cursor() as cursor:
#     cursor.executemany(sql, rows)
# connection.commit()
```

示例默认注释真实写入，复制到已授权测试库后再执行。连接应在 `finally` 关闭或交给框架连接池；异常时回滚，不能把带未提交事务的连接归还池中。

## 常见错误与安全注意

- 单参数元组必须写 `(42,)`，参数化查询不能用 Python 字符串格式化替代。
- 默认事务行为应明确配置，异常路径必须回滚。
- 连接断开重试不能盲目重放非幂等写操作。
