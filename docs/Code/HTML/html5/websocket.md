# WebSocket

WebSocket 在一次 HTTP 升级握手后建立全双工长连接，客户端和服务器都可随时发送消息。
它适合协作编辑、实时游戏、交互式终端和高频双向状态同步。

## 建立连接

生产环境应使用加密的 `wss://`：

```js
const socket = new WebSocket("wss://example.test/ws");

socket.addEventListener("open", () => {
  socket.send(JSON.stringify({ type: "subscribe", channel: "updates" }));
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  renderMessage(message);
});

socket.addEventListener("error", () => {
  console.error("WebSocket 发生网络或协议错误");
});
```

不要假设 `error` 事件会暴露详细原因；关闭信息通常在 `close` 事件中处理。

## 认证与授权

浏览器 WebSocket API 不能设置任意握手请求头。常见做法是使用同站安全 Cookie 会话，
或先通过 HTTPS 获取短期、一次性、限定用途的连接凭证。

避免把长期令牌放在 URL 中，因为代理、服务器和监控可能记录完整 URL。
连接认证只完成身份确认，每次订阅、发送消息和操作对象仍必须做服务端授权。

## 校验 Origin

浏览器握手会发送 `Origin`。服务器应使用精确允许列表校验它，防止恶意站点借用用户 Cookie
发起跨站 WebSocket 劫持。`Origin` 校验不能代替认证、CSRF 整体设计和消息级授权。

非浏览器客户端可以伪造头部，因此服务端绝不能把 `Origin` 当作身份凭证。

## 消息协议与验证

为消息定义版本、类型、请求 ID、最大尺寸和错误格式：

```json
{"version":1,"type":"chat.send","requestId":"a7","payload":{"text":"你好"}}
```

服务端应拒绝未知类型、超大消息、非法编码和不符合结构的数据。
客户端收到的文本也是不可信输入，展示时使用 `textContent`，不要直接写入 `innerHTML`。

## 重连策略

WebSocket 不会替应用自动恢复会话。意外断开后使用带随机抖动的指数退避，
并设置最大等待时间和重试上限，避免大量客户端同时重连形成风暴。

重连后要重新认证或确认会话、恢复订阅，并通过序列号或游标补齐缺失事件。
发送操作应使用请求 ID 和幂等设计，防止“已处理但确认丢失”导致重复执行。

## 心跳与背压

浏览器 API 不直接暴露协议级 Ping/Pong，可在应用层发送心跳消息并检测超时。
服务器也应设置空闲和认证过期策略。

发送前检查 `socket.readyState`。`bufferedAmount` 持续增长表示网络发送跟不上，
应限制队列、降低更新频率或断开异常慢客户端，而不是无限占用内存。

## 正确关闭

```js
if (socket.readyState === WebSocket.OPEN) {
  socket.close(1000, "页面不再需要实时连接");
}
```

组件卸载、退出登录和页面功能关闭时应释放连接、定时器及事件监听。
关闭原因长度有限且不是可信日志字段。服务端必须清理订阅、房间成员和后台资源。

## 选择与部署

只需单向文本推送时，[Server-Sent Events](server-sent-events.md) 通常更简单。
部署 WebSocket 时还要确认反向代理升级头、空闲超时、最大帧大小、连接数限制和可观测性。
浏览器安全模型与跨源边界见[浏览器平台安全边界](security-boundaries.md)。
