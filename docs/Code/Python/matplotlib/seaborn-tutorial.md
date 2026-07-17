# Seaborn 教程

## 概念与用途

Seaborn 建立在 Matplotlib 之上，面向 pandas DataFrame 提供统计语义接口。它可以根据列名映射 x、y、颜色、样式和分面，并内置更适合统计图表的默认主题。Seaborn 负责高层统计绘图，最终的 Figure 和 Axes 仍可使用 Matplotlib API 调整。

## 安装与核心 API

```bash
python -m pip install seaborn pandas matplotlib
```

| API | 用途 |
| --- | --- |
| `sns.set_theme()` | 设置 Seaborn 主题和上下文 |
| `sns.scatterplot()` / `lineplot()` | 关系图 |
| `sns.histplot()` / `kdeplot()` | 分布图 |
| `sns.boxplot()` / `violinplot()` | 分类分布比较 |
| `sns.barplot()` / `pointplot()` | 估计量与不确定性 |
| `sns.heatmap()` | 矩阵热力图 |
| `sns.relplot()` / `displot()` / `catplot()` | Figure 级分面接口 |
| `sns.move_legend()` | 调整图例位置 |

Axes 级函数接收 `ax=` 并画到现有子图；Figure 级函数自己创建 `FacetGrid`，不要再给它传 `ax=`。

## 可运行示例

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

df = pd.DataFrame({
    "team": ["A"] * 6 + ["B"] * 6,
    "week": list(range(1, 7)) * 2,
    "score": [62, 65, 67, 70, 72, 75, 60, 63, 66, 68, 73, 77],
})

sns.set_theme(style="whitegrid", context="notebook")
fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
sns.lineplot(
    data=df, x="week", y="score", hue="team",
    marker="o", errorbar=None, ax=ax
)
ax.set(xlabel="Week", ylabel="Score", title="Weekly score by team")
sns.move_legend(ax, "upper left", title="Team")
fig.savefig("seaborn-tutorial.png", dpi=150)
plt.show()
```

## 统计语义

许多 Seaborn 函数会聚合重复的 x 值并绘制误差区间。例如 `lineplot()` 默认对同一 x 下的 y 求估计量。若每行已经是要直接连接的观测，应确认分组语义，必要时设置 `estimator=None` 或使用 Matplotlib `plot()`。不同 Seaborn 版本对 `errorbar` 等参数支持可能不同，应按锁定版本查文档。

## 常见错误

- DataFrame 列名拼错：Seaborn 会报告无法解释变量。绘图前检查 `df.columns` 和 dtype。
- 把宽表和长表语义混淆：复杂 hue、style、col 映射通常需要用 `melt()` 转成长表。
- 把 `barplot()` 当作原始柱形图：它默认展示估计量及误差，不是逐行数据。已有聚合值时应明确统计行为。
- Figure 级函数与 `plt.subplots()` 混用：`relplot()` 等会创建自己的 Figure，应通过返回对象调整。
- 类别颜色在多张图中变化：显式传入固定 `palette` 字典，保持语义一致。

## 图表设计与工程注意事项

置信区间必须说明估计方法和样本单位，重复测量数据尤其要避免把相关观测当成独立样本。全局 `set_theme()` 会影响后续 Matplotlib 图，库代码可使用上下文管理器限制作用域。大数据上 KDE、pairplot 和 bootstrap 可能很慢，应抽样或调整统计参数。导出仍使用 `fig.savefig()`，并在绘制完成后通过 Matplotlib 设置标题、范围和格式器。
