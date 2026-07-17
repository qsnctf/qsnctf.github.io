# SQL UPDATE

`UPDATE` 用于修改表中已有记录。

## 基本语法

```sql
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;
```

## 示例

```sql
UPDATE users
SET city = 'Guangzhou'
WHERE id = 1;
```

## 同时更新多列

```sql
UPDATE users
SET city = 'Shanghai', age = 23
WHERE id = 2;
```

## 重要风险

如果省略 `WHERE`，可能更新整张表：

```sql
UPDATE users
SET city = 'Unknown';
```

## 相关链接

- 上一篇：[SQL INSERT INTO](insert-into.md)
- 下一篇：[SQL DELETE](delete.md)
