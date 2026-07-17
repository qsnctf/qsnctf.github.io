# HTML 媒体 Media

## Media 的范围

网页媒体不只是“放一个视频”。它包括资源选择、编码格式、字幕轨道、加载策略、
响应式显示、播放控制，以及资源失败时仍可获得的等价内容。

现代方案以浏览器原生元素为基础：图片使用 `img` 或 `picture`，音频使用 `audio`，
视频使用 `video`，文本轨道使用 `track`。插件对象不属于现代媒体栈。

## source 与 type

`audio` 和 `video` 可以包含多个 `source`，浏览器通常按文档顺序选择可播放资源：

```html
<audio controls preload="metadata">
  <source src="interview.opus" type="audio/ogg; codecs=opus">
  <source src="interview.mp3" type="audio/mpeg">
  <p>无法播放音频，请阅读页面中的访谈文字稿。</p>
</audio>
```

`type` 帮助浏览器在下载前判断候选资源。服务端的 `Content-Type` 也必须正确；
两者都不能代替真实设备上的解码测试。添加格式应基于目标浏览器，而非越多越好。

图片中的 `source` 用法不同，它位于 `picture` 中，可结合 `srcset`、`media` 和 `type`
完成格式协商、分辨率选择或艺术方向调整，最后仍需一个 `img` 回退。

## track 文本轨道

```html
<video controls preload="metadata">
  <source src="talk.mp4" type="video/mp4">
  <track kind="captions" src="talk.zh-CN.vtt"
         srclang="zh-CN" label="中文" default>
  <track kind="subtitles" src="talk.en.vtt"
         srclang="en" label="English">
</video>
```

`captions` 面向无法听到声音的用户，应包含对白、讲话者及关键音效；`subtitles`
通常用于语言翻译。`chapters` 可描述章节导航，`descriptions` 用于视觉内容描述。
WebVTT 文件需使用正确 MIME 类型；跨源轨道还涉及 CORS 配置。

## preload 与 autoplay

`preload` 是浏览器提示，不是强制命令：`none` 尽量避免预取，`metadata` 读取时长等
信息，`auto` 允许浏览器预载更多内容。移动网络、省流模式和浏览器策略可能覆盖它。

不要依赖 `autoplay` 传达关键信息。浏览器通常阻止带声音自动播放；即使
`autoplay muted playsinline` 可用于静音内联视频，也应提供暂停按钮，并尊重
`prefers-reduced-motion`。用户主动点击播放是最可靠的启动方式。

## 响应式嵌入

```css
.media-frame {
  width: min(100%, 60rem);
  aspect-ratio: 16 / 9;
}
.media-frame > video,
.media-frame > iframe {
  width: 100%;
  height: 100%;
}
```

原生视频也可使用 `width: 100%; height: auto` 保持自身比例。嵌入第三方播放器时，
为 `iframe` 提供 `title`，仅授予必要的 `allow` 权限，并评估 Cookie、跟踪和 CSP。

## 性能清单

- 为使用场景选择码率、尺寸和关键帧间隔，不发送远超显示尺寸的资源。
- 长媒体启用字节范围请求，配置缓存，并用网络面板验证响应。
- 列表页默认避免同时预载许多音视频；海报图也应压缩和设置尺寸。
- 懒加载第三方嵌入时保留可操作占位内容，避免加载后布局突然跳动。

## 可访问性清单

- 保留原生 `controls`，或完整实现键盘、触摸、焦点与状态反馈。
- 视频提供准确字幕；音频提供可直接访问的文字稿。
- 重要视觉信息提供描述，闪烁内容遵守安全阈值。
- 不使用仅靠颜色或声音表达状态的设计。

## 相关页面

- [浏览器支持与渐进增强](../html5/browser-support.md)
- [audio 音频元素](../html5/audio-element.md)
- [video 视频元素](../html5/video-element.md)
- [安全边界](../html5/security-boundaries.md)
- [HTML 属性参考](../reference/attributes.md)
