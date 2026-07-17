# 参考手册

## 概念与用途

本组按对象和功能快速定位 Pandas API。它是教程的补充，不替代当前版本官方 API 文档；调用细节和弃用信息应以项目锁定版本为准。

## 核心入口

- [Pandas 常用函数](../tutorial/common-functions.md)：教程与参考复用同一实质页面。
- [Pandas Input/Output API](input-output-api.md)。
- [Pandas Series API 手册](series-api.md)。
- [Pandas DataFrame API 手册](dataframe-api.md)。
- [Pandas 数组](arrays.md)、[Pandas Index 对象](index-objects.md)。
- [Pandas DateOffset 对象](dateoffset.md)、[Pandas 测验](quiz.md)。

## 可运行示例

```python
import pandas as pd

df = pd.DataFrame({"group": ["A", "A", "B"], "value": [1, 2, 3]})
print(df.groupby("group")["value"].agg(["count", "sum", "mean"]))
```

## 使用与注意事项

先确认对象类型、轴方向、索引语义、空值行为和返回类型，再选择方法。升级 Pandas 时运行测试并检查弃用警告；不要依赖未记录的内部模块。性能敏感操作应优先使用内置向量化方法，并用真实数据基准验证。
