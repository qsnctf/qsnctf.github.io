# 文档元素、内容模型与语义

本篇从 HTML5 文档骨架出发，解释元素如何构成有效结构，以及语义和可访问性为何
是同一个工程问题的不同侧面。HTML 描述内容，不负责执行业务算法。

## 文档骨架

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="HTML 语义元素学习笔记">
    <title>文档元素与语义</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <header>站点页眉</header>
    <main>页面主要内容</main>
    <footer>站点页脚</footer>
  </body>
</html>
```

`head` 保存元数据、标题和外部资源引用，通常不作为正文显示。
`body` 保存文档内容。字符编码声明应位于文档前部，避免浏览器先按错误编码解析。

## 内容模型

HTML 规范用内容类别和内容模型描述“什么元素可以放在哪里”。常见类别包括：

- 元数据内容：`title`、`meta`、`link`、`style` 等。
- 流式内容：正文中大多数元素。
- 章节内容：`article`、`aside`、`nav`、`section`。
- 标题内容：`h1` 到 `h6`、`hgroup`。
- 短语内容：段落内部的文本级元素，如 `em`、`strong`、`code`。
- 嵌入内容：`img`、`audio`、`video`、`iframe` 等。
- 交互内容：`a`、`button`、部分 `input`、`select` 等。

类别会重叠，并非简单的“块级元素与行内元素”二分法。
CSS 的 `display` 可以改变布局表现，却不会改变元素的 HTML 语义或允许的子内容。

## 正确嵌套

段落不能包含任意流式内容，交互元素也通常不应互相嵌套：

```html
<section>
  <h2>安装说明</h2>
  <p>先检查环境，再运行安装命令。</p>
</section>
```

不要把 `div`、另一个 `p` 或章节元素直接放进 `p`。浏览器遇到某些开始标签时会
隐式结束段落，导致实际 DOM 与源码缩进不同。验证器和元素面板可帮助发现此问题。

## 页面地标

```html
<header>
  <a href="/">站点名称</a>
  <nav aria-label="主导航">
    <a href="/learn/">学习</a>
    <a href="/about/">关于</a>
  </nav>
</header>
<main id="main-content">
  <h1>HTML 学习路线</h1>
</main>
<footer>版权与联系信息</footer>
```

- `header` 是页面或章节的引导内容，不必局限为全站页眉。
- `nav` 表示主要导航链接组，不是每组链接都需要包在其中。
- `main` 表示页面主体，一般只有一个当前可见的主要内容区域。
- `footer` 是页面或章节的页脚信息。
- `aside` 表示与周围内容间接相关的补充内容。

重复地标应提供可区分名称，例如为两个 `nav` 分别设置“主导航”和“文章目录”。

## article 与 section

`article` 表示可独立分发或复用的完整内容，如文章、帖子、评论或产品卡片。
`section` 表示有主题的文档章节，通常应有标题：

```html
<article>
  <h2>编码基础</h2>
  <section>
    <h3>UTF-8</h3>
    <p>UTF-8 是 Unicode 的一种可变长编码。</p>
  </section>
</article>
```

若只是为了应用 CSS 或布局且没有独立语义，使用 `div` 更诚实。

## 标题层级

标题 `h1` 到 `h6` 建立内容大纲，级别应反映嵌套关系：

```html
<h1>浏览器基础</h1>
<h2>解析流程</h2>
<h3>标记化</h3>
<h2>开发者工具</h2>
```

不要因为希望字体更小就跳到 `h5`；视觉大小交给 CSS。
页面通常有一个描述主要主题的 `h1`，各章节按逻辑递进，避免无原因跳级。

## 文本语义

- `p`：段落。
- `em`：语气强调，可能改变句意重音。
- `strong`：重要性、严重性或紧迫性。
- `code`：代码片段；多行代码常与 `pre` 配合。
- `kbd`：用户输入，如键盘按键或命令。
- `samp`：程序输出示例。
- `mark`：与当前上下文相关的高亮。
- `small`：附注、小字条款等旁注信息。
- `time`：日期或时间，可用 `datetime` 提供机器可读值。
- `abbr`：缩写，必要时通过正文或 `title` 解释。

`b` 和 `i` 仍是合法元素，但分别表示吸引注意和不同语气/分类，而不是单纯“粗体”
与“斜体”。若只是视觉效果，应使用 CSS。

## 列表与引用

```html
<ol>
  <li>读取响应头。</li>
  <li>确认字符编码。</li>
  <li>观察解析后的 DOM。</li>
</ol>
<blockquote cite="https://example.test/spec">
  <p>引用的一段完整内容。</p>
</blockquote>
```

`ul` 表示无顺序列表，`ol` 表示顺序有意义的列表，`dl` 表示名称与描述的关联列表。
短的行内引用可使用 `q`；`cite` 属性是来源 URL，不会自动生成可见引用说明。

## 原生控件优先

```html
<button type="button">刷新结果</button>
```

原生按钮天然可聚焦，支持键盘激活，并向无障碍 API 暴露正确角色。
用 `div` 模拟按钮需要自行补齐焦点、键盘、禁用状态和角色，容易遗漏。
链接用于导航到资源，按钮用于触发当前页面中的操作，不应按外观互换职责。

## 可访问名称

交互控件需要可访问名称。名称可以来自可见文本、关联的 `label`、`alt`，或在确有
必要时来自 `aria-label`、`aria-labelledby`。可见名称通常最清楚：

```html
<button type="button">下载报告</button>
```

图标按钮不能只依赖图形含义：

```html
<button type="button" aria-label="关闭对话框">
  <span aria-hidden="true">×</span>
</button>
```

`aria-hidden="true"` 不应放在可聚焦元素或包含可聚焦后代的容器上。

## 语言与阅读方向

文档根元素应声明主要语言，局部语言变化也应标记：

```html
<p>术语 <span lang="en">content model</span> 可译为“内容模型”。</p>
```

语言信息帮助读屏器选择发音规则。书写方向通常由语言和 Unicode 文本决定；
混合双向文本时应使用 `bdi` 等专用机制，而不是手工插入不可见控制字符。

## 跳过链接与焦点

长页面可在开头提供“跳到主要内容”链接：

```html
<a class="skip-link" href="#main-content">跳到主要内容</a>
<main id="main-content" tabindex="-1">
  <h1>页面标题</h1>
</main>
```

不要移除焦点轮廓而不提供同等清晰的替代样式。DOM 顺序应与视觉和键盘阅读顺序
一致，避免仅靠 CSS 重排造成“看见的顺序”和“聚焦的顺序”分离。

## 检查清单

- `doctype`、`lang`、UTF-8、viewport 和唯一 `title` 是否齐全。
- 标题能否单独构成清晰目录，是否存在无理由跳级。
- 页面地标是否准确，重复地标是否有名称。
- 是否错误地用 `div` 模拟链接、按钮或表单控件。
- 图片、图标按钮和控件是否具有合适的可访问名称。
- 键盘能否按合理顺序到达并操作全部交互内容。
- 隐藏内容是否真的应对所有用户隐藏。
- 验证器报告的嵌套和属性错误是否已经处理。

下一篇：[链接、媒体、表格与表单](links-media-tables-and-forms.md)。
