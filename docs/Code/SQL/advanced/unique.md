# SQL UNIQUE

`UNIQUE` 约束要求某列或某组列的值不能重复。

## 示例

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE
);
```

## 作用

- 常用于邮箱、用户名、订单号等需要唯一性的字段。
- 与主键不同，`UNIQUE` 不一定作为主标识列。

## 相关链接

- 上一篇：[SQL NOT NULL](not-null.md)
- 下一篇：[SQL PRIMARY KEY](primary-key.md)
