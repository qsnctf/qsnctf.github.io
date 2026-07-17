# HTML 实例

## 示例说明

本页组合图片、音频、视频、字幕和响应式嵌入。所有资源 URL 都是占位路径，示例不依赖
仓库中的真实媒体；复制到项目后应替换文件，并提供真实文字稿、字幕和失败回退。

## 组合媒体文章

```html
<article>
  <h1>城市声音采集记录</h1>

  <picture>
    <source srcset="station.avif" type="image/avif">
    <source srcset="station.webp" type="image/webp">
    <img src="station.jpg" alt="清晨空旷的火车站站台"
         width="960" height="540">
  </picture>

  <figure>
    <figcaption>站台环境声，时长约两分钟</figcaption>
    <audio controls preload="none">
      <source src="station-sound.opus" type="audio/ogg; codecs=opus">
      <source src="station-sound.mp3" type="audio/mpeg">
      <p>无法播放音频，请阅读下方文字稿。</p>
    </audio>
  </figure>

  <details>
    <summary>音频文字稿</summary>
    <p>[列车进站声] 广播提示下一班列车将在三分钟后到达。</p>
  </details>

  <video controls preload="metadata" poster="route-poster.jpg"
         width="960" height="540">
    <source src="route.webm" type="video/webm">
    <source src="route.mp4" type="video/mp4">
    <track kind="captions" src="route.zh-CN.vtt"
           srclang="zh-CN" label="中文字幕" default>
    <p>无法播放视频，请阅读同页的视频说明。</p>
  </video>
</article>
```

`picture` 中的 `source/type` 用于格式选择，`img` 负责回退和替代文本。音频采用
`preload="none"` 避免文章打开即下载，视频采用 `metadata` 以便取得基础信息。

字幕 `track` 应指向真实、校对后的 WebVTT。纯音频另有普通 HTML 文字稿，避免把访问
能力绑定到脚本播放器。生产页面还应为视频提供完整文字稿和必要的视觉描述。

## 响应式样式

```css
.media-page {
  width: min(100% - 2rem, 60rem);
  margin-inline: auto;
}
.media-page img,
.media-page video,
.media-page audio {
  display: block;
  max-width: 100%;
}
.media-page img,
.media-page video {
  height: auto;
}
```

`width` 和 `height` 属性提供固有比例，CSS 再限制可用宽度。音频控件在窄屏上的最小
尺寸因浏览器而异，应实测而不是强制很小的固定高度。

## 第三方嵌入占位

```html
<div class="embed" data-provider="example">
  <p>外部播放器尚未加载。</p>
  <button type="button">同意并加载外部媒体</button>
</div>
```

示例故意不含真实 `iframe` 和脚本。实际加载时，为嵌入框设置描述性 `title`、固定比例、
按需 `loading="lazy"`，只开放必要权限，并在发送请求前说明第三方隐私影响。

## 自动播放背景的安全形式

```html
<video autoplay muted playsinline loop aria-hidden="true" tabindex="-1">
  <source src="ambient.webm" type="video/webm">
</video>
<button type="button">暂停背景动画</button>
```

这只适用于纯装饰内容。按钮必须真正控制状态，并在 `prefers-reduced-motion: reduce`
下默认停用；浏览器仍可能不播放，任何带声音内容都不应这样启动。

## 发布前检查

- 检查每个 `source` 的编码、`type` 和服务端 MIME 类型。
- 检查字幕语言、同步、讲话者和重要音效，提供可读文字稿。
- 测试 `preload` 未生效、`autoplay` 被阻止和资源 404 的情况。
- 测试响应式尺寸、键盘操作、焦点、触屏、读屏和缩放。
- 检查首屏体积、缓存、范围请求、海报图和第三方隐私成本。
## 相关页面
- [HTML5 教程入口](../html5/index.md)
- [audio 音频元素](../html5/audio-element.md)
- [video 视频元素](../html5/video-element.md)
- [Canvas 画布](../html5/canvas.md)
- [HTML 标签功能分类](../reference/tags-by-function.md)
