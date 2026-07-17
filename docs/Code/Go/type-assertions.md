# Go 类型断言

类型断言从接口值中检查并取得其动态值，语法是 `x.(T)`，其中 `x` 必须是接口类型。
它不是普通类型转换，也不会把一个值自动变成不相关的类型。

## comma-ok 形式

```go
package main

import "fmt"

func printLength(value any) {
	text, ok := value.(string)
	if !ok {
		fmt.Println("不是字符串")
		return
	}
	fmt.Println(len(text))
}

func main() {
	printLength("Go")
	printLength(42)
}
```

`value, ok := x.(T)` 在失败时返回 `T` 的零值和 `false`，不会 panic。处理外部数据或多种合法
动态类型时应优先使用 comma-ok。

## 单值断言会 panic

```go
func mustString(value any) string {
	return value.(string)
}
```

第一个差异示例：单值形式适合“类型不匹配就是程序不变量被破坏”的极少场景；comma-ok 适合可预期
的分支。不要用 `recover` 代替 comma-ok 进行正常类型判断。

## 类型 switch

```go
func describe(value any) string {
	switch v := value.(type) {
	case nil:
		return "nil"
	case int:
		return fmt.Sprintf("整数 %d", v)
	case string:
		return "字符串 " + v
	case fmt.Stringer:
		return v.String()
	default:
		return fmt.Sprintf("未知类型 %T", v)
	}
}
```

类型 switch 一次处理多个动态类型，`v` 在每个单类型 case 中具有对应静态类型。case 顺序应把
更具体的业务类型放在通用接口之前，避免语义被较宽分支捕获。

## 断言具体类型与接口类型

```go
var value any = bytes.NewBufferString("Go")
reader, okReader := value.(io.Reader)
buffer, okBuffer := value.(*bytes.Buffer)
```

第二个差异示例：断言为接口类型检查动态类型是否实现该接口；断言为具体类型要求动态类型完全匹配。
若接口中保存的是 `*bytes.Buffer`，断言 `bytes.Buffer` 会失败，因为二者是不同类型。

## nil 边界

对 nil 接口进行任何非 nil 类型断言都会失败并返回 `ok == false`。接口若包含动态类型为 `*T`、
动态值为 nil 的指针，则断言为 `*T` 会成功，但结果指针仍为 nil，使用前还需检查。

## 常见错误

- 使用单值断言处理用户输入，类型不符时导致 panic。
- 把断言当作 `int` 与 `int64` 之间的数值转换。
- 忽略指针类型和值类型必须精确匹配。
- 断言成功后忘记检查得到的指针是否为 nil。
- 大量依赖 `any` 和类型 switch，实际数据模型却是封闭且可用接口方法或泛型表达。

## 性能与工程实践

偶尔的类型断言成本通常不是瓶颈，可读性和错误路径更重要。协议解码后应尽早转换为明确的领域类型，
不要让 `map[string]any` 在系统各层传播。若调用方只需要某项行为，断言小接口比断言具体实现更解耦。
测试应覆盖成功、失败、nil 接口和“带类型的 nil 指针”四类边界。
