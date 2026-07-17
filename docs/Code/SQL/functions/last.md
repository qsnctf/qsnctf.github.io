# SQL LAST()

`LAST()` 用于返回结果集中的最后一项，但也不是所有数据库都支持的标准函数。

## 更常见替代

通常通过排序后取一条实现：

```sql
SELECT name
FROM users
ORDER BY id DESC
LIMIT 1;
```

## 注意点

- “最后一条”必须依赖明确排序规则。
- 没有排序时，不应假定表有天然顺序。

## 相关链接

- 上一篇：[SQL FIRST()](first.md)
- 下一篇：[SQL MAX()](max.md)
