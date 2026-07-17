# SQL 视图

视图是基于查询结果定义出的“虚拟表”。

## 创建视图

```sql
CREATE VIEW active_users AS
SELECT id, name, city
FROM users
WHERE active = 1;
```

## 查询视图

```sql
SELECT *
FROM active_users;
```

## 用途

- 简化复杂查询。
- 对外暴露稳定接口。
- 限制用户只看到部分列或部分行。

## 相关链接

- 上一篇：[SQL Auto Increment](auto-increment.md)
- 下一篇：[SQL 日期](dates.md)
