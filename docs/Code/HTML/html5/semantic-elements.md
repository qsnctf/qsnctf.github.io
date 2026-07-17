# HTML5 语义元素

语义元素用名称表达内容职责，让浏览器、搜索引擎、辅助技术和维护者理解页面结构。
它们不是布局组件，也不会自动带来安全性或良好可访问性。

## 为什么使用语义元素

- 源码更容易阅读和维护。
- 地标帮助屏幕阅读器快速导航。
- 标题与章节关系更清晰。
- 搜索和阅读工具能更准确地提取内容。

## 常用页面结构

```html
<body>
  <header>站点页眉</header>
  <nav aria-label="主导航">...</nav>
  <main>
    <article>...</article>
    <aside>...</aside>
  </main>
  <footer>站点页脚</footer>
</body>
```

`header` 和 `footer` 既可属于整个页面，也可属于某个 `article` 或 `section`。
`main` 表示当前页面的主要内容，通常只保留一个可见的 `main`。

## article、section 与 div

`article` 是可独立分发或复用的完整内容，例如文章、帖子或评论。
`section` 是有明确主题的章节，通常应有标题。
`div` 没有额外语义，适合纯布局、样式挂钩或没有更准确元素的情况。

```html
<article>
  <h2>浏览器存储</h2>
  <section>
    <h3>选择 API</h3>
    <p>根据容量、结构和生命周期选择。</p>
  </section>
</article>
```

不要为了样式把所有容器都替换成 `section`。如果无法为区域起一个合理标题，
它往往只是普通容器。

## nav 与 aside

`nav` 用于主要导航链接组，不必包住页面中的每一组链接。
页面存在多个导航时，应提供可区分的名称：

```html
<nav aria-label="主导航">...</nav>
<nav aria-label="文章目录">...</nav>
```

`aside` 表示与周围主体间接相关的补充内容，例如术语解释、相关文章或侧栏。
它不是“放在右边”的同义词，位置由 CSS 决定。

## figure 与时间信息

```html
<figure>
  <img src="storage-flow.svg" alt="浏览器存储选择流程图">
  <figcaption>按数据规模和查询需求选择存储 API。</figcaption>
</figure>
<time datetime="2026-07-17">2026 年 7 月 17 日</time>
```

`figure` 表示可从正文引用的自包含内容，`figcaption` 提供说明。
`time` 的 `datetime` 为机器提供标准化日期或时间。

## 标题与可访问性

语义元素不能代替合理标题层级。页面主题通常使用 `h1`，子章节按逻辑递进。
不要仅因字号需要而跳级，视觉大小应交给 CSS。

优先使用原生元素：导航使用链接，操作使用按钮，表单控件使用关联的 `label`。
只有原生语义不足时才补充 ARIA；错误 ARIA 可能比没有 ARIA 更糟。

## 实践检查

- 元素名称是否真实描述内容职责，而不是视觉位置？
- 每个主题章节是否具有清楚的标题？
- 页面地标是否适量，重复地标是否有名称？
- 交互是否使用了键盘可操作的原生控件？
- 隐藏或折叠内容是否同步维护焦点和可访问状态？

更完整的文档内容模型见[HTML 元素](../tutorial/elements.md)和[HTML5 新元素](new-elements.md)。
