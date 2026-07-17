# Python re 模块

> 本页定位为标准库 `re` 的对象模型与 API 参考；模式语法和选型先阅读 [Python3 正则表达式](regular-expressions.md)。

## 概念与用途

`re` 是 Python 标准正则模块。本页侧重模块对象和匹配结果 API：编译后的 Pattern 可复用，Match 对象提供分组、位置和原始字符串信息。

## 核心 API

`Pattern.search()`、`fullmatch()`、`finditer()` 执行匹配；`Match.group()`、`groups()`、`groupdict()`、`span()` 读取结果。标志可用 `re.IGNORECASE`、`MULTILINE` 等组合。

| 对象/API | 返回或作用 | 注意 |
| --- | --- | --- |
| `re.compile()` | `Pattern` | 高频复用并集中标志 |
| `finditer()` | Match 迭代器 | 比 `findall()` 保留更多信息 |
| `groupdict()` | 命名组字典 | 未匹配可选组值为 `None` |
| `re.escape()` | 转义字面文本 | 只用于模式片段，不用于替换串 |

```python
import re

line = "2026-07-17 level=INFO code=200"
pattern = re.compile(r"level=(?P<level>[A-Z]+)\s+code=(?P<code>\d+)")
match = pattern.search(line)
if match:
    print(match.groupdict(), match.span("code"))
```

## 示例：标志与逐项扫描

```python
import re

pattern = re.compile(r"^error:\s*(.+)$", re.IGNORECASE | re.MULTILINE)
log = "INFO: started\nError: disk full\nERROR: timeout"
for match in pattern.finditer(log):
    print(match.start(), match.group(1))
```

编译模式便于注入到函数并测试，也避免在循环中重复表达规则。Python 自身会缓存一部分近期模式，但显式编译仍能为复杂代码提供清晰名称和统一标志。

## API 边界

- `findall()` 的返回形状会随捕获组数量变化；稳定接口优先 `finditer()`。
- `split()` 会把捕获分隔符放入结果，若不需要请使用非捕获组 `(?:...)`。
- `Match` 只对应一次搜索结果，不会随原字符串变化而重新匹配。

## 常见错误与安全注意

- 捕获组编号易因模式修改变化，公共解析逻辑优先使用命名组。
- `.` 默认不匹配换行，`^/$` 的含义会受 `MULTILINE` 影响。
- 用户可控模式和长文本可能导致 ReDoS，应限制复杂度、长度或使用线性时间引擎。
