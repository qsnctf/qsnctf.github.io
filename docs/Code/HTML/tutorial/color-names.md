# HTML 颜色名

CSS 定义了一组不区分大小写的命名颜色，可用于 HTML 元素的视觉样式。
颜色名便于阅读，但名称与实际亮度、对比度之间没有稳定规律。

## 基本示例

```css
.info {
  color: navy;
  background: aliceblue;
  border-color: steelblue;
}
```

常见基础名称包括 `black`、`white`、`red`、`green`、`blue`、`yellow`、
`gray`、`purple`、`orange` 和 `transparent`。

## 同义拼写

以下名称分别表示相同颜色：

- `gray` 与 `grey`。
- `darkgray` 与 `darkgrey`。
- `lightgray` 与 `lightgrey`。
- `slategray` 与 `slategrey`。

项目应选择一种拼写风格并保持一致，减少搜索和维护成本。

## 特殊关键字

`transparent` 表示完全透明的颜色。
`currentColor` 不是固定颜色名，它取元素计算后的 `color` 值：

```css
.icon-button {
  color: royalblue;
  border: 2px solid currentColor;
}
```

这样边框或 SVG 图标可以自动跟随文字颜色与交互状态。

## 名称的限制

`lightgreen` 不保证适合浅色背景，`darkred` 也不保证达到所需对比度。
命名颜色集合有限，不适合精确表达完整品牌色板和透明度层级。
设计系统通常用自定义属性封装最终色值：

```css
:root {
  --status-success-text: darkgreen;
  --status-success-surface: honeydew;
}
```

变量名表达用途，底层值以后可以替换为十六进制、RGB 或 HSL。

## 旧名称与兼容性

标准命名颜色在现代浏览器中支持良好。
不要依赖历史浏览器容错产生的非标准颜色，也不要使用 HTML 的 `color`、`bgcolor` 属性。
颜色应写在受控样式表中，并由 CSS 解析。

## 选择建议

- 教学、原型或明确通用颜色可使用名称。
- 品牌色和设计令牌宜采用精确颜色值。
- 不根据名称猜测视觉效果，始终在目标背景上查看并测量。
- 不只用颜色传达状态，提供文字或其他视觉线索。
- 用户提供的颜色需要按允许格式解析和验证。

上一篇：[HTML 颜色](colors.md)。下一篇：[HTML 颜色值](color-values.md)。
