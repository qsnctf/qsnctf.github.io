# SQL SELECT DISTINCT

`DISTINCT` 用于去除重复值，只保留唯一结果。

## 基本语法

```sql
SELECT DISTINCT column1
FROM table_name;
```

## 示例

```sql
SELECT DISTINCT city
FROM users;
```

如果很多用户来自同一城市，结果中每个城市只出现一次。

## 多列去重

```sql
SELECT DISTINCT city, age
FROM users;
```

这里去重依据是 `(city, age)` 这个组合，而不是单独某一列。

## 注意点

- `DISTINCT` 针对整行选出的列组合去重。
- 去重通常需要额外代价，不应滥用。
- 如果只是想统计唯一值数量，常结合 `COUNT(DISTINCT column)`。

## 相关链接

- 上一篇：[SQL SELECT](select.md)
- 下一篇：[SQL WHERE](where.md)
