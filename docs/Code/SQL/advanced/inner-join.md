# SQL INNER JOIN

`INNER JOIN` 只返回两张表中满足连接条件的记录。

## 示例

```sql
SELECT u.name, o.order_id
FROM users AS u
INNER JOIN orders AS o ON u.id = o.user_id;
```

## 结果含义

- 有匹配用户的订单会出现。
- 没有关联订单的用户不会出现。
- 找不到关联用户的订单也不会出现。

## 相关链接

- 上一篇：[SQL 连接(JOIN)](join.md)
- 下一篇：[SQL LEFT JOIN](left-join.md)
