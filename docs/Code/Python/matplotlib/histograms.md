# Matplotlib 直方图

## 概念与用途

直方图把连续数值划分到若干区间（bin），用柱高表示频数或密度，用于观察分布形状、集中趋势、偏态、长尾和异常值。它与柱形图不同：直方图的 x 轴是连续区间，柱形图的 x 轴是离散类别。

## 核心 API

`Axes.hist(x, bins=None, range=None, density=False, cumulative=False, ...)` 返回频数、边界和 Patch 容器：

- `bins` 可为整数、边界数组或 `"auto"`、`"fd"` 等分箱策略。
- `range` 限定参与分箱的数值范围，范围外数据被忽略。
- `density=True` 使柱形总面积为 1，而不是柱高总和为 1。
- `cumulative=True` 绘制累计分布。
- `histtype="step"` 适合叠加比较多个分布。

## 可运行示例

```python
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(7)
control = rng.normal(loc=70, scale=9, size=800)
treatment = rng.normal(loc=75, scale=8, size=800)
bins = np.arange(40, 106, 5)

fig, ax = plt.subplots(figsize=(8, 4.5), layout="constrained")
ax.hist(control, bins=bins, density=True, alpha=0.5, label="Control")
ax.hist(treatment, bins=bins, density=True, alpha=0.5, label="Treatment")
ax.set(xlabel="Score", ylabel="Density", title="Score distributions")
ax.legend()
ax.grid(axis="y", alpha=0.2)
fig.savefig("histograms.png", dpi=150)
plt.show()
```

比较多组数据时必须使用相同的 bin 边界，否则形状差异可能只是分箱差异。

## 常见错误

- 任意选择 bin 数后下结论：不同分箱可能隐藏或制造峰值。尝试多个合理规则，并结合样本量解释。
- 把 `density=True` 的 y 轴写成百分比：密度可以大于 1，其含义是单位 x 区间内的概率密度。
- 忽略 NaN 和无穷值：绘图前显式清洗并记录排除数量。
- 多组实心直方图完全遮挡：使用透明度、阶梯线、小多图，或比较经验累计分布。
- 截断 `range` 却未说明：范围外数据不会显示，可能掩盖异常值。

## 图表设计与工程注意事项

标注样本量和单位，必要时画出中位数参考线。不同样本量比较形状时使用相同 bins 和 density；比较绝对规模时使用频数。数据量很大时可先用 `numpy.histogram()` 聚合，再绘制结果。不要用平滑 KDE 替代原始分布检查，两者对带宽和边界的假设不同。
