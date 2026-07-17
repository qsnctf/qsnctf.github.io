# SQL FIRST()

`FIRST()` 用于返回结果集中的第一项，但它并不是所有数据库都支持的标准函数。

## 示例思路

某些环境中可以写成：

```sql
SELECT FIRST(name)
FROM users;
```

## 更常见替代

很多数据库更常见的做法是结合排序和限制条数：

```sql
SELECT name
FROM users
ORDER BY id ASC
LIMIT 1;
```

## 相关链接

- 上一篇：[SQL COUNT()](count.md)
- 下一篇：[SQL LAST()](last.md)
