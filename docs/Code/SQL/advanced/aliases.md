# SQL 别名

别名用于给列名或表名起一个临时名称，让结果更易读，或让多表查询更简洁。

## 列别名

```sql
SELECT name AS user_name, city AS user_city
FROM users;
```

## 表别名

```sql
SELECT u.name, o.order_id
FROM users AS u
JOIN orders AS o ON u.id = o.user_id;
```

## 用途

- 缩短长表名。
- 区分自连接中的不同角色。
- 改善结果列标题可读性。

## 相关链接

- 上一篇：[SQL BETWEEN](between.md)
- 下一篇：[SQL 连接(JOIN)](join.md)
