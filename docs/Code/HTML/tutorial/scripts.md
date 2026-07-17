# HTML 脚本

JavaScript 为页面增加行为，HTML 仍应提供清晰结构和尽可能可用的基础内容。
脚本应按渐进增强原则加载，并遵守内容安全策略与输出编码要求。

## 外部脚本

```html
<script src="app.js" defer></script>
```

`defer` 让经典外部脚本在 HTML 解析期间并行下载，并在文档解析完成后按顺序执行。
这通常比把同步脚本放在 `head` 中更不容易阻塞页面。

## JavaScript 模块

```html
<script type="module" src="main.js"></script>
```

模块脚本默认延后执行，拥有模块作用域，并支持 `import` 与 `export`。
模块请求遵守 CORS；生产环境应由可信源通过 HTTPS 提供。

## async 的行为

```html
<script src="analytics.js" async></script>
```

`async` 脚本下载完成后立即执行，多个脚本之间不保证顺序。
它适合不依赖 DOM 完整性和其他脚本顺序的独立功能。

## 渐进增强

```html
<button id="details-toggle" type="button" aria-expanded="false">
  显示详情
</button>
<section id="details" hidden>
  <h2>详情</h2>
  <p>这里是补充内容。</p>
</section>
```

```js
const button = document.querySelector("#details-toggle");
const details = document.querySelector("#details");

button.addEventListener("click", () => {
  details.hidden = !details.hidden;
  button.setAttribute("aria-expanded", String(!details.hidden));
});
```

脚本应使用原生按钮，而不是为 `div` 补写不完整的键盘交互。
动态更新状态时，同步维护可访问名称、展开状态和焦点行为。

## 安全边界

不要把不可信文本传给 `innerHTML`、`outerHTML` 或 `insertAdjacentHTML`。
只需显示文字时使用 `textContent`；需要 HTML 时采用受审查的模板和上下文安全处理。

避免内联事件属性，如 `onclick="..."`，以便分离职责并采用更严格的 CSP。
不要使用 `eval()` 或字符串形式的计时器执行不可信内容。

## noscript

`noscript` 可在脚本不可用时显示说明，但不能代替可工作的服务端或原生 HTML 回退。
关键阅读内容不应只有 JavaScript 成功执行后才能获得。

## 检查清单

- 根据依赖关系选择 `defer`、`async` 或模块脚本。
- 脚本失败时保留可理解的页面结构和关键路径。
- 使用 `textContent` 处理普通文本，不拼接不可信 HTML。
- 对第三方脚本评估权限、隐私、更新和供应链风险。
- 使用 CSP、HTTPS 和最少第三方依赖实施纵深防护。

下一篇：[HTML 字符实体](entities.md)。
