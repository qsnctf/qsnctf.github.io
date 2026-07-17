# Matplotlib 绘图标记

## 概念与用途

标记（marker）显示每个采样点的位置，适合强调离散观测、区分多条曲线，或在打印和色觉受限场景中补充颜色编码。采样点非常密集时，给每个点都画标记会造成遮挡并降低渲染速度。

## 核心 API

`Axes.plot()` 的标记相关参数包括：

| 参数 | 说明 |
| --- | --- |
| `marker` | 形状，如 `"o"`、`"s"`、`"^"`、`"x"`、`"."` |
| `markersize` / `ms` | 标记尺寸，单位为 point |
| `markerfacecolor` / `mfc` | 填充色 |
| `markeredgecolor` / `mec` | 边缘色 |
| `markeredgewidth` / `mew` | 边缘宽度 |
| `markevery` | 每隔多少点绘制标记，或指定位置 |

格式字符串如 `"o--"` 可同时指定标记和线型，但参数较多时显式关键字更容易维护。

## 可运行示例

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.arange(0, 21)
y1 = np.sqrt(x)
y2 = np.log1p(x)

fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.plot(
    x, y1, marker="o", markersize=6, markevery=2,
    markerfacecolor="white", markeredgewidth=1.5, label="sqrt(x)"
)
ax.plot(
    x, y2, marker="s", markersize=5, markevery=2,
    linestyle="--", label="log(1+x)"
)
ax.set(xlabel="x", ylabel="value", title="Marker styles")
ax.legend()
ax.grid(axis="y", alpha=0.25)
fig.savefig("plot-markers.png", dpi=150)
plt.show()
```

## 常见错误

- 把 `markersize` 当作数据坐标单位：它使用 point，因此缩放坐标轴不会改变视觉尺寸。
- 使用不存在的 marker 名称：Matplotlib 会抛出无法识别标记的错误，应使用官方 marker 列表中的值。
- 数据点太多仍逐点加 marker：图形变成实心带状。使用 `markevery=10`、抽样或散点透明度。
- 空心标记边缘不可见：显式设置 `markeredgecolor`，并确保与背景有足够对比度。

## 图表设计与工程注意事项

多条线应组合使用颜色、标记和线型，而不是只改变颜色。标记形状最好控制在少数几种，并在图例中保持足够尺寸。输出到论文或黑白打印时，应实际检查灰度效果。大数据绘制时，`markevery` 只减少标记数量，折线本身仍包含全部点；若性能仍差，需要先按像素分辨率聚合或抽样数据。
