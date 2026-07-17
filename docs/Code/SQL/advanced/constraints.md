# SQL 约束

约束用于限制表中数据必须满足的规则，从而保证数据质量。

## 常见约束

- `NOT NULL`
- `UNIQUE`
- `PRIMARY KEY`
- `FOREIGN KEY`
- `CHECK`
- `DEFAULT`

## 示例

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE
);
```

## 为什么重要

- 降低脏数据进入数据库的概率。
- 把部分规则前移到数据库层。
- 让程序错误更早暴露。

## 相关链接

- 上一篇：[SQL CREATE TABLE](create-table.md)
- 下一篇：[SQL NOT NULL](not-null.md)
