# HTML 音视频 API 参考

`audio` 和 `video` 都实现 `HTMLMediaElement`，共享播放、时间、音量和轨道 API。
实际能力还取决于容器、编解码器、浏览器策略、网络和设备。

## 基本标记

```html
<video id="lesson" controls preload="metadata" width="720" poster="poster.jpg">
  <source src="lesson.webm" type="video/webm">
  <source src="lesson.mp4" type="video/mp4">
  <track kind="captions" src="lesson.zh-CN.vtt"
         srclang="zh-CN" label="中文字幕" default>
  <p><a href="lesson.mp4">下载视频</a>或阅读文字稿。</p>
</video>
```

保留原生 `controls` 通常最可靠；自定义播放器必须完整处理键盘、焦点、名称和状态。

## 常用属性

| 属性 | 类型或值 | 含义与注意 |
| --- | --- | --- |
| `src` | URL | 单一媒体地址；多个候选通常使用 `source` |
| `currentSrc` | 只读 URL | 浏览器最终选择的媒体资源 |
| `crossOrigin` | 字符串 | 跨源请求模式；需服务端 CORS 配合 |
| `preload` | `none`、`metadata`、`auto` | 加载提示，不是强制要求 |
| `autoplay` | 布尔 | 受自动播放策略限制，不要默认播放声音 |
| `controls` | 布尔 | 显示浏览器原生控件 |
| `loop` | 布尔 | 播放结束后循环 |
| `muted` | 布尔 | 当前是否静音 |
| `defaultMuted` | 布尔 | 标记中的默认静音状态 |
| `volume` | `0` 到 `1` | 音量；部分平台不允许脚本修改 |
| `playbackRate` | 数值 | 当前播放速度 |
| `defaultPlaybackRate` | 数值 | 默认播放速度 |
| `currentTime` | 秒 | 当前播放位置；设置时触发跳转 |
| `duration` | 只读秒数 | 未知时可为 `NaN`，直播可为 `Infinity` |
| `paused` | 只读布尔 | 是否暂停 |
| `ended` | 只读布尔 | 是否播放结束 |
| `seeking` | 只读布尔 | 是否正在跳转 |
| `readyState` | 只读枚举值 | 当前已有多少可播放数据 |
| `networkState` | 只读枚举值 | 网络加载状态 |
| `buffered` | 只读 `TimeRanges` | 已缓冲时间区间，不一定连续 |
| `seekable` | 只读 `TimeRanges` | 当前可跳转区间 |
| `played` | 只读 `TimeRanges` | 已播放区间 |
| `error` | 只读对象或 `null` | `MediaError`，不要向用户暴露内部细节 |
| `poster` | `video` URL | 播放前海报，不是内容替代 |
| `videoWidth` / `videoHeight` | `video` 只读数值 | 视频固有像素尺寸 |
| `playsInline` | `video` 布尔 | 提示移动端行内播放 |

## 常用方法

| 方法 | 返回或作用 | 注意 |
| --- | --- | --- |
| `play()` | 返回 Promise | 可能因策略、权限或格式失败，必须处理拒绝 |
| `pause()` | 暂停播放 | 无返回值；状态由事件确认 |
| `load()` | 重新选择并加载资源 | 会重置当前播放流程 |
| `canPlayType(type)` | `""`、`maybe` 或 `probably` | 只是能力提示，不能保证资源成功 |
| `fastSeek(time)` | 快速跳转 | 支持有限，关键功能使用 `currentTime` 回退 |
| `requestPictureInPicture()` | 进入画中画 Promise | 仅 `video`，受用户激活和策略限制 |

## 轨道与资源

| 成员或元素 | 用途 | 注意 |
| --- | --- | --- |
| `source` | 提供多个格式或媒体查询候选 | 按顺序选择，写准确 MIME 类型 |
| `track` | 字幕、说明、章节或元数据 | 常用 WebVTT，跨源轨道需 CORS |
| `textTracks` | 文本轨道列表 | 可控制 `disabled`、`hidden`、`showing` |
| `audioTracks` | 音轨列表 | 浏览器支持不一致 |
| `videoTracks` | 视频轨道列表 | 浏览器支持不一致 |

## 关键事件

| 事件 | 含义 | 常见用途 |
| --- | --- | --- |
| `loadstart` | 开始查找资源 | 显示初始加载状态 |
| `loadedmetadata` | 元数据可用 | 初始化时长、尺寸和进度 |
| `loadeddata` | 当前帧数据可用 | 准备预览画面 |
| `canplay` / `canplaythrough` | 可播放或估计可连续播放 | 后者只是浏览器估计 |
| `play` / `playing` | 请求播放或实际播放 | 同步按钮和状态文字 |
| `pause` | 播放暂停 | 同步按钮 |
| `waiting` / `stalled` | 等待数据或加载停滞 | 提示缓冲，不要阻塞其他操作 |
| `seeking` / `seeked` | 跳转开始或完成 | 更新进度控件 |
| `timeupdate` | 播放位置周期更新 | 频率不固定，不用于精密同步 |
| `durationchange` | 时长变化 | 直播或元数据更新时处理 |
| `ratechange` | 播放速度变化 | 同步速度选择器 |
| `volumechange` | 音量或静音变化 | 同步音量控件 |
| `ended` | 播放结束 | 提供重播或下一项，但不强制跳转 |
| `error` | 加载或解码失败 | 显示替代链接和可理解错误 |

## 自动播放与状态同步

```js
const media = document.querySelector('#lesson');

try {
  await media.play();
} catch {
  // 保持原生控件可用，让用户主动开始播放。
}
```

- 带声音自动播放通常会被阻止，也会干扰读屏和用户环境。
- `play()` 成功解析后仍应根据媒体事件同步界面，不要只维护一份自定义状态。
- 静音背景视频也应提供暂停方式，并尊重 `prefers-reduced-motion`。

## 安全、隐私与无障碍

- 媒体 URL、字幕和海报可能产生跨源请求；不要在长期 URL 中暴露访问令牌。
- 服务端负责授权、MIME 类型、范围请求、缓存和文件内容验证。
- 视频提供校对后的字幕；必要时提供音频描述；音频提供完整文字稿。
- 自定义进度、音量和速度控件必须支持键盘、触屏、可见焦点和状态播报。
- 不依赖文件扩展名判断编码支持，在目标浏览器和真实网络条件下测试。

另见：[事件参考](events.md)、[MDN HTMLMediaElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement)。
