# HTML 文档头部

`head` 包含描述文档和加载资源的元数据，通常不直接显示为正文。正确的头部配置关系到字符解码、
移动端布局、页面标题、搜索摘要和资源安全。

## 学习目标

- 配置字符编码、视口、标题和页面描述。
- 理解 `meta`、`link`、`style` 与 `script` 的基本职责。
- 避免泄露敏感信息或加载不可信资源。

## 核心概念

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>无障碍图片指南 | 前端手册</title>
  <meta name="description" content="学习替代文本、图片尺寸与加载策略。">
  <link rel="stylesheet" href="styles.css">
</head>
```

字符编码声明应尽早出现。服务器的 `Content-Type` 响应头也应声明 UTF-8，并与文档保持一致。
viewport 声明让移动浏览器按设备宽度布局，而不是按较宽的虚拟画布缩放。

## 页面标题与描述

每个页面应有准确、可区分的 `title`。通常先写具体页面主题，再写站点名称。
`description` 可供搜索引擎生成摘要参考，但搜索引擎不保证采用，也不会显示在页面正文中。

不要把密码、内部路径、令牌或不应公开的业务数据放进元数据。浏览器、搜索工具和访问者都能读取它。

## 外部资源

```html
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<script src="app.js" defer></script>
```

`link` 可声明样式表、图标等关系。带 `defer` 的经典脚本会在解析 HTML 的同时下载，
并在文档解析完成后按顺序执行。模块脚本另有模块加载规则。

只加载可信资源。第三方脚本拥有很高页面权限，可能读取 DOM 和用户输入；应减少依赖，固定可审核版本，
并结合内容安全策略、子资源完整性及合适的响应头降低风险。

## 不属于头部的内容

正文标题、段落、导航和主要图片应位于 `body`。`head` 中的 `title` 不是可见的 `h1`，
也不能用 `meta keywords` 代替真实、清楚的页面内容。

## 常见错误

- 遗漏 `title`，或让大量页面使用相同标题。
- 字符编码声明过晚，且与 HTTP 响应头冲突。
- 把可见正文元素放进 `head`，依赖浏览器自动修复。
- 从未知 CDN 加载脚本，未评估供应链和隐私风险。
- 认为 `meta` 能代替服务端安全响应头或访问控制。

## 相关链接

- 上一篇：[链接](links.md)
- 下一篇：[在 HTML 中使用 CSS](css-in-html.md)
- 完整骨架：[HTML 基础](basics.md)
