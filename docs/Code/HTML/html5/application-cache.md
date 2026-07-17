# Application Cache（已移除）

Application Cache（AppCache）曾通过清单文件让页面离线加载。
它已从 Web 平台移除，不应在新项目中使用，也不能依赖浏览器继续支持。

## 历史用法识别

旧页面可能在根元素声明清单：

```html
<html manifest="site.appcache">
```

清单文件常包含以下分区：

```text
CACHE MANIFEST
CACHE:
/index.html
/styles.css
NETWORK:
*
```

以上内容只用于识别和迁移旧代码，不是推荐实现。

## 为什么被移除

- 缓存更新模型隐蔽，用户可能长期运行旧资源。
- 清单中一个错误可能使整个更新失败。
- 导航与回退规则容易产生意外离线响应。
- 调试、版本控制和渐进更新都很困难。
- API 无法提供现代应用所需的细粒度请求控制。

删除 `manifest` 属性不等于完成离线迁移。团队还需确认旧缓存是否会残留、用户是否能
获得新版本，以及离线时哪些页面和数据应当工作。

## 现代替代

使用 [Service Worker 与 Cache API](service-worker-and-cache.md) 拦截请求并显式选择策略。
Service Worker 可以区分导航、静态资源和 API 请求，也能定义安装、激活与缓存清理流程。

```js
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
```

这只是最小事件形态，不构成完整离线方案。生产实现需要 HTTPS、缓存版本、错误回退、
更新策略和测试，不能简单地“缓存所有内容”。

## Cache API 与业务数据

Cache API 保存 `Request` 与 `Response` 对，适合静态资源和可缓存网络响应。
结构化业务记录、草稿和查询索引应放入 [IndexedDB](indexeddb.md)。
不要用 Cache API 模拟关系数据库，也不要把 IndexedDB 当 HTTP 缓存。

## 迁移步骤

1. 盘点 `.appcache` 清单、入口页、回退规则和离线需求。
2. 移除 HTML 上的 `manifest` 属性和旧事件处理代码。
3. 设计 Service Worker 作用域、注册路径和更新生命周期。
4. 只预缓存离线启动真正必需且有版本的静态资源。
5. 为导航、API、图片等请求分别选择网络优先或缓存优先策略。
6. 激活新版本时删除明确属于旧版本的缓存。
7. 测试首次访问、离线启动、断网恢复、更新失败和多标签页场景。

## 更新与回退原则

离线页面必须明确告诉用户数据是否陈旧。网络失败和 HTTP 错误不是同一情况；
`fetch()` 收到 404 或 500 时通常仍会完成 Promise，需要检查 `response.ok`。

不要缓存带有用户隐私数据的响应，除非产品明确需要且已评估共享设备、退出登录、
账户切换和清理行为。缓存键、Vary 响应和认证状态都需要纳入设计。

## 安全要求

Service Worker 具有较强网络控制能力，仅能在安全上下文中注册（本地开发例外）。
限制注册脚本和作用域，保护发布链路，避免缓存不可信 HTML，并为脚本部署建立回滚机制。
更完整的网络与安全说明见 [Fetch 与网络请求](fetch-and-networking.md) 和
[浏览器平台安全边界](security-boundaries.md)。
