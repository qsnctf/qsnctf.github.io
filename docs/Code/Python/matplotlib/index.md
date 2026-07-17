# Matplotlib 教程

Matplotlib 是 Python 科学计算生态中最常用的静态可视化库。它既能快速绘制折线图、散点图和柱形图，也能通过 Figure、Axes、Artist 等对象精确控制布局、坐标轴和输出格式。本教程以面向对象接口为主，示例均可保存为独立脚本运行。

## 学习路线

初学者建议依次学习安装、Pyplot、标记、线条、标题与网格，再学习多图布局和常见统计图。图像处理相关工作可直接阅读 `imshow()`、`imread()` 和 `imsave()`；需要统计可视化时再学习 Seaborn。

1. [Matplotlib 安装](installation.md)：安装、版本验证、后端与虚拟环境。
2. [Matplotlib Pyplot](pyplot.md)：状态式接口与面向对象接口。
3. [Matplotlib 绘图标记](plot-markers.md)：数据点形状、大小和颜色。
4. [Matplotlib 绘图线](plot-lines.md)：线型、线宽、颜色和图例。
5. [Matplotlib 轴标签和标题](labels-and-titles.md)：标题、坐标标签与字体属性。
6. [Matplotlib 网格线](grid-lines.md)：主次网格和层级控制。
7. [Matplotlib 绘制多图](multiple-plots.md)：子图、共享坐标轴和布局。
8. [Matplotlib 散点图](scatter-plots.md)：变量关系、颜色与点大小编码。
9. [Matplotlib 柱形图](bar-charts.md)：类别比较、分组和堆叠。
10. [Matplotlib 饼图](pie-charts.md)：少量类别的组成比例。
11. [Matplotlib 直方图](histograms.md)：连续变量的频数与密度分布。
12. [Matplotlib imshow()](imshow.md)：显示图像和二维矩阵。
13. [Matplotlib imsave()](imsave.md)：将数组直接保存为图像。
14. [Matplotlib imread()](imread.md)：读取图像并检查数组信息。
15. [Matplotlib 中文显示](chinese-text.md)：字体发现、局部配置和负号显示。
16. [Seaborn 教程](seaborn-tutorial.md)：基于 DataFrame 的统计绘图。
17. [Matplotlib 常用函数](common-functions.md)：按任务查找高频 API。
18. [Matplotlib 参考文档](reference.md)：对象模型、参数速查与官方资源。

## 推荐绘图模式

简单探索可以直接使用 `pyplot`，可复用代码和生产脚本优先使用 `fig, ax = plt.subplots()`：

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 2 * np.pi, 200)
fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
ax.plot(x, np.sin(x), label="sin(x)")
ax.set(xlabel="x", ylabel="value", title="Sine wave")
ax.legend()
fig.savefig("sine-wave.png", dpi=150)
plt.show()
```

## 通用工程约定

- 明确 Figure 尺寸和导出 DPI，避免不同运行环境得到不可控的输出尺寸。
- 在批处理任务中使用非交互后端，保存后调用 `plt.close(fig)` 释放内存。
- 不依赖机器默认字体、颜色循环或 GUI 后端；需要稳定复现时显式配置。
- 颜色不应是唯一的信息编码方式，同时使用标签、线型或标记照顾色觉差异。
- 先确认数据单位、缺失值和坐标尺度，再调整图表样式。

## 运行环境

多数页面只依赖 Matplotlib 和 NumPy，Seaborn 页面还需要 pandas 与 seaborn：

```bash
python -m pip install matplotlib numpy pandas seaborn
```

不同 Matplotlib 版本的参数可能有差异。正式项目应锁定依赖版本，并以当前版本的官方文档为准。
