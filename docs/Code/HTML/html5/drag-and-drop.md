# 拖放交互

## 学习目标

- 理解 HTML Drag and Drop 的事件与数据传递。
- 实现不依赖拖放的键盘、触屏替代操作。
- 安全处理拖入文本、链接和文件。

## 核心概念

元素设置 `draggable="true"` 后可触发 `dragstart`，放置目标需要在 `dragover` 中阻止
默认行为，并在 `drop` 中读取 `DataTransfer`。原生拖放在桌面浏览器较常见，但触屏、
键盘和辅助技术支持不一致，因此不能作为完成任务的唯一方式。

## 安全可运行示例

下面既支持拖放，也提供“移动”按钮。状态变化通过文字区域播报：

```html
<ul id="source"><li id="task" draggable="true">整理文档</li></ul>
<h2>已完成</h2>
<ul id="done" aria-label="已完成任务"></ul>
<button id="move" type="button">将“整理文档”移到已完成</button>
<p id="status" role="status"></p>
<script>
  const task = document.querySelector('#task');
  const done = document.querySelector('#done');
  const status = document.querySelector('#status');
  function moveTask() {
    done.append(task);
    task.draggable = false;
    status.textContent = '已将整理文档移到已完成。';
  }
  task.addEventListener('dragstart', event => {
    event.dataTransfer.setData('text/plain', task.id);
  });
  done.addEventListener('dragover', event => event.preventDefault());
  done.addEventListener('drop', event => {
    event.preventDefault();
    if (event.dataTransfer.getData('text/plain') === task.id) moveTask();
  });
  document.querySelector('#move').addEventListener('click', moveTask);
</script>
```

真实排序还应提供“上移”“下移”按钮或可操作菜单，并在服务端重新验证对象身份、归属、
目标位置和权限。前端传来的 ID 与顺序都是不可信数据。

## 文件拖放

文件来自 `event.dataTransfer.files`。客户端应限制可接受类型和大小以改善体验，服务端仍须
检查实际格式、大小、数量、文件名和处理时间，并存放在不可执行位置。不要自动打开或
执行拖入内容；外部 URL 和 HTML 字符串也不能直接插入页面。

## 兼容与无障碍

- 始终提供按钮、文件选择器或表单等键盘/触屏替代。
- 拖动手柄要有可访问名称，操作结果使用文本反馈。
- 不以精细指针、悬停或视觉位置作为唯一线索。
- 在触屏设备和键盘模式下完成完整流程测试。

## 常见错误

- 只监听鼠标事件，认为它等同于拖放和触屏。
- 只显示颜色变化，没有文字说明当前放置目标。
- 信任拖入文件的扩展名、MIME 声明或客户端校验。
- 将 `text/html` 数据直接赋给 `innerHTML`。
- 没有取消默认 `dragover`，导致 `drop` 不触发。

## 相关链接

- [HTML5 教程入口](index.md)
- [浏览器支持](browser-support.md)
- [表单元素](form-elements.md)
- [MDN：HTML Drag and Drop API](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
