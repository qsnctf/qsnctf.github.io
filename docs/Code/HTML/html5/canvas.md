# Canvas 画布

## 学习目标

- 使用 Canvas 2D API 绘制简单图形。
- 理解位图画布、坐标和高分辨率缩放。
- 为图表和交互内容提供可访问替代。

## 核心概念

`canvas` 是 HTML 元素，绘图由 JavaScript 上下文完成。2D 上下文适合动态图形、
像素处理和简单游戏；绘制后的形状不会成为可查询的 DOM 节点。需要可缩放、可选择、
可语义化的静态图形时，通常优先考虑 [SVG](svg.md)。

## 安全可运行示例

```html
<canvas id="chart" width="320" height="160" aria-describedby="chart-data">
  当前浏览器无法显示图表。
</canvas>
<table id="chart-data">
  <caption>每周完成任务数</caption>
  <tr><th scope="col">周</th><th scope="col">数量</th></tr>
  <tr><th scope="row">第一周</th><td>12</td></tr>
  <tr><th scope="row">第二周</th><td>20</td></tr>
</table>
<script>
  const canvas = document.querySelector('#chart');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(60, 64, 80, 72);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(180, 16, 80, 120);
    ctx.fillStyle = '#111827';
    ctx.font = '16px sans-serif';
    ctx.fillText('12', 88, 56);
    ctx.fillText('20', 208, 30);
  }
</script>
```

表格不是“旧浏览器专用占位”，而是所有用户都可访问的等价数据。不要把秘密、令牌或
不可信 SVG/图片当作绘图数据直接加载；跨源图片还会使画布变为受污染状态，阻止导出。

## 清晰度与尺寸

CSS 尺寸与画布绘图缓冲区尺寸不同。高像素密度屏幕可按 `devicePixelRatio` 扩大
缓冲区后缩放上下文，但要设置上限，避免超大画布消耗大量内存。动画应使用
`requestAnimationFrame()`，页面不可见时暂停，并尊重减少动态效果偏好。

## 兼容与无障碍

Canvas 2D 支持广泛，但画布内容本身通常不会进入无障碍树。提供文本、表格、下载数据
或等价控件；不要让只能点击像素区域的交互成为唯一操作方式。键盘焦点应落在真实控件上。

## 常见错误

- 只用 CSS 放大低分辨率画布，导致模糊。
- 每帧创建大量对象或忘记清除画布，造成性能问题。
- 把 Canvas 当作普通 DOM，期待读屏读取其中的文字。
- 在坐标点击之外不提供键盘和触屏友好的控件。
- 加载任意跨源图片后仍尝试 `toDataURL()` 导出。

## 相关链接

- [HTML5 教程入口](index.md)
- [SVG](svg.md)
- [浏览器支持](browser-support.md)
- [MDN：Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- [WHATWG：canvas](https://html.spec.whatwg.org/multipage/canvas.html)
