# Go 语言正则表达式

Go 标准库 `regexp` 实现 RE2 语法，强调线性时间匹配和可预测的资源消耗。
它不会像回溯型引擎那样发生灾难性回溯，但语法能力也有明确边界。
正则适合局部文本模式，不适合完整解析 HTML、JSON、编程语言或复杂嵌套语法。

## RE2 的能力边界

Go 正则不支持 lookahead、lookbehind 等 lookaround。
Go 正则不支持反向引用，例如用 `\1` 要求后文重复前一个捕获组。
Go 正则没有依赖回溯的条件分支或递归模式。
这些限制换来匹配时间与输入长度近似线性的保证，适合服务器处理不可信文本。

```go
// 不受支持：正向 lookahead。
// regexp.MustCompile(`foo(?=bar)`)

// 改为匹配整体，再取需要的部分。
re := regexp.MustCompile(`(foo)bar`)
match := re.FindStringSubmatch("foobar")
fmt.Println(match[1])
```

如果需求依赖复杂上下文，应拆成多个普通检查，或使用专用解析器，而不是寻找绕过 RE2 限制的技巧。

## 编译正则

`regexp.Compile` 返回错误，适合运行时或用户提供的表达式。
`regexp.MustCompile` 在表达式非法时 panic，只适合源代码中的固定常量。

```go
re, err := regexp.Compile(`^[a-z][a-z0-9_]{2,31}$`)
if err != nil {
	return fmt.Errorf("compile username pattern: %w", err)
}
fmt.Println(re.MatchString("go_user"))
```

```go
var requestIDPattern = regexp.MustCompile(`^[0-9a-f]{32}$`)
```

差异示例 1：固定模式用 `MustCompile` 可在启动或测试时尽早暴露开发错误；动态模式必须用 `Compile`，避免不可信输入触发 panic。
编译后的 `Regexp` 可被多个 goroutine 安全使用，通常应复用而不是每次请求重新编译。

## 原始字符串与转义

Go 解释字符串转义，正则引擎也解释正则转义，双引号字符串容易产生双重转义。
反引号原始字符串通常更易读，但它不能包含反引号本身。

```go
raw := regexp.MustCompile(`\d+\.\d+`)
quoted := regexp.MustCompile("\\d+\\.\\d+")
fmt.Println(raw.MatchString("12.50"), quoted.MatchString("12.50"))
```

差异示例 2：以上两个模式语义相同；原始字符串减少了 Go 字符串层的反斜杠。
RE2 的 `\d` 默认表示 ASCII 数字 `[0-9]`，国际化文本应明确是否需要 Unicode 类别，如 `\p{N}`。

## 查找与捕获组

`MatchString` 只回答是否存在匹配，`FindString` 返回第一个匹配。
`FindAllString` 返回多个匹配，参数 `-1` 表示不限制数量。
`FindStringSubmatch` 的第 0 项是完整匹配，后续项对应捕获组。

```go
re := regexp.MustCompile(`(?P<key>[A-Za-z_][A-Za-z0-9_]*)=(?P<value>[^\s]+)`)
parts := re.FindStringSubmatch("PORT=8080")
if parts == nil {
	return errors.New("assignment not found")
}

values := make(map[string]string)
for i, name := range re.SubexpNames() {
	if i > 0 && name != "" {
		values[name] = parts[i]
	}
}
fmt.Println(values["key"], values["value"])
```

可选捕获组未参与匹配时通常得到空字符串，业务上若要区分“缺失”和“匹配空串”，应使用索引 API。
`FindStringIndex` 和 `FindAllStringIndex` 返回字节索引，不是 rune 索引；切片字符串时这一点很重要。

## 替换与安全引用

`ReplaceAllString` 的替换文本会解释 `$1`、`${name}` 等捕获引用。
如果替换文本来自用户且应按字面使用，调用 `regexp.QuoteMeta` 处理模式，或使用 `ReplaceAllStringFunc` 控制替换。

```go
secret := regexp.MustCompile(`(?i)token=[^&\s]+`)
safe := secret.ReplaceAllString("token=abc&next=1", "token=[REDACTED]")
fmt.Println(safe)
```

```go
literal := regexp.QuoteMeta("file[1].txt")
re := regexp.MustCompile(`^` + literal + `$`)
fmt.Println(re.MatchString("file[1].txt"))
```

`QuoteMeta` 只用于把文本嵌入正则模式，它不是 HTML、Shell、SQL 或 URL 转义工具。

## 边界、模式与 Unicode

`^` 和 `$` 默认匹配文本首尾；启用 `(?m)` 后也可匹配行首尾。
`.` 默认不匹配换行，`(?s)` 可让它匹配换行。
`(?i)` 启用不区分大小写，作用域也可写成 `(?i:pattern)`。

```go
linePattern := regexp.MustCompile(`(?m)^ERROR: .+$`)
fmt.Println(linePattern.FindAllString("INFO: ok\nERROR: failed", -1))
```

Go 的 `\b` 是 ASCII 单词边界语义，不应直接假设它适用于中文分词。
中文、emoji 和组合字符的“字符”边界比 rune 更复杂，用户可见文本处理可能需要 Unicode 专用库。

## 校验与解析的区别

用于校验时通常应加 `^...$`，否则 `MatchString` 只要找到子串就会成功。
即使语法匹配，也要继续做范围和业务校验，例如端口必须在 1 到 65535。

```go
portPattern := regexp.MustCompile(`^[0-9]{1,5}$`)
if !portPattern.MatchString(input) {
	return errors.New("invalid port syntax")
}
port, err := strconv.Atoi(input)
if err != nil || port < 1 || port > 65535 {
	return errors.New("port out of range")
}
```

解析 URL、邮件地址和 IP 时优先使用 `net/url`、`net/mail`、`net/netip` 等标准库，而不是自制巨型正则。

## 常见错误与工程注意

- 不要在循环或每个 HTTP 请求中重复 `Compile` 固定表达式。
- 不要对动态表达式使用 `MustCompile`，否则非法输入可使进程 panic。
- 不要期待 lookaround、反向引用或递归模式在 Go 中可用。
- 不要忘记校验模式的完整边界，否则合法子串可能掩盖非法整体输入。
- 限制用户提供模式的长度、输入大小、匹配数量和处理时间，即使 RE2 避免灾难性回溯也仍会消耗资源。
- 日志脱敏模式应有测试，尤其覆盖大小写、换行、编码和多个秘密字段。
- 不要把正则替换当作上下文安全编码；输出到 HTML、Shell 或 SQL 时使用对应 API。
- 为复杂模式添加表驱动测试，列出应匹配和不应匹配的代表输入。

## 小结

Go 的 `regexp` 采用 RE2，以不支持回溯、lookaround 和反向引用换取可预测性能。
固定模式复用 `MustCompile` 的结果，动态模式使用 `Compile` 并处理错误。
正则负责局部语法时最有效；结构化格式、数值范围和安全编码应交给专用解析与校验 API。
