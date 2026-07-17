# HTML 属性参考

属性写在开始标签中，用于补充标识、状态、资源地址和行为约束。
本页覆盖常用属性；属性是否有效仍取决于具体元素和 HTML Living Standard。

## 通用语法

```html
<a id="guide" class="reference" href="index.md" lang="zh-CN">参考入口</a>
<button type="button" disabled>暂不可用</button>
```

属性值建议加引号。布尔属性只要出现就表示真，`disabled="false"` 仍是禁用。

## 常用全局属性

| 属性 | 值或用途 | 状态与注意 |
| --- | --- | --- |
| `id` | 文档内唯一标识 | 用于片段、标签和脚本定位；避免重复 |
| `class` | 空格分隔的类名 | 供 CSS、脚本和测试使用 |
| `lang` | BCP 47 语言标签 | 根元素和语言切换处应准确设置 |
| `dir` | `ltr`、`rtl`、`auto` | 未知用户文本可考虑 `auto` 或 `bdi` |
| `title` | 补充提示 | 不可靠于触屏和键盘，不能替代标签 |
| `hidden` | 隐藏元素 | 布尔属性；不能作为授权机制 |
| `inert` | 禁止区域交互和聚焦 | 现代；仍需管理视觉状态和回退目标 |
| `tabindex` | 焦点顺序或可聚焦性 | 优先 `0`、`-1`；避免正数 |
| `accesskey` | 快捷键提示 | 平台冲突多，通常谨慎使用 |
| `contenteditable` | 可编辑状态 | 枚举属性；处理粘贴内容和焦点 |
| `draggable` | 原生拖放状态 | 枚举属性；必须提供非拖拽操作 |
| `spellcheck` | 拼写检查提示 | 枚举属性；敏感输入应考虑隐私 |
| `translate` | 是否翻译内容 | 常用 `yes` 或 `no` |
| `data-*` | 页面自定义数据 | 对用户可见，不存放秘密或令牌 |
| `role` | ARIA 角色 | 原生语义正确时不要覆盖 |
| `aria-*` | 无障碍名称、状态和关系 | 按 ARIA 规范取值，不套用布尔属性规则 |
| `style` | 内联 CSS | 维护和 CSP 成本高，不插入不可信值 |

## 链接与资源属性

| 属性 | 常见元素 | 用途与注意 |
| --- | --- | --- |
| `href` | `a`、`link`、`base` | URL；解析后限制协议和来源 |
| `src` | `img`、`script`、`iframe`、媒体 | 外部资源 URL；注意 CORS 与跟踪请求 |
| `srcset` | `img`、`source` | 图片候选及密度或宽度描述符 |
| `sizes` | `img`、`source` | 响应式布局中的预期显示宽度 |
| `alt` | `img`、`area`、图像 `input` | 图片替代文本；装饰图使用 `alt=""` |
| `width` / `height` | 图片、视频、Canvas 等 | 声明固有尺寸可减少布局偏移 |
| `loading` | `img`、`iframe` | `lazy` 或 `eager` 加载提示 |
| `decoding` | `img` | 图片解码提示，不是性能保证 |
| `crossorigin` | 跨源资源元素 | `anonymous` 或 `use-credentials` |
| `referrerpolicy` | 链接、图片、iframe 等 | 控制请求携带的引用来源信息 |
| `integrity` | `script`、样式 `link` | 子资源完整性哈希，配合正确 CORS |
| `download` | `a`、`area` | 建议下载；文件名和跨源行为受限制 |
| `target` | `a`、`form`、`base` | 新窗口常用 `_blank`；说明打开方式 |
| `rel` | `a`、`link`、`area`、`form` | 描述关系，如 `noopener`、`stylesheet` |
| `ping` | `a`、`area` | 导航审计 URL；涉及隐私，谨慎使用 |

## 脚本、iframe 与策略

| 属性 | 常见元素 | 用途与注意 |
| --- | --- | --- |
| `async` | `script` | 下载后尽快执行，顺序不保证 |
| `defer` | 经典 `script` | 解析后按文档顺序执行 |
| `type` | `script`、`input`、`button` 等 | 含义依元素；模块脚本用 `module` |
| `nonce` | `script`、`style` | CSP 一次性值，不应被公开复用 |
| `sandbox` | `iframe` | 默认限制能力，令牌应最小化 |
| `allow` | `iframe` | Permissions Policy 功能白名单 |
| `srcdoc` | `iframe` | 内联文档；不可信内容存在 XSS 风险 |

## 表单属性

| 属性 | 常见元素 | 用途与注意 |
| --- | --- | --- |
| `action` | `form` | 提交 URL；服务端校验目标和 CSRF |
| `method` | `form` | 常用 `get` 或 `post` |
| `enctype` | `form` | 文件上传使用 `multipart/form-data` |
| `name` | 表单控件 | 提交字段名；不是可见标签 |
| `value` | 多种控件、`option` | 初始值或提交值；不能视为可信数据 |
| `for` | `label`、`output` | 关联一个或多个控件 ID |
| `autocomplete` | 表单和控件 | 使用标准令牌改善填写和密码管理器 |
| `placeholder` | 文本输入 | 示例提示；不能替代 `label` |
| `required` | 表单控件 | 客户端约束；服务端仍必须验证 |
| `disabled` | 控件、`fieldset` 等 | 不可操作且通常不提交 |
| `readonly` | 部分输入、`textarea` | 可聚焦且通常提交，与 `disabled` 不同 |
| `checked` | 复选框、单选框 | 初始选中布尔属性 |
| `selected` | `option` | 初始选中布尔属性 |
| `multiple` | 文件、邮箱输入和 `select` | 允许多个值 |
| `min` / `max` / `step` | 数值、日期等输入 | 客户端范围约束，不保证业务合法 |
| `minlength` / `maxlength` | 文本控件 | 按 UTF-16 代码单元限制长度 |
| `pattern` | 部分文本输入 | 正则约束；提供可理解错误说明 |
| `accept` | 文件输入 | 文件类型提示，不是安全验证 |
| `capture` | 文件输入 | 移动设备采集提示，支持有差异 |

## 媒体和表格属性

| 属性 | 常见元素 | 用途与注意 |
| --- | --- | --- |
| `controls` | `audio`、`video` | 显示原生控制，通常应保留 |
| `autoplay` | 媒体 | 常被策略阻止；不要自动播放声音 |
| `muted` / `loop` | 媒体 | 静音、循环布尔属性；提供停止方式 |
| `preload` | 媒体 | `none`、`metadata`、`auto`，仅是提示 |
| `poster` | `video` | 播放前海报，不替代视频说明 |
| `kind` / `srclang` | `track` | 轨道类型和语言 |
| `scope` | `th` | 简单表格表头关联，如 `row`、`col` |
| `colspan` / `rowspan` | 表格单元格 | 跨列或跨行；复杂表格需实测读屏 |

## 废弃表现属性

不要在新代码中使用 `align`、`bgcolor`、`border`、`cellpadding`、`cellspacing`、
`color`、`face`、`frameborder`、`marginheight`、`marginwidth` 或 `valign` 表现页面。
应改用 CSS；迁移时保留原有语义和可读性。

## 安全与无障碍检查

- 不可信值进入属性前按 HTML 属性上下文编码，URL 还要做协议白名单校验。
- 不使用 `onclick` 等内联事件属性；参见[事件参考](events.md)。
- `aria-label` 不应随意覆盖清晰的可见文字，ARIA 状态必须与真实状态同步。
- `hidden`、`disabled`、`readonly` 和 CSS 隐藏都不是访问控制。
- 以浏览器最终 DOM 和无障碍树为准，使用验证器检查无效组合。
