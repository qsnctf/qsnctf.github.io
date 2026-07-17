# HTML5 API 测验

本页检查语义元素、浏览器存储、Worker、实时通信、离线缓存和平台安全边界。
先独立作答，再查看页面后半部分的答案。

## 题目

1. `article`、`section` 和 `div` 的主要区别是什么？
2. 为什么不能因为希望文字更小就从 `h2` 跳到 `h5`？
3. `localStorage` 和 `sessionStorage` 的生命周期有何不同？
4. 为什么不应在 Web Storage 中保存长期访问令牌？
5. Web SQL 当前是什么状态，新项目应使用什么替代？
6. IndexedDB 的结构迁移应在哪个事件中进行？
7. 为什么不能只根据单个 IndexedDB 请求的 `success` 判断事务已经提交？
8. Application Cache 当前是什么状态，应使用什么替代？
9. Web Worker 能否直接修改页面 DOM？应如何返回计算结果？
10. 大型 `ArrayBuffer` 如何减少主线程与 Worker 间的复制成本？
11. SSE 连接断开后，浏览器原生 `EventSource` 通常会怎样处理？
12. 为什么不建议把 SSE 或 WebSocket 的长期令牌放入 URL？
13. WebSocket 服务端为什么需要校验 `Origin`？
14. WebSocket 重连为什么应使用指数退避和随机抖动？
15. `fetch()` 收到 HTTP 404 时，Promise 一定会拒绝吗？
16. 取消 Fetch 请求是否保证服务器撤销已经开始的业务操作？
17. CORS 能否代替身份认证和服务端授权？
18. Cache API 与 IndexedDB 各自适合保存什么？
19. Service Worker 为什么不能简单缓存所有 GET 响应？
20. 从浏览器存储读取的数据是否可以直接写入 `innerHTML`？

## 场景题

21. 新闻页面只需要服务器向浏览器推送文字更新，应优先考虑 SSE 还是 WebSocket？为什么？
22. 协作编辑器需要客户端和服务器高频双向发送操作，应选择哪种连接？
23. 用户退出账户时，实时连接、本地数据库和私有缓存应如何处理？
24. 一个页面通过客户端隐藏按钮来限制管理员功能，这个方案缺少什么关键控制？
25. 旧站点仍有 `.appcache` 文件。仅删除 HTML 的 `manifest` 属性是否足够？

## 答案

1. `article` 是可独立分发的完整内容，`section` 是有主题且通常有标题的章节，
   `div` 是没有额外语义的通用容器。
2. 标题级别表达文档结构，不负责视觉字号；样式应由 CSS 控制。
3. `localStorage` 通常跨会话保留，`sessionStorage` 通常随当前标签页会话结束而清除。
4. 任意同源脚本和 XSS 代码都可能读取 Web Storage，长期令牌会扩大账户接管风险。
5. Web SQL 非标准且已废弃；新项目应使用 IndexedDB。
6. 在打开数据库请求的 `upgradeneeded` 事件及其版本升级事务中进行。
7. 单个请求成功后事务仍可能因后续请求或约束错误中止，应以事务完成事件为准。
8. Application Cache 已从平台移除；使用 Service Worker 配合 Cache API。
9. 不能。Worker 使用 `postMessage()` 把结果发送给主线程，由主线程更新 DOM。
10. 把缓冲区放入 transferable 列表转移所有权；转移后发送方不能继续使用原缓冲区。
11. 它通常会自动重连，并可携带最后事件 ID；应用仍需设计状态提示和服务端重放策略。
12. URL 可能进入日志、历史记录、监控和 Referer，从而泄露长期凭据。
13. 防止恶意网站利用用户 Cookie 建立跨站 WebSocket；同时仍需认证和消息级授权。
14. 避免服务恢复时大量客户端同时重连形成流量风暴，并限制资源消耗。
15. 不一定。404 通常仍解析为已完成的 `Response`，代码需要检查 `response.ok` 或状态码。
16. 不保证。请求取消可能发生在服务端已经执行操作之后，关键操作需幂等和状态确认。
17. 不能。CORS 只控制浏览器脚本读取跨源响应，服务器仍须认证和授权每个操作。
18. Cache API 保存请求/响应用于网络缓存；IndexedDB 保存结构化记录、索引和业务离线数据。
19. 响应可能含隐私数据、禁止存储、快速过期或来自不可信来源，还涉及配额和账户切换。
20. 不可以。存储内容仍是不可信数据，纯文本应使用 `textContent`，富文本需严格清理。
21. 优先 SSE，因为需求是单向文本推送，并能利用 HTTP、自动重连和事件 ID。
22. 选择 WebSocket，因为它提供持久的全双工通信。
23. 关闭连接和定时器，清理与账户关联且不应保留的数据库记录与缓存，并重置内存状态。
24. 缺少服务端授权。隐藏按钮只是界面控制，用户仍可直接构造请求。
25. 不足。还需迁移离线策略、处理旧缓存与更新、验证回退行为，并测试现有用户升级路径。

复习时可从 [HTML5 语义元素](semantic-elements.md)、[IndexedDB](indexeddb.md)、
[Service Worker 与 Cache API](service-worker-and-cache.md) 和
[浏览器平台安全边界](security-boundaries.md) 开始。
