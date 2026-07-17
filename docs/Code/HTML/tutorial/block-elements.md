# HTML 区块元素

“区块元素”是传统教学术语，通常指默认从新行开始并占据可用宽度的元素。
现代 HTML 更强调内容模型与语义；是否换行主要由 CSS 的 `display` 决定。

## 常见区块结构

- `main`：页面独有的主要内容。
- `article`：可独立分发的文章、帖子或卡片。
- `section`：围绕一个主题组织的章节，通常带标题。
- `nav`：主要导航链接组。
- `aside`：与正文间接相关的补充信息。
- `header`、`footer`：页面或章节的引导与收尾内容。
- `div`：没有额外语义的通用容器。

```html
<main>
  <article>
    <header>
      <h1>浏览器如何解析 HTML</h1>
      <p>更新时间：<time datetime="2026-07-17">2026 年 7 月 17 日</time></p>
    </header>
    <section>
      <h2>构建 DOM</h2>
      <p>浏览器把标记解析为节点树。</p>
    </section>
  </article>
</main>
```

## div 的正确用途

当内容没有更准确的语义元素，只需要分组以便布局或添加样式时，可使用 `div`：

```html
<div class="toolbar">
  <button type="button">刷新</button>
  <button type="button">导出</button>
</div>
```

不要先选择 `div`，再用 `role` 模拟已经存在的原生元素。
例如操作应使用 `button`，导航应使用 `a`，数据表格应使用 `table`。

## 块级表现不是固定语义

```css
.toolbar {
  display: flex;
  gap: 0.75rem;
}
```

CSS 可以让 `div` 使用弹性布局，也可以让其他元素呈现为块。
改变 `display` 不会改变 HTML 内容模型、键盘行为或无障碍角色。

## 嵌套规则

元素应按相反顺序闭合，并遵守各自内容模型。
`p` 不能包含 `div`、`section` 等流式容器；浏览器可能提前关闭段落。

```html
<section aria-labelledby="status-heading">
  <h2 id="status-heading">服务状态</h2>
  <p>所有系统运行正常。</p>
</section>
```

## 选择建议

- 内容能独立存在时考虑 `article`。
- 内容是有标题的主题章节时考虑 `section`。
- 只是布局钩子且没有语义时使用 `div`。
- 保持标题层级与文档结构一致，不按字号选择标题。
- 不使用大量空 `div` 或 `<br>` 制造间距。
- 用验证器和浏览器元素面板检查最终 DOM。

下一篇：[HTML 布局](layout.md)。
