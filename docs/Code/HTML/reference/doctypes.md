# 有效 HTML DOCTYPES

DOCTYPE 是解析模式触发器，不是 HTML 元素，也不会选择浏览器版本。
新文档只应使用简短的 HTML doctype。

## 新文档推荐

```html
<!doctype html>
```

该声明不区分 ASCII 大小写，但统一小写便于维护。它必须位于文档开头、`html` 元素之前；
前面不要放普通文本或 HTML 注释，以免旧浏览器进入非预期模式。

## 当前有效写法

| 场景 | 声明 | 状态 |
| --- | --- | --- |
| HTML 文档 | `<!doctype html>` | 推荐；触发标准模式 |
| 旧系统要求 public 标识符 | `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0//EN">` | 允许的过渡兼容形式，勿用于新项目 |
| 旧系统要求 system 标识符 | `<!DOCTYPE html SYSTEM "about:legacy-compat">` | 仅供无法输出简短声明的遗留生成器 |

`about:legacy-compat` 不是可下载 DTD，也不赋予额外 HTML 功能。

## 历史 HTML 4 声明

以下声明常见于旧页面，用于识别和迁移；不要复制到新文档。

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
  "http://www.w3.org/TR/html4/strict.dtd">

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
  "http://www.w3.org/TR/html4/loose.dtd">

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN"
  "http://www.w3.org/TR/html4/frameset.dtd">
```

这些 DTD 对应历史 HTML 4 文档类型。`Transitional` 曾允许部分表现性写法，
`Frameset` 对应已废弃的框架页面；现代迁移目标都是语义 HTML 加 CSS。

## 历史 XHTML 1.0 声明

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```

仅写 XHTML doctype 不会让 `text/html` 响应变成 XML。真正的 XHTML 使用 XML MIME 类型，
遵守 XML 大小写、良构和错误处理规则，部署前必须明确兼容性要求。

## 浏览器解析模式

| 模式 | 触发情况 | 影响 |
| --- | --- | --- |
| 标准模式 | 正确的现代 doctype | 按现代 CSS 和布局规则渲染 |
| 有限怪异模式 | 少数历史 doctype | 大体标准，但表格单元格等有兼容差异 |
| 怪异模式 | 缺失或特定错误、旧式 doctype | 模拟旧浏览器布局行为 |

可在控制台检查 `document.compatMode`：标准模式通常为 `CSS1Compat`，
怪异模式为 `BackCompat`。验证器和浏览器开发者工具可帮助定位声明问题。

## 常见误区

- DOCTYPE 不负责声明 UTF-8；字符编码使用 HTTP 头和 `meta charset`。
- DOCTYPE 不会验证页面，也不会自动阻止废弃元素。
- 不需要在现代声明中写 HTML 版本号、DTD URL 或结束标签。
- 不要为了“兼容旧浏览器”删除 doctype，缺失声明反而会触发怪异模式。
- 模板输出的 BOM 通常可被处理，但稳妥做法仍是让 doctype 成为首个标记。

## 安全与无障碍

DOCTYPE 本身不提供安全或无障碍能力，但标准模式能减少跨浏览器布局差异。
迁移旧 doctype 时应同时移除废弃表现标签、检查键盘操作和语义，而不是只替换第一行。

另见：[字符集](character-sets.md)、[WHATWG：The DOCTYPE](https://html.spec.whatwg.org/multipage/syntax.html#the-doctype)。
