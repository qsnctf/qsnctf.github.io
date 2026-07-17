# Server-Sent Events

Server-Sent Events（SSE）通过一个长期 HTTP 连接把服务器事件单向推送给浏览器。
浏览器使用 `EventSource` 接收 `text/event-stream`，适合通知、进度和状态流。

## 客户端连接

```js
const events = new EventSource("/api/events");

events.addEventListener("status", (event) => {
  const data = JSON.parse(event.data);
  statusNode.textContent = data.message;
});

events.onerror = () => {
  console.warn("事件流暂时中断");
};
```

默认 `message` 事件可通过 `events.onmessage` 处理。消息数据始终是字符串，
解析 JSON 后仍要验证字段和类型。

## 服务端格式

响应应使用正确内容类型并持续刷新：

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache

event: status
id: 42
data: {"message":"处理中"}

```

每个事件以空行结束。多行数据应为每行添加 `data:`。
代理缓冲、连接超时和压缩配置可能阻止事件及时到达，需要端到端测试。

## 重连与事件恢复

`EventSource` 在意外断开后会自动重连。服务器可发送 `retry:` 建议等待时间，
浏览器会在重连时通过 `Last-Event-ID` 请求头携带最后事件 ID。

服务器应决定事件是否可重放，并让处理尽量幂等。事件 ID 必须属于当前用户和订阅范围，
不能因客户端提供旧 ID 就返回其无权访问的数据。

自动重连不等于无限重试设计。页面应显示连接状态，服务端应限制连接数、空闲时间和
重放窗口，并使用心跳注释维持经过代理的连接。

## 认证限制

原生 `EventSource` 不能设置任意请求头，因此通常不能直接添加自定义 `Authorization` 头。
常见方案是使用安全 Cookie 会话，并设置 `HttpOnly`、`Secure` 和合适的 `SameSite`。

不要把长期访问令牌放在 URL 查询参数中；URL 可能进入日志、历史记录、监控和 Referer。
若必须使用跨源 Cookie，应显式设置 `withCredentials`，服务端也必须返回精确 CORS 来源，
不能在凭据请求中使用通配符来源。

## Origin 与授权

服务端应验证会话、资源归属和订阅权限。对跨源场景配置严格允许列表，
不要把 CORS 当作认证机制。必要时检查 `Origin`，但仍必须执行正常身份认证与对象级授权。

每条推送内容都可能包含用户数据。服务端要防止跨租户事件混流，客户端不能依据推送消息
自行扩大权限，敏感操作仍需经过受保护的请求完成。

## 资源关闭

页面不再需要事件流时必须关闭连接：

```js
events.close();
```

组件卸载、账户退出、订阅条件变化或页面切到无需实时数据的状态时，都应释放旧连接。
服务端也应检测客户端断开，取消数据库监听和后台任务，避免资源泄漏。

## 何时选择 SSE

- 主要是服务器向客户端单向推送。
- 文本事件即可，不要求二进制帧。
- 希望利用 HTTP、自动重连和事件 ID。
- 双向高频通信或二进制数据更适合 [WebSocket](websocket.md)。

网络请求的一般安全与取消方式见 [Fetch 与网络请求](fetch-and-networking.md)。
