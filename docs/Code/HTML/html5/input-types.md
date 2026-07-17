# HTML 输入类型

## 学习目标

- 为数据选择合适的 `input type`。
- 利用移动键盘和浏览器约束改善输入体验。
- 明确客户端验证不能替代服务端验证。

## 常用类型

`text` 适合普通短文本，`email`、`url`、`tel`、`search` 提供相应输入提示，
`number`、`range` 处理数值，`date`、`time` 等处理日期时间，`checkbox` 与 `radio`
处理选择，`file` 选择文件。密码、令牌等敏感数据仍必须通过 HTTPS 传输。

## 安全可运行示例

```html
<form action="/register" method="post">
  <p>
    <label for="email">邮箱</label>
    <input id="email" name="email" type="email"
           autocomplete="email" maxlength="254" required>
  </p>
  <p>
    <label for="birthday">出生日期</label>
    <input id="birthday" name="birthday" type="date">
  </p>
  <p>
    <label for="code">六位验证码</label>
    <input id="code" name="code" type="text" inputmode="numeric"
           autocomplete="one-time-code" pattern="[0-9]{6}" required>
  </p>
  <button type="submit">提交</button>
</form>
```

验证码使用 `text` 而不是 `number`，因为它是可能含前导零的标识符，不参与算术。
`inputmode` 只提示软键盘布局；`pattern` 和 `required` 可被绕过。

## 类型选择原则

- 电话、邮编、银行卡号、账号和验证码通常不是数值，优先用 `text` 配合 `inputmode`。
- `email` 只检查大致语法，不证明邮箱存在或归用户所有。
- 日期值提交格式通常是标准化字符串，但界面显示受地区与浏览器影响。
- `color`、`range` 等控件外观差异大，旁边应显示可理解的当前值。
- `file` 的 `accept` 只是选择提示，服务端必须检查真实内容。

## 兼容与无障碍

浏览器不认识新类型时通常退化为文本框，这是有用回退，但会失去专用 UI 和约束。
始终提供可见 `label`、清楚说明和文字错误信息；不要用 `placeholder` 替代标签，
也不要只依靠颜色标记无效字段。

## 服务端验证

服务端必须重新验证字段是否存在、类型、长度、格式、范围、字段组合和业务权限。
验证失败应返回安全、明确的错误，不回显未转义输入，不记录密码或完整敏感数据。

## 常见错误

- 为所有数字字符使用 `number`，导致前导零和长编号损坏。
- 认为 `required`、`min` 或 `pattern` 是安全边界。
- 用 `placeholder` 作为唯一说明，输入后用户无法回看要求。
- 假定所有浏览器的日期选择器格式和能力相同。
- 只在客户端限制上传文件类型和大小。

## 相关链接

- [HTML5 教程入口](index.md)
- [表单元素](form-elements.md)
- [表单属性](form-attributes.md)
- [MDN：input 类型](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/input)
- [WHATWG：input](https://html.spec.whatwg.org/multipage/input.html)
