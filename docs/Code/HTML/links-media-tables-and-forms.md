# 链接、媒体、表格与表单
本篇介绍承载导航、媒体、结构化数据和用户输入的核心元素。正确选择也决定键盘行为、
网络请求、可访问性和安全边界。

## 链接与 URL

```html
<a href="/docs/start.html">开始学习</a>
<a href="https://example.test/reference">外部参考</a>
<a href="#forms">跳到表单章节</a>
<a href="mailto:team@example.test">发送邮件</a>
```

`href` 可以是绝对 URL、相对 URL、文档片段或特定协议 URL。
相对 URL 以当前文档 URL或 `base` 元素指定的基准 URL 解析，而不是以服务器文件系统
路径解析。根相对路径 `/docs/` 从站点根开始，`../` 表示上一级 URL 路径。

链接文本应说明目标，避免大量“点击这里”。同页片段目标的 `id` 应唯一且稳定。

## 新窗口与下载

```html
<a href="report.pdf" download>下载报告</a>
<a href="https://example.test/" target="_blank" rel="noopener noreferrer">
  在新标签页打开参考站点
</a>
```

`download` 是下载提示，仍受同源、响应头和浏览器策略影响。新标签页会改变用户预期，
应在界面中说明。现代浏览器通常会为 `_blank` 隔离
`window.opener`，显式 `noopener` 仍可清楚表达意图；`noreferrer` 还会抑制来源信息。

不要将不可信字符串直接拼成 `href`。应用应解析并限制允许的协议，通常仅允许
业务需要的 `https:`、站内相对地址等，而不是只检查字符串前缀。

## 图片

```html
<img
  src="architecture.png"
  alt="客户端发送请求，服务器返回 HTML，浏览器构建 DOM"
  width="960"
  height="540"
  loading="lazy">
```

- `alt` 描述图片在当前上下文中的作用，不必机械描述所有像素。
- 装饰图片使用 `alt=""`，让辅助技术忽略它。
- 链接中只有图片时，`alt` 应描述链接目的。
- `width` 与 `height` 帮助浏览器预留比例，减少布局跳动。
- 首屏关键图片通常不应懒加载，非关键长页面图片可使用 `loading="lazy"`。

图片中若包含重要文字，应在正文提供等价文本，而不是只依赖图片内文字。

## 音频与视频

```html
<video controls width="720" poster="poster.jpg">
  <source src="lesson.webm" type="video/webm">
  <source src="lesson.mp4" type="video/mp4">
  <track kind="captions" src="lesson.zh.vtt" srclang="zh" label="中文字幕" default>
  <p>浏览器无法播放视频，请使用<a href="lesson.mp4">下载链接</a>。</p>
</video>
```

`controls` 提供浏览器原生控制。自动播放通常受策略限制，带声音自动播放也会干扰用户。
视频应按内容需要提供准确字幕，纯音频可提供文字稿。字幕不等于音频描述；二者解决
不同信息缺失问题。不要把关键信息只放在媒体中。

## 数据表格

表格用于二维数据关系，不应用于页面布局：

```html
<table>
  <caption>浏览器测试结果</caption>
  <thead>
    <tr>
      <th scope="col">浏览器</th>
      <th scope="col">结果</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Firefox</th>
      <td>通过</td>
    </tr>
  </tbody>
</table>
```

`caption` 表明表格主题，`th` 是表头单元格，`scope` 帮助建立简单表格的行列关联。
`thead`、`tbody`、`tfoot` 分组结构。复杂表格可能需要 `id` 与 `headers` 明确关联，
但优先考虑拆成多个简单表格。响应式布局中不要删除重要列而不提供替代访问方式。

## 表单骨架

```html
<form action="/search" method="get">
  <label for="query">关键词</label>
  <input id="query" name="q" type="search" required>
  <button type="submit">搜索</button>
</form>
```

`action` 是提交目标，`method` 常用 `get` 或 `post`。只有有 `name` 且未被禁用的成功
控件通常会参与提交；`id` 主要用于标签、片段和脚本关联，不能替代 `name`。

按钮在表单中的默认类型通常是 `submit`，非提交按钮应显式写 `type="button"`。

## label 与分组

```html
<fieldset>
  <legend>通知方式</legend>
  <label><input type="radio" name="channel" value="email"> 邮件</label>
  <label><input type="radio" name="channel" value="sms"> 短信</label>
</fieldset>
```

`label` 扩大可点击区域并提供可访问名称。`placeholder` 会在输入后消失，不能替代标签。
相关选项用 `fieldset` 与 `legend` 分组。复选框适合多选，拥有相同 `name` 的单选按钮
构成互斥组。服务端必须处理零个、一个或多个同名字段的实际情况。

## 常用输入类型

```html
<label for="email">邮箱</label>
<input id="email" name="email" type="email" autocomplete="email" required>
<label for="count">数量</label>
<input id="count" name="count" type="number" min="1" max="20" step="1">
<label for="bio">简介</label>
<textarea id="bio" name="bio" maxlength="500"></textarea>
```

`email`、`url`、`date`、`number` 等类型可改善输入界面并触发基础约束验证，
但不会证明数据真实、合理或已获授权。电话号码、账号等标识不一定适合 `number`，
因为它们可能包含前导零、加号或分隔符。

`select` 适合有限选项，`datalist` 只提供建议而非强制白名单。

## GET 与 POST

GET 提交通常把表单数据编码进 URL 查询字符串：

```text
/search?q=html&page=2
```

GET 适合安全、幂等、可收藏的读取操作。URL 会出现在地址栏、历史记录、日志和可能的
来源信息中，因此不应承载密码、令牌等敏感数据。GET 响应可以被缓存，但具体行为还
取决于响应头和浏览器策略。

POST 通常把数据放在请求体中，适合创建、修改或包含较多数据的操作：

```html
<form action="/profile" method="post">
  <!-- 控件省略 -->
</form>
```

POST 并不自动加密数据，也不天然防重放、防 CSRF 或防越权。保密依赖 HTTPS，状态修改
还需要认证、授权、CSRF 防护、幂等设计或业务确认等适当机制。

## 表单编码与文件上传

默认表单编码是 `application/x-www-form-urlencoded`。上传文件需要：

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <label for="attachment">选择附件</label>
  <input id="attachment" name="attachment" type="file" accept="image/png,image/jpeg">
  <button type="submit">上传</button>
</form>
```

`accept` 只是文件选择提示，不是安全校验。服务端应限制大小、数量和处理时间，检查
实际格式，生成安全文件名，将文件存储在不可执行位置，并按业务需要进行内容扫描。

## 浏览器约束验证

```html
<input name="username" minlength="3" maxlength="32" pattern="[A-Za-z0-9_]+" required>
```

`required`、长度、范围和 `pattern` 可尽早反馈错误，改善体验。
错误信息应清楚说明修正方式，并与具体控件关联。不要只靠颜色标红。

客户端约束可以被开发者工具、脚本或直接 HTTP 请求绕过，所以它不是信任边界。
服务端必须重新验证类型、长度、格式、范围、字段组合、对象归属和操作权限。

## 安全与隐私边界
- 密码框只遮挡屏幕显示，提交值仍需 HTTPS 保护。
- `hidden` 输入对用户不可见，但可被任意修改，不能存放可信价格或权限。
- `disabled` 控件通常不提交，也不能作为服务端授权依据。
- `readonly` 控件通常仍会提交，同样可被伪造。
- 修改状态的请求应考虑 CSRF；输出到页面的数据必须按上下文转义。

## 检查清单

- 链接文本、目标和新窗口行为是否清楚。
- 图片替代文本是否按用途编写，装饰图片是否为空 `alt`。
- 音视频是否具有所需字幕、文字稿和回退链接。
- 表格是否确实表达数据，表头与数据是否正确关联。
- 每个控件是否有标签、`name`、合适类型和清楚错误提示。
- GET 是否只用于读取，敏感数据是否避免进入 URL。
- POST 操作是否有服务端认证、授权、验证和必要的 CSRF 防护。
- 文件上传是否在服务端实施格式、大小、名称、存储和权限控制。

下一篇：[浏览器、DOM 与开发者工具](browser-dom-and-developer-tools.md)。
