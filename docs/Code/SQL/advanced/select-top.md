# SQL SELECT TOP

`TOP` 用于限制返回的记录数量，常见于 SQL Server。

## 基本语法

```sql
SELECT TOP 5 *
FROM users;
```

## 配合排序使用

```sql
SELECT TOP 3 *
FROM products
ORDER BY price DESC;
```

这表示取价格最高的 3 条记录。

## 方言差异

- SQL Server 常用 `TOP n`
- MySQL / PostgreSQL / SQLite 常用 `LIMIT n`

```sql
SELECT *
FROM users
LIMIT 5;
```

## 相关链接

- 上一篇：[SQL 高级教程](index.md)
- 下一篇：[SQL LIKE](like.md)
