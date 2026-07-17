# SQL WHERE

`WHERE` 用于筛选满足条件的记录。

## 基本语法

```sql
SELECT column1, column2
FROM table_name
WHERE condition;
```

## 示例

```sql
SELECT *
FROM users
WHERE city = 'Beijing';
```

```sql
SELECT *
FROM users
WHERE age >= 18;
```

## 常见比较运算符

- `=` 等于
- `<>` 或 `!=` 不等于
- `>` 大于
- `<` 小于
- `>=` 大于等于
- `<=` 小于等于

## 注意点

- `WHERE` 不仅用于 `SELECT`，也用于 `UPDATE` 和 `DELETE`。
- 处理 `NULL` 时不能用 `= NULL`，应使用 `IS NULL`。

## 相关链接

- 上一篇：[SQL SELECT DISTINCT](select-distinct.md)
- 下一篇：[SQL AND & OR](and-or.md)
