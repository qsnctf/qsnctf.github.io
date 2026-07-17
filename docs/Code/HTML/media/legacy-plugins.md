# HTML 插件

## 结论先行

Flash、Java Applet 和 NPAPI 浏览器插件均已淘汰，不应再用于新项目。主流浏览器已经
移除相关运行能力，旧插件还会带来严重的安全、部署、兼容和可访问性问题。

本文不提供安装旧浏览器、启用 NPAPI、旁加载 Flash Player 或降低安全设置的步骤。
如需保存历史内容，应在隔离环境中迁移或录制，而不是要求普通用户恢复过时插件。

## 历史元素

旧页面可能包含 `object`、`embed` 或 `applet`：

```html
<!-- 仅用于识别历史代码，不要照此实现新页面。 -->
<object data="legacy-content.swf" type="application/x-shockwave-flash">
  <p>旧插件内容不可用。</p>
</object>
```

`applet` 已从 HTML 标准中淘汰。`object` 和 `embed` 仍可能承载某些浏览器支持的资源，
但它们不会让 Flash、Java Applet 或 NPAPI 恢复运行，也不应被视为通用插件机制。

## 为什么被淘汰

- 插件拥有复杂且高风险的本机攻击面，补丁与浏览器发布节奏分离。
- 移动设备、无插件浏览器和受管环境无法一致运行内容。
- 插件界面经常脱离 DOM，键盘、缩放、字幕和读屏支持薄弱。
- 二进制内容难以索引、测试、响应式布局和渐进增强。
- 用户安装额外运行时会增加供应链与版本管理风险。

## 现代替代方案

### 音频与视频

使用原生 `audio`、`video`、`source` 和 `track`。浏览器提供播放控件、全屏、字幕轨道
及媒体 API；仍需准备合适编码、文字稿和失败回退。

### 2D 图形与动画

Canvas 适合像素绘制、实时图形和游戏画面；SVG 适合可缩放、可样式化且有 DOM 结构的
图形。普通界面动画优先使用 CSS，并尊重减少动态效果偏好。

### 高性能计算

WebAssembly 可在浏览器沙箱中运行编译模块，适合计算密集型逻辑，但它不是 DOM、
网络或可访问性的替代品。界面仍应由语义 HTML 构成，并对输入和内存边界做验证。

### 交互式应用

使用 HTML、CSS、JavaScript、Web Components 或框架构建。离线缓存可采用 Service
Worker 和 Cache API；数据存储可采用 IndexedDB，而不是依赖插件私有存储。

## 迁移步骤

1. 盘点插件内容的输入、输出、媒体、脚本和服务端依赖。
2. 提取源素材与业务规则，不要试图逐标签机械转换二进制插件。
3. 为静态图形选择 SVG，为动态位图选择 Canvas，为媒体选择原生音视频。
4. 仅在确有计算需求时引入 WebAssembly，并保留语义 HTML 操作界面。
5. 补充键盘操作、字幕、文字替代、响应式布局和自动化测试。
6. 关闭旧插件分发入口，清理安装提示、过时 MIME 类型和下载链接。

## 媒体迁移注意事项

迁移后的 `video` 或 `audio` 应提供带正确 `type` 的多个 `source`，按目标环境测试。
视频字幕使用 `track`；纯音频至少提供文字稿。`preload` 应按页面场景选择，不能假定
`autoplay` 一定成功，尤其不能自动播放声音。

响应式页面可对原生视频使用 `max-width: 100%; height: auto`。性能方面应重新编码、
控制分辨率、启用缓存和范围请求，而不是把原插件包原样塞入下载流程。

## 安全保存历史内容

必须研究历史插件时，使用无敏感数据、无日常账号、默认断网的隔离虚拟机，并只处理
来源明确的样本。对公众发布时优先提供截图、录屏、转写文本或迁移后的开放格式版本。

## 相关页面

- [Canvas 画布](../html5/canvas.md)
- [SVG](../html5/svg.md)
- [audio 音频元素](../html5/audio-element.md)
- [video 视频元素](../html5/video-element.md)
- [Service Worker 与 Cache API](../html5/service-worker-and-cache.md)
- [IndexedDB](../html5/indexeddb.md)
- [HTML 标签字母表](../reference/tags-alphabetical.md)
