# Pandas 高级功能

## 概念与适用边界

高级功能用于构建可组合的数据管道：`pipe` 组织步骤，`transform` 保持原粒度，`eval/query` 表达列运算，扩展 dtype 保留空值语义，时间和窗口 API 处理有序数据。

这些能力不能替代数据契约或执行引擎选择。方法链过长会降低可调试性，`eval` 对小数据未必更快，MultiIndex 也不适合作为所有外部接口的默认结构。

## 关键 API 与语义

- `DataFrame.pipe(func, *args, **kwargs)`：把整个对象传入函数，返回值不限于 DataFrame。
- `assign(**kwargs)`：返回新 DataFrame；可调用值接收当前中间结果。
- `groupby.transform(func)`：结果必须可广播回原组，保持原索引和行数。
- `eval(expr, inplace=False)`：列级表达式；可能使用 `numexpr`，不保证总是更快。
- `query(expr)`：返回满足表达式的行；外部变量用 `@name`。
- `option_context(*args)`：在上下文内临时修改显示或行为选项。

## 示例一：可测试的方法链

```python
import pandas as pd

def validate_columns(df):
    required = {"group", "value"}
    if missing := required.difference(df.columns):
        raise ValueError(f"missing columns: {sorted(missing)}")
    return df

df = pd.DataFrame({"group": ["A", "A", "B"], "value": [2, 3, 5]})
result = (df.pipe(validate_columns)
            .assign(total=lambda x: x.groupby("group")["value"].transform("sum"),
                    ratio=lambda x: x["value"].div(x["total"])))
print(result)
```

`transform` 保留原索引，所以新列能安全对齐。若自定义函数重置或打乱索引，后续赋值可能因标签对齐产生空值。

## 示例二：表达式与局部选项

```python
import pandas as pd

df = pd.DataFrame({"price": [10.0, 25.0, 40.0], "qty": [2, 1, 3]})
minimum = 30
calculated = df.eval("revenue = price * qty").query("revenue >= @minimum")
with pd.option_context("display.max_rows", 2, "display.precision", 1):
    print(calculated)
```

## 示例三：按组滚动且恢复索引

```python
import pandas as pd

df = pd.DataFrame({"id": ["A", "A", "B", "B"], "day": [1, 2, 1, 2], "value": [4, 8, 3, 9]})
df = df.sort_values(["id", "day"])
df["rolling_2"] = df.groupby("id")["value"].transform(
    lambda s: s.rolling(2, min_periods=1).mean()
)
print(df)
```

## 常见错误

- 把用户输入直接拼入 `query`/`eval` 会形成表达式注入风险；动态值使用 `@变量`，列名使用白名单。
- `groupby.apply` 可返回任意形状，索引结构容易变化；能用 `agg` 或 `transform` 时优先使用。
- 方法链中静默 `reset_index(drop=True)` 会破坏后续标签对齐。
- 把 MultiIndex 直接输出到 CSV 或 API，常造成层级名称丢失或消费者无法理解。

## 性能与工程注意事项

将业务步骤封装为小型纯函数，并在 `pipe` 边界验证 schema、行数和唯一键。对 `eval`、普通向量化表达式做真实基准，不预设前者更快。复杂流程保留中间指标和异常样本，不要只返回最终表。对外交换前把扩展 dtype、时区和层级索引转换为双方约定的 schema。
