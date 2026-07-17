# Matplotlib 柱形图

## 概念与用途

柱形图通过长度比较离散类别的数值，适合排名、组间比较和组成分析。竖向柱形图使用 `bar()`，类别名称较长时可使用横向 `barh()`。柱形图的量值轴通常从 0 开始，否则长度比较会被夸大。

## 核心 API

| API/参数 | 用途 |
| --- | --- |
| `ax.bar(x, height)` | 竖向柱形图 |
| `ax.barh(y, width)` | 横向柱形图 |
| `width` / `height` | 柱宽或横向柱高 |
| `bottom` / `left` | 堆叠起点 |
| `yerr` / `xerr` | 误差线 |
| `ax.bar_label(container)` | 在柱上添加数值标签 |

## 可运行示例

```python
import matplotlib.pyplot as plt
import numpy as np

categories = ["Search", "Direct", "Referral", "Email"]
q1 = np.array([42, 31, 24, 18])
q2 = np.array([48, 29, 27, 23])
x = np.arange(len(categories))
width = 0.36

fig, ax = plt.subplots(figsize=(8, 4.5), layout="constrained")
bars1 = ax.bar(x - width / 2, q1, width, label="Q1", color="#3b75af")
bars2 = ax.bar(x + width / 2, q2, width, label="Q2", color="#e28e2c")
ax.bar_label(bars1, padding=3, fontsize=8)
ax.bar_label(bars2, padding=3, fontsize=8)
ax.set(
    ylabel="Conversions (thousands)", title="Conversions by channel",
    xticks=x, xticklabels=categories, ylim=(0, 55)
)
ax.legend()
ax.grid(axis="y", alpha=0.2)
ax.set_axisbelow(True)
fig.savefig("bar-charts.png", dpi=150)
plt.show()
```

堆叠柱形图通过第二组的 `bottom=first_values` 实现；若包含多组正负值，需要分别累计正负基线，不能简单使用同一个累计和。

## 常见错误

- 量值轴截断：柱长从非零位置开始会夸大差异。若业务必须放大细微变化，点图通常更诚实。
- 类别顺序随输入随机变化：比较和排名图应明确排序规则。
- 分组柱太多：类别与系列组合迅速变得拥挤，可改用小多图、热力图或折线图。
- 堆叠柱比较中间段：只有底部系列共享基线，其他段难以精确比较。
- 数值标签与柱顶或边界重叠：为 y 轴留出上边距，控制小数位，不必给每根柱都标注。

## 图表设计与工程注意事项

保持柱宽、间距和系列顺序一致。使用颜色表达同一语义，例如“目标”在所有图中使用同一颜色。大量长类别名称优先横向排列，并给左侧留足空间。自动报告中应显式处理空数据、负值和极大值，测试标签不会超出画布。
