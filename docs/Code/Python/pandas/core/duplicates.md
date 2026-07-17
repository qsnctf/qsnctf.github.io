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

## 注意事项

先保留冲突审计表，再执行去重。空值在去重中通常会被视作相同，但业务上“未知主键”未必是同一实体。大表排序去重成本较高，可在数据库按窗口函数处理。完成后断言 `key.is_unique`，不要只比较总行数。
