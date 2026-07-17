# Pandas 重复数据处理

## 概念与用途

重复可指整行相同，也可指业务主键冲突。去重前要定义判定列、保留规则以及排序优先级，否则 `keep="first"` 可能只是偶然保留文件中的第一条。

## 核心 API

`duplicated`、`drop_duplicates`、`Index.duplicated`、`value_counts`、`groupby.size`。

## 可运行示例

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 1, 2], "updated": pd.to_datetime(["2026-01-01", "2026-01-03", "2026-01-02"]), "value": [8, 9, 7]})
conflicts = df[df.duplicated("id", keep=False)].sort_values(["id", "updated"])
latest = df.sort_values("updated").drop_duplicates("id", keep="last")
print(conflicts)
print(latest)
```

## 示例二：复合键冲突和聚合解决

```python
import pandas as pd

df = pd.DataFrame({"order": [1, 1, 1], "item": ["A", "A", "B"], "qty": [1, 2, 1]})
key = ["order", "item"]
conflicts = df[df.duplicated(key, keep=False)]
resolved = df.groupby(key, as_index=False, dropna=False).agg(qty=("qty", "sum"))
print(conflicts)
print(resolved)
assert not resolved.duplicated(key).any()
```

此处重复事实可合理求和；若记录是状态快照，则可能应按时间保留最新项。解决规则必须匹配数据粒度。

## 返回、空键与复制

`duplicated` 返回与原索引对齐的布尔 Series，`drop_duplicates` 返回新 DataFrame。默认索引通常保留，可用 `ignore_index=True` 重建位置索引。空键会参与重复判断，但多个“未知”不一定是同一实体，应先隔离或补充识别信息。

## 注意事项

先保留冲突审计表，再执行去重。空值在去重中通常会被视作相同，但业务上“未知主键”未必是同一实体。大表排序去重成本较高，可在数据库按窗口函数处理。完成后断言 `key.is_unique`，不要只比较总行数。
