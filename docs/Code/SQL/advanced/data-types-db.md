# SQL DB 数据类型

虽然 SQL 有通用类型概念，但具体数据库往往有自己的实现细节。

## 常见差异

- MySQL 中 `VARCHAR(255)` 很常见。
- PostgreSQL 提供 `TEXT`、数组、`JSONB` 等扩展能力。
- SQL Server 有 `NVARCHAR`、`DATETIME2` 等类型。
- SQLite 采用更灵活的类型亲和规则。

## 实践建议

- 以目标数据库官方文档为准。
- 迁移数据库时，优先检查日期、布尔、自增和文本类型差异。
- 不要只看名称相同就假定语义完全一致。

## 相关链接

- 上一篇：[SQL 通用数据类型](data-types-general.md)
- 继续学习：[SQL 函数](../functions/index.md)
