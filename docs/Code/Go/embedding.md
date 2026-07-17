# Go 组合、嵌入与“继承”

Go 没有传统面向对象语言中的类继承：没有 `extends`、父类、虚方法覆盖或 `super` 调用。
Go 使用组合复用状态，通过结构体嵌入简化选择器，并通过接口实现多态。

## 组合优先

```go
package main

import "fmt"

type Engine struct {
	Power int
}

func (e Engine) Start() string {
	return fmt.Sprintf("发动机启动：%d kW", e.Power)
}

type Car struct {
	engine Engine
	Brand  string
}

func (c Car) Start() string {
	return c.Brand + "，" + c.engine.Start()
}

func main() {
	car := Car{engine: Engine{Power: 120}, Brand: "示例汽车"}
	fmt.Println(car.Start())
}
```

普通命名字段明确表达“Car 拥有 Engine”，调用路径清楚，也便于维护不变量。组合不是继承：
`Car` 不是 `Engine` 的子类型，不能把 `Car` 赋给需要 `Engine` 的变量。

## 结构体嵌入与方法提升

```go
type Vehicle struct {
	ID string
}

func (v Vehicle) Label() string { return "车辆 " + v.ID }

type Truck struct {
	Vehicle
	Capacity int
}

truck := Truck{Vehicle: Vehicle{ID: "T-1"}, Capacity: 8}
fmt.Println(truck.ID)
fmt.Println(truck.Label())
fmt.Println(truck.Vehicle.Label())
```

嵌入字段没有显式字段名，字段名默认为类型名 `Vehicle`。`truck.ID` 和 `truck.Label()` 是提升后的
简写，完整路径仍是 `truck.Vehicle.ID` 与 `truck.Vehicle.Label()`。

第一个差异示例：方法提升让 `Truck` 的方法集可能包含 `Label`，但不会建立 `Truck is-a Vehicle`
的子类型关系。需要 `Vehicle` 时仍要显式传 `truck.Vehicle`。

## 同名方法不是覆盖

```go
func (t Truck) Label() string {
	return fmt.Sprintf("卡车 %s，载重 %d", t.ID, t.Capacity)
}
```

`Truck.Label` 会遮蔽提升的 `Vehicle.Label`，但这不是虚方法覆盖。调用 `t.Vehicle.Label()` 仍明确执行
嵌入类型的方法，而且 `Vehicle` 内部调用自己的方法时不会动态分派到 `Truck.Label`。

这是第二个差异示例：传统继承常通过虚方法实现运行时覆盖；Go 的方法选择由静态选择器和接口动态类型
决定，嵌入本身不提供虚方法派发。

## 接口与嵌入

如果提升后的方法集满足某接口，外层类型可以实现该接口：

```go
type Labeler interface {
	Label() string
}

var _ Labeler = Truck{}
```

这是一种方法集结果，不是继承声明。嵌入 `T` 与嵌入 `*T` 的方法集不同；嵌入 nil 指针后调用其
提升方法还可能 panic，因此构造函数应保证必要依赖已初始化。

## 冲突与可见性

若同一层级嵌入的两个类型都提供同名字段或方法，选择器会产生歧义，必须写完整路径。
提升不突破包可见性：其他包仍不能访问嵌入类型的未导出成员。结构体字面量也不能用提升字段名
直接初始化，必须初始化对应嵌入字段。

## 常见错误

- 把嵌入描述为“Go 的类继承”，进而错误推断子类型关系。
- 认为外层同名方法会虚拟覆盖嵌入类型内部的调用。
- 为省几个选择器而过度嵌入，意外扩大外层类型的公开方法集。
- 嵌入接口或指针却未初始化，调用提升方法时发生 nil panic。
- 忽略多个嵌入成员的同名冲突，API 扩展后出现选择器歧义。

## 性能与工程实践

嵌入通常没有特殊运行时成本，布局上仍是一个真实字段；性能问题主要来自字段本身的大小、复制和
间接访问。对公开类型要谨慎嵌入第三方具体类型，因为其新增方法可能意外改变你的方法集和接口实现。
只为表达明确的“拥有”关系而组合，只在方法提升确实改善 API 时嵌入。跨实现的多态应依靠小接口，
而不是模拟类层次。接口嵌入用于组合方法契约，也同样不代表传统继承。
