# CSRF：跨站请求伪造

> 本文中的测试方法只适用于自己拥有、明确获授权的系统和本地 CTF 靶场。示例统一使用 `127.0.0.1`，不要把它们改造成针对真实用户或第三方站点的页面。

## 一、CSRF 的本质

CSRF（Cross-Site Request Forgery，跨站请求伪造）利用的是浏览器的凭据携带规则：用户登录目标站点后，浏览器可能在后续请求中自动附带该站点的 Cookie、HTTP 认证信息或客户端证书。另一个页面虽然通常读不到目标站点的响应，却可能让浏览器向目标站点发出请求。

因此，CSRF 的核心不是“窃取 Cookie”，而是：

**攻击者控制请求意图，浏览器自动提供用户身份，服务器误把请求当成用户主动操作。**

浏览器的同源策略主要限制跨源页面读取响应和访问 DOM，并不禁止所有跨源请求。例如图片、顶层导航和 HTML 表单都能产生跨源请求。`HttpOnly` 也不能单独防御 CSRF，因为它只阻止 JavaScript 读取 Cookie，不阻止浏览器发送 Cookie。

关于 Cookie、Session 和 HTTP 方法的基础知识，可先阅读[网站状态管理](../Introduction/Website_Status_Management.md)。如果站点同时存在 XSS，脚本往往能读取页面内令牌或直接调用同源接口，参见 [XSS](./Cross_Site_Scripting.md)。因此，CSRF 防护不能替代 XSS 防护。

## 二、成立条件

一次典型 CSRF 通常同时满足以下条件：

1. 目标接口会改变状态，例如修改邮箱、创建订单、绑定账号或删除数据。
2. 浏览器会自动携带可用于认证的凭据，最常见的是会话 Cookie。
3. 请求中的关键参数可预测或可由攻击者指定。
4. 服务端没有校验不可预测的 CSRF 令牌，也没有可靠验证请求来源。
5. 请求格式能被跨源页面构造，或者 CORS 配置错误使脚本能够发送带凭据请求。

如果 API 只接受由客户端代码显式添加的 `Authorization: Bearer ...`，且令牌没有同时放在 Cookie 中，普通跨站页面通常无法凭空添加这个认证头。这会显著降低传统 CSRF 风险，但令牌存储、XSS 和 CORS 仍需单独评估。

## 三、不同请求形式的差异

### 3.1 GET 请求

GET 可以由链接、图片、iframe、脚本资源或顶层导航触发。如果下面的接口真的修改状态，它就违反了 HTTP 语义，也很容易暴露于 CSRF：

```http
GET /profile/email?value=test%40local.invalid HTTP/1.1
Host: 127.0.0.1:8080
Cookie: session=...
```

防御的第一步是：**GET、HEAD 和 OPTIONS 不应产生业务副作用。** 但把 GET 改成 POST 只减少了部分触发方式，并不等于修复，因为 HTML 表单可以发起 POST。

### 3.2 HTML 表单

跨源表单可以提交以下常见编码：

- `application/x-www-form-urlencoded`
- `multipart/form-data`
- `text/plain`

本地靶场中，可以用一个无敏感操作的“偏好设置”接口观察请求：

```html
<!-- 仅在自己启动的 127.0.0.1:8080 靶场中测试 -->
<form action="http://127.0.0.1:8080/lab/preferences" method="post">
  <input type="hidden" name="theme" value="dark">
  <button type="submit">提交本地测试请求</button>
</form>
```

若用户已登录本地靶场，浏览器是否附带 Cookie 取决于 Cookie 的 `SameSite`、`Secure`、请求是否属于同站以及导航方式。

### 3.3 JSON 接口

原生 HTML 表单不能直接设置 `Content-Type: application/json` 并发送任意 JSON。跨源 JavaScript 若使用该类型，通常会先触发 CORS 预检：

```js
fetch("http://127.0.0.1:8080/lab/preferences", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ theme: "dark" })
});
```

这并不表示“JSON 天生免疫 CSRF”。需要检查：

- 服务端是否也接受表单编码或 `text/plain`，然后宽松解析为 JSON。
- 接口是否忽略 `Content-Type`，只按请求体内容解析。
- CORS 是否把不可信源加入允许列表并允许凭据。
- 简单请求是否能通过方法或编码降级到同一业务逻辑。

服务端应严格要求预期的 `Content-Type`，但它仍只是纵深防御，不能代替 CSRF 令牌或来源校验。

### 3.4 CORS 与 CSRF 的关系

CORS 决定跨源脚本能否读取响应，以及某些非简单请求能否实际发出；CSRF 关注服务端是否接受带用户身份的非自愿请求。两者相关但不等价。

危险配置通常具有以下组合：

- 动态反射任意 `Origin`。
- 返回 `Access-Control-Allow-Credentials: true`。
- 允许不可信源使用修改状态的方法和请求头。
- 源匹配使用后缀、子串或未经规范化的正则。

带凭据响应不能使用 `Access-Control-Allow-Origin: *`，但“反射任意 Origin + 允许凭据”与通配效果相近。CORS 允许列表应使用解析后的精确源三元组：协议、主机和端口。

## 四、CSRF 令牌模式

### 4.1 同步器令牌

服务端为会话生成高熵随机令牌，将其嵌入表单或同源页面，再在提交时比较：

```php
<?php
session_start();

if (!isset($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $provided = $_POST['csrf'] ?? '';
    if (!is_string($provided) || !hash_equals($_SESSION['csrf'], $provided)) {
        http_response_code(403);
        exit('CSRF validation failed');
    }

    // 令牌验证通过后再执行本地靶场中的状态修改。
}
?>
<form method="post">
  <input type="hidden" name="csrf"
         value="<?= htmlspecialchars($_SESSION['csrf'], ENT_QUOTES, 'UTF-8') ?>">
  <select name="theme">
    <option value="light">light</option>
    <option value="dark">dark</option>
  </select>
  <button type="submit">保存</button>
</form>
```

令牌应与用户会话绑定、不可预测、不放在 URL 中，并通过 HTTPS 传输。登录、登出或权限显著变化后可轮换令牌。比较时使用恒定时间比较函数，例如 PHP 的 `hash_equals`。

### 4.2 双重提交 Cookie

无服务端会话的应用可让客户端同时在 Cookie 和请求参数或自定义头中提交令牌，服务端验证二者一致。更稳妥的做法是让令牌携带由服务端密钥计算的 HMAC，并绑定当前会话标识，避免攻击者通过可控子域写入一个同名 Cookie 后伪造匹配值。

关键要求包括：

- 令牌必须高熵，或由 HMAC 保证完整性。
- Cookie 使用 `Secure`，并尽可能采用 `__Host-` 前缀、无 `Domain`、`Path=/`。
- 不应只检查“Cookie 和参数相等”而没有会话绑定或签名。

### 4.3 自定义请求头

单页应用常把 CSRF 令牌放在 `X-CSRF-Token` 等自定义头中。普通 HTML 表单无法添加自定义头，跨源脚本则需通过 CORS 预检。服务端仍应验证令牌值，并严格配置 CORS；“存在某个头”不能成为唯一依据，因为代理或后端代码可能错误地注入它。

## 五、SameSite 的能力与边界

`SameSite` 控制 Cookie 在跨站上下文中的发送。这里的“站”通常按可注册域名与协议判断，不等同于同源；不同子域可能跨源但仍同站。

- `Strict`：大多数跨站导航和子资源请求都不带 Cookie，保护最强，但可能影响从外部链接进入后的登录体验。
- `Lax`：通常阻止跨站子资源和 POST 携带 Cookie，但顶层安全方法导航（常见为 GET）仍可能携带。
- `None`：允许跨站发送，现代浏览器要求同时设置 `Secure`。

需要注意：

1. 不显式设置时，现代浏览器常按 `Lax` 处理，但旧浏览器、嵌入式浏览器和兼容策略可能不同。
2. `Lax` 不能保护会改变状态的 GET。
3. 同站不同源场景不一定被拦截；若同站子域可被接管或存在 XSS，风险仍在。
4. OAuth、单点登录、支付回跳和嵌入场景可能确实需要跨站 Cookie，应对特定端点建模，而非全局放宽。
5. SameSite 是纵深防御，不应作为高价值操作的唯一防线。

## 六、Origin 与 Referer 校验

服务端可对修改状态的请求验证来源：

1. 优先解析 `Origin`，要求其与明确允许的源完全匹配。
2. 若浏览器场景未发送 `Origin`，可回退检查 `Referer` 的源部分。
3. 两者都缺失时，高风险接口应默认拒绝或进入额外确认流程。

不要使用 `contains("trusted.example")`、字符串后缀或简单正则，因为 `trusted.example.attacker.invalid`、用户信息段、端口和编码差异可能绕过。应使用 URL 解析器提取小写规范化后的协议、主机和有效端口，再做精确比较。

`Referer` 可能因隐私策略、代理或从 HTTPS 跳到 HTTP 而缺失，因此校验策略要结合实际客户端监控。它适合作为令牌之外的第二道防线，也适合作为异常审计信号。

## 七、Login CSRF

登录 CSRF 的目标不是让受害者以自己的身份执行操作，而是让受害者浏览器登录到攻击者预先准备的账号。之后，受害者可能把搜索记录、支付信息或私密数据误存进攻击者账号。

典型成因是登录接口认为“用户尚未登录，所以不需要 CSRF 防护”。实际上，登录请求同样会改变浏览器的认证状态。防护方式包括：

- 登录表单使用登录前会话绑定的 CSRF 令牌。
- 验证 `Origin`/`Referer`。
- OAuth/OIDC 流程使用一次性、与发起浏览器绑定的 `state`，并正确使用 PKCE/nonce。
- 登录成功后轮换 Session ID，避免会话固定。
- 对账号绑定、第三方身份关联要求重新认证和明确确认。

## 八、完整防御策略

推荐按以下优先级组合实施：

1. 所有修改状态的接口使用非 GET 方法，并验证请求方法和 `Content-Type`。
2. 对基于 Cookie 的认证使用成熟框架内置的 CSRF 中间件。
3. 令牌与会话绑定，使用密码学安全随机数或 HMAC，并在服务端恒定时间比较。
4. Cookie 设置 `Secure`、`HttpOnly` 和符合业务的 `SameSite`；会话 Cookie 尽量使用 `__Host-` 前缀。
5. 精确校验 `Origin`，必要时回退到 `Referer`。
6. CORS 只允许确有需要的可信源、方法和请求头，带凭据时禁止动态反射任意源。
7. 高风险操作要求重新输入密码、二次认证或事务确认。
8. 修复同站子域接管和 XSS，因为它们会削弱多层 CSRF 防护。

## 九、本地测试清单

仅在授权系统或本地靶场中执行以下检查：

- [ ] 列出所有创建、修改、删除、转账、绑定和登录/登出端点。
- [ ] 确认 GET、HEAD、OPTIONS 不改变服务器状态。
- [ ] 在退出和登录两种状态下记录 Cookie 的 `SameSite`、`Secure`、`Domain`、`Path`。
- [ ] 从不同本地源提交 HTML 表单，观察 Cookie 是否发送以及服务端是否拒绝。
- [ ] 删除、置空、复用或替换 CSRF 令牌，预期均返回 `403` 且不发生副作用。
- [ ] 检查令牌是否出现在 URL、日志、分析系统或外链 `Referer` 中。
- [ ] 检查 JSON 端点是否错误接受表单编码、`text/plain` 或缺失的 `Content-Type`。
- [ ] 检查 CORS 是否只返回精确允许的源，且不会允许带凭据的任意源。
- [ ] 测试缺失、畸形和不可信的 `Origin`/`Referer`，确认策略符合设计。
- [ ] 单独测试登录、登出、密码重置、账号绑定和 OAuth 回调。
- [ ] 确认令牌属于当前会话，换账号或换会话后不能继续使用。
- [ ] 验证失败请求被审计，但日志不会记录完整令牌或会话 Cookie。

## 十、总结

CSRF 来自“浏览器自动携带身份”和“服务端无法确认操作意图”的组合。可靠修复不是隐藏接口或只改成 POST，而是使用框架级 CSRF 令牌、严格来源校验、合理的 SameSite 策略、精确 CORS 配置和高风险操作再认证。测试时应覆盖请求方法、编码、认证状态和浏览器上下文，而不是只验证一个表单样例。
