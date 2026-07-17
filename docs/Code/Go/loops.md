# Go 语言循环语句

Go 只有一个循环关键字 `for`，但它可以表达计数循环、条件循环、无限循环和 `range` 迭代。
本篇以 Go 1.22+ 为基线，特别说明循环变量、遍历顺序和控制语句边界。

## 三段式 `for`

```go
for i := 0; i < 5; i++ {
	fmt.Println(i)
}
```

初始化、条件和后置语句都可省略。
`i` 的作用域是整个 for 语句，包括循环体，但循环结束后不可见。

## 条件循环

```go
attempts := 0
for attempts < 3 {
	attempts++
}
fmt.Println(attempts)
```

这相当于其他语言的 `while`。
Go 没有单独的 `while` 或 `do...while` 关键字。

## 无限循环

```go
for {
	message, ok := next()
	if !ok {
		break
	}
	fmt.Println(message)
}
```

服务循环必须有明确的退出、取消或进程生命周期策略。
不要只写无法停止的 goroutine 循环并假设进程退出会解决资源管理。

## `range` 遍历切片

```go
values := []string{"a", "b", "c"}
for index, value := range values {
	fmt.Println(index, value)
}
```

只需要值时可忽略索引：

```go
for _, value := range values {
	fmt.Println(value)
}
```

只写一个变量时，它接收索引而不是元素：

```go
for index := range values {
	fmt.Println(index)
}
```

## 遍历映射

```go
scores := map[string]int{"alice": 90, "bob": 85}
for name, score := range scores {
	fmt.Println(name, score)
}
```

映射遍历顺序未指定，不应依赖某次输出顺序。
需要稳定输出时，先收集键并排序，再按键访问映射。

## 遍历字符串

```go
for index, r := range "Go语言" {
	fmt.Printf("byte=%d rune=%c\n", index, r)
}
```

索引是 rune 起始位置的字节偏移，值是解码后的 rune。
无效 UTF-8 会产生 `utf8.RuneError`；按原始字节处理时应转换为 `[]byte` 或使用索引循环。

## Go 1.22 整数 `range`

Go 1.22 起可对整数进行 range：

```go
for i := range 5 {
	fmt.Println(i)
}
```

输出 0 到 4。
若项目最低版本低于 Go 1.22，应使用传统三段式循环。

## `break`、`continue` 与标签

`break` 结束最内层 `for`、`switch` 或 `select`，`continue` 开始下一次循环。

```go
for i := range 10 {
	if i%2 == 0 {
		continue
	}
	if i > 7 {
		break
	}
	fmt.Println(i)
}
```

标签可控制外层循环：

```go
outer:
for row := range 3 {
	for column := range 3 {
		if row == 1 && column == 1 {
			break outer
		}
	}
}
```

标签适合少量明确的嵌套退出，不应替代函数提取和结构化控制流。

## 差异示例一：索引循环与 range 值

```go
items := []struct{ Count int }{{1}, {2}}
for _, item := range items {
	item.Count++
}
fmt.Println(items)
```

`item` 是元素副本，修改它不会改变切片中的结构体。
需要原地修改时使用索引：

```go
for i := range items {
	items[i].Count++
}
```

## 差异示例二：映射与切片顺序

切片 range 按索引递增遍历，顺序稳定。
映射 range 顺序未指定，即使同一进程多次遍历也不应依赖一致。
测试稳定输出时应显式排序键。

## 差异示例三：Go 1.22 循环变量

Go 1.22 模块语义下，每次迭代的循环变量是新的迭代变量，闭包捕获更符合直觉。
旧版模块语义可能复用变量，导致 goroutine 或闭包观察到最终值。
跨版本维护时仍建议把并发捕获意图写清，并依据 `go.mod` 版本测试。

## 常见错误

- range 结构体切片时修改值副本，以为已修改原元素。
- 依赖映射迭代顺序生成稳定文件或签名。
- 对字符串索引后把单个字节当作完整 Unicode 字符。
- 无限循环没有取消、阻塞等待或退避，造成 CPU 空转。
- 在循环中 `defer` 大量资源关闭，直到外层函数返回才释放。
- 循环内启动无界 goroutine，没有并发上限和错误收集。

## 工程实践

- 遍历集合时明确需要索引、值副本还是元素地址。
- 稳定输出先排序，协议和测试不能依赖映射顺序。
- 长循环检查 `context.Context` 取消，并对 I/O 设置截止时间。
- 循环资源处理提取到小函数，使 `defer` 能及时执行。
- 并发循环使用有界 worker、`errgroup` 或明确的信号量策略。
- 热循环优化前先写基准，避免牺牲边界检查和可读性。

`for` 语法统一，但数据复制、遍历顺序、取消和资源释放决定了循环是否可靠。
