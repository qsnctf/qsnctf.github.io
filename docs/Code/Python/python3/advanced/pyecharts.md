# Python pyecharts

## 概念与用途

pyecharts 将 Python 数据配置转换为 ECharts HTML，适合生成交互式图表和报告。图表通常在浏览器渲染，静态图片导出还需额外渲染工具。

## 核心 API

安装 `python -m pip install pyecharts`。创建图表对象后调用 `add_xaxis()`、`add_yaxis()`、`set_global_opts()`，最后 `render()` 输出 HTML。

```python
from pyecharts.charts import Bar
from pyecharts.options import TitleOpts

chart = (
    Bar()
    .add_xaxis(["一月", "二月", "三月"])
    .add_yaxis("访问量", [120, 180, 150])
    .set_global_opts(title_opts=TitleOpts(title="季度访问量"))
)
print(chart.render("visits.html"))
```

## 常见错误与安全注意

- HTML 中嵌入外部可控文本时要考虑脚本注入和输出发布权限。
- 大量数据点会让浏览器卡顿，应聚合、抽样或使用渐进渲染。
- 离线环境需配置本地 JavaScript 资源，不能假设 CDN 始终可访问。
