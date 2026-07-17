# Matplotlib imshow()

## 概念与用途

`imshow()` 把二维标量数组显示为颜色映射图，或直接显示 RGB/RGBA 图像。它常用于图像预览、矩阵、分类掩码和热力图。二维数据的行对应 y 方向、列对应 x 方向；默认原点位于左上角，这与普通笛卡尔坐标习惯不同。

## 核心 API

`Axes.imshow(X, cmap=None, norm=None, aspect=None, interpolation=None, origin=None, extent=None, ...)` 的关键规则：

- `(M, N)`：标量矩阵，经 `cmap` 和 `norm` 映射为颜色。
- `(M, N, 3)`：RGB 图像；整数通常为 0 到 255，浮点数应为 0 到 1。
- `(M, N, 4)`：带 alpha 的 RGBA 图像。
- `vmin`、`vmax` 或 `norm` 控制标量到颜色的映射范围。
- `origin="lower"` 可将第 0 行放到底部。
- `extent=(left, right, bottom, top)` 把像素范围映射到数据坐标。

## 可运行示例

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(-3, 3, 240)
y = np.linspace(-2, 2, 160)
xx, yy = np.meshgrid(x, y)
z = np.sin(xx ** 2 + yy ** 2) * np.exp(-0.15 * (xx ** 2 + yy ** 2))

fig, ax = plt.subplots(figsize=(7, 4.5), layout="constrained")
image = ax.imshow(
    z,
    extent=(x.min(), x.max(), y.min(), y.max()),
    origin="lower",
    cmap="coolwarm",
    vmin=-1,
    vmax=1,
    aspect="auto",
    interpolation="nearest",
)
ax.set(xlabel="x", ylabel="y", title="Scalar field")
fig.colorbar(image, ax=ax, label="Amplitude")
fig.savefig("imshow-example.png", dpi=150)
plt.show()
```

## 常见错误

- 图像上下颠倒：默认 `origin="upper"`。矩阵坐标图常需要 `origin="lower"`，但真实照片一般保持默认。
- 浮点 RGB 数组范围为 0 到 255：浮点图像应缩放到 0 到 1，否则会被裁剪并产生警告。
- 每张图自动使用不同色阶：并排比较矩阵时必须共享 `vmin/vmax` 或同一个 `Normalize`。
- 以为 `cmap` 能修改 RGB 图：色图只作用于二维标量数组，对已包含 RGB 通道的数组不起作用。
- 插值制造不存在的细节：分类掩码和像素检查使用 `interpolation="nearest"`。

## 图表设计与工程注意事项

连续数据使用感知均匀色图；围绕有意义中心的正负数据使用发散色图并对称设置范围；类别掩码使用离散色图。标量图应提供 colorbar 和单位。大数组在交互环境中可能占用大量内存，必要时按显示分辨率降采样，但分析计算仍应保留原始数据。
