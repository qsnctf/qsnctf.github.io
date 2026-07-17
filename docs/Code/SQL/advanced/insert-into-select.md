# SQL INSERT INTO SELECT

`INSERT INTO ... SELECT` 用于把一个查询结果插入到已有表中。

## 示例

```sql
INSERT INTO customers_backup (id, name, city)
SELECT id, name, city
FROM customers;
```

## 条件插入

```sql
INSERT INTO vip_customers (id, name)
SELECT id, name
FROM customers
WHERE level = 'VIP';
```

## 注意点

- 目标列和查询列数量、顺序必须对应。
- 类型应兼容。

## 相关链接

- 上一篇：[SQL SELECT INTO](select-into.md)
- 下一篇：[SQL CREATE DATABASE](create-database.md)
