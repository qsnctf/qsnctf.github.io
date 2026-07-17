# SQL LEFT JOIN

`LEFT JOIN` 返回左表的所有记录，以及右表中匹配的记录。

## 示例

```sql
SELECT u.name, o.order_id
FROM users AS u
LEFT JOIN orders AS o ON u.id = o.user_id;
```

## 结果含义

- 所有用户都会出现。
- 没有订单的用户，其订单列会显示为 `NULL`。

## 常见用途

- 查找“没有关联数据”的左表记录。

```sql
SELECT u.*
FROM users AS u
LEFT JOIN orders AS o ON u.id = o.user_id
WHERE o.order_id IS NULL;
```

## 相关链接

- 上一篇：[SQL INNER JOIN](inner-join.md)
- 下一篇：[SQL RIGHT JOIN](right-join.md)
