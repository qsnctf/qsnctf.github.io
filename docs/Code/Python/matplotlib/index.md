# Matplotlib 教程

Matplotlib 是 Python 经典绘图库，适合绘制折线图、散点图、柱形图、饼图、直方图、图像和多子图。Seaborn 在 Matplotlib 之上提供更高级的统计绘图接口。

## Matplotlib 安装

```bash
python -m pip install matplotlib
```

常用导入：

```python
import matplotlib.pyplot as plt
```

## Matplotlib Pyplot

`pyplot` 提供类似 MATLAB 的绘图接口。

```python
plt.plot([1, 2, 3], [2, 4, 6])
plt.show()
```

## Matplotlib 绘图标记

marker 控制数据点形状：

```python
plt.plot(x, y, marker="o")
```

常见标记包括 `o`、`.`、`x`、`s`、`^`。

## Matplotlib 绘图线

线型和颜色可通过参数控制：

```python
plt.plot(x, y, linestyle="--", color="red", linewidth=2)
```

## Matplotlib 轴标签和标题

```python
plt.xlabel("x")
plt.ylabel("value")
plt.title("Demo")
```

## Matplotlib 网格线

```python
plt.grid(True, linestyle=":", alpha=0.5)
```

网格线能提升读数能力，但不应喧宾夺主。

## Matplotlib 绘制多图

```python
fig, axes = plt.subplots(1, 2, figsize=(8, 3))
axes[0].plot(x, y)
axes[1].scatter(x, y)
plt.tight_layout()
```

推荐在复杂图中使用面向对象接口 `fig, ax = plt.subplots()`。

## Matplotlib 散点图

```python
plt.scatter(x, y, s=20, c="blue", alpha=0.7)
```

散点图适合观察两个变量关系、异常点和聚类趋势。

## Matplotlib 柱形图

```python
plt.bar(["A", "B", "C"], [3, 5, 2])
```

柱形图适合比较离散类别。

## Matplotlib 饼图

```python
plt.pie([30, 40, 30], labels=["A", "B", "C"], autopct="%1.1f%%")
```

饼图适合少量类别占比，不适合类别很多或差异很小的数据。

## Matplotlib 直方图

```python
plt.hist(data, bins=20)
```

直方图用于观察数值分布。

## Matplotlib imshow()

`imshow` 显示二维数组或图像。

```python
plt.imshow(image, cmap="gray")
plt.axis("off")
```

## Matplotlib imsave()

保存图像数组：

```python
plt.imsave("out.png", image, cmap="gray")
```

## Matplotlib imread()

读取图像：

```python
image = plt.imread("input.png")
```

更复杂图像处理可使用 Pillow 或 OpenCV。

## Matplotlib 中文显示

中文显示需要配置字体：

```python
plt.rcParams["font.sans-serif"] = ["SimHei"]
plt.rcParams["axes.unicode_minus"] = False
```

不同系统字体名称不同，部署时应确认字体存在。

## Seaborn 教程

Seaborn 基于 Matplotlib，适合统计图表：

```bash
python -m pip install seaborn
```

```python
import seaborn as sns
sns.histplot(data=df, x="score", kde=True)
```

常见图包括 `histplot`、`scatterplot`、`boxplot`、`heatmap`、`pairplot`。

## Matplotlib 常用函数

常用函数：

| 函数 | 用途 |
| --- | --- |
| `plot` | 折线图 |
| `scatter` | 散点图 |
| `bar` | 柱形图 |
| `hist` | 直方图 |
| `imshow` | 图像显示 |
| `subplots` | 创建多图 |
| `savefig` | 保存整张图 |
| `legend` | 图例 |

## Matplotlib 参考文档

正式使用时以 Matplotlib 官方文档为准。排查图形问题时重点检查后端、字体、坐标轴范围、数据形状和 `tight_layout`/`constrained_layout`。
