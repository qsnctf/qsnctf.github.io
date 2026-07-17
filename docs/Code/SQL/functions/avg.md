# SQL AVG()

`AVG()` 用于计算某列数值的平均值。

## 示例

```sql
SELECT AVG(price) AS avg_price
FROM products;
```

## 配合条件使用

```sql
SELECT AVG(score)
FROM exams
WHERE class_id = 1;
```

## 相关链接

- 上一篇：[SQL 函数](index.md)
- 下一篇：[SQL COUNT()](count.md)
