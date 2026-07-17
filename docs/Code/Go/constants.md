# Go 语言常量

常量是在编译期可表示且运行时不可重新赋值的值。
Go 常量可为布尔、数字、字符、字符串，也可以暂时保持“无类型”状态，从而获得灵活且精确的表达能力。

## 基本声明

```go
const Pi = 3.141592653589793
const Greeting string = "hello"

const (
	ReadTimeout  = 5 * time.Second
	WriteTimeout = 10 * time.Second
)
```

常量表达式不能调用普通运行时函数。
`time.Second` 本身是常量，因此上面的持续时间声明合法。

## 无类型常量

未显式指定类型的常量可能是无类型布尔、整数、浮点、复数、字符或字符串。
无类型常量在赋给变量或传入参数时，才根据上下文选择可表示的具体类型。

```go
const MaxRetries = 3

var small int8 = MaxRetries
var large int64 = MaxRetries
```

只要值可表示，同一个常量可以用于不同数字类型。

## 常量精度和表示范围

数字常量可具有高于运行时基础类型的精度：

```go
const Huge = 1 << 100
const Ratio = 1.0 / 3.0
```

`Huge` 可以参与常量计算，但不能赋给无法容纳它的运行时整数类型：

```go
// var n uint64 = Huge // 编译错误：溢出
```

编译期精确不等于转换到 `float64` 后仍保持十进制精确。

## `iota`

`iota` 在每个 `const` 声明组中从 0 开始，并按 ConstSpec 递增：

```go
type Level int

const (
	LevelDebug Level = iota
	LevelInfo
	LevelWarning
	LevelError
)
```

省略后续表达式时，会重复前一个非空表达式及其类型。

## 位标志示例

```go
type Permission uint8

const (
	PermissionRead Permission = 1 << iota
	PermissionWrite
	PermissionExecute
)

func hasPermission(all, target Permission) bool {
	return all&target != 0
}
```

位标志适合可组合选项，但需要明确零值、未知位和序列化兼容策略。

## 差异示例一：常量与变量

```go
const Port = 8080
var startedAt = time.Now()
```

端口字面值可在编译期确定，因此可为常量。
当前时间必须在运行时调用函数获得，因此只能是变量。
常量不是“绝对不变配置”的同义词；部署配置通常仍来自环境或文件。

## 差异示例二：无类型常量与有类型常量

```go
const Untyped = 100
const Typed int32 = 100

var a int64 = Untyped
// var b int64 = Typed // 需要显式转换
```

无类型常量可根据目标上下文表示为 `int64`；有类型常量遵循普通类型兼容规则。
公开 API 中显式类型能表达领域含义，但也会减少使用时的灵活性。

## 差异示例三：`iota` 与显式协议值

`iota` 适合内部连续枚举或位标志。
外部协议、数据库状态和持久化格式应显式写值，因为在声明组中插入一行可能改变后续 `iota` 数值。

```go
const (
	StatusPending = 10
	StatusRunning = 20
	StatusDone    = 30
)
```

## 常量命名边界

Go 不要求常量使用全大写蛇形命名。
常量遵循普通 Go 命名方式，例如 `MaxPacketSize`；是否导出仍由首字母大小写决定。
名称中应避免重复包语境，例如 `http.HTTPDefaultPort` 通常不如 `http.DefaultPort` 简洁。

## 常见错误

- 尝试将切片、映射、结构体或函数调用结果声明为常量。
- 认为常量一定有 `int` 或 `float64` 类型，忽略无类型常量。
- 用 `iota` 表示外部持久化值，后续插入常量破坏兼容。
- 把环境可变配置硬编码为常量。
- 将很大的无类型常量转换为较小整数而触发编译溢出。
- 使用常量模拟缺少验证的“枚举”，却允许任意底层值进入 API。

## 工程实践

- 使用定义类型配合常量表达领域集合，并提供验证或 `String` 方法。
- 外部协议值全部显式固定，新增值不修改既有编码。
- 单位写入名称或使用 `time.Duration` 等有语义类型。
- 位标志预留未知位处理策略，反序列化时验证非法组合。
- 常量组按同一概念组织，不创建包含无关值的巨大 `const` 块。
- 对公开常量写清稳定性和可组合规则。

Go 常量的强项是无类型精确计算和清晰的编译期约束，而不是替代运行时配置系统。
