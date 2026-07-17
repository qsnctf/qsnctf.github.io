# Matplotlib 中文显示

## 概念与用途

Matplotlib 的中文方框通常不是字符串编码错误，而是当前字体缺少中文字形。解决问题的关键是选择运行环境中真实存在的中文字体。开发机可按字体名称配置，部署和可复现报告更适合随应用分发授权允许的字体文件，并对单个文本显式使用。

## 核心 API

| API/配置 | 用途 |
| --- | --- |
| `matplotlib.font_manager.fontManager.ttflist` | 查询 Matplotlib 已发现的字体 |
| `font_manager.findfont()` | 解析字体名称对应的文件 |
| `font_manager.addfont(path)` | 将字体文件加入当前进程字体管理器 |
| `FontProperties(fname=...)` | 从字体文件构建局部字体属性 |
| `rcParams["font.sans-serif"]` | 设置全局无衬线字体候选 |
| `rcParams["axes.unicode_minus"]` | 控制坐标轴负号字符 |

## 可运行示例

下面从常见候选中选择本机存在的中文字体；若没有，则明确失败并提示安装字体，而不是静默生成方框：

```python
import matplotlib.pyplot as plt
from matplotlib import font_manager

candidates = [
    "Microsoft YaHei", "SimHei", "Noto Sans CJK SC",
    "Source Han Sans SC", "WenQuanYi Micro Hei",
]
available = {font.name for font in font_manager.fontManager.ttflist}
font_name = next((name for name in candidates if name in available), None)
if font_name is None:
    raise RuntimeError("未找到中文字体，请安装 Noto Sans CJK SC 等中文字体")

with plt.rc_context({
    "font.sans-serif": [font_name, "DejaVu Sans"],
    "axes.unicode_minus": False,
}):
    fig, ax = plt.subplots(figsize=(7, 4), layout="constrained")
    ax.plot([-2, -1, 0, 1, 2], [4, 1, 0, 1, 4], marker="o")
    ax.set(xlabel="横坐标", ylabel="平方值", title="中文标题与负号测试")
    ax.grid(alpha=0.25)
    fig.savefig("matplotlib-chinese-text.png", dpi=150)
    plt.show()
```

## 字体文件方式

应用携带字体文件时，可使用 `FontProperties(fname="fonts/NotoSansCJKsc-Regular.otf")`，并通过 `fontproperties=font` 传给标题和标签。要全局按字体族名使用，可先 `font_manager.fontManager.addfont(path)`，再设置 `rcParams`。分发字体前必须确认许可证允许随项目发布。

## 常见错误

- 只写 `SimHei` 但服务器未安装：字体回退后仍显示方框。部署前查询并验证字体。
- 负号显示为空框：部分中文字体缺少 Unicode minus。可设置 `axes.unicode_minus=False` 使用连字符形式，但更好的方案是选择字形完整的字体。
- 修改 `rcParams` 后影响其他图：在库代码中使用 `plt.rc_context()` 或局部 `FontProperties`。
- 新安装字体仍不生效：长生命周期进程可能需要重启；不要依赖手工删除内部缓存作为部署流程。
- 中英文混排效果差：设置中文字体后保留 DejaVu Sans 等回退字体，并在最终输出中检查数学符号。

## 工程注意事项

CI、容器和生产机应安装同一字体版本，图像快照测试才稳定。字体文件会增加镜像或站点体积，应只打包所需字重。标题、标签和图例都要覆盖测试，因为它们可能走不同字体配置路径。SVG/PDF 的字体嵌入和替换行为不同于 PNG，发布前应在目标阅读器中检查。
