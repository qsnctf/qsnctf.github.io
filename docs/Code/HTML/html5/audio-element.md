# audio 音频元素

## 学习目标

- 使用原生音频控件和多个媒体源。
- 提供文字稿、下载链接和加载失败回退。
- 避免自动播放和自定义控件造成的可访问性问题。

## 基本结构

`audio` 用于嵌入音乐、播客、语音说明等声音资源。它与 `video` 共用许多媒体 API，
但没有画面和 `poster`。实际播放能力取决于容器、编解码器、操作系统和浏览器组合。

## 安全可运行示例

替换为同目录可信音频文件后即可运行：

```html
<figure>
  <figcaption>第 1 课：现代 HTML 简介</figcaption>
  <audio controls preload="metadata">
    <source src="lesson-01.ogg" type="audio/ogg">
    <source src="lesson-01.mp3" type="audio/mpeg">
    <p>
      浏览器无法播放音频，请
      <a href="lesson-01.mp3" download>下载文件</a>。
    </p>
  </audio>
</figure>
<p><a href="lesson-01-transcript.html">阅读完整文字稿</a></p>
```

文字稿应包含对理解内容有帮助的讲话者、重要音效和语气信息。音乐等无法逐字转录的内容，
也应提供标题、作者、用途和必要说明。链接必须在无 JavaScript 时仍可访问。

## 自动播放与控制

不要默认自动播放带声音内容。浏览器通常会阻止它，辅助技术用户也可能同时听到读屏声音。
若提供循环背景音，必须有明显的暂停或关闭方式，并记住用户选择时遵守隐私政策。

自定义播放器需要实现播放/暂停、进度、音量、速度和状态反馈，并支持键盘与触屏。
除非确有需求，保留 `controls` 通常更可靠。

## 性能与安全

- `preload="none"` 或 `metadata` 可减少列表页的初始流量，但浏览器拥有最终决定权。
- 服务端应配置正确 MIME 类型、范围请求、缓存和访问控制。
- 不从任意查询参数直接生成媒体 URL；限制允许的来源和协议。
- 受保护资源不应仅依赖难猜 URL，授权必须由服务端执行。

## 兼容与无障碍

准备至少一种覆盖目标环境的格式，并测试加载失败、低速网络、后台播放和移动端行为。
文字稿是搜索、快速浏览和无法听音频时的重要替代，不应隐藏在只能运行脚本的组件中。

## 常见错误

- 没有 `controls`，又未提供任何可操作按钮。
- 页面打开即播放声音，且无法快速停止。
- 只写“您的浏览器不支持”，没有下载链接或文字稿。
- 用文件扩展名代替真实格式和编码测试。
- 自定义进度条只能用鼠标拖动。

## 相关链接

- [HTML5 教程入口](index.md)
- [video 视频元素](video-element.md)
- [浏览器支持](browser-support.md)
- [MDN：audio](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/audio)
- [W3C：音频与视频媒体无障碍](https://www.w3.org/WAI/media/av/)
