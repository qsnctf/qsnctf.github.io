# SQL COUNT()

`COUNT()` 用于统计记录数量。

## 示例

```sql
SELECT COUNT(*) AS total_users
FROM users;
```

## 统计非 `NULL` 值

```sql
SELECT COUNT(city)
FROM users;
```

这会统计 `city` 不为 `NULL` 的行数。

## 相关链接

- 上一篇：[SQL AVG()](avg.md)
- 下一篇：[SQL FIRST()](first.md)
