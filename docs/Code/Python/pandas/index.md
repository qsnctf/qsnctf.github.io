# Pandas 教程

Pandas 是面向表格和时间序列数据的 Python 库。本教程按“基础入门、数据读写、分析能力、数据处理核心、API 参考”组织；示例默认使用 `import pandas as pd`。

## 版本基线

本文档最低兼容 **Pandas 2.0**，主要按 Pandas 2.x 的公开 API 编写。仅 Pandas 2.1 及以上可用的功能会显式标注，例如 `DataFrame.map`；Pandas 2.0 应使用对应替代写法。建议运行以下代码确认环境：

```python
import pandas as pd

major, minor = map(int, pd.__version__.split(".")[:2])
if (major, minor) < (2, 0):
    raise RuntimeError("本教程要求 pandas >= 2.0")
print("pandas version:", pd.__version__)
```

Pandas 未来版本可能调整默认参数或移除弃用 API。项目应固定依赖版本、把弃用警告纳入测试，并以所用版本的官方文档为最终依据。

## 概念与用途

Pandas 用 `Series` 和 `DataFrame` 表达带标签数据，适合表格读写、清洗、转换、统计和时间序列分析。学习时应同时理解数据类型、索引对齐和空值语义，而不只是记忆函数名。

## 核心 API

核心对象是 `pd.Series`、`pd.DataFrame` 和 `pd.Index`；高频操作包括 `read_*`、`loc`、`groupby`、`merge`、`pivot_table`、`rolling` 与 `to_*`。各分组页面会进一步说明参数、返回类型和适用边界。

## 可运行示例

```python
import pandas as pd

sales = pd.DataFrame({"team": ["A", "A", "B"], "amount": [10, 15, 12]})
summary = sales.groupby("team", as_index=False).agg(total=("amount", "sum"))
print(summary)
```

## 学习路线

1. 从 [pandas 简介](tutorial/introduction.md)、[安装](tutorial/installation.md)、[Series](tutorial/series.md) 和 [DataFrame](tutorial/dataframe.md) 掌握对象模型。
2. 使用 [数据读写](io/index.md) 选择格式并建立可靠的导入、导出流程。
3. 进入 [数据处理核心](core/index.md)，学习选取、清洗、合并、重塑、分组和窗口计算。
4. 结合相关性、可视化、性能与股票案例完成分析，再用 [参考手册](reference/index.md) 快速查找 API。

## 基础与分析

| 主题 | 页面 |
| --- | --- |
| pandas 简介 | [认识 Pandas](tutorial/introduction.md) |
| Pandas 安装 | [安装与环境验证](tutorial/installation.md) |
| Pandas Series | [一维带标签数据](tutorial/series.md) |
| Pandas DataFrame | [二维表格对象](tutorial/dataframe.md) |
| Pandas 数据清洗 | [清洗工作流](tutorial/data-cleaning.md) |
| Pandas 常用函数 | [常用函数速查](tutorial/common-functions.md) |
| Pandas 相关性分析 | [相关系数与解释](tutorial/correlation-analysis.md) |
| Pandas 数据排序与聚合 | [排序和汇总](tutorial/sorting-and-aggregation.md) |
| Pandas 数据可视化 | [内置绘图](tutorial/data-visualization.md) |
| Pandas 高级功能 | [进阶能力](tutorial/advanced-features.md) |
| Pandas 性能优化 | [内存与速度](tutorial/performance-optimization.md) |
| Pandas 股票数据分析 | [行情分析案例](tutorial/stock-analysis.md) |
| Pandas Index 详解 | [索引语义](tutorial/index-guide.md) |
| Pandas 多层索引 | [MultiIndex](tutorial/multi-index.md) |
| Pandas 数据类型 | [dtype 与转换](tutorial/data-types.md) |
| Pandas 类别类型 | [Categorical](tutorial/categorical-data.md) |

## 分组入口

- [数据读写](io/index.md)：CSV、Excel、JSON、SQL、HTML、Parquet、Feather 与导出。
- [数据处理核心](core/index.md)：选择、过滤、缺失值、字符串、时间序列、合并、重塑、分组和窗口。
- [参考手册](reference/index.md)：I/O、Series、DataFrame、数组、Index、DateOffset 与测验。

## 常见错误与工程注意事项

示例尽量在内存中构造数据；涉及文件的示例会创建当前目录下的临时演示文件。生产项目应固定 Pandas 和可选 I/O 引擎版本，在写出前明确索引、时区、空值和数据类型约定，并为关键转换增加行数、主键唯一性与取值范围校验。
