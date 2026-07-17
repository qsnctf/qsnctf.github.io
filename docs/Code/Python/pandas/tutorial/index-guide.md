# Pandas Index 详解

## 概念与适用边界

`Index` 是行或列轴的不可变标签集合，决定选择、算术对齐、连接和重采样语义。它可以重复，但实体主键型索引通常应唯一；普通交换表也可把主键保留为列。

索引不是自动数据库主键，不提供外键、事务或持久化约束。默认 `RangeIndex` 只代表当前位置，不应被当作跨文件稳定标识。

## 关键 API 与返回

- `set_index(keys, drop=True, append=False, verify_integrity=False) -> DataFrame`。
- `reset_index(level=None, drop=False, names=None) -> DataFrame`。
- `reindex(labels=None, index=None, columns=None, method=None, fill_value=...) -> DataFrame/Series`。
- `sort_index(axis=0, level=None, ascending=True, kind="quicksort")`。
- `Index.is_unique`、`has_duplicates`、`duplicated`：唯一性检查。
- `Index.get_indexer(target)`：返回整数位置，未找到为 `-1`。
- `union`、`intersection`、`difference`：集合式标签运算。

## 示例一：算术按索引对齐

```python
import pandas as pd

price = pd.Series({"A": 10, "B": 20})
qty = pd.Series({"B": 3, "C": 4})
print(price * qty)
print(price.mul(qty, fill_value=0))
```

结果索引取两侧标签并集。普通乘法只有共同标签 `B` 有值；`fill_value` 只补单侧缺失，不会改变标签集合。

## 示例二：重索引与完整维度

```python
import pandas as pd

sales = pd.DataFrame({"day": ["Mon", "Wed"], "amount": [10, 30]}).set_index("day")
calendar = pd.Index(["Mon", "Tue", "Wed"], name="day")
complete = sales.reindex(calendar, fill_value=0)
print(complete)
assert complete.index.equals(calendar)
```

`reindex` 按标签重排并创建缺失标签，不是按位置截取。对重复索引执行某些重索引会失败，应先解决重复含义。

## 示例三：验证主键

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 1, 2], "value": [8, 9, 7]})
duplicates = df[df["id"].duplicated(keep=False)]
print(duplicates)
if not df["id"].is_unique:
    print("id cannot safely become a unique index")
```

## 复制与性能语义

`set_index`、`reset_index` 和 `reindex` 通常返回新对象；是否共享底层块取决于操作与 Copy-on-Write，不能依赖视图行为。排序后的索引可提升范围切片和 MultiIndex 操作的可预测性，但频繁来回移动键会增加复制和认知成本。

## 常见错误与工程注意事项

- `loc` 标签切片通常包含右端，`iloc` 位置切片不包含右端。
- 重复标签使 `df.loc[key]` 的返回形状不稳定，可能是 Series 或 DataFrame。
- `get_indexer` 的 `-1` 不能直接用于 `iloc`，否则会错误选中最后一行。
- 合并前明确键来自列还是索引，并检查两侧 dtype、空值和重复键。
- 时间索引应排序、统一时区，并区分业务日历与自然日。
- CSV 默认不会保留索引语义；导出和回读时明确 `index`/`index_col`。
