# Python3 正则表达式

> 本页定位为正则表达式的模式设计与使用场景入门；需要查阅 `Pattern`、`Match`、标志位等对象 API 时，请继续阅读 [Python re 模块](re.md)。

## 概念与用途

正则表达式描述文本模式，适合格式校验、提取和替换。Python 的 `re` 模块支持 Unicode、捕获组、命名组和预编译模式；复杂语法解析通常应使用专门解析器。

## 核心 API

`re.fullmatch()` 校验整个字符串，`search()` 查找首个匹配，`finditer()` 流式遍历，`sub()` 替换。模式建议使用原始字符串并通过 `re.compile()` 复用。

| 模式元素 | 含义 | 示例 |
| --- | --- | --- |
| `\d` / `\w` | 数字/单词字符 | `r"\d+"` |
| `*` / `+` / `?` | 数量限定 | `r"https?"` |
| `(...)` | 捕获分组 | `r"(cat|dog)"` |
| `(?P<name>...)` | 命名分组 | 结构化提取 |

```python
import re

pattern = re.compile(r"(?P<name>[A-Za-z]+)=(?P<value>\d+)")
text = "width=128 height=72"
result = {m["name"]: int(m["value"]) for m in pattern.finditer(text)}
print(result)
```

## 示例：校验与修复替换

`fullmatch()` 适合字段校验；替换回调适合根据匹配内容计算结果，避免替换字符串中的反斜杠和组引用歧义。

```python
import re

username = "alice_2026"
valid = re.fullmatch(r"[a-z][a-z0-9_]{2,19}", username) is not None
print("合法用户名:", valid)

text = "item2 item10"
print(re.sub(r"\d+", lambda match: str(int(match.group()) + 1), text))
```

正则适合局部、规则稳定的文本模式。嵌套语言、完整 HTML、编程语言语法和需要语义状态的输入应使用解析器。先写代表性成功、失败和边界样本，再决定模式，而不是不断给单个失败样本打补丁。

## 常见错误与安全注意

- `match()` 只从开头匹配，完整校验应使用 `fullmatch()`。
- 嵌套量词可能造成灾难性回溯和 ReDoS，应限制输入长度并简化模式。
- 替换字符串包含用户输入时，可传入替换函数避免反向引用歧义。
