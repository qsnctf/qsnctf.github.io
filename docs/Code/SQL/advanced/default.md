# SQL DEFAULT

`DEFAULT` 用于为列指定默认值。

## 示例

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  city VARCHAR(100) DEFAULT 'Unknown'
);
```

## 作用

当插入时未提供该列值，数据库会自动使用默认值。

## 注意点

- 默认值不等于验证逻辑。
- 对时间列，很多数据库支持使用当前时间函数作为默认值。

## 相关链接

- 上一篇：[SQL CHECK](check.md)
- 下一篇：[SQL CREATE INDEX](create-index.md)
