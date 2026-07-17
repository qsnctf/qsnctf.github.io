# 浏览器支持与渐进增强

## 学习目标

- 区分语法支持、API 存在和功能可用。
- 使用特性检测而不是浏览器嗅探。
- 为不支持或受限环境提供可理解的回退。

## 支持不是一个布尔值

浏览器“支持”某功能，可能只表示能解析元素或存在某个方法。编码格式、权限策略、
设备能力、用户设置、辅助技术和嵌入环境仍会改变最终行为。HTML Living Standard
持续更新，实际采用范围应结合兼容数据和真实设备测试判断。

## 安全可运行示例

下面检测 `dialog` 的关键方法；不支持时保留普通内容，不下载未知 polyfill：

```html
<button id="open" type="button">查看说明</button>
<dialog id="help">
  <p>这是浏览器原生对话框。</p>
  <form method="dialog"><button>关闭</button></form>
</dialog>
<p id="fallback" hidden>当前浏览器不支持对话框，请直接阅读本段说明。</p>
<script>
  const button = document.querySelector('#open');
  const dialog = document.querySelector('#help');
  const fallback = document.querySelector('#fallback');
  button.addEventListener('click', () => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else fallback.hidden = false;
  });
</script>
```

检测应靠近实际使用点。`'geolocation' in navigator` 只能说明接口存在，不能说明用户
会授权，也不能保证定位成功；每个异步 API 仍需处理拒绝、超时和不可用状态。

## 渐进增强

渐进增强从可用的 HTML 核心开始，再增加样式和交互。例如表单应有正常的 `action`
和服务端处理，JavaScript 仅用于即时提示；网络或脚本失败时仍可提交。

优雅降级则从完整功能出发再处理旧环境。两者可结合，但都不能把安全检查只放在前端。

## 测试策略

- 根据访问数据和产品要求定义支持矩阵，不盲目追求所有旧版本。
- 测试 Chromium、Firefox、WebKit 系浏览器以及至少一台真实移动设备。
- 测试键盘导航、200% 缩放、减少动态效果和高对比度设置。
- 对媒体检查实际编码，不只检查 `video` 或 `audio` 元素是否存在。
- 对权限 API 测试允许、拒绝、撤销、超时和非 HTTPS 场景。

## Polyfill 与安全

Polyfill 是用现有能力模拟新 API 的代码，不能模拟浏览器缺失的底层设备或安全能力。
只从可信来源引入，固定版本并纳入依赖审计；不要运行根据 User-Agent 动态返回的未知脚本。

## 兼容与无障碍

回退必须提供相同任务，而不只是显示“不支持”。例如拖放应有按钮或文件选择器，
Canvas 图表应有数据表，媒体应有字幕、文字稿和下载链接。隐藏回退前要确认增强功能可用。

## 常见错误

- 解析 User-Agent 后维护大量版本分支。
- 只检测属性存在，不处理调用失败或权限拒绝。
- 用 JavaScript 写入本可直接存在于 HTML 的关键内容。
- 为旧浏览器加载来源不明、长期不更新的 polyfill。
- 把视觉一致误认为功能、键盘和读屏体验一致。

## 相关链接

- [HTML5 教程入口](index.md)
- [新增与语义元素](new-elements.md)
- [地理定位](geolocation.md)
- [MDN：实现特性检测](https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Testing/Feature_detection)
- [Can I use](https://caniuse.com/)
