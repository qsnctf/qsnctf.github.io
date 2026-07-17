# SVG 矢量图形

## 学习目标

- 在 HTML 中嵌入可缩放矢量图形。
- 区分内联 SVG、图片资源和 Canvas 的适用场景。
- 为 SVG 提供名称、说明和安全边界。

## 核心概念

SVG 使用元素描述形状、路径、文本和坐标，缩放时通常不会像位图那样失真。
内联 SVG 会进入 DOM，可被 CSS 和 JavaScript 操作；通过 `img` 引用的 SVG 更隔离，
适合不需要内部交互的图标或插图。

## 安全可运行示例

```html
<svg viewBox="0 0 240 120" width="480" role="img"
     aria-labelledby="chart-title chart-desc">
  <title id="chart-title">两项任务的完成比例</title>
  <desc id="chart-desc">文档任务完成百分之八十，测试任务完成百分之五十。</desc>
  <rect x="20" y="20" width="160" height="28" rx="4" fill="#2563eb" />
  <rect x="20" y="70" width="100" height="28" rx="4" fill="#16a34a" />
  <text x="188" y="40" font-size="16">80%</text>
  <text x="128" y="90" font-size="16">50%</text>
</svg>
```

`viewBox` 定义内部坐标和缩放范围。颜色之外还应有文字、图案或形状差异；本例直接写出
百分比。装饰性 SVG 可使用 `aria-hidden="true"`，但不能隐藏承载关键信息的图形。

## 内联与外部资源

```html
<img src="status-chart.svg" alt="文档任务 80%，测试任务 50%">
```

外部图片的 `alt` 说明用途。内联方式便于控制内部节点，但会扩大 DOM，也更需要谨慎
处理来源。不要把用户上传或不可信字符串直接注入内联 SVG；SVG 可包含链接、事件和
其他活跃内容，应在服务端按严格允许列表净化，或作为隔离图片提供。

## SVG 与 Canvas

SVG 适合图标、示意图、少量节点的图表和需要缩放/交互的图形。Canvas 适合频繁重绘、
大量像素或大量对象的场景。性能和可访问性都应通过原型测试，而不是只按节点数量猜测。

## 兼容与无障碍

基础 SVG 支持广泛，滤镜、字体和高级 CSS 行为仍需检查目标浏览器。为信息图提供标题、
说明或旁边的等价数据表；交互节点需可聚焦、可键盘操作，并具有清楚的可访问名称。

## 常见错误

- 省略 `viewBox`，导致响应式缩放和裁切异常。
- 把复杂信息图只写成一个含糊的 `alt="图表"`。
- 依赖红绿颜色区分状态。
- 给装饰图形重复朗读文件名或无意义路径信息。
- 未净化不可信 SVG 就以内联方式插入页面。

## 相关链接

- [HTML5 教程入口](index.md)
- [Canvas](canvas.md)
- [MathML](mathml.md)
- [MDN：SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG)
- [W3C：SVG Accessibility](https://www.w3.org/WAI/standards-guidelines/aria/)
