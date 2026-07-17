# Matplotlib 常用函数

## 概念与用途

Matplotlib API 很大，日常工作可以按“创建画布、绘制数据、设置坐标轴、添加说明、布局与导出”五类记忆。新代码优先调用 `Axes` 和 `Figure` 方法，`pyplot` 主要负责创建对象、显示窗口和少量全局配置。

## 创建与生命周期

| API | 返回/作用 | 典型用途 |
| --- | --- | --- |
| `plt.subplots()` | `Figure, Axes` | 创建单图或规则子图 |
| `plt.figure()` | `Figure` | 手动构建复杂画布 |
| `plt.show()` | 显示所有打开的 Figure | 桌面脚本最终展示 |
| `plt.close(fig)` | 释放指定 Figure | 批量绘图防止内存累积 |
| `fig.savefig()` | 写入 PNG、SVG、PDF 等 | 导出完整图表 |

## 绘图函数

| Axes 方法 | 图表 |
| --- | --- |
| `ax.plot()` | 折线和标记线 |
| `ax.scatter()` | 散点图 |
| `ax.bar()` / `barh()` | 竖向/横向柱形图 |
| `ax.hist()` | 直方图 |
| `ax.pie()` | 饼图或环形图 |
| `ax.imshow()` | 图像和二维数组 |
| `ax.errorbar()` | 带误差线的数据 |
| `ax.fill_between()` | 区间、置信带或面积 |
| `ax.boxplot()` | 箱线图 |
| `ax.contour()` / `contourf()` | 等高线/填充等高线 |

## 坐标轴与说明

| API | 用途 |
| --- | --- |
| `ax.set()` | 批量设置标题、标签、范围和刻度 |
| `set_xlim()` / `set_ylim()` | 设置显示范围 |
| `set_xscale()` / `set_yscale()` | 设置线性、对数等尺度 |
| `set_xticks()` / `set_yticks()` | 设置刻度位置和标签 |
| `ax.legend()` | 创建图例 |
| `ax.grid()` | 设置网格 |
| `ax.annotate()` | 带箭头注释 |
| `ax.axhline()` / `ax.axvline()` | 水平/垂直参考线 |
| `fig.colorbar()` | 为颜色映射添加色标 |

## 可运行综合示例

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0.1, 10, 200)
y = np.log(x)
uncertainty = 0.15 + 0.03 * x

fig, ax = plt.subplots(figsize=(7.5, 4.5), layout="constrained")
ax.plot(x, y, color="tab:blue", linewidth=2, label="Estimate")
ax.fill_between(
    x, y - uncertainty, y + uncertainty,
    color="tab:blue", alpha=0.18, label="Uncertainty"
)
ax.axhline(0, color="0.35", linestyle=":", linewidth=1)
ax.set(
    xlabel="Input", ylabel="log(input)", title="Common Matplotlib APIs",
    xlim=(0, 10)
)
ax.legend()
ax.grid(axis="y", alpha=0.2)
fig.savefig("common-functions.png", dpi=150, facecolor="white")
plt.show()
```

## 常见错误

- 使用 `plt.*` 时依赖错误的当前 Axes：多图代码改用 `ax.*`。
- `set_xticklabels()` 单独使用导致警告：同时固定 Locator，通常使用 `set_xticks(positions, labels)`。
- `savefig()` 输出空白：保存发生在关闭或某些后端的 `show()` 之后。保存应在关闭前完成。
- 对数轴包含零或负值：对数尺度无法表示，应清洗数据或选择 symlog 等合适尺度。
- 图例遮挡数据：调整位置、列数或把图例放到图外，不要只缩小字体。

## 图表设计与工程注意事项

常用不等于必须使用：选择 API 前先确定数据类型和读者任务。统一主题应通过样式表或 `rc_context` 管理，绘图函数尽量接收 `Axes` 并返回创建的 Artist，便于测试和二次修改。批量生成时固定尺寸、DPI、颜色映射和随机种子，并关闭 Figure。若下游需要编辑，导出 SVG/PDF；用于网页和预览时通常使用 PNG。
