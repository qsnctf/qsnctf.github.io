# video 视频元素

## 学习目标

- 使用多个视频源、原生控制和海报图。
- 提供字幕、文字回退和下载路径。
- 理解自动播放、编码格式和跨源安全边界。

## 基本结构

`video` 是现代 HTML 的原生媒体元素。容器支持 `controls`、`poster`、`preload` 等属性，
多个 `source` 允许浏览器按顺序选择可播放资源。元素支持不代表每一种编码都支持，
应根据目标浏览器选择容器和编解码器并实测。

## 安全可运行示例

替换为同目录可信媒体文件后即可运行：

```html
<video controls width="720" poster="lesson-poster.jpg" preload="metadata">
  <source src="lesson.webm" type="video/webm">
  <source src="lesson.mp4" type="video/mp4">
  <track kind="captions" src="lesson.zh-CN.vtt"
         srclang="zh-CN" label="中文字幕" default>
  <p>
    浏览器无法播放视频。
    <a href="lesson.mp4" download>下载视频</a>，
    或阅读<a href="lesson-transcript.html">文字稿</a>。
  </p>
</video>
```

WebVTT 字幕应包含对白和理解内容所需的声音信息。字幕不是音频描述：视觉内容对理解
很重要时，还应提供音频描述版本或正文说明。回退链接必须指向真实可访问资源。

## 播放策略

带声音自动播放通常被浏览器阻止，也会干扰用户。若业务确需静音背景视频，可使用
`autoplay muted playsinline`，同时提供暂停控件并尊重减少动态效果偏好。不要移除原生
`controls`，除非自定义控件完整支持键盘、焦点、名称、状态和不同输入方式。

## 性能与安全

- `preload="metadata"` 常适合只需尺寸和时长的页面，浏览器仍可自行决策。
- 不可信媒体应限制来源；服务端应发送正确 `Content-Type`、范围请求和缓存头。
- 跨源字幕通常需要正确 CORS 配置和 `crossorigin` 属性。
- 不要把访问令牌放进长期可见的媒体 URL；应使用合适的授权和短期资源策略。

## 兼容与无障碍

测试不同浏览器、移动端全屏、字幕样式、键盘操作和网络失败。播放器附近提供清楚标题，
不要依赖自动播放传递关键信息；字幕、文字稿和下载链接也应在脚本失败时可用。

## 常见错误

- 只提供一种编码，误以为 `.mp4` 后缀就保证兼容。
- 把自动生成但未校对的字幕直接发布。
- 视频无声音时省略所有文字替代，却忽略画面信息。
- 自定义控件不可聚焦或没有可访问名称。
- 将 `poster` 当作内容替代，或使用空的回退段落。

## 相关链接

- [HTML5 教程入口](index.md)
- [audio 音频元素](audio-element.md)
- [浏览器支持](browser-support.md)
- [MDN：video](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/video)
- [WebVTT 标准](https://www.w3.org/TR/webvtt1/)
