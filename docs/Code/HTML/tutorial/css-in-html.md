# 在 HTML 中使用 CSS

CSS 负责页面的视觉表现。HTML 应保持语义清晰，再通过样式表设置颜色、字体、间距和布局，
这样内容在样式加载失败时仍然可理解。

## 学习目标

- 比较外部、内部和行内 CSS 的使用方式。
- 使用类名建立可维护的样式关联。
- 认识响应式、可访问性和 CSS 安全边界。

## 核心概念

多数站点优先使用外部样式表，便于缓存和复用：

```html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```

```css
.notice {
  padding: 1rem;
  border-inline-start: 0.25rem solid #1769aa;
  background: #eef7ff;
}
```

```html
<p class="notice">维护期间请保存正在编辑的内容。</p>
```

类名宜描述内容角色或组件，如 `notice`、`site-nav`，而不是 `blue-text`、`left-20px`。

## 内部与行内样式

小型独立示例可以在 `head` 使用 `style`：

```html
<style>
  body {
    max-width: 70ch;
    margin-inline: auto;
    padding: 1rem;
  }
</style>
```

`style` 属性只作用于单个元素，复用和覆盖都较困难，也会让严格内容安全策略更复杂。
生产页面通常避免大量行内样式，但邮件模板等受限环境可能有具体需求。

## 现代布局与可访问性

优先使用 Flexbox、Grid、逻辑属性和媒体查询，不使用表格排版。以相对单位和内容驱动布局，
同时检查窄屏、放大文本、高对比度及 `prefers-reduced-motion` 等用户偏好。

不要移除键盘焦点轮廓，除非提供同等清楚的替代样式。颜色对比应足够，状态不能只靠颜色表达。

## 安全边界

不要把不可信字符串直接插入 `style` 属性或样式表。CSS 能加载外部资源、覆盖界面并形成欺骗性布局；
应限制可配置的属性和值，并通过内容安全策略控制允许的样式来源。

## 常见错误

- 使用 `font`、`center`、`bgcolor` 等过时 HTML 表现方式。
- 选择器过度依赖复杂 DOM 层级，结构一改样式就失效。
- 用固定像素宽度导致窄屏横向滚动。
- 为了“整洁”移除焦点样式或降低文字对比度。
- 把用户输入直接拼进 CSS URL 或任意声明。

## 相关链接

- 上一篇：[文档头部](document-head.md)
- 下一篇：[图片](images.md)
- 语义文本：[文本格式化](text-formatting.md)
