# SQL UCASE()

`UCASE()` 用于把字符串转换为大写。在很多数据库中，等价或更常见的名字是 `UPPER()`。

## 示例

```sql
SELECT UCASE(name) AS upper_name
FROM users;
```

## 方言说明

更常见且更通用的写法：

```sql
SELECT UPPER(name)
FROM users;
```

## 相关链接

- 上一篇：[SQL EXISTS](exists.md)
- 下一篇：[SQL LCASE()](lcase.md)
