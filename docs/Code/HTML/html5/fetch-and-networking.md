# Fetch 与网络请求

Fetch API 用 Promise 表达 HTTP 请求与响应，可在页面、Worker 和 Service Worker 中使用。
它比旧式回调接口更易组合，但不会自动处理超时、重试、业务错误或安全策略。

## 基本请求

```js
async function loadProfile() {
  const response = await fetch("/api/profile", {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
```

Fetch 只在网络错误、取消等情况下拒绝 Promise。404 和 500 仍会得到 `Response`，
因此必须检查 `response.ok` 或状态码。解析后的 JSON 仍需做结构验证。

## 发送 JSON

```js
const response = await fetch("/api/notes", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({ title: "离线设计" }),
});
```

不要把用户输入直接拼入 URL、请求头或 JSON 字符串。URL 参数使用 `URL` 和
`URLSearchParams`，JSON 使用序列化器，文件上传使用 `FormData`。

## 取消与超时

组件卸载、用户切换查询或超时后应取消无用请求：

```js
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 8000);

try {
  const response = await fetch("/api/report", {
    signal: controller.signal,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
} finally {
  clearTimeout(timer);
}
```

取消请求不保证服务器撤销已经开始的业务操作。创建、扣款等操作应在服务端支持幂等键、
状态查询或明确的取消协议。

## 重试原则

只对临时网络失败、429 或部分 5xx 考虑重试，并使用指数退避和随机抖动。
尊重 `Retry-After`，设置最大次数。GET 通常可重试；POST 是否安全取决于业务幂等设计。

不要对认证失败、验证失败和所有 4xx 盲目重试，也不要让页面、Service Worker 和代理
同时无限重试同一个请求。

## 凭据、CORS 与 CSRF

同源请求默认携带同源凭据。跨源携带 Cookie 需要 `credentials: "include"`，
服务端必须返回精确的允许来源和凭据头。CORS 控制浏览器能否向脚本暴露响应，
不是身份认证，也不能阻止服务器收到某些跨站请求。

Cookie 会话的状态修改请求仍需 CSRF 防护，例如合适 `SameSite`、不可预测令牌和
`Origin` 校验。不要用 `mode: "no-cors"` 绕过限制；它会得到不可读的 opaque 响应。

## 响应与内容安全

在解析前检查状态、`Content-Type` 和可接受的响应大小。下载大文件时考虑流式处理，
避免一次性占满内存。从网络获得的 HTML、URL 和文本都不可信，进入 DOM 时按上下文处理。

敏感请求只使用 HTTPS。不要在查询参数中放密码和长期令牌；它们可能进入日志、历史记录
和 Referer。访问令牌应限制权限和生命周期，并避免存入可被 XSS 读取的长期存储。

## 缓存与生命周期

浏览器 HTTP 缓存由请求和响应头控制。Service Worker 的 Cache API 是额外的应用缓存层，
不能忽略 `no-store`、用户切换和数据过期语义。详见
[Service Worker 与 Cache API](service-worker-and-cache.md)。

## 实践检查

- 每个请求是否有错误、取消、超时和加载状态？
- 是否区分网络失败、HTTP 错误和业务错误？
- 重试是否有限、带退避且符合幂等性？
- 跨源、Cookie、CSRF 和服务端授权是否分别处理？
- 响应是否在渲染、保存或执行前经过验证？
