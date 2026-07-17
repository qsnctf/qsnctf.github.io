# SQL 连接(JOIN)

`JOIN` 用于把多个表中有关联的数据组合起来。

## 为什么要连接

关系型数据库通常把不同主题存入不同表，例如：

- `users` 保存用户信息
- `orders` 保存订单信息

如果订单表里有 `user_id`，就可以通过连接把订单和用户信息放到同一结果集中。

## 基本示例

```sql
SELECT u.name, o.order_id
FROM users AS u
JOIN orders AS o ON u.id = o.user_id;
```

## 常见连接类型

- `INNER JOIN`
- `LEFT JOIN`
- `RIGHT JOIN`
- `FULL JOIN`

它们的差异主要在于：匹配失败时，哪一侧的行仍然保留。

## 相关链接

- 上一篇：[SQL 别名](aliases.md)
- 下一篇：[SQL INNER JOIN](inner-join.md)
