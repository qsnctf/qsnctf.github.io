# Canvas API 参考

`canvas` 提供脚本控制的位图画布。本页集中列出常用 Canvas 2D API；
WebGL、WebGPU、离屏画布和完整接口请按具体需求查阅对应规范。

## 获取上下文

```html
<canvas id="chart" width="640" height="320">
  图表数据：第一项 40，第二项 75。
</canvas>
<script>
  const canvas = document.querySelector('#chart');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(40, 220, 120, 60);
    ctx.fillRect(220, 120, 120, 160);
  }
</script>
```

`width`、`height` 属性决定绘图缓冲区尺寸；只用 CSS 拉伸会缩放已有像素并可能模糊。

## 矩形与清除

| 成员 | 作用 | 注意 |
| --- | --- | --- |
| `fillRect(x, y, w, h)` | 绘制填充矩形 | 使用当前 `fillStyle` |
| `strokeRect(x, y, w, h)` | 绘制矩形轮廓 | 使用当前描边样式 |
| `clearRect(x, y, w, h)` | 清除矩形区域 | 清为透明黑，不是填背景色 |

## 路径与形状

| 成员 | 作用 | 注意 |
| --- | --- | --- |
| `beginPath()` | 开始新路径 | 避免意外连接旧子路径 |
| `closePath()` | 闭合当前子路径 | 不会自动描边或填充 |
| `moveTo(x, y)` | 移动画笔起点 | 不产生线段 |
| `lineTo(x, y)` | 添加直线 | 最后调用 `stroke()` 或 `fill()` |
| `arc(...)` | 添加圆弧 | 角度使用弧度 |
| `ellipse(...)` | 添加椭圆弧 | 现代浏览器支持良好 |
| `arcTo(...)` | 用切线连接圆弧 | 半径和控制点需合法 |
| `quadraticCurveTo(...)` | 二次贝塞尔曲线 | 一个控制点 |
| `bezierCurveTo(...)` | 三次贝塞尔曲线 | 两个控制点 |
| `rect(x, y, w, h)` | 向路径添加矩形 | 与立即绘制方法不同 |
| `roundRect(...)` | 添加圆角矩形 | 较新方法，检查目标支持 |
| `fill(path?, rule?)` | 填充路径 | 填充规则常用 `nonzero`、`evenodd` |
| `stroke(path?)` | 描边路径 | 描边居中落在路径两侧 |
| `clip(path?, rule?)` | 设置裁剪区域 | 状态叠加，通常配合 `save()` |
| `isPointInPath(...)` | 测试点是否在填充区 | 坐标和变换需保持一致 |
| `Path2D` | 保存和复用路径 | 不为图形自动提供 DOM 语义 |

## 颜色与线条

| 属性或方法 | 作用 | 注意 |
| --- | --- | --- |
| `fillStyle` | 填充颜色、渐变或图案 | 接受 CSS 颜色字符串等 |
| `strokeStyle` | 描边颜色、渐变或图案 | 保证实际背景上的对比度 |
| `globalAlpha` | 全局透明度 | 范围 `0` 到 `1` |
| `globalCompositeOperation` | 像素合成模式 | 导出和叠加前实测结果 |
| `lineWidth` | 线宽 | 坐标缩放会影响视觉宽度 |
| `lineCap` / `lineJoin` | 端点和连接样式 | 常用 `butt`、`round`、`miter` |
| `miterLimit` | 尖角限制 | 仅影响 `miter` 连接 |
| `setLineDash()` | 设置虚线序列 | `getLineDash()` 可读取副本 |
| `lineDashOffset` | 虚线偏移 | 可用于动画，但应尊重减少动态偏好 |
| `createLinearGradient()` | 线性渐变 | 返回对象后添加色标 |
| `createRadialGradient()` | 径向渐变 | 检查半径合法性 |
| `createPattern()` | 图片重复图案 | 图片加载完成后创建 |

## 文本

| 成员 | 作用 | 注意 |
| --- | --- | --- |
| `font` | CSS 字体简写字符串 | 等待 Web 字体加载可避免度量变化 |
| `textAlign` | 水平对齐 | `start`、`end` 可适配文字方向 |
| `textBaseline` | 基线方式 | 如 `alphabetic`、`middle` |
| `direction` | 文本方向 | 与页面语言和双向文本协调 |
| `fillText()` / `strokeText()` | 绘制文本 | 文字不会进入无障碍树 |
| `measureText()` | 测量文本 | 返回 `TextMetrics`，不是 DOM 布局尺寸 |

## 图片与像素

| 成员 | 作用 | 安全或性能注意 |
| --- | --- | --- |
| `drawImage()` | 绘制图片、视频或其他画布 | 等待资源可用并校验尺寸 |
| `createImageData()` | 创建空像素数据 | 大尺寸会消耗大量内存 |
| `getImageData()` | 读取像素 | 跨源污染画布会抛出安全异常 |
| `putImageData()` | 写入像素 | 不应用当前变换和合成方式 |
| `toDataURL()` | 同步生成数据 URL | 大画布开销高，优先 `toBlob()` |
| `toBlob()` | 异步导出图片 | 污染画布不可导出 |

## 变换与状态

| 成员 | 作用 | 注意 |
| --- | --- | --- |
| `save()` / `restore()` | 保存和恢复绘图状态 | 成对使用，避免状态泄漏 |
| `translate()` | 平移坐标系 | 影响后续绘制 |
| `rotate()` | 旋转坐标系 | 角度使用弧度 |
| `scale()` | 缩放或翻转坐标系 | 也会影响线宽和文本 |
| `transform()` | 乘入变换矩阵 | 多次调用会累积 |
| `setTransform()` | 直接设置变换 | 可用于每帧重置 |
| `resetTransform()` | 恢复单位矩阵 | 现代浏览器支持良好 |

## 动画与高分辨率

- 动画使用 `requestAnimationFrame()`，标签页不可见时暂停非必要工作。
- 根据 `devicePixelRatio` 放大缓冲区并缩放上下文，同时为最大尺寸设上限。
- 每帧只重绘必要区域，避免无界数组、超大图片和频繁像素读回。
- 动画不是计时器保证；使用时间戳计算进度，并提供暂停方式。

## 安全与无障碍

- 未通过 CORS 授权的跨源图片或视频会污染画布，阻止像素读取和导出。
- 不把任意 SVG、图片 URL 或用户脚本直接送入绘图流程；限制类型、来源和尺寸。
- Canvas 内文字和形状通常不进入无障碍树，应提供可见文本、数据表或等价控件。
- 像素命中区域不能成为唯一操作路径；使用真实按钮并支持键盘和触屏。
- 图表不能只靠颜色区分类别，应配合标签、图案或形状。

另见：[颜色名](color-names.md)、[MDN Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)。
