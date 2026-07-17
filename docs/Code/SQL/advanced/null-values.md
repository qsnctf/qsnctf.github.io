# SQL NULL 值

`NULL` 表示“未知”或“缺失”，它不等于空字符串，也不等于数字 `0`。

## 判断 `NULL`

```sql
SELECT *
FROM users
WHERE city IS NULL;
```

```sql
SELECT *
FROM users
WHERE city IS NOT NULL;
```

## 注意点

- 不能写 `city = NULL`。
- `NULL` 参与比较时，结果常不是普通的真/假，而是未知。

## 相关链接

- 上一篇：[SQL 日期](dates.md)
- 下一篇：[SQL NULL 函数](null-functions.md)
