# SQL DELETE

`DELETE` 用于删除表中的记录。

## 基本语法

```sql
DELETE FROM table_name
WHERE condition;
```

## 示例

```sql
DELETE FROM users
WHERE id = 3;
```

## 风险提示

如果没有 `WHERE`，会删除整张表中的所有记录：

```sql
DELETE FROM users;
```

## `DELETE` 与 `DROP`

- `DELETE` 删除的是表中的数据。
- `DROP TABLE` 删除的是整张表结构及其数据。

## 相关链接

- 上一篇：[SQL UPDATE](update.md)
- 继续学习：[SQL 高级教程](../advanced/index.md)
