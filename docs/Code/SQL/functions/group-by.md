# SQL GROUP BY

`GROUP BY` 用于按某列或某组列分组，通常和聚合函数一起使用。

## 示例

```sql
SELECT city, COUNT(*) AS total
FROM users
GROUP BY city;
```

## 作用

按城市分组后，统计每个城市的用户数量。

## 注意点

- 非聚合列通常需要出现在 `GROUP BY` 中。
- 分组后的过滤常应使用 `HAVING` 而不是 `WHERE`。

## 相关链接

- 上一篇：[SQL SUM()](sum.md)
- 下一篇：[SQL HAVING](having.md)
