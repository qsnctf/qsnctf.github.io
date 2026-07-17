# HTML 表单属性

## 学习目标

- 理解提交、自动填充和约束验证相关属性。
- 正确选择 GET、POST 与编码方式。
- 把浏览器验证定位为体验增强，而非服务端安全边界。

## 提交属性

`action` 指定提交 URL，`method` 常用 `get` 或 `post`。GET 数据通常进入 URL，适合读取、
可收藏和幂等操作，不应携带密码或令牌。POST 数据通常进入请求体，但并不自动加密；
保密依赖 HTTPS，状态修改还需认证、授权和适当的 CSRF 防护。

上传文件时使用 `enctype="multipart/form-data"`。`target` 会改变响应打开位置，应谨慎使用；
`novalidate` 只关闭浏览器约束验证，不会也不应关闭服务端验证。

## 安全可运行示例

```html
<form action="/account" method="post" autocomplete="on">
  <p>
    <label for="display-name">显示名称</label>
    <input id="display-name" name="display_name"
           minlength="2" maxlength="40" required>
  </p>
  <p>
    <label for="website">个人网站</label>
    <input id="website" name="website" type="url"
           autocomplete="url" placeholder="https://example.com/">
  </p>
  <button type="submit">保存</button>
</form>
```

服务端必须重新检查名称长度、Unicode 处理、URL 协议与业务规则。若以后把名称输出到 HTML，
应按 HTML 文本上下文编码；URL 则需解析并限制允许协议，不能只检查字符串前缀。

## 约束验证属性

- `required` 要求非空或完成选择。
- `minlength`、`maxlength` 限制文本长度。
- `min`、`max`、`step` 约束数值或日期范围。
- `pattern` 使用 JavaScript 风格正则约束文本，错误说明应明确展示要求。
- `readonly` 通常仍会提交，`disabled` 通常不提交；两者都不是防篡改机制。

## 自动填充

使用规范的 `autocomplete` 标记，如 `name`、`email`、`new-password` 和
`one-time-code`，可帮助密码管理器和移动设备。不要阻止用户粘贴密码，也不要依赖
`autocomplete="off"` 保护敏感数据；浏览器可能为用户安全和便利忽略它。

## 单个按钮覆盖

提交按钮可用 `formaction`、`formmethod`、`formenctype` 覆盖表单设置，适合“保存草稿”
等明确操作。服务端必须按每个端点独立验证，不能相信按钮值证明用户走过特定界面。

## 兼容与无障碍

不同浏览器的错误气泡、日期控件和自动填充表现不同。提供标签、持久说明和服务端返回的
文字错误，并把错误与控件关联。使用 `:invalid` 时不要在用户尚未交互前满屏标红。

## 常见错误

- 用 POST 代替 HTTPS，误以为请求体不会被窃听。
- 把 `readonly`、`disabled` 或隐藏字段当作可信数据。
- 正则过度严格，拒绝合法姓名、邮箱或国际化输入。
- 关闭粘贴和密码管理器，反而迫使用户使用弱密码。
- 只返回“输入无效”，不指出字段和修正方法。

## 相关链接

- [HTML5 教程入口](index.md)
- [输入类型](input-types.md)
- [表单元素](form-elements.md)
- [MDN：客户端表单验证](https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Forms/Form_validation)
- [WHATWG：Form control infrastructure](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)
