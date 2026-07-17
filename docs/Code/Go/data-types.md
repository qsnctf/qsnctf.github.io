# Go 语言数据类型

Go 是静态类型语言，每个变量在编译期都有确定类型。
本篇介绍基础类型、复合类型、定义类型、别名、零值和转换边界；切片、映射和接口会在后续专题深入。

## 基础类型

布尔类型为 `bool`，值只有 `true` 和 `false`。
字符串类型为 `string`，保存只读字节序列，通常包含 UTF-8 文本但语言不强制编码有效。

整数类型包括：

- 有符号：`int8`、`int16`、`int32`、`int64`、`int`。
- 无符号：`uint8`、`uint16`、`uint32`、`uint64`、`uint`、`uintptr`。
- 别名：`byte` 是 `uint8` 的别名，`rune` 是 `int32` 的别名。

浮点类型为 `float32`、`float64`，复数类型为 `complex64`、`complex128`。
一般计数和索引优先使用 `int`；协议字段、文件格式和跨系统接口才应根据规格选择固定位宽类型。

## 零值

声明后未显式初始化的变量会得到零值：

```go
var enabled bool    // false
var count int       // 0
var ratio float64   // 0
var name string     // ""
var pointer *int    // nil
var numbers []int   // nil
var lookup map[int]string // nil
```

良好 API 会尽量让零值可用。
nil 切片可以安全读取、遍历和 `append`；nil 映射可以读取，但写入会 panic。

## 数组与切片

数组长度属于类型：

```go
var a [3]int
b := [3]int{1, 2, 3}
fmt.Println(a, b)
```

切片是描述一段数组区域的值：

```go
values := []int{1, 2, 3}
values = append(values, 4)
fmt.Println(len(values), cap(values))
```

`[3]int` 与 `[4]int` 是不同类型；`[]int` 不包含固定长度，适合大多数序列 API。

## 映射与结构体

```go
scores := map[string]int{
	"alice": 90,
	"bob":   85,
}

type User struct {
	Name string
	Age  int
}

user := User{Name: "Alice", Age: 20}
```

映射是引用内部哈希表的描述符，不可用 `==` 比较，唯一例外是与 `nil` 比较。
结构体在所有字段可比较时可直接比较；字段顺序和类型属于结构体类型的一部分。

## 指针

```go
value := 42
pointer := &value
*pointer = 43
fmt.Println(value)
```

指针类型 `*T` 保存 `T` 的地址，可为 `nil`。
Go 不支持普通指针算术；`unsafe` 包绕过类型和内存安全保证，仅应用于有明确边界的底层场景。

## 定义类型与类型别名

```go
type UserID int64
type Byte = uint8
```

`UserID` 是新的定义类型，不会和 `int64` 隐式互换。
`Byte` 是别名，与 `uint8` 完全相同；别名主要用于兼容和迁移，不应替代领域类型。

## 显式类型转换

```go
count := 42
ratio := float64(count) / 10
fmt.Println(ratio)
```

Go 不做一般数字类型的隐式转换。
转换可能截断或改变表示，编译通过不代表值一定安全。

## 差异示例一：字符串长度与字符数量

```go
text := "Go语言"
fmt.Println(len(text))
fmt.Println(utf8.RuneCountInString(text))
```

`len` 返回字节数，`utf8.RuneCountInString` 返回 rune 数量。
用户看到的字素簇还可能由多个 rune 组成，因此 rune 数也不总等于视觉字符数。

## 差异示例二：nil 切片与空切片

```go
var nilSlice []int
emptySlice := []int{}
fmt.Println(nilSlice == nil)
fmt.Println(emptySlice == nil)
```

两者长度都为零且都可追加，但 nil 状态不同，JSON 编码等外部表示可能也不同。
API 是否区分二者应由协议契约决定，不要随意依赖。

## 差异示例三：值复制与共享底层数据

```go
arrayA := [2]int{1, 2}
arrayB := arrayA
arrayB[0] = 9

sliceA := []int{1, 2}
sliceB := sliceA
sliceB[0] = 9
fmt.Println(arrayA, sliceA)
```

数组赋值复制全部元素；切片赋值复制描述符，两个切片可能共享底层数组。

## 常见错误

- 用 `int` 表示协议规定的固定宽度字段，造成平台或序列化不一致。
- 将 `len(string)` 当作 Unicode 字符数。
- 向 nil 映射写入数据。
- 数字强制转换前不检查范围，发生截断或符号变化。
- 认为切片参数完全独立，忽视共享底层数组和 `append` 扩容差异。
- 使用浮点数精确表示金额。

## 工程实践

- 为领域概念定义类型，例如 `UserID`、`DurationMillis`，减少单位混淆。
- API 明确 nil 与空集合是否有语义差异。
- 金额优先使用最小货币单位整数或经过评估的十进制定点库。
- 边界转换前检查范围，外部输入解析后立即验证。
- 结构体字段按职责组织，不为节省少量内存过早手工布局。
- 使用 `go vet` 和测试覆盖序列化、溢出边界及 Unicode 输入。

类型系统能防止一部分错误，但编码、单位、范围和所有权仍需要 API 明确表达。
