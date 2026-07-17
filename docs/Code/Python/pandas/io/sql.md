# Pandas 读取 SQL

## 概念与用途

Pandas 可从 SQL 查询或表读取数据，也可把 DataFrame 写入数据库。生产项目通常通过 SQLAlchemy 管理连接和方言，让筛选、连接和聚合尽量在数据库完成。

## 核心 API

`pd.read_sql`、`pd.read_sql_query`、`pd.read_sql_table`、`DataFrame.to_sql`；常用参数有 `params`、`parse_dates`、`columns`、`chunksize`、`index`、`if_exists`、`method`。

## 可运行示例

```python
import sqlite3
import pandas as pd

with sqlite3.connect(":memory:") as conn:
    pd.DataFrame({"id": [1, 2], "amount": [10, 25]}).to_sql("orders", conn, index=False)
    result = pd.read_sql_query(
        "SELECT * FROM orders WHERE amount >= ?", conn, params=(20,)
    )
    print(result)
```

## 示例二：分块读取并保持全局汇总

```python
import sqlite3
import pandas as pd

with sqlite3.connect(":memory:") as conn:
    pd.DataFrame({"team": ["A", "A", "B"], "amount": [10, 15, 20]}).to_sql("sales", conn, index=False)
    parts = []
    for chunk in pd.read_sql_query("SELECT team, amount FROM sales", conn, chunksize=2):
        parts.append(chunk.groupby("team")["amount"].sum())
    totals = pd.concat(parts, axis=1).fillna(0).sum(axis=1)
    print(totals)
```

传入 `chunksize` 时返回迭代器，而非 DataFrame。数据库端可完成的过滤和聚合应尽量留在 SQL 中，减少网络和客户端内存。

## 可选依赖、类型与事务

SQLite 可用标准库连接；PostgreSQL、MySQL 等通常需要 SQLAlchemy 和对应驱动。数据库 decimal、时区时间、可空布尔与 Pandas dtype 的映射依赖方言和驱动，应做回读测试。`to_sql` 不自动创建所有业务约束和索引，批量写入还要明确事务边界与失败重试策略。

## 注意事项

永远使用参数化查询，不拼接用户输入；表名和排序字段不能用普通值参数代替，应使用白名单。`read_sql` 会把结果载入客户端内存，大查询需过滤列行或分块。`to_sql(if_exists="replace")` 会替换表，风险很高；生产写入应考虑事务、主键、索引、批次、权限和数据库原生批量导入。
