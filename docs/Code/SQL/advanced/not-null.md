# SQL NOT NULL

`NOT NULL` 表示这一列必须有值，不能为 `NULL`。

## 示例

```sql
CREATE TABLE users (
  id INT,
  name VARCHAR(100) NOT NULL
);
```

## 含义

插入或更新时，如果不给 `name` 提供有效值，数据库会拒绝该操作。

## 相关链接

- 上一篇：[SQL 约束](constraints.md)
- 下一篇：[SQL UNIQUE](unique.md)
