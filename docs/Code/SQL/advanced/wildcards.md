# SQL 通配符

通配符通常和 `LIKE` 一起使用，用于表达“模糊匹配”。

## 常见通配符

- `%`：匹配任意长度的任意字符
- `_`：匹配单个字符

## 示例

```sql
SELECT *
FROM users
WHERE name LIKE 'A%';
```

匹配以 `A` 开头的名称。

```sql
SELECT *
FROM users
WHERE name LIKE '_ob';
```

可匹配 `Bob`、`Rob` 等三个字符名称。

## 注意点

- 不同数据库还可能支持更丰富的模式语法。
- 复杂文本搜索常不应只靠 `LIKE`，而应考虑全文索引。

## 相关链接

- 上一篇：[SQL LIKE](like.md)
- 下一篇：[SQL IN](in.md)
