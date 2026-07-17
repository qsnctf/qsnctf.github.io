# Matplotlib 网格线

## 概念与用途

网格线帮助读者把数据点对应到坐标值，尤其适合需要精确比较的折线图和散点图。网格是辅助层，不应比数据线更醒目。通常只显示与主要读数方向有关的网格，例如柱形图使用 y 轴网格。

## 核心 API

`Axes.grid(visible=True, which="major", axis="both", **line_properties)` 控制网格：

- `which` 可选 `"major"`、`"minor"` 或 `"both"`。
- `axis` 可选 `"x"`、`"y"` 或 `"both"`。
- `color`、`linestyle`、`linewidth`、`alpha` 控制视觉样式。
- `ax.minorticks_on()` 启用次刻度，定位器可进一步控制间隔。
- `ax.set_axisbelow(True)` 让网格绘制在数据 Artist 下方。

## 可运行示例

```python
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.ticker import MultipleLocator

x = np.linspace(0, 10, 101)
y = np.exp(x / 5)

fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.plot(x, y, color="#1f77b4", linewidth=2)
ax.xaxis.set_major_locator(MultipleLocator(2))
ax.xaxis.set_minor_locator(MultipleLocator(0.5))
ax.yaxis.set_minor_locator(MultipleLocator(0.5))
ax.grid(which="major", color="0.65", linewidth=0.8, alpha=0.55)
ax.grid(which="minor", color="0.8", linestyle=":", linewidth=0.5, alpha=0.45)
ax.set_axisbelow(True)
ax.set(xlabel="Time (s)", ylabel="Response", title="Major and minor grids")
fig.savefig("grid-lines.png", dpi=150)
plt.show()
```

## 常见错误

- 设置次网格却看不到：Axes 没有次刻度定位器。调用 `minorticks_on()` 或显式设置 MinorLocator。
- 网格覆盖数据：降低 `alpha` 和线宽，并使用 `set_axisbelow(True)`。
- 对数坐标上网格过密：只显示主网格，或为对数 Locator 配置合理的次刻度。
- 调用 `plt.grid()` 修改了错误子图：多图场景应使用目标对象的 `ax.grid()`。
- 网格间距不代表固定数据单位：日期轴、类别轴和对数轴的定位规则不同，不要按线条数量推断数值。

## 图表设计与工程注意事项

网格颜色应接近背景而不是数据色，避免形成视觉竞争。热力图、图像和密集散点图通常不需要网格。报告模板中可通过样式表统一网格，但应允许单张图关闭。导出为小尺寸位图时，过细的点线可能出现摩尔纹或消失，应在最终输出尺寸下检查。
