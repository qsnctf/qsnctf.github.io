# SQL SELECT INTO

`SELECT INTO` 通常用于把查询结果写入一张新表。

## 示例

```sql
SELECT *
INTO customers_backup
FROM customers;
```

## 条件复制

```sql
SELECT name, city
INTO beijing_customers
FROM customers
WHERE city = 'Beijing';
```

## 方言差异

- SQL Server 常见 `SELECT INTO`
- MySQL 常更常见 `CREATE TABLE ... AS SELECT ...`

## 相关链接

- 上一篇：[SQL UNION](union.md)
- 下一篇：[SQL INSERT INTO SELECT](insert-into-select.md)
