# Matplotlib 绘图线

## 概念与用途

折线用于展示有顺序的数据，尤其适合时间序列和连续自变量。线条的颜色、宽度、样式和透明度可以表达系列身份、置信程度或重点，但不应让样式暗示数据中不存在的连续关系。

## 核心 API

`Axes.plot(x, y, ...)` 返回 `Line2D` 对象列表。常用参数如下：

| 参数 | 示例 | 用途 |
| --- | --- | --- |
| `color` | `"tab:blue"`、`"#336699"` | 线条颜色 |
| `linestyle` / `ls` | `"-"`、`"--"`、`":"`、`"-."` | 线型 |
| `linewidth` / `lw` | `2.0` | 线宽，单位为 point |
| `alpha` | `0.7` | 透明度 |
| `label` | `"actual"` | 图例文字 |
| `drawstyle` | `"steps-post"` | 阶梯线绘制方式 |

`ax.axhline()`、`ax.axvline()` 可添加参考线，`ax.legend()` 根据带 `label` 的 Artist 创建图例。

## 可运行示例

```python
import matplotlib.pyplot as plt
import numpy as np

month = np.arange(1, 13)
actual = np.array([12, 14, 13, 16, 18, 21, 20, 23, 22, 25, 27, 29])
target = np.linspace(13, 27, 12)

fig, ax = plt.subplots(figsize=(8, 4), layout="constrained")
ax.plot(month, actual, color="#2673b8", linewidth=2.2, label="Actual")
ax.plot(month, target, color="#d1495b", linestyle="--", label="Target")
ax.axhline(20, color="0.35", linewidth=1, linestyle=":", label="Baseline")
ax.set(xlabel="Month", ylabel="Units", title="Monthly trend", xticks=month)
ax.legend(ncols=3)
ax.grid(axis="y", alpha=0.2)
fig.savefig("plot-lines.png", dpi=150)
plt.show()
```

## 常见错误

- x 和 y 长度不同：`plot()` 会抛出维度不匹配错误，绘图前检查 `len(x) == len(y)`。
- 时间数据未排序：折线按输入顺序连接，可能产生来回折返。先按时间排序。
- 缺失值导致断线：NaN 通常会切断线段。应判断这是期望的缺口，还是需要合理插值的数据问题。
- 图例为空：未为线条设置 `label`，或标签以下划线开头。
- 用折线连接无顺序类别：会暗示类别之间连续，应改用柱形图或点图。

## 图表设计与工程注意事项

不要用平滑曲线掩盖原始波动，除非明确说明平滑方法。线宽要与输出尺寸匹配，屏幕上清晰不代表缩小后仍清晰。大量时间点绘图前应按展示粒度聚合，既提高性能，也避免超过像素分辨率的伪精度。关键阈值可使用参考线并直接标注，避免读者只靠图例猜测。
