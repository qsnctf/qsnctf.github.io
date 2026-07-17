# SQL Auto Increment

自增列用于自动生成连续编号，常用于主键。

## MySQL 示例

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
```

## 其他数据库差异

- PostgreSQL 常用 `SERIAL` 或 `GENERATED ... AS IDENTITY`
- SQL Server 常用 `IDENTITY(1,1)`
- SQLite 常见 `INTEGER PRIMARY KEY`，必要时配合 `AUTOINCREMENT`

## 相关链接

- 上一篇：[SQL ALTER](alter.md)
- 下一篇：[SQL 视图](views.md)
