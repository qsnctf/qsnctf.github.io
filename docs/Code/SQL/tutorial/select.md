# SQL SELECT

`SELECT` 用于从一个或多个表中读取数据，是最常用的 SQL 语句。

## 基本语法

```sql
SELECT column1, column2
FROM table_name;
```

如果想取出所有列：

```sql
SELECT *
FROM users;
```

## 示例

```sql
SELECT id, name, city
FROM users;
```

这会返回 `users` 表中的三列。

## 使用建议

- 明确列名通常比 `SELECT *` 更好。
- 明确列清单能减少不必要的数据传输。
- 当表结构变化时，显式列名更稳定。

## 相关链接

- 上一篇：[SQL 语法](syntax.md)
- 下一篇：[SQL SELECT DISTINCT](select-distinct.md)
