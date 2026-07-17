# SQL FOREIGN KEY

`FOREIGN KEY` 用于建立表与表之间的引用关系。

## 示例

```sql
CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 作用

- 保证 `orders.user_id` 指向存在的 `users.id`。
- 维护引用完整性。

## 注意点

- 删除或更新被引用行时，可能需要配置 `CASCADE`、`RESTRICT` 等行为。

## 相关链接

- 上一篇：[SQL PRIMARY KEY](primary-key.md)
- 下一篇：[SQL CHECK](check.md)
