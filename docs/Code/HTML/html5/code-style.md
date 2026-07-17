# HTML5 代码风格

一致的代码风格降低审查和维护成本。格式不是语义本身，但清晰格式能更早暴露错误嵌套、
遗漏属性和不安全的动态拼接。

## 文档基线

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>页面标题</title>
  </head>
  <body>
    <main>
      <h1>页面主题</h1>
    </main>
  </body>
</html>
```

使用简洁的 HTML5 doctype，声明页面语言，并把字符编码放在文档前部。
标签和属性名统一小写，属性值使用双引号。

## 缩进与换行

- 项目内统一使用两个或四个空格，不混用 Tab。
- 子元素缩进一级，结束标签与开始标签对齐。
- 长属性按项目格式化规则换行，不手工排成易失真的列。
- 文本是否换行应考虑最终空白语义，特别是行内元素和 `pre`。

```html
<button
  class="dialog__close"
  type="button"
  aria-label="关闭对话框"
>
  <span aria-hidden="true">×</span>
</button>
```

## 语义优先

按内容职责选择元素，不按默认外观选择。导航使用 `nav` 和 `a`，操作使用 `button`，
主题章节使用带标题的 `section`，纯样式容器再使用 `div`。

```html
<button type="button">刷新</button>
<a href="/reports/">查看报告</a>
```

不要用可点击 `div` 模拟按钮。原生控件已有键盘、焦点和无障碍语义。

## 属性约定

按钮始终显式写出 `type`，避免表单中的按钮默认提交。
图片提供符合用途的 `alt`；纯装饰图片使用空 `alt=""`。
表单控件使用 `label` 关联，不用 `placeholder` 替代标签。

布尔属性只需写属性名：

```html
<input type="checkbox" name="offline" checked>
```

`checked="false"` 仍表示选中，因为布尔属性是否存在才是关键。

## class、id 与 data 属性

类名应表达组件或职责，避免把易变的颜色和像素值写进名称。
`id` 在文档中必须唯一，可用于标签关联、片段导航和必要脚本定位。
自定义数据使用 `data-*`，但不要把秘密或可信权限信息放入 DOM。

## CSS 与 JavaScript 分离

优先使用外部样式和模块脚本，减少内联事件处理器：

```html
<link rel="stylesheet" href="/assets/site.css">
<script type="module" src="/assets/app.js"></script>
```

脚本通过 `addEventListener()` 绑定行为。这样更利于 CSP、测试和职责分离。
动态文本使用 `textContent`，只有受信任或严格清理的 HTML 才能进入 HTML 解析入口。

## 注释与工具

注释说明不明显的约束和原因，不复述标签名称，也不要留下敏感信息或失效代码。
使用格式化器、HTML 验证器、链接检查器和无障碍检查工具形成自动化基线。

## 提交前检查

- 标签正确闭合和嵌套，DOM 与预期一致。
- 标题层级、地标和表单标签清晰。
- 无重复 `id`，链接和资源路径可解析。
- 没有内联秘密、危险 DOM 拼接或不必要第三方脚本。
- 桌面、移动端、键盘和目标浏览器均完成测试。
