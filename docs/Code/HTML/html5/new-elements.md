# 新增元素与语义结构

## 学习目标

- 正确使用现代 HTML 的结构与内容元素。
- 理解语义元素不等于固定视觉布局。
- 为旧环境和辅助技术保留清晰文档结构。

## 常见结构元素

`header` 表示页面或章节的介绍内容，`nav` 表示主要导航，`main` 是页面独有主内容，
`article` 表示可独立分发的内容，`section` 表示有主题的章节，`aside` 表示补充内容，
`footer` 表示页面或章节的页脚。它们都是 HTML Living Standard 的一部分。

## 安全可运行示例

```html
<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>语义页面</title></head>
<body>
  <header><h1>前端学习笔记</h1></header>
  <nav aria-label="主要导航">
    <a href="#latest">最新文章</a>
    <a href="#about">关于</a>
  </nav>
  <main>
    <article id="latest">
      <h2>为什么使用语义元素</h2>
      <p>它们帮助人和工具理解内容角色。</p>
      <time datetime="2026-07-17">2026 年 7 月 17 日</time>
    </article>
    <aside id="about"><h2>相关说明</h2><p>这是补充信息。</p></aside>
  </main>
  <footer><small>示例内容，无外部输入。</small></footer>
</body>
</html>
```

示例不把用户输入拼接进 HTML。如果需要显示外部数据，应创建元素并设置 `textContent`，
或使用经过上下文安全处理的模板系统，不能仅靠删除 `<script>` 标签防止 XSS。

## 其他常用元素

- `figure` 与 `figcaption` 组合图片、代码或图表及其说明。
- `details` 与 `summary` 提供原生可展开内容。
- `mark` 标记与当前语境相关的文本，不只是黄色样式。
- `progress` 表示任务完成度，`meter` 表示已知范围内的度量值。
- `template` 保存默认不渲染的 DOM 片段，使用时仍需安全填充数据。

## 标题与章节

每个有标题的章节使用清楚的 `h2`、`h3` 层级。不要根据字体大小跳级，也不要假设
章节元素会自动修正标题大纲。一个页面通常有一个描述主内容的 `h1`。

## 兼容与无障碍

现代浏览器普遍识别这些元素，但元素存在不保证使用正确。`nav` 应有可区分的名称，
页面只能有一个可见的 `main`，原生 `details` 的交互通常优于自行模拟。
CSS 不可用时，源码顺序仍应合理；键盘焦点顺序应与阅读顺序一致。

## 常见错误

- 把每个 `div` 都替换成 `section`，却不给章节标题。
- 用 `article` 仅因为需要卡片样式。
- 在多个导航区使用相同且含糊的无障碍名称。
- 用 `header`、`footer` 推断视觉位置，而忽略它们可属于章节。
- 用 ARIA 覆盖正确的原生语义，反而制造冲突。

## 相关链接

- [HTML5 教程入口](index.md)
- [浏览器支持](browser-support.md)
- [表单元素](form-elements.md)
- [MDN：HTML 元素参考](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements)
- [WHATWG：HTML elements](https://html.spec.whatwg.org/multipage/semantics.html)
