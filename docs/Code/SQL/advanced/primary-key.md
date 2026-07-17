# SQL PRIMARY KEY

`PRIMARY KEY` 用于唯一标识表中的每一行。

## 示例

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
```

## 特点

- 必须唯一。
- 通常不能为 `NULL`。
- 一张表通常只有一个主键约束，但可以是组合主键。

## 相关链接

- 上一篇：[SQL UNIQUE](unique.md)
- 下一篇：[SQL FOREIGN KEY](foreign-key.md)
