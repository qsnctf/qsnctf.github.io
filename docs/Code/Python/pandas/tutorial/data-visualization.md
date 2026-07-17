# Pandas 数据可视化

## 概念与用途

`Series.plot` 和 `DataFrame.plot` 提供基于 Matplotlib 的快速绘图接口，适合探索性分析和简单报表。复杂样式、布局和交互图通常直接使用 Matplotlib、Seaborn 或专业可视化库。

## 核心 API

`plot`、`plot.line`、`plot.bar`、`plot.scatter`、`plot.hist`、`plot.box`，以及返回的 Matplotlib `Axes` 的 `set_title`、`set_xlabel`、`legend`。

## 可运行示例

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({"month": ["Jan", "Feb", "Mar"], "sales": [12, 18, 15]})
ax = df.plot.bar(x="month", y="sales", legend=False, color="#2878b5")
ax.set(title="Monthly sales", xlabel="Month", ylabel="Units")
plt.tight_layout()
plt.show()
```

## 示例二：按日期索引绘图

```python
import pandas as pd
import matplotlib.pyplot as plt

s = pd.Series([10, 13, 12], index=pd.date_range("2026-01-01", periods=3, freq="D"), name="sales")
ax = s.plot(marker="o", figsize=(6, 3), grid=True)
ax.axhline(s.mean(), color="tomato", linestyle="--", label="mean")
ax.legend()
plt.tight_layout()
plt.show()
```

`plot` 返回 Matplotlib `Axes`，不会返回变换后的数据。DataFrame 默认以索引为横轴；若传入 `x=`，该列用于横轴但原表不会被修改。

## 返回、复制与工程边界

绘图前的筛选、排序和聚合通常返回新对象；绘图本身不会复制一份可供后续分析的数据。含混合字符串的数值列应先清洗。批量生成图时及时 `plt.close()`，避免累计内存；可复现报表应固定尺寸、字体、颜色、排序和 DPI。

## 注意事项

绘图前应处理空值、单位和排序；时间轴先转换为日期。类别太多会使图不可读，聚合或筛选后再画。无桌面的服务器应使用非交互后端并 `savefig`；大量点可采样、分箱或预聚合，避免渲染成为瓶颈。
