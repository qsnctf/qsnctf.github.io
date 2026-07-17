# XHTML 简介

XHTML 是以 XML 语法表达 HTML 的历史标准路线。
它影响了早期网页开发习惯，但普通现代网站通常直接使用 HTML5 的 HTML 语法。

## 历史背景

XHTML 1.0 将 HTML 4.01 的元素和属性重新表述为 XML 应用。
XHTML 1.1 更强调模块化与严格规则。
曾经规划的 XHTML 2.0 最终停止推进，没有成为现代 Web 的主流基础。

今天的 HTML Living Standard 同时描述 HTML 语法和 XML 序列化方式。
“文件看起来像 XHTML”不等于浏览器按 XML 解析它，响应媒体类型才是关键边界。

## XML 语法特点

```xml
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh-CN">
  <head>
    <title>XHTML 示例</title>
  </head>
  <body>
    <p>所有元素必须正确闭合。</p>
    <img src="diagram.png" alt="流程图" />
  </body>
</html>
```

XML 语法要求：

- 元素与属性名区分大小写，通常使用小写 XHTML 名称。
- 属性值必须加引号。
- 元素必须正确嵌套并闭合。
- 空元素需要 XML 形式的自闭合写法。
- 根元素使用 XHTML 命名空间。

## 媒体类型决定解析器

以 `application/xhtml+xml` 提供时，浏览器按 XML 规则解析，格式错误可能导致文档无法显示。
以 `text/html` 提供时，即使源码包含 XML 声明或 `/>`，浏览器仍使用 HTML 解析器和容错规则。

因此，不应仅凭扩展名 `.xhtml`、DOCTYPE 或代码风格判断实际解析模式。
部署前应确认服务器的 HTTP `Content-Type`。

## 与现代 HTML5 的关系

在 `text/html` 文档中，`<br>`、`<img>` 等空元素不需要尾部斜杠。
写成 `<br />` 通常会被 HTML 解析器接受，但这不会把文档变成 XHTML。
HTML 中的布尔属性可写为 `disabled`；XML 序列化需要显式属性值。

XHTML 曾倡导的引号、正确嵌套和一致小写仍是良好代码风格，
但采用这些习惯不需要切换到 XML 媒体类型。

## 何时使用

只有在系统明确需要 XML 工具链、命名空间或 XML 序列化，并能正确配置媒体类型时，
才应考虑 XHTML。新建普通网页、文档站和 Web 应用通常选择 HTML5。

## 安全与兼容性

XML 解析模式不会自动提升安全性。
页面仍需正确处理不可信数据、URL、脚本、CSP、认证和授权。
部分旧浏览器和工具对 `application/xhtml+xml` 支持有限，选择前应确认目标环境。

上一篇：[HTML 测验](quiz.md)。返回：[HTML 速查列表](quick-reference.md)。
