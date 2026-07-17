# Web Storage

Web Storage 提供同源键值存储，包括持久化的 `localStorage` 和标签页级的
`sessionStorage`。两者的键和值都只能是字符串，并且 API 是同步的。

## localStorage 与 sessionStorage

- `localStorage` 在浏览器会话结束后通常仍保留，直到用户、站点或浏览器清除。
- `sessionStorage` 隔离到当前标签页及其会话，关闭标签页后通常清除。
- 两者都受同源策略约束，协议、主机或端口不同即不是同一存储区。
- 隐私模式、用户设置和存储配额都可能使写入失败。

## 基本操作

```js
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");
localStorage.removeItem("theme");
```

不存在的键返回 `null`。不要用属性访问代替 `getItem()` 和 `setItem()`，
显式方法能避免键名与对象属性冲突。

## 保存结构化数据

```js
const preferences = { theme: "dark", pageSize: 20 };

try {
  localStorage.setItem("preferences", JSON.stringify(preferences));
} catch (error) {
  console.error("无法保存偏好设置", error);
}
```

读取时也要处理格式损坏、旧版本结构和 `null`：

```js
const raw = localStorage.getItem("preferences");
const preferences = raw ? JSON.parse(raw) : { theme: "light" };
```

生产代码应在 `try...catch` 中解析，并验证结果字段，而不是信任存储内容。

## storage 事件

同源的另一个页面修改 `localStorage` 时，其他页面可以收到事件：

```js
window.addEventListener("storage", (event) => {
  if (event.key === "theme") {
    applyTheme(event.newValue);
  }
});
```

发起修改的当前页面通常不会收到自己的 `storage` 事件。
事件适合轻量同步，不是可靠消息队列，也不提供事务或投递确认。

## XSS 与敏感数据风险

Web Storage 不是安全保险箱。页面中的任意同源 JavaScript 都能读取它；一旦发生 XSS，
攻击代码通常也能读取长期保存的令牌、个人信息和业务数据。

不要在 Web Storage 中保存密码、长期访问令牌、私钥或可直接恢复登录状态的秘密。
认证会话通常应使用服务端会话配合 `HttpOnly`、`Secure`、合适 `SameSite` 的 Cookie，
这样 JavaScript 无法直接读取会话 Cookie，但仍必须防范 XSS 发起已认证操作。

从 Storage 读取的数据仍是不可信输入。显示时使用 `textContent`，不要直接送入
`innerHTML`；反序列化后执行字段验证，并控制对象原型相关风险。

## 性能与容量

Web Storage 的同步访问会阻塞主线程。不要保存大对象、频繁写入或把它当数据库。
容量没有统一保证，浏览器可在压力下清理站点数据，应用必须允许数据缺失。

需要大量结构化数据、索引、事务或异步访问时，应使用 [IndexedDB](indexeddb.md)。
需要理解更完整的隔离与威胁模型，可阅读[浏览器平台安全边界](security-boundaries.md)。

## 实践检查

- 只保存可丢失、低敏感度、体积小的数据。
- 对读写、JSON 解析和配额错误做失败处理。
- 为数据结构保存版本并设计迁移或重置策略。
- 不把客户端存储当作权限判断或服务器事实来源。
- 清除账户数据时同时清理相关本地存储。
