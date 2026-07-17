# Go 语言泛型

泛型允许函数和类型使用类型参数，在保持静态类型检查的同时复用算法。类型参数写在方括号中，
每个参数都必须有约束；约束描述允许的类型集合及可使用的操作。

## 泛型函数与类型推断

```go
package main

import "fmt"

func First[T any](values []T) (T, bool) {
	if len(values) == 0 {
		var zero T
		return zero, false
	}
	return values[0], true
}

func main() {
	value, ok := First([]string{"Go", "Rust"})
	fmt.Println(value, ok)
}
```

调用 `First([]string{...})` 时，编译器从实参推断 `T` 为 `string`，无需写 `First[string]`。
如果没有足够信息，例如调用一个无参数泛型构造函数，就必须显式提供类型实参。

## 约束与底层类型

```go
type Integer interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64
}

func Sum[T Integer](values []T) T {
	var total T
	for _, value := range values {
		total += value
	}
	return total
}
```

`|` 表示类型集合的并集，`~int` 表示所有底层类型为 `int` 的类型，因此自定义的
`type Count int` 也满足约束。第一个差异示例：写 `int` 只允许预声明类型 `int`，写 `~int`
还允许底层类型相同的命名类型。

`any` 不允许使用 `+` 或 `<`，因为不是所有类型都支持这些运算。`comparable` 允许 `==` 和 `!=`，
常用于 map 键或去重算法，但不意味着支持排序。

## 泛型类型

```go
type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(value T) {
	s.items = append(s.items, value)
}

func (s *Stack[T]) Pop() (T, bool) {
	if len(s.items) == 0 {
		var zero T
		return zero, false
	}
	last := len(s.items) - 1
	value := s.items[last]
	var zero T
	s.items[last] = zero
	s.items = s.items[:last]
	return value, true
}
```

第二个差异示例：`Stack[int]` 与 `Stack[string]` 是不同的实例化类型，不能互相赋值；
非泛型的 `[]any` 虽能混放值，却会丢失元素类型关系并需要断言。

## 标准库约束与辅助包

Go 1.21+ 的 `slices`、`maps` 和 `cmp` 包提供常见泛型算法。排序有序值可使用 `slices.Sort`，
自定义顺序使用 `slices.SortFunc` 和 `cmp.Compare`，通常无需自行维护 `Ordered` 约束。

## 类型推断边界

类型推断主要根据函数实参和约束统一类型，不根据返回值目标类型完成所有推断。类型参数的方法集
只包含约束保证的方法；即使实际传入类型还有其他方法，泛型函数也不能直接调用它们。

## 常见错误

- 使用 `any` 约束后仍尝试对 `T` 做加法或排序比较。
- 忘记 `~`，意外拒绝底层类型相同的自定义命名类型。
- 为只有一种实际类型的代码引入泛型，增加 API 和错误信息复杂度。
- 把类型参数当作运行时模板或继承机制。
- 通过 `any` 转换和类型 switch 绕过约束，破坏静态安全。

## 性能与工程实践

泛型通常能避免接口装箱和手写类型断言，但具体机器码生成策略是实现细节，不能假设一定零开销。
优先复用标准库泛型函数；自定义约束应保持最小，并用能表达领域含义的名称。只有算法确实对多种类型
保持相同行为时才泛化。基准测试要覆盖实际实例化类型，因为不同大小和布局的类型成本可能不同。
