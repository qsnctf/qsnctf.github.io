# Pandas 相关性分析

## 概念与用途

相关性衡量变量共同变化程度。Pearson 适合线性关系，Spearman 基于秩、适合单调关系，Kendall 对小样本和秩关系较稳健；相关不代表因果。

## 核心 API

- `DataFrame.corr(method="pearson", min_periods=...)`：相关矩阵。
- `Series.corr(other, method=...)`：两列相关性。
- `DataFrame.cov`：协方差；`corrwith`：与另一个对象逐列相关。

## 可运行示例

```python
import pandas as pd

df = pd.DataFrame({"hours": [1, 2, 3, 4], "score": [52, 60, 71, 83], "breaks": [4, 3, 2, 1]})
print(df.corr(method="pearson", numeric_only=True).round(2))
print(df["hours"].corr(df["score"], method="spearman"))
```

## 示例二：样本量与滚动相关

```python
import pandas as pd

df = pd.DataFrame({"x": [1, 2, 3, 4, 5], "y": [2, None, 5, 8, 10]})
paired_n = df[["x", "y"]].dropna().shape[0]
rolling = df["x"].rolling(3, min_periods=3).corr(df["y"])
print("paired observations:", paired_n)
print(rolling)
```

`Series.corr` 返回标量；`rolling().corr` 返回与原索引对齐的 Series，窗口样本不足或含空值时产生 `NaN`。报告系数时应同时报告有效样本数。

## 适用与性能边界

分类变量、非线性关系和共同时间趋势不能只靠 Pearson 矩阵解释。高维相关矩阵需要近似平方级内存，应先筛选数值列或分块分析；大规模多重检验还需控制假阳性。

## 注意事项

空值会按列对成对排除，不同单元格可能使用不同样本数；用 `min_periods` 并报告样本量。离群值会显著影响 Pearson，分类编码的数字不一定可直接计算相关。多重比较、共同趋势和时间自相关会制造伪相关，结论应结合可视化、领域知识和统计检验。
