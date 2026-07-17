# SQL ALTER

`ALTER` 用于修改已有数据库对象的结构，最常见的是修改表。

## 示例

添加列：

```sql
ALTER TABLE users
ADD email VARCHAR(255);
```

删除列：

```sql
ALTER TABLE users
DROP COLUMN email;
```

## 注意点

- 不同数据库对 `ALTER` 的支持细节差异较大。
- 生产环境修改结构前要评估锁、兼容性和数据迁移成本。

## 相关链接

- 上一篇：[SQL DROP](drop.md)
- 下一篇：[SQL Auto Increment](auto-increment.md)
