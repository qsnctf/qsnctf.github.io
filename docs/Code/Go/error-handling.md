# Go 错误处理

Go 使用普通值表示可预期的失败，而不是把异常作为主要控制流。
函数通常把 `error` 放在最后一个返回值中；调用者必须决定处理、包装或返回它。
`panic` 适合程序不变量被破坏等无法继续的情况，不应代替输入校验、网络失败或文件不存在等普通错误。

## error 的边界

`error` 是只有 `Error() string` 方法的接口：

```go
type error interface {
	Error() string
}
```

错误文本面向人类，稳定的程序判断应使用错误链、类型或显式字段，而不是比较字符串。
库通常返回错误，让应用层决定日志、重试、退出或转换为协议状态码。
同一层不要既记录又返回同一个错误，否则上层再次记录时会产生重复日志。

## 创建与包装错误

`errors.New` 创建固定错误，`fmt.Errorf` 可添加上下文。
格式动词 `%w` 会保留原错误，使 `errors.Is` 和 `errors.As` 能沿错误链检查。

```go
package account

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("account not found")

func Load(id string) error {
	if id == "" {
		return fmt.Errorf("load account: empty id")
	}
	return fmt.Errorf("load account %q: %w", id, ErrNotFound)
}
```

哨兵错误适合调用者只关心类别的情况，但公开过多哨兵会扩大 API 的兼容性负担。
包装信息应描述当前操作，例如 `read config: ...`，不要只重复底层文本。

## errors.Is：比较错误语义

直接使用 `==` 只能匹配完全相同的值，包装后通常失效。
`errors.Is` 会遍历由 `Unwrap` 暴露的错误链。

```go
err := Load("42")

// 差异示例 1：直接比较无法识别被包装的 ErrNotFound。
if err == ErrNotFound {
	fmt.Println("不会执行")
}

if errors.Is(err, ErrNotFound) {
	fmt.Println("账户不存在")
}
```

标准库常见判断包括 `errors.Is(err, fs.ErrNotExist)` 和 `errors.Is(err, context.Canceled)`。
不要用 `strings.Contains(err.Error(), "not found")` 判断类别，错误文本可能改变或被本地化。

## errors.As：提取错误类型

当调用者需要结构化字段时，定义错误类型并使用 `errors.As`。

```go
type ValidationError struct {
	Field string
	Msg   string
}

func (e *ValidationError) Error() string {
	return e.Field + ": " + e.Msg
}

func ValidateAge(age int) error {
	if age < 0 {
		return fmt.Errorf("validate input: %w", &ValidationError{
			Field: "age",
			Msg:   "must not be negative",
		})
	}
	return nil
}

err := ValidateAge(-1)
var validationErr *ValidationError
if errors.As(err, &validationErr) {
	fmt.Println(validationErr.Field)
}
```

差异示例 2：`errors.Is` 回答“是否属于某个错误值/语义”，`errors.As` 回答“链中是否存在某种类型并提取它”。
传给 `errors.As` 的目标通常是指针的地址；目标类型不正确会导致匹配失败，非法目标还会 panic。

## errors.Join：组合独立失败

Go 1.20+ 的 `errors.Join` 将多个非 nil 错误合成一个错误。
组合错误可被 `errors.Is` 和 `errors.As` 遍历，适合关闭多个资源或批量校验。

```go
func Validate(name, email string) error {
	var errs []error
	if name == "" {
		errs = append(errs, errors.New("name is required"))
	}
	if email == "" {
		errs = append(errs, errors.New("email is required"))
	}
	return errors.Join(errs...)
}
```

`errors.Join()` 或仅包含 nil 的调用返回 nil。
它不表示错误发生的先后因果关系；有明确因果链时优先逐层 `%w` 包装。
不要依赖组合错误的最终字符串格式作为机器接口。

## 资源清理错误

写文件时，`Close` 可能报告缓冲刷新或文件系统错误，不能总是忽略。

```go
func Store(path string, data []byte) (err error) {
	f, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("create %q: %w", path, err)
	}
	defer func() {
		err = errors.Join(err, f.Close())
	}()

	if _, err := f.Write(data); err != nil {
		return fmt.Errorf("write %q: %w", path, err)
	}
	return nil
}
```

对于只读文件，延迟关闭通常可以直接执行；对于关键写入，应检查 `Close`，必要时还要调用 `Sync`。

## 常见错误与工程注意

- 不要写 `if err != nil { panic(err) }` 作为通用处理策略。
- 不要丢弃错误，例如 `_ = json.NewEncoder(w).Encode(v)`；应明确说明为何可忽略。
- 不要包装后使用 `%v` 期待 `errors.Is` 生效，保留链必须使用 `%w`。
- 不要在每一层记录同一个错误；在拥有请求、任务或用户上下文的边界统一记录。
- 错误信息应包含操作和对象，但不要泄露密码、令牌、私钥、SQL 参数或用户隐私。
- 重试前判断错误是否临时且操作是否幂等，并设置退避、上限与 `context` 截止时间。
- 对外 API 应转换内部错误，避免把文件路径、数据库结构和依赖实现暴露给客户端。
- 测试错误类别时使用 `errors.Is/As`，测试文本只用于确实承诺稳定文本的场景。
- 在并发任务中收集错误时要同时处理取消和 goroutine 生命周期，避免只返回第一个错误却泄漏任务。

## 小结

把普通失败表示为 `error`，逐层添加上下文并保留错误链。
使用 `errors.Is` 判断语义，使用 `errors.As` 提取类型，使用 `errors.Join` 表示多个独立失败。
在应用边界统一记录和展示错误，并把敏感信息、重试策略和资源清理纳入设计。
