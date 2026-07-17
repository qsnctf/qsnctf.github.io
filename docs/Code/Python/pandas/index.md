# Pandas 教程

Pandas 是 Python 数据分析核心库，基于 Series 和 DataFrame 提供结构化数据读写、清洗、聚合、时间序列和可视化能力。

## pandas 简介

Pandas 适合处理表格型数据。它提供类似电子表格和 SQL 的操作接口，也能与 NumPy、Matplotlib、SQL 数据库结合。

## Pandas 安装

```bash
python -m pip install pandas
```

常用导入约定：

```python
import pandas as pd
```

## Pandas Series

Series 是一维带索引数组。

```python
s = pd.Series([10, 20, 30], index=["a", "b", "c"])
```

## Pandas DataFrame

DataFrame 是二维表格数据结构，每列可以有不同 dtype。

```python
df = pd.DataFrame({"name": ["a", "b"], "score": [90, 80]})
```

## 数据读写

Pandas 支持 CSV、Excel、JSON、SQL、HTML、Parquet、Feather 等格式。选择格式时要关注体积、速度、类型保真和跨语言支持。

## Pandas 数据读写

统一模式是 `read_*` 读取，`to_*` 导出。

## Pandas CSV

```python
df = pd.read_csv("data.csv")
df.to_csv("out.csv", index=False)
```

注意编码、分隔符、缺失值表示和日期解析。

## Pandas Excel

```python
df = pd.read_excel("data.xlsx", sheet_name="Sheet1")
df.to_excel("out.xlsx", index=False)
```

Excel 适合人工查看，不适合超大规模数据交换。

## Pandas JSON

```python
df = pd.read_json("data.json")
df.to_json("out.json", force_ascii=False)
```

嵌套 JSON 可能需要 `json_normalize` 展开。

## Pandas 读取 SQL

```python
df = pd.read_sql("select * from users", conn)
```

真实项目中应使用参数化查询和受控连接。

## Pandas 读取 HTML

`read_html` 可以从 HTML 表格中读取数据：

```python
tables = pd.read_html("page.html")
```

## Pandas Parquet / Feather

Parquet 和 Feather 适合高效列式存储，通常比 CSV 更快且更保留类型信息。

## Pandas 数据导出

常见导出包括 `to_csv`、`to_excel`、`to_json`、`to_parquet`、`to_sql`。

## Pandas 数据清洗

清洗包括处理缺失值、重复值、异常值、类型转换、字段拆分和标准化。

## Pandas 常用函数

常用函数包括 `head`、`tail`、`info`、`describe`、`value_counts`、`sort_values`、`groupby`、`merge`。

## Pandas 相关性分析

```python
df.corr(numeric_only=True)
```

相关性不等于因果关系，分析时要结合业务背景。

## Pandas 数据排序与聚合

```python
df.sort_values("score")
df.groupby("class")["score"].mean()
```

## Pandas 数据可视化

DataFrame 内置 `plot` 基于 Matplotlib：

```python
df.plot(kind="bar")
```

## Pandas 高级功能

高级能力包括多层索引、窗口函数、时间序列、类别类型、向量化字符串和分组变换。

## Pandas 性能优化

优化方向：减少 Python 循环、使用向量化、选择合适 dtype、分块读取、使用 Parquet、避免不必要副本。

## Pandas 股票数据分析

股票数据常涉及时间索引、复权、收益率、移动平均、回撤和可视化。重点是数据来源、缺失交易日和前视偏差。

## Pandas Index 详解

Index 是行标签。它影响对齐、选择、连接和重采样行为。

## Pandas 多层索引

MultiIndex 支持多维标签，适合分组统计和层级数据。

## Pandas 数据类型

常见 dtype 包括整数、浮点、布尔、字符串、日期时间、类别类型。

## Pandas 类别类型

`category` 适合重复值较多的离散字段，可降低内存并加快部分操作。

## 数据处理核心

数据处理核心流程通常是读取、检查、清洗、转换、聚合、分析和导出。

## Pandas 数据选取

`loc` 按标签选择，`iloc` 按位置选择。

```python
df.loc[df["score"] > 80, ["name", "score"]]
```

## Pandas 过滤与条件查询

布尔条件可组合使用 `&`、`|`、`~`，每个条件要加括号。

## Pandas 缺失值处理

```python
df.isna().sum()
df.dropna()
df.fillna(0)
```

## Pandas 重复数据处理

```python
df.duplicated()
df.drop_duplicates()
```

## Pandas 字符串操作

`str` 访问器支持向量化字符串处理：

```python
df["name"].str.lower()
```

## Pandas 日期与时间

```python
df["time"] = pd.to_datetime(df["time"])
```

## Pandas 时间序列分析

时间序列常用重采样、滚动窗口和日期索引。

## Pandas apply / map / applymap

`map` 常用于 Series 映射，`apply` 可作用于 Series/DataFrame，`applymap` 在新版中逐步被 `DataFrame.map` 替代。

## Pandas 数据合并

`merge` 类似 SQL join：

```python
pd.merge(left, right, on="id", how="left")
```

## Pandas 数据拼接

`concat` 沿行或列拼接对象。

## Pandas 数据重塑

常用 `pivot`、`melt`、`stack`、`unstack`。

## Pandas 分组操作

`groupby` 支持 split-apply-combine 模式。

## Pandas 窗口函数

窗口函数包括 `rolling`、`expanding`、`ewm`，常用于移动平均和累计统计。

## 参考手册

参考手册用于快速定位 API。正式使用时应以当前版本官方文档为准。

## Pandas Input/Output API

I/O API 包括 `read_csv`、`read_excel`、`read_json`、`read_sql`、`read_parquet`、`read_html` 等。

## Pandas Series API 手册

Series API 包括索引、统计、字符串、日期、缺失值和转换操作。

## Pandas DataFrame API 手册

DataFrame API 包括选择、赋值、聚合、合并、重塑、绘图和导出。

## Pandas 数组

Pandas 支持扩展数组，用于 nullable integer、string、category、datetime 等类型。

## Pandas Index 对象

Index 对象不可变，支持对齐、集合操作和查找。

## Pandas DateOffset 对象

DateOffset 表示日期偏移规则，用于时间序列移动和频率处理。

## Pandas 测验

自检问题：`loc` 与 `iloc` 的区别是什么？`merge` 与 `concat` 适用场景有什么不同？为什么 CSV 不如 Parquet 保留类型？
