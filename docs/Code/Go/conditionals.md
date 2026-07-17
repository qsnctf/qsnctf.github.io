# Go 语言条件语句

Go 使用 `if` 和 `switch` 表达条件分支，没有三元条件运算符。
本篇介绍初始化语句、作用域、表达式 switch、类型 switch 和分支设计边界。

## 基本 `if`

```go
temperature := 28
if temperature >= 30 {
	fmt.Println("hot")
} else if temperature >= 20 {
	fmt.Println("comfortable")
} else {
	fmt.Println("cold")
}
```

条件必须是 `bool`，不能使用整数、字符串、指针或 nil 代替真假值。
条件外不写圆括号，代码块大括号不可省略。

## 带初始化语句的 `if`

```go
if value, err := strconv.Atoi("42"); err != nil {
	fmt.Println("invalid:", err)
} else {
	fmt.Println(value)
}
```

初始化语句中的 `value` 和 `err` 仅在整个 `if`/`else` 结构内可见。
这适合限制临时结果作用域，但若后续仍需使用结果，应在外层声明。

## 提前返回

```go
func parsePositive(text string) (int, error) {
	value, err := strconv.Atoi(text)
	if err != nil {
		return 0, fmt.Errorf("parse integer: %w", err)
	}
	if value <= 0 {
		return 0, fmt.Errorf("value must be positive")
	}
	return value, nil
}
```

Go 工程常用提前返回处理错误和非法状态，减少主流程嵌套。
但不要把一个连贯条件拆成大量难以追踪的跳出点。

## 表达式 `switch`

```go
day := time.Now().Weekday()
switch day {
case time.Saturday, time.Sunday:
	fmt.Println("weekend")
default:
	fmt.Println("workday")
}
```

Go 的 `case` 默认不会自动贯穿到下一分支，不需要写 `break`。
多个匹配值可写在同一 `case` 中。

## 无表达式 `switch`

```go
score := 86
switch {
case score >= 90:
	fmt.Println("A")
case score >= 80:
	fmt.Println("B")
case score >= 60:
	fmt.Println("C")
default:
	fmt.Println("D")
}
```

无表达式 switch 等价于 `switch true`，按从上到下第一个为真的 case 执行。
范围重叠时顺序就是语义，应优先把更具体条件放在前面。

## switch 初始化语句

```go
switch value := strings.TrimSpace(input); value {
case "yes", "y":
	fmt.Println("accepted")
case "no", "n":
	fmt.Println("rejected")
default:
	fmt.Println("unknown")
}
```

`value` 的作用域限制在 switch 内，适合只服务于分支判断的规范化结果。

## 类型 switch

```go
func describe(value any) string {
	switch value := value.(type) {
	case nil:
		return "nil"
	case int:
		return fmt.Sprintf("int: %d", value)
	case string:
		return "string: " + value
	default:
		return fmt.Sprintf("%T", value)
	}
}
```

类型 switch 只用于接口值。
在单一类型 case 中，短变量具有对应具体类型；不要用它替代本可由静态类型表达的 API。

## `fallthrough`

`fallthrough` 强制执行下一个 case 的语句体，不重新判断下一个 case 条件：

```go
switch n := 1; n {
case 1:
	fmt.Println("one")
	fallthrough
case 2:
	fmt.Println("next case body")
}
```

它很少必要，且容易让读者误判条件关系；通常应提取共享函数或合并 case。

## 差异示例一：独立 `if` 与 `else if`

```go
if n > 0 {
	fmt.Println("positive")
}
if n%2 == 0 {
	fmt.Println("even")
}
```

两个独立 `if` 都可能执行。
`if ... else if ...` 只会选择一个分支，适合互斥分类；不要因视觉相似混淆业务含义。

## 差异示例二：Go switch 与 C 风格 switch

Go case 默认结束，不需要 `break`；C 风格 switch 常默认贯穿。
Go 可以直接 `switch` 任意可比较表达式，也可省略表达式写条件链。
因此不要机械添加 `break`，也不要依赖其他语言的贯穿习惯。

## 差异示例三：初始化作用域

```go
if value := compute(); value > 0 {
	fmt.Println(value)
}
// value 在这里不可见
```

若后续需要 `value`：

```go
value := compute()
if value > 0 {
	fmt.Println(value)
}
fmt.Println("result:", value)
```

## 常见错误

- 写 `if n {}` 或 `if pointer {}`，忘记条件必须为 bool。
- 在初始化语句中用 `:=` 遮蔽外层 `err`，分支后检查了错误变量的旧值。
- 无表达式 switch 的宽泛条件放在前面，使后续 case 永远不可达。
- 为每个 case 添加无意义 `break`，暴露对 Go 语义的误解。
- 滥用 `fallthrough` 制造隐式控制流。
- 类型 switch 缺少 default 或未知类型处理，导致静默忽略扩展值。

## 工程实践

- 错误和边界条件优先返回，让正常路径保持左对齐。
- 复杂条件提取为有名称的布尔变量或函数。
- switch 用于同一维度的分类，不要混合无关副作用。
- 对外部枚举保留 default，并决定拒绝、记录还是向前兼容。
- 分支中重复资源操作时提取公共逻辑，避免 `fallthrough`。
- 使用表驱动测试覆盖边界值、默认分支和互斥条件。

条件语句应清晰表达业务分类和失败路径，而不是展示尽可能紧凑的语法技巧。
