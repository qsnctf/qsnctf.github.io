# Go 语言结构体

结构体把若干命名字段组合成一个值，是 Go 建模业务数据的主要工具。Go 没有类；行为通过给
命名类型定义方法来表达，复用通常依靠组合和接口。

## 定义与初始化

```go
package main

import "fmt"

type User struct {
	ID     int64
	Name   string
	Active bool
}

func main() {
	var zero User
	a := User{ID: 1, Name: "Alice", Active: true}
	b := &User{ID: 2, Name: "Bob"}

	fmt.Println(zero, a.Name, b.ID)
}
```

字段会得到各自类型的零值。推荐使用带字段名的复合字面量，它能抵抗字段顺序变化；
不带字段名的 `User{1, "Alice", true}` 更脆弱，且跨包使用时可读性较差。

## 字段可见性与方法

字段名首字母大写表示从其他包可导出，小写字段仅包内可见。可见性由标识符决定，不是由
`public` 或 `private` 关键字决定。

```go
type Rectangle struct {
	Width  float64
	Height float64
}

func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

func (r *Rectangle) Scale(factor float64) {
	r.Width *= factor
	r.Height *= factor
}
```

第一个差异示例：`Area` 只读取值，适合值接收者；`Scale` 修改状态，必须使用指针接收者。
同一类型的方法接收者风格应保持一致，尤其不要复制包含 `sync.Mutex` 的结构体。

## 相等性与复制

若所有字段都可比较，结构体可直接使用 `==`。包含切片、map 或函数字段的结构体不可整体比较。

```go
type Point struct{ X, Y int }

p1 := Point{X: 1, Y: 2}
p2 := p1
p2.X = 9
fmt.Println(p1 == p2) // false
```

第二个差异示例：普通字段随结构体复制而独立；若字段是切片，复制结构体只复制切片描述符，
两个结构体仍可能共享底层数组。需要深拷贝时必须明确复制引用式字段。

## 标签与编码

结构体标签是供反射库读取的字符串元数据：

```go
type Request struct {
	Name string `json:"name"`
	Age  int    `json:"age,omitempty"`
}
```

标签本身不会执行验证或转换。`encoding/json` 只能直接处理导出字段，未导出字段即使有标签也不会编码。

## 常见错误

- 跨包依赖未导出字段，代码无法编译。
- 用位置字面量初始化字段较多的结构体，字段调整后语义错位。
- 复制含互斥锁的结构体，产生两个失去同步关系的锁副本。
- 认为结构体复制一定是深拷贝，忽略切片、map、指针字段共享数据。
- 把所有字段都导出，使类型不变量无法由构造函数和方法维护。

## 性能与工程实践

字段顺序可能因内存对齐影响结构体尺寸，可用 `unsafe.Sizeof` 观察，但不要为了少量字节牺牲领域可读性。
高频创建的大量小对象才值得评估布局。API 中优先让结构体表达清晰的数据契约；当零值有用时，
尽量让类型无需构造函数即可工作。需要并发共享时，应明确哪些字段受锁保护，而不是暴露内部可变字段。
