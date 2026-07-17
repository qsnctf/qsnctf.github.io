# HTML 测验

先独立回答，再展开答案。题目覆盖结构、布局、表单、URL、安全和历史语法。

## 题目

1. HTML、CSS 和 JavaScript 的主要职责分别是什么？
2. `section` 与 `div` 的选择依据是什么？
3. 为什么不能用 `placeholder` 替代 `label`？
4. GET 请求为什么不适合提交密码或令牌？
5. `id` 与 `name` 在表单中的主要区别是什么？
6. `frameset` 和 `frame` 在现代 HTML 中处于什么状态？
7. 嵌入 `iframe` 时至少应考虑哪三个安全或可访问性属性？
8. `defer` 与 `async` 的执行顺序有何不同？
9. 为什么 `&nbsp;` 不适合页面布局？
10. HTML 字符引用能否替代上下文相关的输出编码？
11. 外部 URL 为什么应先解析再检查协议？
12. 颜色设计为什么不能只检查“看起来好看”？

## 实践题

找出下面代码中的至少五个问题：

```html
<div onclick="submitForm()">提交</div>
<input name="email" placeholder="邮箱">
<font color="red">错误</font>
<iframe src="https://widget.example.test"></iframe>
<script src="app.js"></script>
```

<details>
<summary>查看答案与解析</summary>

1. HTML 描述结构与语义，CSS 负责主要表现，JavaScript 负责主要行为。
2. 有主题且通常需要标题的章节用 `section`；仅为样式或布局分组时用 `div`。
3. 占位符会在输入后消失，不能提供持久名称，也不稳定地替代可访问名称。
4. GET 数据通常进入 URL，可能出现在地址栏、历史记录、日志和来源信息中。
5. `id` 用于文档内唯一标识、标签和脚本关联；`name` 决定提交字段名称。
6. 二者是旧式框架技术，已在 HTML5 中废弃，不应用于新项目。
7. 至少提供准确 `title`，按最小权限配置 `sandbox`，并限制 `allow`；还可设置
   `referrerpolicy`，同时评估来源和替代访问方式。
8. `defer` 在解析完成后按文档顺序执行；`async` 下载完成即执行，不保证相互顺序。
9. 它表达不换行空格而非布局，容易破坏响应式换行；间距应由 CSS 负责。
10. 不能。HTML 文本、属性、URL、JavaScript 和 CSS 需要各自适合的处理。
11. 字符串前缀检查可能与浏览器实际解析结果不同；解析后检查规范化的方案更可靠。
12. 还需测量前景与背景对比度，并检查焦点、禁用、深色和高对比度状态。

实践题可改为原生 `button` 并绑定事件；输入框增加 `label` 和合适的 `type`；
用 CSS 和明确文字呈现错误；iframe 增加 `title`、严格 `sandbox` 与必要权限限制；
脚本根据依赖使用 `defer` 或 `type="module"`。此外，提交和错误处理仍需服务端验证。

</details>

复习：[HTML 教程总结](summary.md)。继续了解：[XHTML 简介](xhtml-introduction.md)。
