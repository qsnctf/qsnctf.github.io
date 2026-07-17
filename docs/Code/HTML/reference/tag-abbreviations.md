# HTML 标签简写及全称

HTML 元素名多来自英文单词或历史缩写。名称来源有助于检索和记忆，
但实际语义应以现代 HTML 标准为准，不能只按字面推断。

## 文档与章节

| 标签 | 英文全称或来源 | 现代用途 |
| --- | --- | --- |
| `html` | HyperText Markup Language | 文档根元素 |
| `head` | head | 文档元数据容器 |
| `body` | body | 文档正文 |
| `title` | title | 文档标题 |
| `meta` | metadata | 元数据 |
| `base` | base URL | 相对 URL 基准 |
| `link` | link | 文档与外部资源的关系 |
| `main` | main content | 页面独有的主要内容 |
| `header` | header | 页面或章节的引导内容 |
| `footer` | footer | 页面或章节的收尾内容 |
| `nav` | navigation | 主要导航链接组 |
| `article` | article | 可独立分发的内容 |
| `section` | section | 有主题的章节 |
| `aside` | aside | 间接相关的补充内容 |

## 文本语义

| 标签 | 英文全称或来源 | 现代用途 |
| --- | --- | --- |
| `h1`–`h6` | heading | 一至六级标题 |
| `p` | paragraph | 段落 |
| `div` | division | 无额外语义的块级容器 |
| `span` | span | 无额外语义的行内容器 |
| `br` | line break | 内容中的换行 |
| `hr` | thematic break | 段落级主题转换 |
| `em` | emphasis | 语气强调 |
| `strong` | strong importance | 重要、严重或紧急内容 |
| `small` | small print | 附注、版权等旁注 |
| `s` | strikethrough | 已不准确或不再相关的内容 |
| `del` | deleted text | 编辑中删除的内容 |
| `ins` | inserted text | 编辑中插入的内容 |
| `abbr` | abbreviation | 缩写或简称 |
| `dfn` | defining instance | 正在定义的术语 |
| `mark` | marked/highlighted | 因当前上下文而突出显示 |
| `time` | time | 机器可读日期或时间 |

## 列表、引用与代码

| 标签 | 英文全称或来源 | 现代用途 |
| --- | --- | --- |
| `ul` | unordered list | 无序列表 |
| `ol` | ordered list | 有序列表 |
| `li` | list item | 列表项 |
| `dl` | description list | 描述列表 |
| `dt` | description term | 名称或术语 |
| `dd` | description details | 描述、定义或值 |
| `blockquote` | block quotation | 块级引用 |
| `q` | quotation | 行内引用 |
| `cite` | citation | 作品标题引用 |
| `pre` | preformatted text | 保留空白的预格式文本 |
| `code` | code | 代码片段 |
| `kbd` | keyboard input | 用户输入 |
| `samp` | sample output | 程序输出示例 |
| `var` | variable | 变量或占位符 |

## 链接、媒体与嵌入

| 标签 | 英文全称或来源 | 现代用途 |
| --- | --- | --- |
| `a` | anchor | 超链接或页面内锚点 |
| `img` | image | 图片 |
| `picture` | picture | 响应式图片候选容器 |
| `src` | source（属性名） | 资源地址，不是 HTML 标签 |
| `audio` | audio | 音频 |
| `video` | video | 视频 |
| `source` | source | 媒体或图片候选资源 |
| `track` | timed text track | 字幕、说明或章节轨道 |
| `iframe` | inline frame | 嵌入独立浏览上下文 |
| `canvas` | canvas | 脚本绘图表面 |
| `svg` | Scalable Vector Graphics | 可缩放矢量图形根元素 |

## 表格与表单

| 标签 | 英文全称或来源 | 现代用途 |
| --- | --- | --- |
| `table` | table | 二维表格数据 |
| `caption` | caption | 表格标题 |
| `thead` / `tbody` / `tfoot` | table head/body/foot | 表格行分组 |
| `tr` | table row | 表格行 |
| `th` | table header cell | 表头单元格 |
| `td` | table data cell | 数据单元格 |
| `col` | column | 表格列 |
| `form` | form | 表单 |
| `input` | input | 输入控件 |
| `label` | label | 控件标签 |
| `select` | select | 选项选择控件 |
| `option` | option | 可选项 |
| `textarea` | text area | 多行文本输入 |
| `button` | button | 按钮 |
| `fieldset` | field set | 控件分组 |
| `legend` | legend | 控件组标题 |

## 脚本与交互

| 标签 | 英文全称或来源 | 现代用途 |
| --- | --- | --- |
| `script` | script | 脚本或数据块 |
| `noscript` | no script | 脚本未启用时的替代内容 |
| `template` | template | 默认不渲染的模板片段 |
| `slot` | slot | Web Component 内容插槽 |
| `details` | details | 可展开的披露组件 |
| `summary` | summary | `details` 的摘要或标签 |
| `dialog` | dialog | 对话框或模态交互 |

`font`、`center`、`frame`、`frameset`、`marquee` 等历史元素不应用于新页面。
不要把属性名 `src`、`href`、`alt` 当作标签，也不要用 `div` 模拟原生按钮和链接。

相关参考：[语言代码](language-codes.md) · [字符实体](entities.md) · [质量检查](validation-checklist.md)
