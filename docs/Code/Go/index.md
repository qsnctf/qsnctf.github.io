# Go 语言教程总览

本组教程以 Go 1.22 及以上版本为基线，面向希望从语法入门走向工程开发的读者。
Go 是静态类型、编译型语言，强调简单语法、显式错误处理、快速构建和并发编程。
本组先建立语言基础，再逐步进入包、接口、泛型、并发、测试、网络与工程实践。

## 适用范围

- 初次学习 Go，需要完整基础路线的读者。
- 已掌握其他语言，希望理解 Go 设计取舍的读者。
- 准备编写命令行工具、服务端程序或自动化程序的读者。
- 示例默认使用 Go Modules，不讲 GOPATH 时代的旧式依赖管理流程。

Go 适合构建网络服务、基础设施工具、命令行程序和需要易部署性的后端应用。
它不是所有任务的唯一选择：浏览器界面、强依赖特定科学计算生态或极端底层控制的项目，可能更适合其他技术栈。

## 基础学习路线

1. [Go 简介](introduction.md)：理解语言定位、工具链和设计边界。
2. [Go 语言环境安装](installation.md)：安装 Go 1.22+ 并验证模块环境。
3. [Go 开发工具](development-tools.md)：配置 VS Code、GoLand、gopls 与 Delve。
4. [Go 语言结构](program-structure.md)：认识包、导入、声明和程序入口。
5. [Go 语言基础语法](basic-syntax.md)：掌握标识符、语句、注释和格式化规则。
6. [Go 语言数据类型](data-types.md)：理解基础类型、复合类型和零值。
7. [Go 语言变量](variables.md)：学习声明、推导、赋值和生命周期。
8. [Go 语言常量](constants.md)：掌握无类型常量、`iota` 和表示范围。
9. [Go 语言运算符](operators.md)：理解算术、比较、逻辑、位和指针运算。
10. [Go 语言条件语句](conditionals.md)：使用 `if` 与 `switch` 表达分支。
11. [Go 语言循环语句](loops.md)：使用统一的 `for` 完成各种迭代。
12. [Go 语言函数](functions.md)：学习多返回值、可变参数、闭包和 `defer`。
13. [Go 语言变量作用域](scope.md)：理解包、文件、函数和语句块作用域。

## 复合类型与抽象路线

1. [Go 语言数组](arrays.md)
2. [Go 语言指针](pointers.md)
3. [Go 语言结构体](structs.md)
4. [Go 语言切片(Slice)](slices.md)
5. [Go 语言范围(Range)](range.md)
6. [Go 语言 Map(集合)](maps.md)
7. [Go 语言递归函数](recursion.md)
8. [Go 语言类型转换](type-conversion.md)
9. [Go 语言接口](interfaces.md)
10. [Go 语言泛型](generics.md)
11. [Go 类型断言](type-assertions.md)
12. [Go 组合、嵌入与“继承”](embedding.md)

## 工程实践路线

1. [Go 错误处理](error-handling.md)
2. [Go 并发](concurrency.md)
3. [Go 文件处理](file-handling.md)
4. [Go 语言正则表达式](regular-expressions.md)
5. [Go 语言开发工具](tooling.md)
6. [Go Modules](modules.md)
7. [Go 语言测验](quiz.md)

其中[Go 开发工具](development-tools.md)聚焦编辑器、语言服务器和调试器的环境选择；[Go 语言开发工具](tooling.md)进一步讲测试、静态分析、竞态检测、基准、性能分析和代码生成。

## 第一个模块

```bash
mkdir hello
cd hello
go mod init example.com/hello
```

创建 `main.go`：

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, Go")
}
```

运行与验证：

```bash
go fmt ./...
go vet ./...
go test ./...
go run .
```

## 两组关键差异

### 差异一：编译运行与脚本运行

`go run .` 会临时编译后运行，适合开发；`go build .` 生成可部署二进制，适合交付。
不要把 `go run` 当作生产部署方案，也不要误以为 Go 源码由运行时逐行解释。

### 差异二：显式错误与异常式控制流

Go 函数常返回 `(value, error)`，调用者显式检查 `err`。
与依赖异常传播的语言相比，这种写法更冗长，但正常失败路径更容易在调用点被看见。

## 学习方法

- 每个示例放进独立模块或明确的包中执行。
- 修改示例后运行 `go fmt`、`go vet` 和 `go test`。
- 使用 `go doc` 或 `pkg.go.dev` 查 API，不依赖过时博客复制代码。
- 先理解值语义、零值和接口，再进入并发编程。
- 先通过测试确认正确性，再使用基准和分析器优化性能。

## 常见错误

- 只安装编辑器插件，却没有安装 Go SDK 或配置正确的 `go` 命令。
- 在模块外随意运行代码，导致依赖版本和导入路径不可复现。
- 忽略返回的错误，或用 `panic` 处理普通输入失败。
- 未理解切片共享底层数组，就在函数间传递并原地修改。
- 为追求“并发”无边界创建 goroutine，造成泄漏和资源耗尽。

## 工程实践基线

- 提交前至少执行 `go fmt ./...`、`go vet ./...` 和 `go test ./...`。
- 使用 `context.Context` 传递取消和截止时间，不把它存入长期结构体。
- 错误应包含操作上下文，并使用 `%w` 保留错误链。
- API 优先让零值可用，避免不必要的构造流程。
- 并发代码必须说明所有权、退出条件和 channel 关闭责任。
- 依赖和最低 Go 版本应由 `go.mod` 记录。

完成基础路线后，应能独立创建模块、阅读常见 Go 代码，并写出结构清晰、可测试的小型程序。
