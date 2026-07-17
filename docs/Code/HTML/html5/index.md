# HTML5 教程与简介

## 学习目标

- 理解“HTML5”在历史和现代开发中的含义。
- 能从本目录选择语义、图形、媒体、交互或表单主题继续学习。
- 写出安全、可访问、可渐进增强的现代 HTML 页面。

## HTML5 现在指什么

HTML5 曾是 HTML 的一个正式版本名称，带来了语义元素、原生音视频、Canvas、
更丰富的表单控件等能力。今天 HTML 不再按 HTML5、HTML6 这样发布离散大版本，
而由 WHATWG 以 **HTML Living Standard（现行标准）** 持续维护。

因此，“HTML5”仍常被用作现代 HTML 功能的通俗称呼，但开发时应查询现行标准、
MDN 兼容数据和目标浏览器测试结果，而不是把 2014 年的特性清单视为永久边界。

## 最小可运行页面

将下面内容保存为 `.html` 文件并用浏览器打开：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>现代 HTML 示例</title>
</head>
<body>
  <header><h1>学习 HTML</h1></header>
  <main>
    <article>
      <h2>语义优先</h2>
      <p>HTML 描述内容，CSS 控制表现，JavaScript 增强交互。</p>
    </article>
  </main>
</body>
</html>
```

`<!doctype html>` 触发标准模式，`lang` 帮助读屏与翻译工具，UTF-8 和 viewport
声明则是现代页面的基础。不要依赖脚本生成全部正文，基础内容应在脚本失败时仍可读。

## 阅读路线

1. [浏览器支持](browser-support.md)：能力检测、回退与测试策略。
2. [新增与语义元素](new-elements.md)：页面结构、内容元素和渐进增强。
3. [Canvas](canvas.md)、[SVG](svg.md) 与 [MathML](mathml.md)：图形和数学内容。
4. [拖放](drag-and-drop.md) 与 [地理定位](geolocation.md)：交互、权限和替代方案。
5. [video](video-element.md) 与 [audio](audio-element.md)：媒体、字幕和回退。
6. [输入类型](input-types.md)、[表单元素](form-elements.md) 与
   [表单属性](form-attributes.md)：输入体验和验证边界。

## 兼容与无障碍原则

- 先提供能工作的语义 HTML，再用 CSS 和 JavaScript 增强。
- 使用原生元素，不用 `div` 模拟按钮、链接或输入框。
- 对新能力做特性检测，不只根据浏览器名称或版本猜测。
- 确保键盘、触屏、读屏和缩放用户都能完成核心任务。
- Canvas、媒体、拖放和定位必须有文本或传统控件等替代路径。

## 安全原则

- 不把不可信文本直接拼入 `innerHTML`；优先使用 `textContent`。
- 权限型 API 只在用户明确操作后请求，并解释用途。
- 客户端状态、隐藏字段和约束验证都不能替代服务端验证与授权。
- 外部资源、上传内容和媒体 URL 均应限制来源并使用 HTTPS。

## 常见错误

- 把“HTML5”误认为一个冻结且所有浏览器完全一致的规范包。
- 为追求新标签而忽略语义，或用 ARIA 重造已有原生控件。
- 只在单一桌面浏览器测试，遗漏移动端、键盘和辅助技术。
- 把兼容性回退写成安全降级，导致验证或权限检查被绕过。

## 相关链接

- [HTML 基础知识体系](../index.md)
- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)
- [MDN：HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
- [Can I use](https://caniuse.com/)
