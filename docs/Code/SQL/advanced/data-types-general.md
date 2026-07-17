# SQL 通用数据类型

不同数据库的数据类型名称和细节有差异，但常见类别大体一致。

## 常见分类

- 整数：`INT`、`BIGINT`
- 小数：`DECIMAL`、`NUMERIC`
- 字符串：`CHAR`、`VARCHAR`、`TEXT`
- 日期时间：`DATE`、`TIME`、`TIMESTAMP`
- 布尔：`BOOLEAN` 或兼容类型

## 选择原则

- 能用整数就不要用字符串保存数字。
- 金额通常优先使用定点数类型，如 `DECIMAL`。
- 长度和范围应贴近业务，不要无限放宽。

## 相关链接

- 上一篇：[SQL NULL 函数](null-functions.md)
- 下一篇：[SQL DB 数据类型](data-types-db.md)
