# SQL CREATE INDEX

索引用于加快查询速度，但也会增加写入和维护成本。

## 示例

```sql
CREATE INDEX idx_users_name
ON users(name);
```

## 唯一索引

```sql
CREATE UNIQUE INDEX idx_users_email
ON users(email);
```

## 注意点

- 不要给每一列都建索引。
- 高频过滤、排序或连接列更适合建索引。
- 索引会占用空间并影响插入、更新、删除性能。

## 相关链接

- 上一篇：[SQL DEFAULT](default.md)
- 下一篇：[SQL DROP](drop.md)
