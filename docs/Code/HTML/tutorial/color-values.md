# HTML 颜色值

颜色实际由 CSS 设置。本页介绍现代 CSS 中常见的精确颜色表示方式。
选择语法时应兼顾可读性、设计系统、透明度和浏览器支持范围。

## 十六进制

```css
.sample {
  color: #1a2b3c;
  background-color: #f5f7fa;
}
```

`#rrggbb` 每两个十六进制数字表示红、绿、蓝分量。
短写 `#rgb` 会把每位重复，例如 `#abc` 等于 `#aabbcc`。
八位 `#rrggbbaa` 和四位 `#rgba` 可在末尾表示透明度。

## RGB

```css
.overlay {
  background: rgb(0 0 0 / 60%);
}
```

现代空格语法中三个分量依次为红、绿、蓝，斜杠后是 alpha 透明度。
旧的逗号语法仍很常见，但同一项目宜保持统一。

## HSL

```css
.accent {
  color: hsl(215 75% 42%);
  background: hsl(215 75% 95% / 70%);
}
```

HSL 依次表示色相、饱和度和亮度，适合人工调整同一色系。
相同 HSL 亮度不代表人眼感知亮度相同，仍需实际检查对比度。

## Alpha 与透明度

颜色 alpha 只影响该颜色；`opacity` 会影响整个元素及其后代：

```css
.disabled-card {
  opacity: 0.6;
}
```

降低整个元素透明度可能让文字难以阅读。
若只需半透明背景，应给背景颜色设置 alpha，而不是降低容器 `opacity`。

## 变量与回退

```css
:root {
  --accent: #2457c5;
  --accent-contrast: #ffffff;
}

.primary-button {
  color: var(--accent-contrast);
  background-color: var(--accent);
}
```

现代 CSS 还支持 `hwb()`、`lab()`、`lch()`、`oklab()` 和 `oklch()` 等色彩空间。
使用较新语法前应根据项目支持范围测试，并在必要时提供较早声明作为回退。

## 安全与质量

- 不把用户输入直接拼入 `style` 或样式表。
- 解析允许的颜色格式，并保存规范化值。
- 在真实背景上检查文字、边框、图标和焦点指示器的对比度。
- 分别测试浅色、深色、悬停、焦点、禁用和高对比度状态。
- 颜色值表达视觉结果，状态含义应由变量名和文本共同表达。

上一篇：[HTML 颜色名](color-names.md)。下一篇：[HTML 脚本](scripts.md)。
