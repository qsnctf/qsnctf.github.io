# Go 语言范围（Range）

`range` 用于遍历数组、切片、字符串、map、channel，以及 Go 1.22 支持的整数范围。
不同数据源返回的值不同，遍历顺序和复制语义也不同。

## 数组与切片

```go
package main

import "fmt"

func main() {
	values := []string{"A", "B", "C"}
	for i, value := range values {
		fmt.Println(i, value)
	}

	for i := range 3 {
		fmt.Println(i) // 0、1、2，Go 1.22+
	}
}
```

不需要索引时写 `for _, value := range values`，只需要索引时写 `for i := range values`。
`value` 是本次迭代元素的副本，修改它不会修改切片元素：

```go
for i := range values {
	values[i] = "item-" + values[i]
}
```

这是第一个差异示例：修改 `value` 只影响局部副本，修改 `values[i]` 才作用于原元素。

## 字符串遍历

字符串的 `range` 按 UTF-8 解码为 Unicode 码点，索引是该码点首字节的位置：

```go
for byteIndex, r := range "Go语言" {
	fmt.Printf("%d: %c\n", byteIndex, r)
}
```

第二个差异示例：普通索引 `s[i]` 得到单个字节，`range` 得到 `rune`；中文字符可能占多个字节。
非法 UTF-8 字节序列会产生替换字符 `utf8.RuneError`。

## map 与 channel

```go
counts := map[string]int{"a": 1, "b": 2}
for key, value := range counts {
	fmt.Println(key, value)
}

ch := make(chan int, 2)
ch <- 1
ch <- 2
close(ch)
for value := range ch {
	fmt.Println(value)
}
```

map 的遍历顺序未指定，每轮都可能不同；需要稳定输出时先收集并排序键。channel 的 `range`
持续接收直到 channel 被关闭并耗尽，若永不关闭且没有新值，循环会永久阻塞。

## Go 1.22 循环变量语义

从 Go 1.22 起，每次迭代都会获得新的循环变量，闭包捕获和取地址不再共享旧版本中的同一个变量。
项目的 `go.mod` 语言版本会影响旧模块的语义；维护历史代码时仍应确认模块版本并运行测试。

```go
for _, value := range []string{"a", "b", "c"} {
	go func() {
		fmt.Println(value)
	}()
}
```

## 常见错误

- 假设 map 按插入顺序遍历，导致测试或序列化结果不稳定。
- 把字符串索引误当作字符序号，处理多字节 UTF-8 时切错位置。
- 修改 range 值副本，期待原结构体元素随之变化。
- 遍历未关闭的 channel，造成 goroutine 永久阻塞。
- 在遍历切片时追加同一切片，却假设循环一定访问新增元素。

## 性能与工程实践

对大型结构体切片使用 `for i := range items` 可避免每轮复制整个结构体。数组参与 `range` 时，
范围表达式可能被复制；大型数组可遍历其切片 `array[:]`。map 需要稳定顺序时排序键会产生额外分配，
应只在协议、日志或测试确有确定性要求时支付成本。不要在热路径中重复把字符串转为 `[]rune`，
若只需顺序读取码点，直接 `range` 通常更高效。
