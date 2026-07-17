# Matplotlib 轴标签和标题

## 概念与用途

标题说明图表讨论什么，轴标签说明变量及单位，刻度标签则把坐标值翻译为读者能理解的形式。缺少单位或使用模糊标题会让正确的数据也难以解释。Figure 总标题适合多子图，Axes 标题负责描述单个面板。

## 核心 API

| API | 用途 |
| --- | --- |
| `ax.set_title()` | 设置子图标题，可用 `loc` 控制对齐 |
| `ax.set_xlabel()` / `set_ylabel()` | 设置轴标签 |
| `ax.set()` | 一次设置多个 Axes 属性 |
| `fig.suptitle()` | 设置整张 Figure 的总标题 |
| `ax.tick_params()` | 调整刻度和刻度文字 |
| `ax.text()` / `annotate()` | 添加说明或数据注释 |
| `fontdict`、`fontsize`、`fontweight` | 控制文字样式 |

## 可运行示例

```python
import matplotlib.pyplot as plt
import numpy as np

years = np.arange(2019, 2025)
revenue = np.array([2.4, 2.8, 3.1, 3.7, 4.0, 4.6])

fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.plot(years, revenue, marker="o", linewidth=2)
ax.set_title("Annual revenue", loc="left", fontsize=14, fontweight="bold")
ax.set_xlabel("Fiscal year")
ax.set_ylabel("Revenue (million USD)")
ax.tick_params(axis="both", labelsize=9)
ax.annotate(
    "New high", xy=(2024, 4.6), xytext=(2022.6, 4.25),
    arrowprops={"arrowstyle": "->", "color": "0.3"}
)
ax.grid(axis="y", alpha=0.2)
fig.savefig("labels-and-titles.png", dpi=150)
plt.show()
```

数学表达式可使用 Matplotlib 内置 mathtext，例如 `ax.set_ylabel(r"Amplitude $A^2$")`，不一定需要安装 LaTeX。

## 常见错误

- 标签没有单位：读者无法判断数值是元、万元还是百分比。单位应放在轴标签或刻度格式中。
- 标题与图形重叠或被裁切：使用 `layout="constrained"`，或在保存时设置 `bbox_inches="tight"`。
- 手工传入刻度标签但未固定刻度位置：可能出现标签数量不匹配。使用 `set_xticks(positions, labels)` 一次设置。
- 字号层级混乱：标题、标签、刻度应有稳定层级，不要所有文字都加粗放大。
- 中文显示方框：这不是编码问题，通常是所选字体缺少中文字形，参见中文显示章节。

## 图表设计与工程注意事项

标题优先陈述结论或问题，而不是重复图表类型。坐标标签使用完整变量名，避免只有内部字段名。自动报告应统一格式化数值和日期，不要逐个硬编码刻度。注释应只突出关键事件，过多箭头和文字会遮挡数据；必要时增加画布尺寸或把补充说明放在图注中。
