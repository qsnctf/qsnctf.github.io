# HTML 教程总结

HTML 是描述网页结构与语义的标记语言。
CSS 负责主要视觉表现，JavaScript 负责主要交互行为，三者职责应保持清晰。

## 文档基础

现代文档使用简洁的 `<!doctype html>`、UTF-8、准确的 `lang`、viewport 和唯一 `title`。
元素通过正确嵌套形成 DOM 树；浏览器容错不代表源码有效。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>课程总结</title>
  </head>
  <body>
    <main><h1>课程总结</h1></main>
  </body>
</html>
```

## 结构与布局

使用 `main`、`nav`、`article`、`section` 等元素表达内容角色。
没有更准确语义、仅需分组时才使用 `div`。
页面布局使用正常流、Flexbox 和 Grid，不使用表格、`frameset` 或大量空白字符。

## 内容与可访问性

标题层级反映内容结构；链接用于导航，按钮用于操作。
图片按用途编写 `alt`，表格使用表头和标题，表单控件使用持久可见的标签。
所有功能应能通过键盘操作，焦点必须可见，状态不能只靠颜色表达。

## 表单与 URL

GET 适合读取，POST 适合状态修改，但请求方法本身不提供认证或保密。
HTTPS 保护传输；服务端仍需验证输入、认证用户、检查授权并按需防护 CSRF。
动态 URL 应由 URL API 构造并限制允许协议，不直接拼接不可信字符串。

## iframe 与脚本

`frame` 和 `frameset` 已废弃；`iframe` 仍可使用，但需要准确 `title`、最小化 `sandbox`
令牌和 `allow` 权限，并谨慎处理第三方内容与 `postMessage`。

脚本优先采用模块或 `defer`，并按渐进增强设计。
显示普通数据时使用 `textContent`，避免将不可信内容传入 HTML 解析接口。

## 颜色、字符与编码

颜色通过 CSS 设置，可使用名称、十六进制、RGB、HSL 等表示。
必须检查对比度，并用文字或结构补充颜色状态。
文档统一使用 UTF-8；字符引用用于表示 `<`、`&` 等特殊字符，但不是通用安全方案。

## 最终检查

- 使用验证器检查嵌套、重复 ID 和无效属性。
- 在窄屏、宽屏、缩放和长文本环境下检查布局。
- 只用键盘完成导航、表单和动态交互。
- 检查无障碍名称、地标、标题和焦点顺序。
- 在网络与元素面板中确认真实请求、响应和最终 DOM。
- 服务端不信任来自 HTML 表单、隐藏字段或客户端脚本的任何权限声明。

完成复习后可参加[HTML 测验](quiz.md)，或查看[HTML 速查列表](quick-reference.md)。
