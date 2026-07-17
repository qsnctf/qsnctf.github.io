# Matplotlib 绘制多图

## 概念与用途

多图布局用于并排比较指标、展示同一数据的不同视角，或组成完整分析面板。Matplotlib 将整张画布称为 Figure，将每个绘图区称为 Axes。`plt.subplots()` 能一次建立规则网格，`subplot_mosaic()` 适合用字符串描述不等大小的布局。

## 核心 API

| API | 用途 |
| --- | --- |
| `plt.subplots(nrows, ncols)` | 创建规则子图网格 |
| `sharex` / `sharey` | 共享坐标范围和刻度 |
| `fig.subplots_adjust()` | 手动调整间距 |
| `layout="constrained"` | 自动处理标题、标签和图例占用空间 |
| `fig.suptitle()` | 设置整张图的总标题 |
| `plt.subplot_mosaic()` | 通过布局字符串创建命名 Axes |
| `ax.remove()` | 删除不需要的 Axes |

## 可运行示例

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 2 * np.pi, 200)
fig, axes = plt.subplots(
    2, 2, figsize=(9, 6), sharex=True, layout="constrained"
)

axes[0, 0].plot(x, np.sin(x), color="tab:blue")
axes[0, 0].set_title("sin(x)")
axes[0, 1].plot(x, np.cos(x), color="tab:orange")
axes[0, 1].set_title("cos(x)")
axes[1, 0].plot(x, np.sin(2 * x), color="tab:green")
axes[1, 0].set_title("sin(2x)")
axes[1, 1].plot(x, np.cos(2 * x), color="tab:red")
axes[1, 1].set_title("cos(2x)")

for ax in axes.flat:
    ax.grid(alpha=0.2)
    ax.set_ylabel("value")
for ax in axes[-1, :]:
    ax.set_xlabel("radians")

fig.suptitle("Trigonometric functions")
fig.savefig("multiple-plots.png", dpi=150)
plt.show()
```

`axes` 的形状取决于行列数。若希望单图时也始终得到二维数组，可使用 `squeeze=False`。

## 常见错误

- 把 `axes` 当成单个 Axes：多行多列时它是 NumPy 数组，可用 `axes[row, col]` 或 `axes.flat`。
- 每个子图自动缩放导致误判：比较相同指标时应使用 `sharey=True` 或显式设置相同范围。
- 同时使用 `tight_layout()` 和 constrained layout：两套布局引擎不应混用，选择一种即可。
- 每个面板重复图例和标签：造成拥挤。共享含义时可用 Figure 级图例，并只在边缘子图放轴标签。
- 子图过多：单个面板太小，信息无法读取。拆成多张图或使用分页/交互视图。

## 图表设计与工程注意事项

比较型小多图应保持坐标尺度、颜色语义和面板顺序一致。自动生成未知数量子图时，要计算行列数并删除空 Axes。Figure 尺寸应随行列数增长，而不是把所有内容挤进固定画布。共享轴会联动范围，修改任一共享 Axes 的范围会影响其他面板，这是预期行为。
