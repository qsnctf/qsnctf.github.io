# SQL UNION

`UNION` 用于合并两个或多个 `SELECT` 结果集。

## 基本语法

```sql
SELECT city FROM customers
UNION
SELECT city FROM suppliers;
```

## 规则

- 每个 `SELECT` 的列数必须相同。
- 对应列的数据类型应兼容。
- `UNION` 默认去重。

## 保留重复行

```sql
SELECT city FROM customers
UNION ALL
SELECT city FROM suppliers;
```

## 相关链接

- 上一篇：[SQL FULL JOIN](full-join.md)
- 下一篇：[SQL SELECT INTO](select-into.md)
