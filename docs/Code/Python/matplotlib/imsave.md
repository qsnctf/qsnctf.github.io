# Matplotlib imsave()

## 概念与用途

`matplotlib.pyplot.imsave()` 将 NumPy 数组直接编码为图像文件，适合保存计算生成的灰度图、颜色映射结果或 RGB/RGBA 像素。它保存的是数组本身，不会保存坐标轴、标题、图例等 Figure 元素；保存完整图表应使用 `Figure.savefig()`。

## 核心 API

```python
matplotlib.pyplot.imsave(
    fname, arr, vmin=None, vmax=None, cmap=None,
    format=None, origin=None, dpi=100, metadata=None
)
```

- `fname` 可为路径或二进制文件对象，扩展名通常决定格式。
- `arr` 支持二维标量数组、RGB 或 RGBA 数组。
- `cmap`、`vmin`、`vmax` 用于二维标量数组。
- `origin` 控制数组第 0 行在上方还是下方。
- `format` 在文件名没有扩展名时显式指定编码格式。
- `dpi` 主要写入格式元数据，不会像 `savefig()` 那样按 Figure 尺寸改变数组像素数。

## 可运行示例

```python
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

height, width = 180, 320
y, x = np.mgrid[0:height, 0:width]
field = np.sin(x / 18) + np.cos(y / 14)

output = Path("generated-field.png")
plt.imsave(
    output,
    field,
    cmap="viridis",
    vmin=-2,
    vmax=2,
    origin="lower",
    metadata={"Title": "Generated scalar field"},
)
print(f"saved {output} ({output.stat().st_size} bytes)")
```

保存 RGB 图像时直接传入形状为 `(height, width, 3)` 的数组，不要再设置 `cmap`。

## 常见错误

- 期待输出包含坐标轴和标题：`imsave()` 只编码数组。完整可视化应先绘图，再调用 `fig.savefig()`。
- 二维灰度数组保存后变成彩色：默认应用当前色图。需要灰度时显式设置 `cmap="gray"` 和稳定的 `vmin/vmax`。
- 每批图像亮度不一致：自动归一化会按每个数组的最小值和最大值拉伸。跨样本比较时固定范围。
- RGB dtype 或范围错误：`uint8` 使用 0 到 255，浮点 RGB 使用 0 到 1；超出范围会被裁剪。
- 误以为 PNG 会保留原始浮点矩阵：常规图像编码保存的是可视化后的像素，不是分析数据。

## 图表设计与工程注意事项

需要无损保留数值和 dtype 时使用 `.npy`、TIFF 或领域专用格式，并把 PNG 仅作为预览。写文件前创建受控输出目录，避免用未经校验的用户输入拼接路径。批处理应使用唯一、可追踪的文件名并记录色阶参数。若输出用于机器学习，确认通道顺序、alpha、颜色空间和重新读取后的 dtype 符合下游约定。
