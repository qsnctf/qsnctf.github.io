# 浏览器、DOM 与开发者工具

浏览器接收的是网络响应字节，呈现给用户的却是经过解码、解析、样式计算、布局、
绘制和脚本修改后的结果。理解这些阶段，才能解释“源码里有但页面没有”或
“元素面板里有但查看源码找不到”等现象。

## 从 URL 到页面

一次典型导航大致包括：

1. 解析 URL，确认协议、主机、端口、路径、查询和片段。
2. 查询 DNS 并建立连接；HTTPS 还要完成 TLS 协商与证书验证。
3. 发送 HTTP 请求，包括方法、路径、请求头和可选请求体。
4. 接收状态码、响应头和响应体字节。
5. 根据 HTTP 头、BOM 和 HTML 声明等确定字符编码。
6. 将 HTML 文本标记化并构建 DOM。
7. 获取 CSS、脚本、图片、字体等子资源。
8. 构建样式与布局信息，绘制页面，并响应后续交互。

实际浏览器会并行、预加载和增量渲染，上述顺序是便于理解的模型，不是严格串行实现。

## 字符编码

HTTP 响应可以声明：

```http
Content-Type: text/html; charset=utf-8
```

文档内部也应尽早声明：

```html
<meta charset="utf-8">
```

两者不一致会造成乱码或解析差异，应由服务器和文档统一为 UTF-8。
编码决定字节如何变成字符，HTML 实体则是在已经解码的 HTML 文本中表示字符，
二者不是同一层问题。错误地反复编码或解码也可能造成数据损坏。

## HTML 标记化与树构建

HTML 解析器不是简单地按正则表达式寻找尖括号。它使用状态机标记化输入，并根据
树构建规则插入元素、文本和注释节点。解析上下文会影响相同字符的意义。

```html
<p>第一段
<p>第二段
```

在 HTML 中，新的 `p` 开始标签会隐式结束前一个段落。浏览器可能生成两个完整的
`p` 元素，即使源码没有结束标签。容错是互操作规则，不是鼓励省略或写错标记。

表格、模板、SVG/MathML 集成点和错误嵌套还会触发更复杂的修复规则。

## DOM 是什么

DOM（Document Object Model，文档对象模型）是浏览器向程序暴露的节点树接口。
它不是 HTML 文件本身，也不是屏幕截图。HTML 解析可生成 DOM，JavaScript 还能继续
创建、移动、修改或删除节点。

```html
<main id="content">
  <h1>标题</h1>
  <p>正文</p>
</main>
```

对应树中 `document` 包含 `html`，其下有 `head` 和 `body`，`body` 再包含 `main`。
元素之间的空白也可能形成文本节点，因此 `children` 与 `childNodes` 结果不同。

## DOM 查询与修改

```js
const heading = document.querySelector("h1");
heading.textContent = "更新后的标题";

const note = document.createElement("p");
note.textContent = "这段文本由脚本安全创建。";
document.querySelector("main").append(note);
```

`querySelector` 使用 CSS 选择器查找第一个匹配元素。`textContent` 把值作为文本处理，
适合显示普通不可信字符串。`innerHTML` 会把字符串重新当作 HTML 解析，若数据不可信，
就可能跨越代码与数据边界；应优先使用文本和 DOM API。

## HTML 属性与 DOM 属性

HTML attribute 是源码或标记中的属性，DOM property 是 JavaScript 对象上的状态。
二者常相互反映，但不总是相同：

```html
<input id="name" value="初始值">
```

用户编辑后，`input.value` 通常是当前值，而 `getAttribute("value")` 仍可能是初始属性值。
复选框的 `checked` 当前状态与 `checked` 内容属性也需区分。调试表单时应查看正确层次。

## 脚本加载

```html
<script src="app.js" defer></script>
<script type="module" src="main.js"></script>
```

普通外部脚本默认会阻塞 HTML 解析直至下载并执行完毕。`defer` 允许并行下载，待文档
解析完成后按顺序执行。模块脚本默认具有类似延迟执行行为，并采用模块作用域。
`async` 脚本下载完成即执行，顺序不稳定，适合彼此独立的脚本。

脚本可以使用 `DOMContentLoaded` 观察初始 HTML 已解析完成；`load` 还等待许多子资源。

## 查看源码

“查看网页源代码”通常显示导航响应中的原始 HTML 文本，适合检查：

- 服务端实际返回的初始标记。
- `meta`、注释、初始脚本和资源 URL。
- 数据是在响应中直接存在，还是后来由脚本请求生成。

它通常不会反映 JavaScript 后续 DOM 修改，也不等于服务器端模板、源代码仓库或数据库。
服务端代码不会因为浏览器“查看源码”而自动公开，但发送到客户端的内容都应视为可见。

## 元素面板

元素（Elements/Inspector）面板显示当前解析并可能被脚本修改后的 DOM，同时提供匹配的
CSS 规则、计算样式、盒模型、事件监听器和无障碍信息。它适合检查：

- 浏览器如何修复错误嵌套。
- 元素当前属性、文本、状态和实际层级。
- 哪条 CSS 规则胜出，尺寸和间距从何而来。
- 控件的角色、名称、焦点能力和无障碍树结果。

面板中的临时修改只影响本地当前页面，刷新后通常消失，也没有修改服务器数据。

## 网络面板

网络（Network）面板记录导航和子资源请求。调试时重点查看：

- 请求 URL、方法、状态码和重定向链。
- 请求头、响应头、Cookie 与缓存相关字段。
- 查询字符串、表单数据或 JSON 请求体。
- 响应内容、内容类型、字符编码和实际传输大小。
- 发起者、时间线、阻塞、连接和服务器等待时间。

打开面板后再复现问题，必要时启用保留日志和禁用缓存。面板可能展示令牌、Cookie 和
个人数据，分享截图或导出的 HAR 文件前必须脱敏。

## 控制台与源代码面板

控制台显示脚本错误、警告和显式日志，也可在当前页面上下文运行短表达式：

```js
document.characterSet
document.querySelectorAll("img:not([alt])").length
```

不要把来源不明的代码粘贴进控制台。控制台代码拥有当前页面上下文中的能力，
可能读取页面数据或发起请求。浏览器关于“不要粘贴代码”的警告应认真对待。

源代码（Sources/Debugger）面板用于查看已加载脚本、设置断点、单步执行和观察作用域。
格式化后的压缩脚本便于阅读，但仍不等于原始工程源码；source map 可能提供映射。

## 存储与应用面板

Application/Storage 面板可查看 Cookie、localStorage、sessionStorage、IndexedDB、缓存和
Service Worker。需要区分：

- Cookie 可以随匹配请求发送；`HttpOnly` Cookie 不允许 JavaScript 读取。
- localStorage 按源长期保存字符串，不会自动随 HTTP 请求发送。
- sessionStorage 通常限定于源和标签页会话。
- Service Worker 可拦截请求并提供离线缓存，旧缓存可能解释更新不生效。

浏览器存储不是秘密保险箱。XSS、恶意扩展、共享设备或错误权限都可能暴露数据。

## URL、源与同源策略

源由协议、主机和端口组成。以下 URL 与 `https://app.example.test/` 比较：

| URL | 是否同源 | 原因 |
| --- | --- | --- |
| `https://app.example.test/page` | 是 | 协议、主机、端口相同 |
| `http://app.example.test/` | 否 | 协议不同 |
| `https://api.example.test/` | 否 | 主机不同 |
| `https://app.example.test:8443/` | 否 | 端口不同 |

同源策略限制脚本读取其他源的数据。CORS 是服务器通过响应头选择性放宽读取权限的机制，
不是认证，也不会阻止浏览器发送所有跨源请求。表单、图片和导航各有自己的跨源规则。

## 缓存与重定向调试

页面内容陈旧时，应同时检查内存缓存、磁盘缓存、Service Worker、CDN 和服务器缓存头。
`304 Not Modified` 表示客户端可复用已有响应体，并非服务器返回了一个空页面。

重定向状态码如 301、302、303、307、308 对方法保留规则不同。网络面板的完整链条
可以揭示登录循环、协议切换和路径规范化问题，不要只观察最终 URL。

## 调试工作流

1. 明确预期、实际结果和最小复现步骤。
2. 在网络面板确认请求是否发出以及响应是否正确。
3. 用查看源码确认初始 HTML，用元素面板确认最终 DOM。
4. 检查控制台错误和被浏览器阻止的资源。
5. 检查计算样式、布局、可访问名称和焦点状态。
6. 排除缓存、扩展和 Service Worker 影响。
7. 修复根因后刷新并重新执行完整路径。

下一篇：[HTML 转义、XSS 与 CTF](html-escaping-xss-and-ctf.md)。
