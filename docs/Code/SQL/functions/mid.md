# SQL MID()

`MID()` 用于截取字符串的一部分。很多数据库更常见的函数名是 `SUBSTRING()`。

## 示例

```sql
SELECT MID(name, 1, 3)
FROM users;
```

## 通用替代

```sql
SELECT SUBSTRING(name, 1, 3)
FROM users;
```

## 相关链接

- 上一篇：[SQL LCASE()](lcase.md)
- 下一篇：[SQL LEN()](len.md)
