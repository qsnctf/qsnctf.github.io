# Matplotlib imread()

## 概念与用途

`matplotlib.pyplot.imread()` 将常见图像读取为 NumPy 数组，适合绘图前的轻量读取和检查。它不是完整图像处理库：批量格式转换、EXIF 方向、色彩管理和复杂编解码通常应使用 Pillow、imageio 或 OpenCV。

## 核心 API

```python
image = matplotlib.pyplot.imread(fname, format=None)
```

返回数组通常具有以下形状：灰度图 `(height, width)`，RGB 图 `(height, width, 3)`，RGBA 图 `(height, width, 4)`。返回 dtype 与格式有关：PNG 常返回 0 到 1 的浮点数组，JPEG 常返回 0 到 255 的 `uint8`。调用方不应假设所有格式具有同一 dtype 或范围。

## 可运行示例

示例先生成测试图，因此不依赖仓库中的外部图片：

```python
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

path = Path("imread-source.png")
rgb = np.zeros((120, 180, 3), dtype=np.float32)
rgb[..., 0] = np.linspace(0, 1, rgb.shape[1])
rgb[..., 1] = np.linspace(0, 1, rgb.shape[0])[:, None]
rgb[..., 2] = 0.35
plt.imsave(path, rgb)

image = plt.imread(path)
print("shape:", image.shape)
print("dtype:", image.dtype)
print("range:", float(image.min()), float(image.max()))

fig, ax = plt.subplots(figsize=(6, 4), layout="constrained")
ax.imshow(image)
ax.set_title(f"{path.name}: {image.shape}, {image.dtype}")
ax.axis("off")
fig.savefig("imread-preview.png", dpi=150)
plt.show()
```

## 常见错误

- 文件路径相对于错误工作目录：使用 `pathlib.Path`，并在报错时打印 `Path.cwd()` 和路径的绝对形式。
- 假设所有图像都是三通道：透明 PNG 可能为四通道，灰度图可能只有二维。按 `image.ndim` 和最后一维检查。
- 直接比较 PNG 浮点值与 JPEG 整数值：先统一到明确的范围和 dtype。
- 忽略 EXIF 方向：某些手机照片的像素未实际旋转，简单读取后方向可能与查看器不同。
- 用 Matplotlib 读取不受支持的格式：错误能力取决于底层 Pillow 支持，复杂场景应使用专用库。

## 工程注意事项

读取不可信图片时要限制文件大小、像素数量和解码资源，防止压缩炸弹消耗内存。加载后立即验证形状、通道、dtype 和有限值。Matplotlib 通常按 RGB 顺序，而 OpenCV 默认使用 BGR，跨库传递时要显式转换。不要用可视化预览代替数据校验；显示正常不代表 alpha、位深和色彩空间符合处理要求。
