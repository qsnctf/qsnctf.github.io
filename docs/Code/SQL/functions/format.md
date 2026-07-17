# SQL FORMAT()

`FORMAT()` 用于按指定格式显示值，常见于日期、数字等场景。

## 示例

```sql
SELECT FORMAT(order_date, 'yyyy-MM-dd')
FROM orders;
```

## 注意点

- 格式化函数的名字、参数和性能特征在不同数据库之间差异很大。
- 报表展示层的格式化，很多时候更适合在应用层完成。

## 相关链接

- 上一篇：[SQL NOW()](now.md)
- 返回：[SQL 函数](index.md)
