# SQL AND & OR

`AND` 和 `OR` 用于组合多个条件。

## `AND`

所有条件都为真时，整条条件才成立。

```sql
SELECT *
FROM users
WHERE city = 'Beijing' AND age >= 18;
```

## `OR`

只要有一个条件为真，整条条件就成立。

```sql
SELECT *
FROM users
WHERE city = 'Beijing' OR city = 'Shanghai';
```

## 组合使用

```sql
SELECT *
FROM users
WHERE (city = 'Beijing' OR city = 'Shanghai')
  AND age >= 18;
```

## 注意点

- 使用括号明确优先级。
- 不要依赖自己记忆中的默认优先级推断复杂条件。
- 复杂条件应拆成多行提高可读性。

## 相关链接

- 上一篇：[SQL WHERE](where.md)
- 下一篇：[SQL ORDER BY](order-by.md)
