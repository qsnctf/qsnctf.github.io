# HTML 表单元素

## 学习目标

- 使用 `form`、`label`、`fieldset`、`select`、`textarea` 和 `button`。
- 建立清楚的名称、分组和提交结构。
- 在服务端执行最终验证、授权和安全处理。

## 表单与成功控件

`form` 定义提交范围和目标。通常只有具有 `name`、未被禁用且满足提交条件的控件
会形成表单数据；`id` 用于标签和脚本关联，不能替代 `name`。按钮在表单内默认可能是
提交按钮，非提交行为应显式使用 `type="button"`。

## 安全可运行示例

```html
<form action="/feedback" method="post">
  <fieldset>
    <legend>反馈类型</legend>
    <label><input type="radio" name="kind" value="question" required> 问题</label>
    <label><input type="radio" name="kind" value="suggestion"> 建议</label>
  </fieldset>
  <p>
    <label for="topic">主题</label>
    <select id="topic" name="topic">
      <option value="html">HTML</option>
      <option value="accessibility">无障碍</option>
    </select>
  </p>
  <p>
    <label for="message">内容</label>
    <textarea id="message" name="message" rows="6" maxlength="1000" required></textarea>
  </p>
  <button type="submit">发送反馈</button>
</form>
```

示例提交到同源路径。真实服务端需验证允许的 `kind` 与 `topic` 值、文本长度和权限，
实施 CSRF 防护，并在输出反馈内容时按上下文编码。

## 选择与建议

`select` 适合有限的固定选项，`optgroup` 可分组。`datalist` 只提供建议，用户仍可能
输入列表外的值，不能当作白名单。大量可搜索选项若自定义组件，应保留完整键盘交互。

`output` 可显示计算结果，`progress` 表示任务进度，`meter` 表示已知范围内的度量；
不要仅根据默认外观选择元素。

## 文件上传

文件表单需要 `method="post"` 和 `enctype="multipart/form-data"`。服务端应限制文件数量、
大小与处理时间，检查真实格式，生成安全文件名，存放在不可执行位置，并按需求扫描内容。

## 兼容与无障碍

每个控件都要有可见标签或等价名称。相关单选与复选项用 `fieldset` 和 `legend` 分组。
错误摘要可链接到具体控件，控件旁说明修正方式；保持焦点可见和源码顺序合理。

## 常见错误

- 只有 `id` 没有 `name`，导致值未提交。
- 使用 `disabled` 显示可信价格或权限，服务端却直接接受其他字段。
- 用一组无标签的 `div` 模拟下拉框。
- 把 `datalist` 当作不能输入其他值的强制列表。
- 认为客户端字符计数和文件选择限制不可绕过。

## 相关链接

- [HTML5 教程入口](index.md)
- [输入类型](input-types.md)
- [表单属性](form-attributes.md)
- [MDN：form](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/form)
- [WHATWG：Forms](https://html.spec.whatwg.org/multipage/forms.html)
