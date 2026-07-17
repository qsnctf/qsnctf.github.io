# Go 语言指针

指针保存某个变量的内存地址。Go 提供指针以便共享和修改数据，但不支持普通指针算术，
也不允许像 C 那样通过地址任意移动访问内存。

## 取地址与解引用

```go
package main

import "fmt"

func increment(n *int) {
	*n++
}

func main() {
	value := 41
	p := &value
	increment(p)
	fmt.Println(value, *p) // 42 42
}
```

`&value` 取得地址，类型为 `*int`；`*p` 读取或写入该地址对应的值。表达式 `*n++`
按 Go 语法等价于 `(*n)++`，不是移动指针。

## nil 指针

指针的零值是 `nil`。可以比较指针是否为 `nil`，但解引用 nil 指针会 panic：

```go
func nameLength(name *string) int {
	if name == nil {
		return 0
	}
	return len(*name)
}
```

只有当“没有值”与该类型的零值语义不同，或函数确实需要修改调用方变量时，才应使用指针。
不要把所有参数机械地改成指针。

## 值接收者与指针接收者

```go
type Counter struct {
	N int
}

func (c Counter) Value() int { return c.N }

func (c *Counter) Add(delta int) {
	c.N += delta
}
```

值接收者操作副本，指针接收者可以修改原值。第一个差异示例是 `Counter.Value` 不改变状态，
而 `Counter.Add` 必须使用指针接收者。对于包含互斥锁或较大字段的结构体，也通常使用指针接收者。

Go 会在变量可寻址时自动完成 `c.Add(1)` 所需的取地址，但这只是语法便利，不会改变方法集规则。
`T` 的方法集只含接收者为 `T` 的方法，`*T` 的方法集同时包含 `T` 与 `*T` 的方法。

## 指针与引用式类型的边界

切片、map、channel 和函数值本身已包含引用语义，通常不需要传 `*[]T` 或 `*map[K]V`。
第二个差异示例：函数可直接修改切片元素或 map 条目，但若要替换调用方的切片描述符，才需要返回
新切片或传切片指针。

```go
func appendOne(values []int) []int {
	return append(values, 1)
}
```

## new 与复合字面量

`new(T)` 分配一个零值 `T` 并返回 `*T`。结构体更常用 `&Config{Port: 8080}`，因为字段含义清晰。
局部变量取地址是安全的，编译器会根据逃逸分析决定放在栈还是堆上。

## 常见错误

- 解引用 nil 指针，或忽略构造函数可能返回的 nil。
- 返回指向循环中复用临时变量的指针，导致多个结果指向同一对象。
- 用指针表示所有可选字段，增加 nil 分支和对象分配。
- 误以为传入 `*map` 才能修改 map 条目。
- 混用值接收者和指针接收者，导致方法集与接口实现难以理解。

## 性能与工程实践

指针可减少大值复制，但可能让对象逃逸到堆并增加 GC 压力。小型不可变结构体按值传递往往更简单，
也更利于局部性。使用 `go test -bench` 和 `-gcflags=-m` 验证性能判断，不要依据“指针一定更快”
的经验结论设计 API。共享指针还意味着共享可变状态，需要锁、原子操作或所有权约束来避免数据竞争。
