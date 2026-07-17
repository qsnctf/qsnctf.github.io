# SQL NULL 函数

很多数据库提供处理 `NULL` 的函数，用于在值缺失时给出替代值。

## 常见函数

- MySQL：`IFNULL(expr, alt)`
- SQL Server：`ISNULL(expr, alt)`
- 通用标准常见：`COALESCE(expr1, expr2, ...)`

## 示例

```sql
SELECT name, COALESCE(city, 'Unknown') AS city_name
FROM users;
```

## 作用

如果 `city` 为 `NULL`，就显示 `'Unknown'`。

## 相关链接

- 上一篇：[SQL NULL 值](null-values.md)
- 下一篇：[SQL 通用数据类型](data-types-general.md)
