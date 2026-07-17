# Matplotlib 饼图

## 概念与用途

饼图用扇形角度和面积表示整体中的组成比例，只适合类别少、总和有明确意义、差异较大的场景。需要精确比较、类别较多或存在负值时，排序柱形图通常更合适。

## 核心 API

`Axes.pie(x, labels=None, autopct=None, startangle=0, counterclock=True, ...)` 常用参数：

| 参数 | 用途 |
| --- | --- |
| `labels` | 类别标签 |
| `autopct` | 百分比格式字符串或格式化函数 |
| `startangle` | 起始角度 |
| `colors` | 扇区颜色 |
| `explode` | 将特定扇区移出中心 |
| `wedgeprops` | 设置边缘或通过 `width` 创建环形图 |
| `pctdistance` / `labeldistance` | 调整百分比和标签位置 |

## 可运行示例

```python
import matplotlib.pyplot as plt

labels = ["Product", "Operations", "Sales", "Other"]
values = [46, 28, 18, 8]
colors = ["#3978a8", "#59a14f", "#f2a541", "#bab0ac"]

fig, ax = plt.subplots(figsize=(6.5, 5), layout="constrained")
wedges, texts, autotexts = ax.pie(
    values,
    labels=labels,
    colors=colors,
    autopct=lambda p: f"{p:.0f}%" if p >= 10 else "",
    startangle=90,
    counterclock=False,
    wedgeprops={"width": 0.55, "edgecolor": "white"},
    pctdistance=0.72,
)
ax.set_title("Budget allocation")
ax.set_aspect("equal")
fig.savefig("pie-charts.png", dpi=150)
plt.show()
```

## 常见错误

- 数据包含负值：饼图无法表达负的组成，应使用柱形图或瀑布图。
- 把互不构成整体的指标放进同一饼图：只有同口径、同时间范围且可相加的数据才适用。
- 类别过多导致标签重叠：合并有业务意义的小类为“其他”，或改用排序柱形图。
- 过度使用 `explode`、阴影和 3D 效果：会扭曲面积感知。最多突出一个有明确原因的扇区。
- 百分比因四舍五入不等于 100%：这是显示精度问题，必要时展示原值或说明舍入。

## 图表设计与工程注意事项

扇区应按业务顺序或从大到小排列，并保持顺时针方向稳定。使用直接标签通常比让读者在图例与扇区间来回匹配更高效。颜色要有区分但不必每个扇区都高饱和。自动生成图表前验证 `sum(values) > 0`，并明确缺失值是否被排除；空数组和全零数组不能形成有意义的饼图。
