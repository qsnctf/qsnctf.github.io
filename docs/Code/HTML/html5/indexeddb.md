# IndexedDB

IndexedDB 是浏览器提供的异步、事务型对象数据库，适合离线数据、大量结构化记录、
二进制对象和需要索引查询的场景。它不是服务端数据库，也不能作为可信授权来源。

## 核心概念

- 数据库有名称和整数版本。
- 对象仓库 `objectStore` 类似记录集合。
- 键可来自 `keyPath`、自动递增值或调用方提供。
- 索引 `index` 支持按非主键字段查询。
- 所有读写都发生在事务中。
- 请求通过事件或 Promise 封装返回异步结果。

## 打开与升级数据库

```js
const request = indexedDB.open("notes-app", 1);

request.onupgradeneeded = () => {
  const db = request.result;
  const store = db.createObjectStore("notes", { keyPath: "id" });
  store.createIndex("by-updated", "updatedAt");
};

request.onsuccess = () => {
  const db = request.result;
  console.log("数据库已打开", db.name);
};

request.onerror = () => console.error(request.error);
```

结构创建和迁移只能在版本升级事务中完成。升级逻辑应按旧版本逐步执行，
避免删除仓库后重建导致用户数据丢失。

## 写入记录

```js
function saveNote(db, note) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("notes", "readwrite");
    tx.objectStore("notes").put(note);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
```

以事务完成事件作为提交成功信号，不要只观察单个请求的 `success`。
事务回调中避免等待无关网络请求，否则事务可能在等待期间自动结束。

## 查询与游标

已知主键时使用 `get()`；记录量可控时可用 `getAll()`；大量数据宜使用游标分页处理。

```js
const tx = db.transaction("notes", "readonly");
const index = tx.objectStore("notes").index("by-updated");
const request = index.openCursor(null, "prev");

request.onsuccess = () => {
  const cursor = request.result;
  if (!cursor) return;
  renderTitle(cursor.value.title);
  cursor.continue();
};
```

## 版本阻塞与连接关闭

其他标签页保持旧连接时，数据库升级可能被阻塞。应用应监听 `versionchange` 并关闭连接：

```js
db.onversionchange = () => {
  db.close();
  location.reload();
};
```

打开请求的 `onblocked` 可提示用户关闭旧标签页。数据库用完后可调用 `db.close()`；
事务会自动结束，但仍应正确处理错误和中止。

## 配额、清理与持久化

可用容量和清理策略由浏览器决定。写入可能因配额、隐私设置或磁盘状态失败。
重要数据应同步到服务端或允许导出，离线副本必须能够重建。
可按需了解 `navigator.storage.estimate()` 和 `navigator.storage.persist()`，但持久化申请不保证成功。

## 安全边界

IndexedDB 受同源策略隔离，但同源脚本，包括被 XSS 注入的脚本，也可访问数据库。
不要保存不必要的令牌、密钥或敏感个人数据。从数据库读取的数据仍需验证，
渲染时使用安全 DOM API。客户端记录不得决定服务器端权限或资产状态。

## 选择建议

- 少量字符串偏好：使用 [Web Storage](web-storage.md)。
- 大量结构化或二进制数据：使用 IndexedDB。
- 请求响应离线缓存：使用 [Service Worker 与 Cache API](service-worker-and-cache.md)。
- 历史 Web SQL 项目：参见 [Web SQL（已废弃）](web-sql.md) 的迁移说明。
