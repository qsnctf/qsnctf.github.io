# SQL HAVING

`HAVING` 用于对分组后的结果再做筛选。

## 示例

```sql
SELECT city, COUNT(*) AS total
FROM users
GROUP BY city
HAVING COUNT(*) > 5;
```

## 与 `WHERE` 的区别

- `WHERE` 过滤原始行。
- `HAVING` 过滤分组结果。

## 相关链接

- 上一篇：[SQL GROUP BY](group-by.md)
- 下一篇：[SQL EXISTS](exists.md)
