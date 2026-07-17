# SQL BETWEEN

`BETWEEN` 用于匹配某个范围内的值，通常包含边界。

## 示例

```sql
SELECT *
FROM products
WHERE price BETWEEN 100 AND 300;
```

## 日期范围

```sql
SELECT *
FROM orders
WHERE order_date BETWEEN '2026-01-01' AND '2026-01-31';
```

## 注意点

- `BETWEEN a AND b` 通常等价于 `>= a AND <= b`。
- 对日期时间字段要注意边界是否包含一天内的具体时刻。

## 相关链接

- 上一篇：[SQL IN](in.md)
- 下一篇：[SQL 别名](aliases.md)
