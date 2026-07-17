# HTML 表单

表单收集用户输入并发起请求。HTML 约束改善体验，但服务端仍必须验证数据、权限与业务规则。

## 基本表单

```html
<form action="/search" method="get">
  <label for="query">搜索关键词</label>
  <input id="query" name="q" type="search" required>
  <button type="submit">搜索</button>
</form>
```

`label` 提供可见且可访问的名称；`placeholder` 不能替代标签。
提交字段通常必须有 `name`，而 `id` 用于标签、片段和脚本关联。

## 合适的控件

```html
<form action="/profile" method="post">
  <label for="email">邮箱</label>
  <input id="email" name="email" type="email" autocomplete="email" required>

  <label for="bio">简介</label>
  <textarea id="bio" name="bio" maxlength="500"></textarea>

  <button type="submit">保存</button>
  <button type="button">预览</button>
</form>
```

表单内 `button` 默认可能提交，非提交按钮应显式设置 `type="button"`。
为姓名、邮箱、密码等常见字段提供准确的 `autocomplete` 值。

## 选项分组

```html
<fieldset>
  <legend>通知方式</legend>
  <label><input type="checkbox" name="channel" value="email"> 邮件</label>
  <label><input type="checkbox" name="channel" value="sms"> 短信</label>
</fieldset>
```

`fieldset` 和 `legend` 为相关控件提供组名。
复选框适合多选；同名 `radio` 适合互斥单选。

## GET 与 POST

GET 适合不会修改状态、可收藏的读取请求，数据通常进入 URL 查询字符串。
密码、令牌等敏感数据不应出现在 URL、历史记录和日志中。
POST 适合创建或修改操作，但 POST 本身不提供加密、认证、授权或 CSRF 防护。
传输保密依赖 HTTPS，状态修改还需要服务端安全控制。

## 文件上传

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <label for="attachment">附件</label>
  <input id="attachment" name="attachment" type="file" accept="image/png,image/jpeg">
  <button type="submit">上传</button>
</form>
```

`accept` 只是选择提示。服务端应检查实际格式、大小、数量、文件名和存储位置。

## 验证与错误

- 使用 `required`、`minlength`、`maxlength`、`min`、`max` 等表达基础约束。
- 错误信息应说明原因，并与对应控件关联，不能只用红色表示。
- 不信任隐藏、只读或禁用状态；请求可以绕过页面直接构造。
- 服务端重新验证类型、范围、字段组合、对象归属和操作权限。
- 输出用户数据时按所在上下文编码，避免注入问题。

相关内容：[脚本与渐进增强](scripts.md)和[HTML 字符实体](entities.md)。
