# HTML 基础

本页通过一个完整而小型的文档介绍 HTML 的基本书写方式。示例可以直接保存为 `.html` 文件，
然后在现代浏览器中打开。

## 学习目标

- 编写结构完整的 HTML5 文档。
- 区分文档声明、根元素、头部和正文。
- 使用缩进与验证工具保持结构清晰。

## 最小完整页面

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>城市步行指南</title>
  </head>
  <body>
    <header>
      <h1>城市步行指南</h1>
    </header>
    <main>
      <p>选择安全路线，并留意天气变化。</p>
      <a href="lists.md">查看出发清单</a>
    </main>
  </body>
</html>
```

## 核心概念

`<!doctype html>` 告诉浏览器按现代标准模式处理文档。`html` 是根元素，`head` 保存元数据，
`body` 保存页面正文。`lang="zh-CN"` 帮助读屏和翻译工具选择合适的语言规则。

开始标签、内容与结束标签通常组成一个元素：

```html
<p>这是一段正文。</p>
```

属性写在开始标签中，为元素提供额外信息。属性值统一加引号有助于避免空格和特殊字符引起歧义：

```html
<a href="introduction.md" lang="zh-CN">返回简介</a>
```

## 注释与空白

```html
<!-- 说明维护原因，不存放密码或内部令牌。 -->
<p>连续的普通空白通常会折叠为一个空格。</p>
```

注释会发送到客户端，不能用于隐藏敏感信息。缩进主要服务于源码阅读，不会自动改变元素语义。

## 安全实践

示例中的文本是固定内容。真实应用显示用户输入时，不要用字符串拼接生成标签；应使用模板引擎的
自动转义功能或 `textContent` 等文本 API，并对 URL 协议建立允许列表。

## 常见错误

- 遗漏 `title`、字符编码或文档主要语言。
- 标签交叉闭合，例如 `<strong><em>文字</strong></em>`。
- 在 HTML 中使用 Windows 文件路径而不是 URL 路径与 `/`。
- 把源码注释误当成不会被访问者看到的安全存储区。

## 相关链接

- 上一篇：[编辑器与开发环境](editors.md)
- 下一篇：[HTML 元素](elements.md)
- 深入头部：[文档头部](document-head.md)
