# Matplotlib 散点图

## 概念与用途

散点图用点的位置表达两个数值变量的关系，可用于观察相关趋势、聚类、异常值和异方差。颜色 `c` 与面积 `s` 还能编码额外变量，但编码过多会降低可读性。散点图展示关联而非因果。

## 核心 API

`Axes.scatter(x, y, s=None, c=None, marker=None, cmap=None, norm=None, alpha=None)` 返回 `PathCollection`：

- `s` 表示标记面积，单位为 point 的平方，不是半径。
- `c` 可传单一颜色、数值数组或颜色数组。
- `cmap` 和 `norm` 将数值映射为颜色。
- `edgecolors`、`linewidths` 控制点边缘。
- `fig.colorbar(collection, ax=ax)` 为连续颜色编码添加色标。

## 可运行示例

```python
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(42)
x = rng.normal(size=200)
y = 0.65 * x + rng.normal(scale=0.7, size=200)
score = np.hypot(x, y)
size = 20 + 45 * rng.random(200)

fig, ax = plt.subplots(figsize=(7, 5), layout="constrained")
points = ax.scatter(
    x, y, s=size, c=score, cmap="viridis", alpha=0.72,
    edgecolors="white", linewidths=0.4
)
ax.axhline(0, color="0.5", linewidth=0.8)
ax.axvline(0, color="0.5", linewidth=0.8)
ax.set(xlabel="Feature A", ylabel="Feature B", title="Feature relationship")
fig.colorbar(points, ax=ax, label="Distance from origin")
fig.savefig("scatter-plots.png", dpi=150)
plt.show()
```

## 常见错误

- x、y、颜色或尺寸数组长度不一致：所有逐点数组必须能对应到同一批观测。
- `c=(1, 0, 0)` 被解释为数值序列：单一 RGB 色更稳妥地写成 `color=(1, 0, 0)`。
- 点太密导致过度绘制：降低 `alpha`、缩小点、抽样，或改用 `hexbin()` 和二维直方图。
- 面积直接映射原始值：面积感知并非线性，极端值会吞没其他点。先归一化并设置合理上下限。
- 使用彩虹色图：视觉亮度不均且不利于色觉差异。连续值优先使用感知均匀色图。

## 图表设计与工程注意事项

连续颜色必须配色标，类别颜色应配图例。对于数百万点，逐点 SVG 文件会巨大，考虑栅格化集合、Hexbin 或聚合。异常点标注前应有业务判定规则，避免只凭视觉删除数据。透明度叠加依赖绘制顺序，比较多个群组时可分层绘制并固定 `zorder`。
