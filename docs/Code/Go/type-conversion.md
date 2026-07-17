# Go 语言类型转换

Go 通常不进行隐式数值转换。显式转换写作 `T(value)`，它创建目标类型的值，但不保证转换后
仍保留原值语义；截断、溢出、编码和底层表示都需要调用方理解。

## 数值转换

```go
package main

import "fmt"

func main() {
	i := 42
	f := float64(i)
	truncated := int(3.9)
	large := 300
	wrapped := uint8(large)

	fmt.Println(f, truncated, wrapped) // 42 3 44
}
```

浮点转整数会丢弃小数部分；转换为范围更小的整数类型会按目标位宽截取。转换不是校验，
处理外部输入时应先检查 `math.MinInt32`、`math.MaxInt32` 等边界。

## 转换与解析不是一回事

```go
text := "123"
number, err := strconv.Atoi(text)
if err != nil {
	log.Fatal(err)
}
fmt.Println(number)
```

第一个差异示例：`int("123")` 不是把十进制文本解析为整数；字符串解析应使用 `strconv.Atoi`
或 `strconv.ParseInt`。反向格式化使用 `strconv.Itoa`、`FormatInt` 或 `fmt.Sprintf`。

## 字符串、字节与 rune

```go
s := "Go语言"
bytes := []byte(s)
runes := []rune(s)

fmt.Println(len(bytes), len(runes))
fmt.Println(string(bytes), string(runes))
```

第二个差异示例：`[]byte` 表示 UTF-8 字节，`[]rune` 表示 Unicode 码点；一个中文字符通常占多个字节。
字符串与字节切片互转通常会复制数据。`string(65)` 得到 `"A"`，不是 `"65"`；数字格式化应使用
`strconv.Itoa(65)`。

## 命名类型与底层类型

```go
type Celsius float64
type Fahrenheit float64

func toFahrenheit(c Celsius) Fahrenheit {
	return Fahrenheit(c*9/5 + 32)
}
```

即使底层类型相同，不同命名类型通常也不能直接赋值，需要显式转换。转换只改变静态类型或表示，
不会自动执行单位换算；上例的公式是业务逻辑，不是类型转换自动提供的行为。

## 接口转换与类型断言边界

把具体值赋给接口通常是赋值，不是 `T(value)` 数值转换。从接口中恢复动态值应使用类型断言
`v, ok := x.(T)`，而不是普通转换。不同概念不要混用。

## 常见错误

- 未检查窄化整数转换，导致静默截断或回绕。
- 用 `string(number)` 格式化十进制数字，得到对应码点。
- 按字节截断 UTF-8 字符串，产生无效文本。
- 把类型转换当作单位换算或输入验证。
- 用浮点数表示金额，再转换成整数时产生精度问题。

## 性能与工程实践

字符串与 `[]byte` 的常规转换可能分配并复制，热路径可通过减少往返转换来优化，而不是使用不安全的
零拷贝技巧。解析外部输入要保留并包装错误，例如 `fmt.Errorf("parse port: %w", err)`。
金额和精确计数优先使用最小单位整数或十进制定点库。所有窄化转换都应在代码附近写清边界假设，
并通过边界值测试覆盖最大值、最小值和溢出输入。
