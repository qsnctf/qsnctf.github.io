# SQL 语法

SQL 语句通常由关键字、表名、列名、字面量和值组成。关键字大小写通常不敏感，但为了可读性，教程中常把关键字写成大写。

## 基本写法

```sql
SELECT column1, column2
FROM table_name
WHERE condition;
```

## 语法特点

- 一条语句通常以分号 `;` 结束。
- 字符串常量通常写成单引号，如 `'Alice'`。
- 标识符是否需要引号，取决于数据库和名称是否与关键字冲突。
- `SELECT`、`FROM`、`WHERE` 等子句通常按固定顺序出现。

## 常见约定

```sql
SELECT id, name
FROM users
WHERE age >= 18
ORDER BY name ASC;
```

这样的多行格式比写成一长行更容易检查条件、排序和列清单。

## 常见错误

- 忘记 `FROM`。
- 把字符串值写成未加引号的文本。
- 在 `UPDATE` 或 `DELETE` 中漏写 `WHERE`。
- 混淆列名、表名和字符串常量。

## 相关链接

- 上一篇：[SQL 简介](introduction.md)
- 下一篇：[SQL SELECT](select.md)
