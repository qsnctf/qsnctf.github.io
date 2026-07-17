# Service Worker 与 Cache API

Service Worker 是运行在页面之外的事件驱动脚本，可代理其作用域内的网络请求。
配合 Cache API，它能实现可控离线体验，是已移除 AppCache 的现代替代方案。

## 注册

Service Worker 需要安全上下文，`localhost` 通常作为本地开发例外：

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js", { scope: "/" })
    .catch((error) => console.error("注册失败", error));
}
```

脚本路径会影响默认作用域。不要为了方便给不相关页面授予过大的网络控制范围。

## 安装与预缓存

```js
const CACHE_NAME = "app-shell-v3";
const PRECACHE = ["/", "/assets/site.css", "/assets/app.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
});
```

只预缓存启动离线体验必需、URL 稳定且发布时已验证的资源。
一个资源失败会使 `addAll()` 拒绝，部署流程应检测资源是否真实存在。

## 激活与清理

```js
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names
        .filter((name) => name.startsWith("app-shell-") && name !== CACHE_NAME)
        .map((name) => caches.delete(name))
    ))
  );
});
```

只删除本应用明确拥有的旧缓存，不要清空同源其他功能的缓存。
新 Worker 的接管时机需要谨慎设计，强制立即接管可能让旧页面和新资源版本不一致。

## 请求策略

不同资源需要不同策略。静态指纹资源可缓存优先，导航常用网络优先并提供离线回退，
频繁更新的数据可采用网络优先或 stale-while-revalidate。

```js
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request)
    )
  );
});
```

该示例没有更新缓存，也没有区分跨源、导航和 API，仅用于展示控制流程。
生产代码应先定义缓存资格、过期和失败语义。

## Cache API 注意事项

Cache API 不会自动遵守业务上的过期要求，也不会替应用执行缓存淘汰。
`cache.put()` 保存的是响应快照；流式响应通常需要 `response.clone()` 才能同时返回和缓存。

不要默认缓存以下内容：

- 非 GET 请求或具有副作用的操作。
- 含账户隐私、一次性令牌或个性化敏感数据的响应。
- `Cache-Control: no-store` 或业务明确禁止离线保留的响应。
- 未验证来源和内容类型的跨源响应。

## 更新与通信

Service Worker 更新在后台检查，已打开页面可能继续由旧版本控制。
应用可通过 `postMessage()` 报告新版本，但应让用户在安全时机刷新，避免丢失表单或草稿。
`skipWaiting()` 与 `clients.claim()` 不是固定模板，使用前要分析版本兼容性。

## 数据职责

缓存的网络响应可能被浏览器清理，不能是重要数据的唯一副本。
结构化草稿、索引和大量对象应使用 [IndexedDB](indexeddb.md)；服务器仍是权限和共享数据
的可信来源。网络请求行为见 [Fetch 与网络请求](fetch-and-networking.md)。

## 安全与测试

Service Worker 被攻陷后可影响大量请求，因此要保护脚本发布链路、限制第三方依赖、
使用 CSP，并建立快速回滚机制。退出登录时清理需要清理的私有缓存。

测试首次安装、升级、多标签页、离线、慢网、存储清理、认证切换和响应错误。
旧 AppCache 项目的迁移说明见 [Application Cache（已移除）](application-cache.md)。
