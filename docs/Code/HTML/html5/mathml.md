# MathML 数学标记

## 学习目标

- 使用 MathML 表达简单数学公式。
- 理解数学语义与视觉排版的区别。
- 为兼容性不足的环境准备可读回退。

## 核心概念

MathML 是在网页中描述数学结构的标记语言。HTML Living Standard 允许在 HTML 中
直接嵌入 MathML。浏览器可根据结构排版分数、根式、上下标和运算符，辅助技术也有机会
获得比图片更完整的数学语义。

## 安全可运行示例

```html
<p>一元二次方程的求根公式：</p>
<math display="block" aria-label="x 等于负 b 加减根号 b 平方减四 a c，除以二 a">
  <mi>x</mi><mo>=</mo>
  <mfrac>
    <mrow>
      <mo>−</mo><mi>b</mi><mo>±</mo>
      <msqrt>
        <msup><mi>b</mi><mn>2</mn></msup>
        <mo>−</mo><mn>4</mn><mi>a</mi><mi>c</mi>
      </msqrt>
    </mrow>
    <mrow><mn>2</mn><mi>a</mi></mrow>
  </mfrac>
</math>
<p>纯文本回退：x = (-b ± sqrt(b² - 4ac)) / (2a)</p>
```

`mi` 表示标识符，`mn` 表示数字，`mo` 表示运算符，`mrow` 组合内容，`mfrac`
表示分数。示例只使用静态可信标记；不要把不可信 LaTeX 或 MathML 字符串直接写入 DOM。

## 内容来源

大型公式通常由编辑器或转换工具生成。应固定可信转换器版本，限制输入长度与复杂度，
并对生成结果进行净化。数学表达式也可能消耗大量布局资源，不能无限制处理外部输入。

## 兼容与无障碍

现代主流浏览器的 MathML Core 支持已明显改善，但字体、复杂布局和辅助技术朗读仍有差异。
在目标浏览器与读屏组合上测试。关键公式可同时提供自然语言解释或纯文本表示，避免只用
公式截图；若必须用图片，应提供准确 `alt` 和正文说明。

## 渐进增强

先提供能理解的文本，再嵌入 MathML。若项目采用 JavaScript 排版库，应避免页面在脚本
加载失败时完全空白，并遵守内容安全策略。不要同时向读屏暴露重复且冲突的两份公式。

## 常见错误

- 用普通 HTML 上下标拼出复杂公式，却丢失运算结构。
- 只提供公式图片，没有替代文本或解释。
- 假设视觉正确就代表读屏朗读正确。
- 将外部公式输入未经限制地交给转换器或 `innerHTML`。
- 为追求一致外观而加载过大脚本，破坏无脚本回退。

## 相关链接

- [HTML5 教程入口](index.md)
- [SVG](svg.md)
- [浏览器支持](browser-support.md)
- [MDN：MathML](https://developer.mozilla.org/zh-CN/docs/Web/MathML)
- [W3C：MathML Core](https://www.w3.org/TR/mathml-core/)
