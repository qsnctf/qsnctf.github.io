# NumPy Matplotlib

Matplotlib 直接接受 NumPy 数组作为坐标、图像、颜色和统计数据。NumPy 负责生成与变换数据，Matplotlib 负责视觉编码；二者组合适合函数绘图、模拟结果、矩阵热图和信号分析。

## 折线与散点

下面使用无界面后端并保存临时图片，因此可在桌面和服务器环境运行：

```python
from pathlib import Path
from tempfile import TemporaryDirectory

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 2 * np.pi, 300)
y = np.sin(x)

fig, ax = plt.subplots(figsize=(6, 3))
ax.plot(x, y, label="sin(x)")
ax.scatter(x[::30], y[::30], s=18)
ax.set(xlabel="x", ylabel="value", title="Sine wave")
ax.grid(alpha=0.25)
ax.legend()

with TemporaryDirectory() as directory:
    output = Path(directory) / "sine.png"
    fig.savefig(output, dpi=150, bbox_inches="tight")
    print(output.exists(), output.stat().st_size > 0)
plt.close(fig)
```

## 二维数组可视化

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(-2, 2, 100)
y = np.linspace(-2, 2, 80)
xx, yy = np.meshgrid(x, y)
z = np.exp(-(xx**2 + yy**2))

fig, ax = plt.subplots()
image = ax.imshow(z, origin="lower", extent=[x.min(), x.max(), y.min(), y.max()],
                  cmap="viridis", aspect="auto")
fig.colorbar(image, ax=ax, label="intensity")
plt.close(fig)
print(z.shape, np.isfinite(z).all())
```

## 数据 shape 规则

`plot(x, y)` 要求首维长度可匹配；`scatter` 通常接收同长度一维坐标；`imshow` 接收二维标量数组或 `(height, width, 3/4)` 图像数组。图像坐标原点、范围和纵横比应显式设置。

## 常见错误与性能注意事项

- 脚本和服务优先使用 `fig, ax = plt.subplots()` 的面向对象接口，避免全局 pyplot 状态互相污染。
- 无 GUI 的 CI/服务器应使用 `Agg` 后端；必须在导入 `pyplot` 前设置后端。
- 绘制百万级点通常没有视觉收益，可先抽样、聚合、分箱或栅格化。
- `imshow` 会按数组值自动归一化颜色，多图比较时应统一 `vmin`、`vmax` 或 `norm`。
- 循环创建图后调用 `plt.close(fig)`，否则长期进程会累积内存。
- 保存可复现图表时固定数据、随机种子、尺寸、DPI、字体和颜色范围，并保留生成代码而非只保存图片。
