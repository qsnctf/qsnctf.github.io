# HTML 视频

## 基本结构

`video` 提供浏览器原生视频播放能力。常见页面应保留 `controls`，用 `poster` 提供加载前
画面，并用明确尺寸或 CSS 比例避免播放器加载时发生布局偏移。

```html
<video controls preload="metadata" poster="lesson-poster.jpg"
       width="960" height="540">
  <source src="lesson.webm" type="video/webm">
  <source src="lesson.mp4" type="video/mp4">
  <track kind="captions" src="lesson.zh-CN.vtt"
         srclang="zh-CN" label="中文字幕" default>
  <p>无法播放视频，请阅读页面中的课程文字稿。</p>
</video>
```

以上文件名均为占位，示例结构不要求仓库存在真实媒体。生产页面应提供可访问的回退链接，
并确认海报图没有代替字幕、文字稿或视频本身传达的关键信息。

## source 与 type

多个 `source` 让浏览器依次选择可播放候选。`type` 可避免尝试明显不支持的格式，
服务端还需发送正确 MIME 类型。容器相同不表示编解码器相同，应在目标浏览器、系统和
移动设备上验证画面、声音、全屏以及硬件解码表现。

资源顺序应体现优先格式，不必为形式上的“兼容”提供大量高成本编码。对较大站点，
自适应流媒体可能更合适，但仍需播放器、字幕、清晰度切换和错误回退设计。

## track 字幕

`track` 通常使用 WebVTT。`kind="captions"` 应记录对白、讲话者和理解内容所需的声音；
`subtitles` 通常表示语言翻译。使用准确的 `srclang`、可理解的 `label`，默认轨道只能有
一个 `default`。

机器生成字幕必须人工校对。字幕不能描述全部视觉信息；演示步骤、场景变化或屏幕文字
对理解至关重要时，还应提供音频描述版本或完整文字稿。跨源轨道需要正确 CORS 响应。

## preload 与 autoplay 限制

`preload="metadata"` 常适合普通内容页，`none` 适合大量视频列表，`auto` 仍只是提示。
浏览器可根据网络、电量和省流设置改变行为，所以页面必须能处理尚未获得时长的状态。

带声音自动播放通常被浏览器阻止。静音装饰视频可能使用
`autoplay muted playsinline loop`，但必须提供暂停方式，避免承载关键信息，并尊重
`prefers-reduced-motion`。不要通过反复调用 `play()` 绕过用户选择。

## 响应式视频

```css
video {
  display: block;
  width: 100%;
  max-width: 60rem;
  height: auto;
}
```

对于固定比例的第三方 `iframe`，可在容器上设置 `aspect-ratio: 16 / 9`，子元素填满
容器。为嵌入框提供准确 `title`、限制 `allow` 权限，并考虑按需加载和隐私占位页。

## 性能

- 按显示尺寸和内容类型选择分辨率、帧率与码率。
- 压缩 `poster`，声明尺寸，避免海报成为新的性能瓶颈。
- 配置缓存、字节范围响应和正确 `Content-Type`。
- 页面含多个视频时减少预载，用户接近或操作播放器后再加载重资源。
- 用真实移动网络测试开始播放时间、拖动、失败重试和数据消耗。

## 可访问性

- 优先原生 `controls`；自定义控件必须支持键盘、焦点、触摸和状态反馈。
- 提供准确字幕、文字稿，并在需要时提供音频描述。
- 避免闪烁风险，不把自动播放视频作为唯一信息来源。
- 检查 200% 缩放、横竖屏、全屏和字幕样式下是否仍可操作。

## 相关页面

- [HTML5 video 元素](../html5/video-element.md)
- [HTML5 audio 元素](../html5/audio-element.md)
- [浏览器支持](../html5/browser-support.md)
- [安全边界](../html5/security-boundaries.md)
- [HTML 属性参考](../reference/attributes.md)
