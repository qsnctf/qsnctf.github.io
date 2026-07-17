# HTML 拾色器

`input type="color"` 提供浏览器原生颜色选择界面，并作为表单控件提交颜色值。
界面样式和高级颜色能力依浏览器与操作系统而异。

## 最小示例

```html
<form action="/preferences" method="post">
  <label for="accent">主题强调色</label>
  <input id="accent" name="accent" type="color" value="#2563eb">
  <button type="submit">保存</button>
</form>
```

在广泛兼容的基本模式下，`value` 使用 `#rrggbb` 格式；省略或给出无效值时通常回退为黑色。

## 常用属性

| 属性 | 用途 | 注意 |
| --- | --- | --- |
| `id` | 与 `label for` 关联 | 文档内保持唯一 |
| `name` | 表单提交字段名 | 缺少时不会作为成功控件提交 |
| `value` | 当前颜色值 | 基础互操作值使用六位十六进制 |
| `disabled` | 禁止操作和提交 | 不是权限控制 |
| `required` | 要求有效值 | 颜色控件通常始终有有效默认值，作用有限 |
| `autocomplete` | 自动填充提示 | 对颜色控件的实际支持有限 |
| `list` | 关联 `datalist` 建议 | 呈现和支持存在差异，不能依赖色板 UI |

## 建议色板

```html
<label for="brand-color">品牌色</label>
<input id="brand-color" name="brandColor" type="color"
       value="#663399" list="brand-colors">
<datalist id="brand-colors">
  <option value="#663399" label="紫色">
  <option value="#2563eb" label="蓝色">
  <option value="#15803d" label="绿色">
</datalist>
```

不要假定所有浏览器都会把 `datalist` 显示为可点击色板；关键预设可另做真实按钮列表。

## 读取与预览

```html
<label for="preview-color">预览颜色</label>
<input id="preview-color" type="color" value="#2563eb">
<output id="color-value" for="preview-color">#2563eb</output>
<div id="preview" aria-label="所选颜色预览"></div>

<script>
  const picker = document.querySelector('#preview-color');
  const output = document.querySelector('#color-value');
  const preview = document.querySelector('#preview');

  picker.addEventListener('input', () => {
    output.value = picker.value;
    preview.style.backgroundColor = picker.value;
  });
</script>
```

`input` 适合实时预览，`change` 常在用户确认选择后触发；具体交互时机可能因平台而异。

## 表单提交与验证

| 检查 | 建议 |
| --- | --- |
| 格式 | 服务端按允许语法解析，不信任浏览器提交值 |
| 范围 | 若业务只允许品牌色，应使用服务端白名单 |
| 存储 | 保存规范化色值，不拼接到任意 CSS 文本 |
| 输出 | 写入 HTML 属性时正确编码；写入 CSS 时使用受控解析结果 |
| CSRF | 修改账户偏好等操作仍需要常规 CSRF 防护 |

用户可以绕过控件直接构造请求，因此 `type="color"` 不是安全验证器。

## 无障碍注意

- 提供持久可见的 `label`，不要只用旁边的色块或 `title` 属性说明用途。
- 同时显示颜色文本值或语义名称，不能只靠视觉色块表达选择结果。
- 用选中状态、文字或图标补充颜色，不让“红/绿”成为唯一状态区别。
- 自定义色板按钮需要可访问名称、键盘操作、可见焦点和当前选中状态。
- 用户选色用于前景或背景时，实时检测与相邻颜色的对比度，并允许修正。

## 兼容性与渐进增强

不支持该类型的旧浏览器可能把它当作文本输入，因此服务端验证仍是必要回退。
部分新实现探索透明度和更宽色域，但跨浏览器接口尚不宜作为唯一关键路径；
需要 alpha、HSL 或 OKLCH 时可提供增强界面，同时保留可编辑的标准值和清晰错误说明。

另见：[颜色名](color-names.md)、[MDN：input type=color](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/input/color)。
