# Matplotlib Pyplot

## 概念与用途

`matplotlib.pyplot` 是 Matplotlib 的便捷接口，通常导入为 `plt`。它维护“当前 Figure”和“当前 Axes”的状态，适合交互探索；面向对象接口则把操作明确地放在 `fig` 和 `ax` 上，更适合多图、封装函数和工程代码。

## 核心 API

| API | 用途 |
| --- | --- |
| `plt.figure()` | 创建或激活 Figure |
| `plt.subplots()` | 同时创建 Figure 和一个或多个 Axes |
| `plt.plot()` | 在当前 Axes 绘制折线 |
| `plt.show()` | 进入 GUI 事件循环并显示窗口 |
| `plt.savefig()` | 保存当前 Figure |
| `plt.close()` | 关闭 Figure 并释放资源 |
| `ax.set()` | 批量设置标题、标签和范围 |

## 可运行示例

下面使用推荐的面向对象接口，同时演示一张图中的两组数据：

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 101)
fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")

ax.plot(x, np.sin(x), label="sin(x)")
ax.plot(x, np.cos(x), label="cos(x)")
ax.set(xlabel="x", ylabel="value", title="Pyplot and Axes")
ax.legend()
ax.grid(alpha=0.25)

fig.savefig("pyplot-example.png", dpi=150)
plt.show()
```

将绘图逻辑封装为函数时，让函数接收 `Axes`，而不是在函数内部依赖全局当前坐标轴：

```python
def draw_series(ax, x, y, label):
    ax.plot(x, y, label=label)
    ax.legend()
```

## 状态接口与对象接口

`plt.title("Demo")` 操作当前 Axes，`ax.set_title("Demo")` 操作指定 Axes。只有一张图时二者结果类似；当循环创建多张图或处理子图时，显式对象能避免内容画到错误的坐标轴。Figure 是完整画布，Axes 是包含坐标轴、数据和标题的绘图区，不要把 Axes 与 x/y axis 混为一谈。

## 常见错误与设计注意事项

- 忘记 `plt.show()`：普通脚本可能运行后立即退出；Notebook 通常会自动显示，但不应依赖该行为。
- 在 `show()` 之后才保存：部分后端可能已清空或关闭窗口。通常先 `fig.savefig()` 再 `plt.show()`。
- 循环绘制大量图片不关闭：Figure 会累积并产生内存警告。每轮保存后调用 `plt.close(fig)`。
- 混合状态式和对象式调用：代码可能修改错误的当前图。一个绘图单元中尽量统一使用 `ax.*`。
- 图表只追求装饰：先保证标签、单位、图例和尺度正确，再设置颜色与样式。

工程中应把数据准备与绘图分开，使绘图函数容易测试和复用。需要统一视觉规范时使用样式表或 `rc_context`，避免在模块导入阶段永久修改全局 `rcParams`。
