# Go 语言切片（Slice）

切片是对底层数组某个连续区间的描述符，包含指针、长度 `len` 和容量 `cap`。切片长度可变，
但切片本身不存储元素；多个切片可能共享同一个底层数组。

## 创建与追加

```go
package main

import "fmt"

func main() {
	a := []int{1, 2, 3}
	b := make([]int, 2, 5)
	b = append(b, 30, 40)

	fmt.Println(a, len(a), cap(a))
	fmt.Println(b, len(b), cap(b))
}
```

`make([]int, 2, 5)` 创建长度为 2、容量为 5 的切片，前两个元素已存在且为零值。
`append` 返回新的切片描述符，必须接收返回值。容量不足时它会分配新底层数组并复制旧元素，
容量增长策略属于实现细节，代码不应依赖具体倍数。

## 截取与共享底层数组

```go
base := []int{10, 20, 30, 40}
part := base[1:3]
part[0] = 99
fmt.Println(base) // [10 99 30 40]
```

这是切片与数组复制的第一个关键差异：切片截取不复制元素，`part` 与 `base` 共享数据。
如果需要独立副本，可使用 `slices.Clone` 或 `copy`：

```go
import "slices"

independent := slices.Clone(part)
independent[0] = 7
```

三索引表达式可限制容量，避免被调用方追加时覆盖原切片的后续元素：

```go
window := base[1:3:3] // len=2, cap=2
window = append(window, 50) // 必须分配新底层数组
```

## nil 切片与空切片

```go
var nilSlice []int
empty := []int{}

fmt.Println(nilSlice == nil, len(nilSlice)) // true 0
fmt.Println(empty == nil, len(empty))       // false 0
```

两者都可 `range`、`append`，长度都为 0，这是第二个差异示例。它们在 JSON 编码等边界上可能分别
表现为 `null` 与 `[]`，API 契约若区分二者就要显式规范。切片不能互相使用 `==` 比较；Go 1.21+
可使用标准库 `slices.Equal` 比较可比较元素。

## 删除与清理

```go
values := []int{1, 2, 3, 4}
i := 1
values = append(values[:i], values[i+1:]...)
clear(values[len(values):cap(values)])
```

删除会移动后续元素。若元素含指针且底层数组长期存活，应清零不再使用的槽位，避免对象被意外保留。
Go 1.21+ 的 `clear` 可清零切片元素。

## 常见错误

- 忽略 `append` 返回值，导致长度未更新或新数组丢失。
- 认为子切片已经复制，修改后意外污染原数据。
- 返回一个很小的子切片，却让超大底层数组长期无法被 GC 回收。
- 混淆长度和容量，访问 `s[len(s)]` 会越界，即使容量仍有空间。
- 在多个 goroutine 中无同步地追加或修改同一切片，产生数据竞争。

## 性能与工程实践

已知大致元素数时用 `make([]T, 0, n)` 预分配容量，可减少扩容和复制，但过度预分配会浪费内存。
跨 API 边界时应说明函数是否保留、修改或异步使用传入切片；所有权不清比单次复制成本更危险。
需要长期保存小窗口时应克隆数据。排序、比较、查找和删除优先考虑标准库 `slices` 包，避免重复实现。
