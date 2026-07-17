# HTML 参考手册

本组页面用于快速检索现代 HTML 的常用元素、属性、事件和相关 Web API。
它是工程速查表，不声称穷尽持续更新的 HTML Living Standard。

## 使用说明

| 标记 | 含义 |
| --- | --- |
| 现代 | 当前规范中的常规功能，仍需检查具体浏览器支持 |
| 有条件 | 仅适用于特定元素、上下文、权限或安全来源 |
| 实验性 | 规范或实现仍可能变化，不宜作为无回退的关键功能 |
| 废弃 | 不应在新代码中使用，旧内容应逐步迁移 |

浏览器“能够解析”不等于写法符合规范，也不等于具备良好的安全性和可访问性。

## 索引

| 页面 | 主要内容 | 适合查询 |
| --- | --- | --- |
| [标签（字母排序）](tags-alphabetical.md) | 常用现代元素与废弃元素 | 已知标签名，查询用途和状态 |
| [标签（功能排序）](tags-by-function.md) | 按文档结构、文本、媒体、表单等分组 | 按任务选择语义元素 |
| [HTML 属性](attributes.md) | 全局属性和常用元素专用属性 | 属性适用对象、值和风险 |
| [HTML 事件](events.md) | 常见 DOM 事件与监听建议 | 选择事件和理解触发时机 |
| [Canvas API](canvas-api.md) | 2D 上下文常用属性与方法 | 绘图、像素、导出和动画 |
| [音视频 API](audio-video-api.md) | `HTMLMediaElement` 常用成员 | 播放、进度、音量和媒体事件 |
| [有效 DOCTYPES](doctypes.md) | HTML 标准模式声明与历史声明 | 新文档写法和旧文档识别 |
| [颜色名](color-names.md) | CSS 命名颜色速查 | 基础颜色、同义名和使用限制 |
| [拾色器](color-picker.md) | `input type="color"` | 原生颜色输入和表单提交 |
| [字符集](character-sets.md) | UTF-8、声明位置与解码边界 | 编码配置和乱码排查 |

## 最小现代文档

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>页面标题</title>
  </head>
  <body>
    <main>
      <h1>页面主标题</h1>
    </main>
  </body>
</html>
```

## 查询原则

- 优先使用具有正确语义和原生行为的元素，而不是给 `div`、`span` 模拟控件。
- 属性是否合法取决于元素、取值和上下文；“全局属性”也可能有语义限制。
- DOM 事件属于 Web API，不是 HTML 元素清单的一部分；优先使用 `addEventListener()`。
- Canvas 和媒体 API 会受来源、权限、自动播放、编解码器及性能约束。
- CSS 颜色名不属于 HTML 标签语法；颜色对比度必须基于实际前景和背景测量。
- 新文档统一使用 UTF-8 和简短 doctype，不复制历史 DTD 声明。

## 安全基线

- 不把不可信字符串直接写入 `innerHTML`、事件处理属性、`style` 或 URL 属性。
- URL 应解析后限制协议和来源；授权必须由服务端执行。
- iframe、媒体、Canvas 导出和跨源资源应遵守同源策略、CORS 与最小权限原则。
- 客户端约束和隐藏字段只能改善体验，不能替代服务端验证。

## 无障碍基线

- 设置准确的文档语言，保持标题和地标结构清楚。
- 图片提供合适的替代文本，表单控件具有可见标签。
- 所有交互支持键盘，焦点清晰可见，状态不只依赖颜色。
- 音视频按内容提供字幕、文字稿或音频描述；Canvas 提供等价文本或数据。

## 权威资料

- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)
- [MDN HTML 参考](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference)
- [WAI 无障碍标准与指南](https://www.w3.org/WAI/standards-guidelines/)
- [Can I use 浏览器兼容性数据](https://caniuse.com/)
