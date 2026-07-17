# HTML 速查列表

本页汇总现代 HTML 的常用骨架、元素与检查要点。
速查表不能替代对语义、内容模型、可访问性和安全边界的理解。

## 最小文档

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
      <h1>页面主标题</h1>
    </main>
  </body>
</html>
```

## 结构元素

| 元素 | 用途 |
| --- | --- |
| `header` | 页面或章节的引导内容 |
| `nav` | 主要导航链接组 |
| `main` | 页面独有的主要内容 |
| `article` | 可独立分发的完整内容 |
| `section` | 有主题的章节，通常有标题 |
| `aside` | 间接相关的补充内容 |
| `footer` | 页面或章节的收尾信息 |
| `div` | 无额外语义的通用容器 |

## 文本与列表

- 标题：`h1` 至 `h6`，按结构递进。
- 段落：`p`；强调：`em`；重要：`strong`。
- 代码：`code`；预格式文本：`pre`；用户输入：`kbd`。
- 无序列表：`ul`；有序列表：`ol`；描述列表：`dl`。
- 时间：`time`；缩写：`abbr`；引用：`blockquote`、`q`。

## 链接与媒体

```html
<a href="summary.md">查看总结</a>
<img src="diagram.png" alt="浏览器解析流程图" width="800" height="450">
```

链接文本说明目标；信息图片提供准确 `alt`，装饰图片使用空 `alt=""`。
音视频根据内容提供字幕、文字稿或回退链接。

## 表单

```html
<form action="/subscribe" method="post">
  <label for="email">邮箱</label>
  <input id="email" name="email" type="email" autocomplete="email" required>
  <button type="submit">订阅</button>
</form>
```

每个控件需要标签和提交用的 `name`。
客户端验证只改善体验，服务端必须重新验证并执行授权。

## 脚本和样式

```html
<link rel="stylesheet" href="styles.css">
<script type="module" src="main.js"></script>
```

样式与行为尽量放在外部受控资源中。
普通文本更新使用 `textContent`，不要拼接不可信 HTML。

## 必查项目

- `doctype`、语言、UTF-8、viewport 和唯一标题齐全。
- DOM 嵌套有效，标题层级和地标结构清楚。
- 键盘可以到达并操作全部交互控件，焦点清晰可见。
- 文字与背景对比度充足，状态不只依赖颜色。
- 相对 URL 在实际部署路径下可用，外部 URL 协议受到限制。
- iframe 具有 `title`，并按最小权限设置 `sandbox` 和 `allow`。
- 不使用废弃的 `frame`、`frameset`、`font` 或表现属性。

继续查阅：[标签简写及全称](tag-abbreviations.md)和[HTML 总结](summary.md)。
