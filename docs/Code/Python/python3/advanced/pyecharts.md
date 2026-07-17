# Python pyecharts

## 概念与用途

pyecharts 将 Python 数据配置转换为 ECharts HTML，适合生成交互式图表和报告。图表通常在浏览器渲染，静态图片导出还需额外渲染工具。

## 核心 API

本教程建议 `python -m pip install "pyecharts>=2.0"`。生成 HTML 不需要外部服务，但浏览器渲染需要 JavaScript 资源；默认 CDN 在离线或受限网络中可能不可用。

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

## API 与输出

| API | 用途 | 资源边界 |
| --- | --- | --- |
| `add_xaxis` | 设置分类轴 | 长标签需截断/旋转 |
| `add_yaxis` | 添加系列 | 控制系列和点数量 |
| `render` | 写 HTML | 使用可信目标路径 |
| `render_embed` | 返回 HTML 片段 | 嵌入前评估清洗 |

## 示例：只生成配置片段

```python
from pyecharts.charts import Line

line = Line().add_xaxis(["Mon", "Tue"]).add_yaxis("latency", [12, 18])
snippet = line.render_embed()
print(snippet[:120])
```

写文件后没有长连接需要关闭，但批量生成应控制内存和输出目录容量。若配置远程资源，HTTP 获取应由部署层设置超时和缓存，不要让页面依赖不可控第三方 CDN。

## 常见错误与安全注意

- HTML 中嵌入外部可控文本时要考虑脚本注入和输出发布权限。
- 大量数据点会让浏览器卡顿，应聚合、抽样或使用渐进渲染。
- 离线环境需配置本地 JavaScript 资源，不能假设 CDN 始终可访问。
