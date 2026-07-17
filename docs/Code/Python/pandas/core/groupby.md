# Pandas 分组操作

## 概念与用途

`groupby` 实现 split-apply-combine：按键拆分数据、对各组计算、再合并结果。`agg` 降低粒度，`transform` 保持原行数，`filter` 按整组条件保留或删除组。

## 核心 API

`groupby`、`agg`、`transform`、`filter`、`size`、`count`、`nunique`、`cumcount`、`ngroup`。

## 可运行示例

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [8, 10, 7]})
df["team_mean"] = df.groupby("team")["score"].transform("mean")
summary = df.groupby("team", as_index=False).agg(
    games=("score", "size"), average=("score", "mean")
)
print(df)
print(summary)
```

## 示例二：空键与 size/count

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", None], "score": [8, None, 7]})
summary = df.groupby("team", dropna=False).agg(rows=("score", "size"), values=("score", "count"))
print(summary)
```

`size` 包括值为空的行，`count` 排除目标列空值。`dropna=False` 保留空分组键。

## 示例三：过滤整组

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [8, 10, 7]})
kept = df.groupby("team", group_keys=False).filter(lambda group: len(group) >= 2)
print(kept)
```

`filter` 返回原行的子集并保留原索引；`transform` 返回等长结果，`agg` 则降低粒度。选择错误方法常导致赋值时索引错位。

## 性能与复制语义

分组对象是延迟描述，聚合时生成新结果。内置聚合通常比 Python lambda 和 `apply` 快。高基数键会增加分组开销；只选择必要值列，并明确 `sort`、`observed`、`dropna`，避免默认变化影响结果。

## 注意事项

`size` 统计行数，`count` 排除指定列空值。默认分组可能排除空键，按需要设置 `dropna=False`；类别键关注 `observed`。避免 `groupby.apply` 返回不规则结构，能用 `agg`/`transform` 的表达通常更快、更稳定。分组结果排序也应显式控制。
