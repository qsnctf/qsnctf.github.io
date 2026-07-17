# Go 语言接口

接口描述一组方法。类型无需显式声明 `implements`；只要其方法集满足接口，就自动实现该接口。
这种结构化约束有利于让接口定义在使用方，而不是提前建立庞大的类型层次。

## 定义与实现

```go
package main

import "fmt"

type Speaker interface {
	Speak() string
}

type Person struct {
	Name string
}

func (p Person) Speak() string { return "你好，我是 " + p.Name }

func greet(s Speaker) {
	fmt.Println(s.Speak())
}

func main() {
	greet(Person{Name: "小明"})
}
```

接口值包含动态类型和动态值。值接收者方法属于 `Person` 与 `*Person` 的方法集，因此两者都可赋给
`Speaker`。若 `Speak` 使用指针接收者，则只有 `*Person` 实现该接口，这是第一个差异示例。

## 小接口与组合

标准库倾向于单方法接口，例如 `io.Reader`。接口可嵌入其他接口来组合方法集合：

```go
type ReadWriter interface {
	io.Reader
	io.Writer
}
```

接口应由消费者按需要定义。参数只需要 `Read` 时就接收 `io.Reader`，不要为了方便接收包含十几个
方法的大接口。返回值通常优先返回具体类型，让调用方保留完整能力。

## nil 接口陷阱

只有动态类型和动态值都为空时，接口才等于 nil：

```go
type AppError struct {
	Message string
}

func (e *AppError) Error() string { return e.Message }

func bad() error {
	var err *AppError
	return err
}

fmt.Println(bad() == nil) // false
```

这是第二个差异示例：`var err error` 是 nil 接口；把 nil 的 `*AppError` 放入 `error` 后，动态类型
不为空，所以接口不等于 nil。正确做法是在没有错误时直接 `return nil`，不要返回带类型的 nil 指针。

## any 与空接口

`any` 是 `interface{}` 的别名，可保存任意类型，但取回值时需要类型断言或类型 switch。
不要把 `any` 当作关闭类型系统的默认选择；配置边界、反序列化数据等确实开放的场景才适合使用。

## 编译期检查

可用空白标识符让编译器验证实现关系：

```go
var _ Speaker = Person{}
```

这种声明不产生运行时逻辑，适合放在实现附近，尤其是方法集容易因接收者变化而破坏时。

## 常见错误

- 返回带动态类型的 nil 指针，导致 `err != nil`。
- 定义过大的“万能接口”，使实现和测试替身成本升高。
- 误判值类型与指针类型的方法集，实现关系不符合预期。
- 接收接口指针 `*MyInterface`；接口本身已是描述符，几乎总应直接接收接口值。
- 用 `any` 和反射替代可以由具体类型或泛型表达的约束。

## 性能与工程实践

接口调用可能阻碍内联，装箱也可能引发逃逸，但应先以解耦和清晰契约为目标，再通过 profile 验证热点。
不要为了测试而给每个结构体创建接口；在真实消费者需要替换实现时定义最小接口。接口值跨 goroutine
传递并不会自动保证其动态值并发安全，并发约束仍由具体实现负责。
