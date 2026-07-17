# Go 语言函数

函数是 Go 中组织行为、建立 API 和隔离测试边界的基本单元。
本篇介绍声明、参数、返回值、多返回值、可变参数、函数值、闭包、递归和 `defer`。

## 基本声明

```go
func add(left int, right int) int {
	return left + right
}
```

相邻参数类型相同时可合并：

```go
func add(left, right int) int {
	return left + right
}
```

Go 不支持函数重载。相同包作用域中不能仅靠参数类型声明多个同名函数。

## 多返回值

```go
func divide(left, right float64) (float64, error) {
	if right == 0 {
		return 0, fmt.Errorf("division by zero")
	}
	return left / right, nil
}
```

调用者同时接收结果和错误：

```go
result, err := divide(10, 2)
if err != nil {
	log.Fatal(err)
}
fmt.Println(result)
```

多返回值是语言特性，不是返回一个隐式元组对象。

## 命名返回值

```go
func dimensions() (width, height int) {
	width = 1920
	height = 1080
	return
}
```

命名返回值可用于短函数、文档语义和 deferred 修改。
长函数中使用裸 `return` 会让返回值来源不清，应显式返回。

## 参数是值复制

```go
func rename(name string) {
	name = "changed"
}
```

修改参数变量不影响调用者变量。
切片、映射、指针等值复制后可能仍引用共享数据，因此函数能通过它们修改底层对象。

## 可变参数

```go
func sum(values ...int) int {
	total := 0
	for _, value := range values {
		total += value
	}
	return total
}
```

调用方式：

```go
fmt.Println(sum(1, 2, 3))
numbers := []int{4, 5, 6}
fmt.Println(sum(numbers...))
```

可变参数在函数内表现为切片，并且必须是最后一个参数。

## 函数值与高阶函数

函数是一等值，可以赋值、传参和返回：

```go
func apply(value int, operation func(int) int) int {
	return operation(value)
}

double := func(value int) int {
	return value * 2
}
fmt.Println(apply(5, double))
```

函数值可为 nil，调用 nil 函数会 panic。

## 闭包

```go
func counter() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}
```

闭包捕获外层变量，使变量生命周期延长。
多个 goroutine 调用同一闭包并修改捕获变量时，需要同步，否则会产生数据竞争。

## `defer`

`defer` 在外围函数返回前执行调用，参数在注册 defer 时求值：

```go
func readFile(path string) ([]byte, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	return io.ReadAll(file)
}
```

多个 defer 按后进先出执行。
关闭操作也可能返回错误；写文件等场景不能总是无条件忽略 `Close` 错误。

## 递归边界

```go
func factorial(n uint64) uint64 {
	if n < 2 {
		return 1
	}
	return n * factorial(n-1)
}
```

递归写法简洁，但深度不受信任时可能耗尽栈，且示例还会发生整数溢出。
普通线性任务通常优先迭代；树遍历等自然递归结构也应设置深度或输入限制。

## 差异示例一：值参数与切片参数

```go
func changeNumber(value int) {
	value = 9
}

func changeFirst(values []int) {
	values[0] = 9
}
```

两种参数都按值传递，但切片副本仍指向同一底层数组。
若函数会修改传入切片，应在命名、文档或 API 设计中明确。

## 差异示例二：普通返回与命名返回

```go
func explicit() int {
	result := 42
	return result
}

func named() (result int) {
	result = 42
	return
}
```

两者都合法。普通显式返回更容易追踪；命名返回适合结果含义重要或 deferred 错误处理，但不应为省字符使用。

## 差异示例三：立即调用与 `defer`

```go
fmt.Println("now")
defer fmt.Println("later")
fmt.Println("end")
```

输出顺序是 `now`、`end`、`later`。
defer 绑定外围函数，不绑定词法块，因此循环中的 defer 不会在每次迭代末自动执行。

## 常见错误

- 忽略错误返回，或只记录错误后继续使用无效结果。
- 裸返回出现在长函数中，难以确认实际返回值。
- 假设切片和映射参数完全隔离。
- 在大循环中累计 defer，延迟资源释放。
- 闭包捕获共享变量后并发修改，没有同步。
- 使用 `panic` 代替可预期的错误返回。

## 工程实践

- 函数保持单一职责，参数和返回值表达清晰的数据流。
- 错误使用 `%w` 包装上下文，调用者用 `errors.Is/As` 判断错误链。
- 接受接口、返回具体类型通常更利于调用方解耦，但应按实际需求设计。
- 对可能阻塞的调用接受 `context.Context` 作为首个参数。
- 资源获取成功后尽快注册 defer，并处理重要的关闭错误。
- 通过表驱动测试覆盖正常值、边界值和错误路径。

函数 API 的质量取决于副作用、错误、所有权和取消语义是否明确，而不只取决于参数数量。
