# SQL FULL JOIN

`FULL JOIN` 或 `FULL OUTER JOIN` 返回左表和右表中的所有记录，匹配不上时另一侧用 `NULL` 补齐。

## 示例

```sql
SELECT u.name, o.order_id
FROM users AS u
FULL JOIN orders AS o ON u.id = o.user_id;
```

## 结果含义

- 匹配成功的行合并展示。
- 左表独有的行保留。
- 右表独有的行也保留。

## 注意点

- SQLite 和部分环境不直接支持 `FULL JOIN`。
- 有时可通过 `LEFT JOIN` 与 `UNION` 变通实现。

## 相关链接

- 上一篇：[SQL RIGHT JOIN](right-join.md)
- 下一篇：[SQL UNION](union.md)
