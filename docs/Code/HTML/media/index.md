# HTML 媒体

## 学习目标

- 选择图片、音频、视频和图形的原生 HTML 方案。
- 理解媒体格式、加载策略、响应式布局和替代内容。
- 在性能、兼容性与可访问性之间做出明确取舍。

## 现代原生媒体

现代网页通常使用 `img`、`picture`、`audio`、`video`、`track`、Canvas 和 SVG。
它们由浏览器直接支持，不需要 Flash、Java Applet 或其他外部插件。

选择元素时先看内容语义：照片和插图使用图片元素，声音使用 `audio`，连续画面使用
`video`，可缩放矢量图形使用 SVG，逐帧动态绘图才考虑 Canvas。

## 图片与响应式资源

```html
<picture>
  <source media="(min-width: 48rem)" srcset="cover-wide.webp" type="image/webp">
  <img src="cover.jpg" alt="讲师在白板前说明媒体加载流程"
       width="960" height="540" loading="lazy">
</picture>
```

`source` 的 `type` 可让浏览器跳过不支持的格式，`media` 可按媒体查询选择构图。
`img` 是必要回退；准确的 `width`、`height` 能预留比例并减少布局偏移。

## 音频与视频

```html
<video controls preload="metadata" poster="preview.jpg">
  <source src="lesson.webm" type="video/webm">
  <source src="lesson.mp4" type="video/mp4">
  <track kind="captions" src="lesson.zh-CN.vtt"
         srclang="zh-CN" label="中文字幕" default>
  <p>无法播放视频，请阅读同页提供的文字稿。</p>
</video>
```

浏览器按顺序检查 `source`；`type` 应是正确 MIME 类型，但扩展名和容器名不能保证
编解码器一定受支持。应针对目标设备实际测试。

`track` 可提供字幕、章节和描述。字幕需要包括对白及理解内容所需的重要声音，
并经人工校对；只有画面传达的信息还需要音频描述或正文替代。

## 加载与自动播放

- `preload="none"` 表示尽量不预取，适合页面中有许多媒体的情况。
- `preload="metadata"` 主要请求时长等元数据，常是内容页的稳妥默认值。
- `preload="auto"` 只是提示，浏览器仍会根据网络和节流策略决定。
- 带声音的 `autoplay` 通常会被阻止，也可能打断读屏和用户正在播放的内容。
- 静音背景视频常需 `autoplay muted playsinline`，仍应提供暂停方式。

## 响应式嵌入

```css
img,
video {
  max-width: 100%;
  height: auto;
}
```

第三方 `iframe` 可用带 `aspect-ratio` 的容器保持比例，但应设置描述性 `title`、
最小化权限，并考虑隐私提示。可自行托管时，优先原生媒体而非不透明播放器。

## 性能与可访问性

- 压缩资源并选择合理分辨率，不向小屏设备无条件发送超大文件。
- 服务端发送正确 `Content-Type`、缓存头和字节范围响应。
- 首屏关键图片不要盲目懒加载，非关键图片可使用 `loading="lazy"`。
- 使用原生 `controls`；自定义控件必须支持键盘、焦点和可访问名称。
- 不把关键信息只放进音视频，提供字幕、文字稿或等价正文。
- 测试低速网络、加载失败、移动端、缩放、键盘和辅助技术。

## 继续阅读

- [HTML5 教程入口](../html5/index.md)
- [audio 音频元素](../html5/audio-element.md)
- [video 视频元素](../html5/video-element.md)
- [Canvas 画布](../html5/canvas.md)
- [SVG](../html5/svg.md)
- [HTML 标签功能分类](../reference/tags-by-function.md)
