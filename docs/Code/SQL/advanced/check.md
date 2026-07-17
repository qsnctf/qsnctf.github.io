# SQL CHECK

`CHECK` 约束要求列值必须满足指定条件。

## 示例

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  age INT CHECK (age >= 0)
);
```

## 作用

- 防止非法范围值进入数据库。
- 让简单业务规则在数据库层也能被验证。

## 相关链接

- 上一篇：[SQL FOREIGN KEY](foreign-key.md)
- 下一篇：[SQL DEFAULT](default.md)
