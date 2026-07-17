# Pandas apply / map / applymap

## 概念与适用边界

这些 API 调用 Python 函数完成难以直接向量化的转换。`Series.map` 面向单值映射，`Series.apply` 面向 Series 元素，`DataFrame.apply` 按行或列处理，`DataFrame.map` 对每个单元格处理。

**`DataFrame.map` 需要 Pandas 2.1+。** 在 Pandas 2.0 中使用 `DataFrame.applymap`；`applymap` 自 2.1 起被弃用，新代码应按最低支持版本选择兼容写法。

## 关键 API、参数与返回

- `Series.map(arg, na_action=None) -> Series`：`arg` 可为函数、字典或 Series。
- `Series.apply(func, convert_dtype=..., args=(), **kwargs)`：标量函数通常返回 Series，返回 Series 的函数可能展开为 DataFrame。
- `DataFrame.apply(func, axis=0, raw=False, result_type=None, args=(), **kwargs)`。
- `DataFrame.map(func, na_action=None, **kwargs) -> DataFrame`，仅 Pandas 2.1+。
- `DataFrame.applymap(func, na_action=None, **kwargs) -> DataFrame`，Pandas 2.0 替代方案。

`axis=0` 把每列作为 Series 传入，`axis=1` 把每行作为 Series 传入。`raw=True` 可传 NumPy 数组，但会失去标签；返回形状可由 `result_type="expand"/"reduce"/"broadcast"` 控制。

## 示例一：字典映射并审计未命中值

```python
import pandas as pd

codes = pd.Series([1, 2, 9, None], dtype="Int64")
labels = codes.map({1: "new", 2: "paid"})
unmapped = codes[codes.notna() & labels.isna()]
print(labels)
print("unmapped:", unmapped.tolist())
```

字典未命中会得到缺失值。若字典实现 `__missing__`，可以提供默认值，但生产流程仍应监控未知编码。

## 示例二：DataFrame.apply 的行返回展开

```python
import pandas as pd

df = pd.DataFrame({"price": [10, 20], "qty": [2, 3]})
features = df.apply(
    lambda row: [row["price"] * row["qty"], row["qty"] >= 3],
    axis=1,
    result_type="expand",
)
features.columns = ["revenue", "bulk"]
print(features)
```

此例说明返回形状控制，不代表推荐用逐行 `apply` 计算乘法；实际应使用向量化 `df["price"] * df["qty"]`。

## 示例三：2.0/2.1 兼容的逐元素转换

```python
import pandas as pd

df = pd.DataFrame({"a": [1.2, None], "b": [3.4, 5.6]})
formatter = lambda value: "NA" if pd.isna(value) else f"{value:.1f}"

version = tuple(map(int, pd.__version__.split(".")[:2]))
formatted = df.map(formatter) if version >= (2, 1) else df.applymap(formatter)
print(formatted)
```

## 索引、空值与复制语义

这些方法通常保留输入索引，但函数返回 Series/DataFrame 时可能形成额外列或层级。`na_action="ignore"` 可跳过空值，但并非所有方法和版本都以相同方式支持。结果通常是新对象；不要依赖函数内部修改传入 Series 来改变原 DataFrame。

## 常见错误与性能/工程注意事项

- `axis=1` 为每行构造 Series，开销很高；先寻找算术、`str`、`dt`、`where`、`map` 字典、连接或 `transform`。
- 函数返回类型不一致会导致 `object` dtype 或难以预测的展开结果。
- 捕获所有异常并返回空值会隐藏坏数据，应记录失败样本和数量。
- 用户提供的函数等价于执行代码，不能在不可信边界开放任意 UDF。
- 若必须迭代且不需要返回对齐结果，`itertuples` 通常比逐行 `apply`/`iterrows` 更轻量。
