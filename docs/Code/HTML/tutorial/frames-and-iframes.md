# HTML 框架与 iframe

`frameset`、`frame` 和 `noframes` 属于旧式框架页面技术，在 HTML5 中已经废弃。
现代页面不应使用它们布局；本页提及这些元素只为识别历史代码。

## 历史 frameset

旧文档曾用 `<frameset>` 替代 `<body>`，再用 `<frame>` 拼接多个页面。
这种方式会造成地址、历史记录、打印、收藏、焦点和无障碍问题。
不要在新项目中复制旧式 `frameset` 示例，也不要用表格模拟相同布局。

现代布局应使用语义元素配合 CSS Grid 或 Flexbox，参见[HTML 布局](layout.md)。

## iframe 的用途

`iframe` 仍是 HTML 标准的一部分，用于嵌入独立浏览上下文，例如受控地图、视频或预览。

```html
<iframe
  src="https://video.example.test/embed/lesson-1"
  title="第一课：HTML 文档结构"
  width="640"
  height="360"
  loading="lazy"
  sandbox="allow-scripts allow-same-origin"
  referrerpolicy="strict-origin-when-cross-origin"
  allow="fullscreen">
</iframe>
```

## title 与替代内容

每个 `iframe` 应有简洁、可区分的 `title`，说明嵌入内容的主题或功能。
页面还应在 iframe 外提供必要说明或可直接访问的链接。
不要把关键操作完全依赖第三方嵌入内容。

## sandbox

没有值的 `sandbox` 会施加较严格限制，再按需要添加令牌放宽能力。
常见令牌包括 `allow-forms`、`allow-scripts`、`allow-downloads` 和 `allow-popups`。
只授予业务所需的最小权限，不要机械复制宽松令牌集合。

对同源内容同时允许 `allow-scripts` 与 `allow-same-origin` 可能显著削弱隔离效果。
沙箱不是可信代码审计、响应头策略或独立源隔离的替代品。

## 权限与隐私

`allow` 属性控制摄像头、麦克风、全屏等特性策略权限。
不要授予未使用的敏感能力；第三方内容也会带来网络请求、追踪和可用性风险。
`referrerpolicy` 可限制发送给嵌入源的来源信息。

## 跨源边界

同源策略通常阻止父页面直接读取跨源 iframe 的 DOM。
跨窗口协作可使用 `postMessage`，但接收方必须核对 `event.origin` 和消息结构。

```js
window.addEventListener("message", (event) => {
  if (event.origin !== "https://widget.example.test") return;
  if (event.data?.type === "ready") console.log("组件已就绪");
});
```

发送消息时应指定准确目标源，不使用不必要的 `"*"`。

## 检查清单

- 不在新页面使用已废弃的 `frameset` 或 `frame`。
- 为 iframe 设置准确、唯一的 `title`。
- 以最严格 sandbox 为起点，仅添加必要令牌。
- 限制特性权限、来源信息和第三方依赖。
- 验证 `postMessage` 的来源与数据，不信任跨窗口输入。

下一篇：[HTML 颜色](colors.md)。
