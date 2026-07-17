# SQL INSERT INTO

`INSERT INTO` 用于向表中插入新记录。

## 指定列插入

```sql
INSERT INTO users (name, age, city)
VALUES ('Alice', 20, 'Beijing');
```

## 按表的列顺序插入

```sql
INSERT INTO users
VALUES (1, 'Alice', 20, 'Beijing');
```

这种写法依赖列顺序，通常不如显式列名安全。

## 一次插入多行

```sql
INSERT INTO users (name, age, city)
VALUES
  ('Alice', 20, 'Beijing'),
  ('Bob', 22, 'Shanghai');
```

## 注意点

- 推荐始终写明列名。
- 主键、自增列和默认值列通常不必手工提供。
- 外部输入应通过参数绑定传入。

## 相关链接

- 上一篇：[SQL ORDER BY](order-by.md)
- 下一篇：[SQL UPDATE](update.md)
