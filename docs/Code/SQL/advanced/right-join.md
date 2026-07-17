# SQL RIGHT JOIN

`RIGHT JOIN` 返回右表的所有记录，以及左表中匹配的记录。

## 示例

```sql
SELECT u.name, o.order_id
FROM users AS u
RIGHT JOIN orders AS o ON u.id = o.user_id;
```

## 结果含义

- 所有订单都会出现。
- 没有匹配用户的订单，用户列会是 `NULL`。

## 注意点

- 很多团队更习惯只写 `LEFT JOIN`，通过交换表顺序表达同样逻辑。
- SQLite 不直接支持 `RIGHT JOIN`。

## 相关链接

- 上一篇：[SQL LEFT JOIN](left-join.md)
- 下一篇：[SQL FULL JOIN](full-join.md)
