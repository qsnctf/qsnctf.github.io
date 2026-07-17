# HTML 与 DOM 事件参考

事件由 DOM、UI Events、Pointer Events、HTML 等 Web 标准共同定义。
优先在脚本中使用 `addEventListener()`，避免 `onclick` 一类内联事件属性。

## 监听方式

```js
const button = document.querySelector('#save');

button.addEventListener('click', (event) => {
  event.currentTarget.textContent = '已保存';
});
```

监听器可通过 `capture`、`once`、`passive` 和 `signal` 选项控制传播、生命周期与性能。

## 文档和页面生命周期

| 事件 | 常见目标 | 触发时机与注意 |
| --- | --- | --- |
| `DOMContentLoaded` | `document` | HTML 已解析，子资源不一定完成 |
| `load` | `window`、资源元素 | 页面或指定资源完成加载 |
| `beforeunload` | `window` | 离开前提示受严格限制，不可靠保存数据 |
| `pagehide` | `window` | 页面离开或进入往返缓存 |
| `pageshow` | `window` | 页面显示，可能来自往返缓存 |
| `visibilitychange` | `document` | 标签页可见性变化，适合暂停工作 |
| `hashchange` | `window` | URL 片段变化 |
| `popstate` | `window` | 会话历史条目变化 |
| `online` / `offline` | `window` | 网络状态提示，不保证目标服务可用 |

## 指针、鼠标和触控

| 事件 | 触发时机 | 注意 |
| --- | --- | --- |
| `pointerdown` / `pointerup` | 指针按下或抬起 | 统一鼠标、触笔和触摸，通常优先使用 |
| `pointermove` | 指针移动 | 高频事件，避免昂贵同步工作 |
| `pointerenter` / `pointerleave` | 进入或离开元素 | 不冒泡，与 `over`/`out` 不同 |
| `pointercancel` | 浏览器取消指针序列 | 必须清理拖动或按压状态 |
| `click` | 主激活操作 | 原生按钮也可由键盘触发 |
| `dblclick` | 双击 | 不应作为关键功能唯一入口 |
| `contextmenu` | 请求上下文菜单 | 不应无理由禁用系统菜单 |
| `wheel` | 滚轮或类似输入 | 不等同于滚动，谨慎阻止默认行为 |

不要只监听鼠标事件实现控件。原生 `button` 和链接已提供键盘、触屏与辅助技术语义。

## 键盘和焦点

| 事件 | 触发时机 | 注意 |
| --- | --- | --- |
| `keydown` | 按键按下 | 适合快捷键；检查组合键和重复触发 |
| `keyup` | 按键释放 | 不适合作为所有文本输入来源 |
| `focus` / `blur` | 获得或失去焦点 | 不冒泡 |
| `focusin` / `focusout` | 焦点进入或离开 | 冒泡，适合事件委托 |

`keypress` 已废弃。文本输入应优先观察 `input`、`beforeinput` 和合成事件，
不要根据 `keydown` 猜测最终字符，也不要拦截浏览器和辅助技术常用快捷键。

## 表单和编辑

| 事件 | 常见目标 | 触发时机与注意 |
| --- | --- | --- |
| `beforeinput` | 可编辑控件 | 内容修改前，可获知输入类型；支持细节有差异 |
| `input` | 输入、选择、可编辑区域 | 值随用户操作发生变化 |
| `change` | 表单控件 | 值提交式变更，时机因控件而异 |
| `submit` | `form` | 表单提交；监听表单而非只监听按钮 |
| `reset` | `form` | 表单重置 |
| `invalid` | 表单控件 | 约束验证失败；通常不冒泡 |
| `formdata` | `form` | 构造提交用 `FormData` 后 |
| `select` | 文本控件 | 用户选择文本 |
| `compositionstart` / `compositionend` | 文本输入 | 输入法组合开始或结束 |
| `copy` / `cut` / `paste` | 文档、可编辑控件 | 剪贴板操作；权限和隐私受限制 |

客户端验证不能替代服务端验证。显示错误时应将文字说明与控件关联，并管理焦点。

## 拖放、滚动与尺寸

| 事件 | 触发时机 | 注意 |
| --- | --- | --- |
| `dragstart` / `dragend` | 原生拖动开始或结束 | 提供按钮等非拖拽替代操作 |
| `dragenter` / `dragleave` | 拖动对象进入或离开 | 子元素会影响计数和视觉状态 |
| `dragover` | 拖动对象悬停 | 接受放置时通常需阻止默认行为 |
| `drop` | 放置数据 | 验证文件类型、大小和内容 |
| `scroll` | 文档或元素滚动 | 高频；复杂观察优先 IntersectionObserver |
| `scrollend` | 滚动完成 | 较新事件，检查目标浏览器支持 |
| `resize` | `window` | 元素尺寸变化优先 ResizeObserver |

## 媒体事件

| 事件 | 含义 | 注意 |
| --- | --- | --- |
| `loadedmetadata` | 时长、尺寸等元数据可用 | 适合初始化进度和画面尺寸 |
| `canplay` | 可开始播放 | 不保证能无缓冲播到结束 |
| `play` / `pause` | 播放状态变化 | 以事件同步自定义界面 |
| `playing` / `waiting` | 正在播放或等待数据 | 用于缓冲状态反馈 |
| `timeupdate` | 播放位置更新 | 频率不固定，不用于精密计时 |
| `volumechange` | 音量或静音变化 | 同步控件状态 |
| `ended` | 播放结束 | 循环播放时行为不同 |
| `error` | 媒体加载或解码失败 | 提供可理解错误和替代链接 |

完整成员另见[音视频 API](audio-video-api.md)。

## 错误与安全相关事件

| 事件 | 目标 | 注意 |
| --- | --- | --- |
| `error` | `window` 或资源元素 | 不向用户泄露堆栈、路径或敏感数据 |
| `unhandledrejection` | `window` | 捕获未处理 Promise 拒绝，仍应在源头处理 |
| `securitypolicyviolation` | `document` 等 | CSP 违规报告，可辅助定位注入风险 |

## 实践检查

- 使用事件委托时，以 `event.target.closest()` 查找匹配元素，并验证容器边界。
- 仅在确有必要时调用 `preventDefault()`，不要破坏滚动、缩放、导航和表单语义。
- 高频事件使用节流、观察器或 `requestAnimationFrame()`，并在组件销毁时取消监听。
- 不把来自事件对象、拖放、剪贴板或 `postMessage` 的数据视为可信输入。
- 自定义事件不能替代原生控件的名称、角色、状态、键盘和焦点行为。
- 事件触发顺序存在浏览器和输入方式差异，关键流程应在目标环境实测。
