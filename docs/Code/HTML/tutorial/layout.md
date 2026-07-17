# HTML 布局

HTML 负责页面结构和语义，CSS 负责排列、尺寸、间距与响应式变化。
现代布局优先使用 Flexbox、Grid 和正常文档流，不使用表格或框架排版。

## 语义骨架

```html
<body>
  <header class="site-header">站点页眉</header>
  <nav aria-label="主导航">导航链接</nav>
  <main>
    <article>主要文章</article>
    <aside>相关资料</aside>
  </main>
  <footer>站点页脚</footer>
</body>
```

DOM 顺序应先满足阅读和键盘操作，再考虑视觉排列。
不要用 CSS 把焦点顺序与视觉顺序变成相反方向。

## Flexbox 一维布局

Flexbox 适合工具栏、导航、卡片行等单轴排列：

```css
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
```

允许换行可以降低窄屏溢出的风险。
子项需要收缩时，注意长单词和 URL 仍可能撑破容器。

## Grid 二维布局

```css
main {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(14rem, 1fr);
  gap: 2rem;
  max-width: 72rem;
  margin-inline: auto;
  padding: 1rem;
}

@media (max-width: 48rem) {
  main {
    grid-template-columns: 1fr;
  }
}
```

`minmax(0, 3fr)` 允许主列正确收缩。
媒体查询在空间不足时改为单列，而不是只缩小文字。

## 响应式基础

文档应包含 viewport 声明：

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

优先使用相对单位、流式宽度和内容驱动的断点。
图片可用 `max-width: 100%` 防止超过容器，但仍应声明固有尺寸以减少布局跳动。

## 常见问题

- 不用 `table`、透明图片或连续 `&nbsp;` 布局。
- 避免固定高度截断放大后的文字。
- 不隐藏焦点轮廓，确保交互控件可见且可达。
- 检查 200% 缩放、窄屏、长文本和不同语言内容。
- 浮动适合文字环绕图片，不是现代页面主布局方案。
- `position: absolute` 会脱离常规流，不应成为默认排版工具。

相关内容：[HTML 区块元素](block-elements.md)与[框架和 iframe](frames-and-iframes.md)。
