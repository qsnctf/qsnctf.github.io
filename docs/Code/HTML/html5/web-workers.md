# Web Workers

Web Worker 让 JavaScript 在独立线程中执行计算，避免长任务阻塞页面主线程。
Worker 适合 CPU 密集型解析、转换和计算，不会让网络本身变得更快。

## Dedicated Worker

页面创建专用 Worker，并通过消息传递交换数据：

```js
const worker = new Worker("./hash-worker.js", { type: "module" });

worker.postMessage({ text: "hello" });
worker.addEventListener("message", (event) => {
  output.textContent = event.data.digest;
});
worker.addEventListener("error", (event) => {
  console.error("Worker 执行失败", event.message);
});
```

Worker 文件：

```js
self.addEventListener("message", async (event) => {
  const bytes = new TextEncoder().encode(event.data.text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  self.postMessage({ digest: Array.from(new Uint8Array(digest)) });
});
```

## 不能直接操作 DOM

Worker 没有页面的 `window` 和 `document`，**不能直接读取或修改 DOM**。
DOM 更新必须由主线程执行，Worker 通过 `postMessage()` 返回计算结果。

Worker 可使用部分 Web API，例如 `fetch()`、定时器、IndexedDB 和 Web Crypto；
具体可用能力应查阅目标 API 的 Worker 支持情况。

## 消息与数据传输

消息默认使用结构化克隆，可传递对象、数组、Blob、Map 等数据，但函数和 DOM 节点不能克隆。
大型 `ArrayBuffer` 可作为 transferable 转移所有权，避免复制：

```js
const buffer = new ArrayBuffer(1024 * 1024);
worker.postMessage(buffer, [buffer]);
```

转移后发送方的原缓冲区会分离，不应继续使用。共享内存需要 `SharedArrayBuffer`、原子操作
以及满足跨源隔离要求，设计不当会产生数据竞争。

## Shared Worker 与 Service Worker

Shared Worker 可被同源多个页面共享，但支持和生命周期管理更复杂。
Service Worker 面向网络代理、离线缓存、推送等事件，不是通用长期后台线程。
离线能力参见 [Service Worker 与 Cache API](service-worker-and-cache.md)。

## 生命周期与关闭

页面不再需要 Worker 时应主动释放资源：

```js
worker.terminate();
```

Worker 内部也可调用 `self.close()`。终止前应考虑未完成任务、消息确认和界面状态；
不要假设 Worker 会永久存活，也不要依赖它保存唯一一份重要状态。

## 错误、取消与背压

为任务分配 ID，返回成功或结构化错误，并允许主线程发送取消消息。
如果生产消息速度高于 Worker 处理速度，应限制队列、合并任务或丢弃过期结果。
用户快速切换输入时，旧任务结果可能晚到，主线程应核对任务 ID 再渲染。

## 安全边界

Worker 脚本仍属于应用代码，受同源和 CSP 等限制。不要把不可信文本当作代码执行，
也不要认为移到 Worker 就能隔离 XSS。传入数据需要验证，返回内容进入 DOM 时仍要安全渲染。

## 适用性检查

- 先用性能工具确认主线程确有长计算任务。
- 计算成本是否明显高于线程通信和数据复制成本？
- 是否可以把任务设计为无共享状态的消息处理？
- 是否处理了错误、取消、终止和页面卸载？
- 是否在目标浏览器中测试模块 Worker 路径与部署 MIME 类型？
