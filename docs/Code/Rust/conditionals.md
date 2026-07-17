# 条件判断
Rust 使用 `if`、`else if` 和 `else` 表达分支。条件必须是 `bool`，不会把整数、字符串或
引用隐式转换为真假值。
## 基本 if
```rust
fn main() {
    let temperature = 31;

    if temperature >= 35 {
        println!("高温");
    } else if temperature >= 25 {
        println!("温暖");
    } else {
        println!("凉爽");
    }
}
```

多个条件按顺序判断，命中后不再检查后续分支。条件复杂时可提取为有业务含义的布尔变量，
避免在 `if` 中堆叠难以审查的逻辑。
## if 是表达式
`if` 可以产生值，因此可直接初始化绑定：

```rust
fn main() {
    let score = 86;
    let level = if score >= 90 {
        "A"
    } else if score >= 60 {
        "B"
    } else {
        "C"
    };
    println!("level = {level}");
}
```

所有可能正常完成的分支必须返回兼容类型。`if condition { 5 } else { "five" }` 会编译失败。
用于赋值时通常需要完整的 `else`，否则缺失分支的值是 `()`。
## match
`match` 适合枚举、离散值和需要穷尽检查的分支：

```rust
fn main() {
    let code = 404;
    let message = match code {
        200 => "ok",
        400..=499 => "client error",
        500..=599 => "server error",
        _ => "other",
    };
    println!("{message}");
}
```

每个分支称为 arm，形式是 `pattern => expression`。`match` 必须穷尽所有可能值，`_` 可作为
兜底模式，但若枚举变化值得显式处理，过早使用 `_` 可能隐藏新状态。
## matches! 与 if let

只关心值是否匹配某个模式时可使用 `matches!`：

```rust
fn main() {
    let status = Some(200);
    let success = matches!(status, Some(200..=299));
    println!("success = {success}");

    if let Some(code) = status {
        println!("code = {code}");
    }
}
```

`matches!(expression, pattern)` 返回 `bool`，还可添加 match guard。`if let` 适合只处理一个
主要模式，其他情况忽略或放入 `else`；需要多个结构化分支时优先 `match`。

## 常见错误与工程说明

- 写 `if number` 会失败，应写明确条件，如 `if number != 0`。
- `=` 是赋值相关语法，比较相等使用 `==`。
- 分支尾表达式误加分号会把该分支变为 `()`，造成分支类型不一致。
- 浮点 NaN 会让常规大小比较返回 `false`，输入可能非有限值时应先检查。
- 权限、安全策略等条件应采用默认拒绝并覆盖边界测试，避免复杂否定逻辑。

## 练习

编写程序把 HTTP 状态码映射为 `success`、`redirect`、`client error`、`server error` 或
`unknown`。先用 `match` 返回字符串，再用 `matches!` 单独判断它是否为成功状态。
