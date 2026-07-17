# SQL IN

`IN` 用于判断某个值是否在一组给定值中。

## 基本语法

```sql
SELECT *
FROM users
WHERE city IN ('Beijing', 'Shanghai', 'Shenzhen');
```

## 与多个 `OR` 的关系

下面两种写法逻辑等价：

```sql
WHERE city IN ('Beijing', 'Shanghai')
```

```sql
WHERE city = 'Beijing' OR city = 'Shanghai'
```

## 也可配合子查询

```sql
SELECT *
FROM orders
WHERE user_id IN (
  SELECT id FROM users WHERE city = 'Beijing'
);
```

## 相关链接

- 上一篇：[SQL 通配符](wildcards.md)
- 下一篇：[SQL BETWEEN](between.md)
