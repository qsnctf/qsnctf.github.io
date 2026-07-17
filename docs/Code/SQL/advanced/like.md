# SQL LIKE

`LIKE` 用于按模式匹配字符串，常和通配符一起使用。

## 基本语法

```sql
SELECT *
FROM users
WHERE name LIKE 'A%';
```

## 示例

- `'A%'`：以 `A` 开头
- `'%son'`：以 `son` 结尾
- `'%ann%'`：包含 `ann`

## 注意点

- 模式匹配是否区分大小写，取决于数据库和排序规则。
- 前导 `%` 通常不利于普通索引使用。

## 相关链接

- 上一篇：[SQL SELECT TOP](select-top.md)
- 下一篇：[SQL 通配符](wildcards.md)
