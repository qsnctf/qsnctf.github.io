# Go 语言基础语法

Go 的语法刻意保持紧凑，并由 gofmt 统一布局。
本篇覆盖词法元素、标识符、语句、注释、分号规则和常用输入输出，不提前展开各类型专题。

## 源文件基础

Go 源文件通常使用 UTF-8，扩展名为 `.go`。
源文件从包声明开始，之后是导入和声明：

```go
package main

import "fmt"

func main() {
	fmt.Println("你好，Go")
}
```

Go 标识符区分大小写。`count`、`Count` 是不同名称，而且首字母大小写还决定包外可见性。

## 标识符与关键字

标识符可以使用 Unicode 字母和数字，但不能以数字开头。
工程代码通常优先使用简洁、可读且团队一致的英文名称，避免视觉上相似的 Unicode 字符。

Go 的关键字数量较少，例如：

```text
break case chan const continue default defer else fallthrough
for func go goto if import interface map package range return
select struct switch type var
```

预声明名称如 `int`、`string`、`len`、`make`、`true` 不是关键字，技术上可被遮蔽，但通常不应这样做。

## 注释

```go
// 单行注释

/*
多行块注释
*/
```

导出声明的文档注释应紧邻声明，并以声明名称开头：

```go
// ParsePort parses a decimal TCP port.
func ParsePort(text string) (int, error) {
	return strconv.Atoi(text)
}
```

注释解释契约、原因和边界，不要逐行复述显而易见的代码。

## 分号与换行

Go 的词法分析器会在特定行尾自动插入分号，所以源码几乎不手写分号。
左大括号通常必须和 `if`、`for`、函数签名位于同一行：

```go
if ready {
	fmt.Println("ready")
}
```

把 `{` 单独放到下一行可能因自动插入分号而导致语法错误。

## 声明与短变量声明

```go
var count int
name := "Gopher"
count = 3
```

`var` 可用于包级或函数级；`:=` 只能用于函数体内，并要求左侧至少有一个新变量。
详细规则见[Go 语言变量](variables.md)。

## 多重赋值

右侧表达式先求值，再进行赋值，因此可以直接交换：

```go
left, right := 10, 20
left, right = right, left
fmt.Println(left, right)
```

多返回值也常结合多重赋值使用：

```go
value, err := strconv.Atoi("42")
if err != nil {
	log.Fatal(err)
}
fmt.Println(value)
```

## 代码块与控制流

花括号定义词法块。Go 不用圆括号包围 `if` 和 `for` 条件：

```go
for i := 0; i < 3; i++ {
	if i%2 == 0 {
		fmt.Println(i)
	}
}
```

`++` 和 `--` 是语句而不是表达式，所以不能写 `x = i++`。

## 字面量基础

```go
decimal := 1_000_000
binary := 0b1010
octal := 0o755
hexadecimal := 0xFF
runeValue := '界'
interpreted := "line\n"
raw := `line\n`
```

双引号是解释型字符串，会处理转义；反引号是原始字符串，不处理大多数转义且可跨行。
单引号表示 rune，而不是字符串。

## 差异示例一：解释型与原始字符串

```go
fmt.Println("a\nb")
fmt.Println(`a\nb`)
```

第一条输出两行，第二条输出字面量反斜杠和 `n`。
原始字符串适合正则和多行文本，但反引号本身不能直接出现在其中。

## 差异示例二：声明与赋值

```go
x := 1
x = 2
x, y := 3, 4
```

第一行声明 `x`，第二行只赋值，第三行合法是因为 `y` 是新变量。
若写 `x := 2` 且当前块中没有任何新名称，编译器会报告“no new variables”。

## 输入输出边界

`fmt.Println` 适合示例和简单终端输出；服务程序应使用结构化日志方案。
`fmt.Scan` 适合简单空白分隔输入，不适合复杂协议或需要严格错误报告的解析。

```go
var name string
if _, err := fmt.Scan(&name); err != nil {
	log.Fatal(err)
}
fmt.Println("hello", name)
```

## 常见错误

- 手工排列空格和大括号，而不运行 `gofmt`。
- 忽略大小写造成的导出差异或名称不匹配。
- 使用单引号表示字符串，或把 rune 当作任意长度文本。
- 在函数外使用 `:=`。
- 忽略 `fmt.Scan`、文件或解析 API 返回的错误。
- 把 `++` 放入表达式，照搬 C/C++ 的写法。

## 工程实践

- 保存时运行格式化，提交前执行 `go fmt ./...`。
- 名称遵循 Go 惯例：短作用域可短，长生命周期应明确。
- 不使用无意义缩写和重复包名，如 `http.HTTPClient` 式冗余。
- 复杂表达式拆成有业务含义的步骤，避免追求一行代码。
- 使用 `go doc` 阅读标准库契约，尤其关注错误、单位和并发安全说明。

Go 语法较少，但词法作用域、值语义和 API 契约仍需要通过实际编译和测试掌握。
