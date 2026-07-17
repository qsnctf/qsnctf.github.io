# HTML URL

URL 标识网络资源。HTML 的链接、图片、脚本、表单和 iframe 等属性都会解析 URL。
理解基准地址、相对路径、编码和协议限制有助于避免失效链接与安全问题。

## URL 组成

```text
https://example.test:443/docs/page.html?lang=zh#forms
```

其中可包含方案、主机、端口、路径、查询和片段。
片段 `#forms` 由客户端定位到页面内对应 `id`，通常不会随 HTTP 请求发送给服务器。

## 绝对与相对 URL

```html
<a href="https://example.test/docs/">绝对 URL</a>
<a href="summary.md">同目录页面</a>
<a href="../html5/semantic-elements.md">上级 html5 页面</a>
<a href="#encoding">当前页面片段</a>
```

相对 URL 根据当前文档 URL或 `base` 元素解析，不根据开发者本机文件路径解析。
站点根相对地址以 `/` 开始，而 `../` 表示 URL 路径的上一级。

本教程实际导航只使用确认会存在的 tutorial 页面；示例中的 html5 路径用于说明规则。

## 查询参数与编码

查询字符串以 `?` 开始，多个参数通常用 `&` 分隔。
在 HTML 属性中书写与号时应写成 `&amp;`：

```html
<a href="/search?q=html&amp;page=2">第二页结果</a>
```

构造动态 URL 时使用平台 URL API，而不是手工拼接：

```js
const url = new URL("/search", location.origin);
url.searchParams.set("q", userQuery);
```

百分号编码用于 URL 组件中的字节表示，与 HTML 字符引用不是同一机制。

## 安全协议

不要把不可信字符串直接放入 `href`、`src`、`action` 或 `formaction`。
应用应解析 URL，并按业务白名单限制 `https:`、站内相对 URL 等允许方案。
仅检查字符串是否以 `http` 开头容易被大小写、空白和解析差异绕过。

`javascript:` URL 会执行代码，现代应用通常不应允许。
外部链接若打开新标签页，应说明行为，并按需要使用 `rel="noopener noreferrer"`。

## 可用性

- 链接文本说明目标，不大量使用“点击这里”。
- 页面内目标 `id` 保持唯一、稳定并能在聚焦后看见。
- 避免把敏感数据放入查询字符串、浏览历史和日志。
- 重定向参数只允许受信任目标，防止开放重定向。
- 部署到子路径时测试相对地址，不假定站点永远位于域名根目录。

下一篇：[HTML 速查列表](quick-reference.md)。
