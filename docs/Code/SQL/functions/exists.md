# SQL EXISTS

`EXISTS` 用于判断子查询是否返回至少一行结果。

## 示例

```sql
SELECT name
FROM users AS u
WHERE EXISTS (
  SELECT 1
  FROM orders AS o
  WHERE o.user_id = u.id
);
```

## 作用

查询至少存在一条订单记录的用户。

## 相关链接

- 上一篇：[SQL HAVING](having.md)
- 下一篇：[SQL UCASE()](ucase.md)
