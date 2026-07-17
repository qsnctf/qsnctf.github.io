# Go 语言结构

Go 程序由模块、包、源文件、声明和语句组成。
本篇建立从 `go.mod` 到 `main` 函数的结构模型，并说明可见性、初始化和文件拆分边界。

## 模块与包

模块是版本管理和依赖解析单元，由 `go.mod` 定义：

```bash
go mod init example.com/greeter
```

包是编译和代码组织单元，同一目录中的普通 `.go` 文件通常属于同一个包。
一个模块可以包含多个包；一个包也可以由多个源文件共同组成。

```text
greeter/
├── go.mod
├── main.go
└── internal/
    └── message/
        └── message.go
```

## 可执行程序入口

```go
package main

import "fmt"

func main() {
	fmt.Println("start")
}
```

可执行程序需要 `package main` 和无参数、无返回值的 `func main()`。
库包不能声明一个可由运行时自动执行的普通 `main` 函数。

## 包声明与导入

每个 Go 源文件首先声明所属包，随后通常是导入和顶层声明：

```go
package report

import (
	"fmt"
	"time"
)

func Title(at time.Time) string {
	return fmt.Sprintf("Report %s", at.Format(time.DateOnly))
}
```

导入路径标识包，源码中默认使用包声明的名称。
未使用的导入是编译错误，这能减少重构后残留依赖。

## 声明顺序

顶层可以声明常量、变量、类型和函数：

```go
package counter

const DefaultStep = 1

var starts int

type Counter struct {
	value int
}

func New() Counter {
	starts++
	return Counter{}
}
```

编译器不要求函数必须先声明后使用，因此文件内顺序主要服务于阅读。
包级可变变量会增加共享状态，实际项目应谨慎使用。

## 导出规则

标识符首字母大写时可从其他包访问，首字母小写时仅在当前包可见：

```go
type Client struct{}

func (Client) Send() {}

func validate() {}
```

`Client` 和 `Send` 被导出，`validate` 不导出。
导出是包级可见性规则，不是对象级 `public/private` 修饰符。

## 初始化顺序

包级变量先按依赖关系初始化，然后按文件呈现给编译器的顺序执行 `init` 函数，最后可执行包调用 `main`。

```go
package main

import "fmt"

var label = buildLabel()

func buildLabel() string {
	return "ready"
}

func init() {
	fmt.Println("init:", label)
}

func main() {
	fmt.Println("main")
}
```

`init` 不能被普通代码调用，也不能带参数或返回值。
避免在 `init` 中做网络访问、启动 goroutine 或执行难以测试的重工作。

## 差异示例一：模块与包

模块路径 `example.com/app` 可以包含 `example.com/app/cmd/server` 和 `example.com/app/internal/store` 等多个包。
包名不是依赖版本边界；发布、下载和版本选择发生在模块层。

## 差异示例二：同包多文件与跨包调用

同一目录同一包中的 `main.go` 可直接调用 `helper.go` 中的小写函数，无需导入。
子目录是另一个包，调用其功能必须通过导入路径，并且只能使用导出标识符。
不要把目录层级误认为类似其他语言的命名空间嵌套。

## `internal` 边界

位于 `internal` 目录中的包只能被其父目录树范围内的代码导入。
这是由 Go 工具链强制执行的封装边界，适合模块内部实现，但不是安全沙箱。

## 常见错误

- 同一目录混用 `package main` 和其他包名，测试外部包写法除外。
- 把所有代码放入一个巨大 `main.go`，难以测试和复用。
- 为消除循环导入而复制代码，却不重新划分职责和依赖方向。
- 大量使用空白导入 `_` 触发副作用，却未说明初始化原因。
- 依赖多个文件的词法文件名决定业务初始化顺序。

## 工程实践

- 包围绕单一职责组织，并让依赖方向清晰、无环。
- `cmd/<name>` 可承载多个可执行入口，业务逻辑放在可测试包中。
- 导出 API 编写文档注释，并从名称开始描述对象。
- 减少包级可变状态，通过显式构造和依赖注入建立对象关系。
- 文件拆分服务于主题和可读性，不需要让一个类型独占一个文件。
- 用 `go list ./...` 和 `go test ./...` 验证整个模块的包结构。

理解模块、包和文件的不同职责后，才适合继续学习语法细节和跨包 API 设计。
