# SQL CREATE TABLE

`CREATE TABLE` 用于定义一张新表的结构。

## 示例

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT,
  city VARCHAR(100)
);
```

## 常见组成

- 列名
- 数据类型
- 是否允许 `NULL`
- 主键、默认值、约束等

## 相关链接

- 上一篇：[SQL CREATE DATABASE](create-database.md)
- 下一篇：[SQL 约束](constraints.md)
