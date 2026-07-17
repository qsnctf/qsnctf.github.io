# SQL ORDER BY

`ORDER BY` 用于对查询结果排序。

## 基本语法

```sql
SELECT column1, column2
FROM table_name
ORDER BY column_name ASC;
```

`ASC` 表示升序，`DESC` 表示降序。

## 示例

```sql
SELECT *
FROM users
ORDER BY age DESC;
```

## 多列排序

```sql
SELECT *
FROM users
ORDER BY city ASC, age DESC;
```

先按城市升序；城市相同时，再按年龄降序。

## 注意点

- 没有 `ORDER BY` 时，结果顺序通常不应被假定为固定。
- 分页查询通常必须结合稳定排序键。

## 相关链接

- 上一篇：[SQL AND & OR](and-or.md)
- 下一篇：[SQL INSERT INTO](insert-into.md)
