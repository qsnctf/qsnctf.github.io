# HTML 入门教程

本教程面向第一次系统学习 HTML 的读者，目标是写出结构清楚、语义准确、可访问且易维护的页面。
HTML 描述内容的含义与组织方式；视觉样式主要交给 CSS，交互逻辑主要交给 JavaScript。

## 学习目标

- 理解 HTML 文档、元素、标签和属性之间的关系。
- 掌握文本、链接、图片、表格和列表的正确用途。
- 建立语义优先、可访问性优先和安全输出的习惯。
- 能使用编辑器、浏览器和验证工具发现常见问题。

## 推荐路线

1. [HTML 简介](introduction.md)：认识 HTML 的职责与网页工作方式。
2. [编辑器与开发环境](editors.md)：建立简单可靠的练习环境。
3. [HTML 基础](basics.md)：编写并查看第一个完整页面。
4. [HTML 元素](elements.md)：理解标签、嵌套和空元素。
5. [HTML 属性](attributes.md)：学习属性的通用写法与使用原则。
6. [标题](headings.md)与[段落](paragraphs.md)：组织正文结构。
7. [文本格式化](text-formatting.md)：用语义元素标记重点和代码。
8. [链接](links.md)：创建清楚、安全的页面导航。
9. [文档头部](document-head.md)：配置标题、编码和元数据。
10. [在 HTML 中使用 CSS](css-in-html.md)：为结构添加可维护的样式。
11. [图片](images.md)、[表格](tables.md)与[列表](lists.md)：表达常见内容。

## 核心概念

一个现代 HTML 页面至少需要明确文档类型、语言、字符编码、视口和页面标题：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>我的学习页面</title>
  </head>
  <body>
    <main>
      <h1>HTML 学习记录</h1>
      <p>从有意义的结构开始编写网页。</p>
    </main>
  </body>
</html>
```

浏览器会把源码解析成 DOM 树，再结合 CSS 绘制页面。浏览器能够修复部分错误，
但自动修复后的 DOM 不一定符合作者预期，因此不能用“看起来正常”代替结构检查。

## 现代与安全原则

- 优先使用有语义的原生元素，不用 `div` 模拟按钮或标题。
- 用户或外部数据进入页面前必须按输出上下文安全编码，不能直接拼接 HTML。
- 图片提供合适的替代文本，交互控件提供可访问名称。
- 使用 UTF-8，不依赖过时的表现属性或浏览器私有标签。
- 外部资源只从可信位置加载，并在应用层配置合适的安全策略。

## 常见错误

- 把 HTML 当成负责算法和业务逻辑的编程语言。
- 为追求外观而跳过标题级别或滥用 `<br>`、表格布局。
- 只检查页面截图，不检查键盘操作、窄屏布局和最终 DOM。
- 认为隐藏内容、禁用按钮或客户端验证能够实现权限控制。

## 相关链接

- 下一篇：[HTML 简介](introduction.md)
- 快速实践：[HTML 基础](basics.md)
- 结构细节：[HTML 元素](elements.md)
