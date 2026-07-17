# Matplotlib 参考文档

## 概念与用途

本页用于快速定位 Matplotlib 对象模型、常见参数和官方资料。Matplotlib 由多个层次组成：`pyplot` 管理绘图状态，Figure 表示整张画布，Axes 表示绘图区，Axis 管理刻度与标签，Artist 是线条、文字、图例等所有可绘制对象的基类。

## 对象模型

| 对象 | 职责 | 常见获取方式 |
| --- | --- | --- |
| `Figure` | 画布、布局、导出 | `fig, ax = plt.subplots()` |
| `Axes` | 数据绘制、坐标范围、标题 | `ax` 或 `fig.subplots()` |
| `Axis` | x/y 刻度、定位器、格式器 | `ax.xaxis`、`ax.yaxis` |
| `Artist` | 可绘制元素基类 | 绘图函数返回值 |
| `Transform` | 数据、轴和屏幕坐标转换 | `ax.transData` 等 |
| `Backend` | 渲染到 GUI 或文件 | `matplotlib.get_backend()` |

## 高频参数速查

| 类别 | 参数 |
| --- | --- |
| 颜色 | `color`、`cmap`、`norm`、`vmin`、`vmax`、`alpha` |
| 线条 | `linestyle`、`linewidth`、`marker`、`markersize` |
| 文本 | `fontsize`、`fontweight`、`fontfamily`、`ha`、`va` |
| 层级 | `zorder`、`clip_on`、`visible` |
| 坐标 | `xlim`、`ylim`、`xscale`、`yscale`、`aspect` |
| 导出 | `dpi`、`format`、`transparent`、`bbox_inches`、`facecolor` |

颜色可使用命名色、`tab:` 色、十六进制、0 到 1 的 RGB/RGBA 元组。长度参数多数以 point 表示，Figure 尺寸以 inch 表示，最终位图像素约等于 `figsize * dpi`。

## 可运行检查示例

```python
import matplotlib
import matplotlib.pyplot as plt
from matplotlib import font_manager

print("Matplotlib:", matplotlib.__version__)
print("Backend:", matplotlib.get_backend())
print("Config file:", matplotlib.matplotlib_fname())
print("Cache/config dir:", matplotlib.get_configdir())
print("Available styles:", plt.style.available[:8])
print("Default sans font:", font_manager.findfont("DejaVu Sans"))

with plt.style.context("ggplot"):
    fig, ax = plt.subplots(figsize=(6, 3.5), layout="constrained")
    line, = ax.plot([1, 2, 3], [2, 1, 4], marker="o", label="series")
    ax.set(title="Reference check", xlabel="x", ylabel="y")
    ax.legend()
    print("Artist type:", type(line).__name__)
    fig.savefig("reference-check.svg")
    plt.show()
```

## 官方资料

- [Matplotlib 官方文档](https://matplotlib.org/stable/)
- [Pyplot API](https://matplotlib.org/stable/api/pyplot_summary.html)
- [Axes API](https://matplotlib.org/stable/api/axes_api.html)
- [示例库](https://matplotlib.org/stable/gallery/index.html)
- [颜色与色图](https://matplotlib.org/stable/users/explain/colors/index.html)
- [后端说明](https://matplotlib.org/stable/users/explain/figure/backends.html)
- [版本变更记录](https://matplotlib.org/stable/users/release_notes.html)

查资料时优先确认 URL 对应的版本与项目锁定版本一致。搜索示例能快速找到绘法，但最终参数含义应回到对应 API 文档核实。

## 常见错误与排查顺序

1. 检查数据的 `shape`、dtype、有限值、排序和单位。
2. 检查当前 Figure/Axes 是否为预期对象。
3. 检查坐标范围、线性/对数尺度、Locator 和 Formatter。
4. 检查字体是否存在、后端是否支持当前环境。
5. 检查 Matplotlib 版本及弃用警告，再对照该版本文档。

不要使用私有属性或以下划线开头的内部模块作为稳定 API。全局 `rcParams` 修改、后端切换和字体注册都可能影响整个进程，库代码应限制副作用。图像回归测试对版本、字体和渲染器敏感，升级依赖时需要在受控环境中更新基线，而不是忽略所有差异。
