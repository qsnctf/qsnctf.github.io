# SQL LCASE()

`LCASE()` 用于把字符串转换为小写。很多数据库更常用 `LOWER()`。

## 示例

```sql
SELECT LCASE(name) AS lower_name
FROM users;
```

## 更常见写法

```sql
SELECT LOWER(name)
FROM users;
```

## 相关链接

- 上一篇：[SQL UCASE()](ucase.md)
- 下一篇：[SQL MID()](mid.md)
