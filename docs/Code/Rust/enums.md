# Rust 枚举、Option 与 Result

枚举表示“一个值只能是若干变体之一”，每个变体还可携带不同数据。它与 `match` 结合，可让编译器检查状态处理是否完整。

## 定义枚举

```rust
#[derive(Debug, PartialEq)]
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    Color(u8, u8, u8),
}

fn describe(message: Message) -> String {
    match message {
        Message::Quit => String::from("quit"),
        Message::Move { x, y } => format!("move to {x},{y}"),
        Message::Write(text) => text,
        Message::Color(r, g, b) => format!("rgb({r},{g},{b})"),
    }
}

fn main() {
    assert_eq!(describe(Message::Move { x: 2, y: 3 }), "move to 2,3");
    let _ = Message::Quit;
    let _ = Message::Write(String::from("hello"));
    let _ = Message::Color(1, 2, 3);
}
```

`match` 必须穷尽所有可能。通配符 `_` 会匹配任何剩余值，但可能掩盖未来新增变体需要专门处理的事实。

## Option 表示可选值

`Option<T>` 有 `Some(T)` 和 `None`，避免用空指针或魔法值表示缺失。

```rust
fn first_even(values: &[i32]) -> Option<i32> {
    values.iter().copied().find(|value| value % 2 == 0)
}

fn main() {
    let value = first_even(&[1, 4, 7]);
    assert_eq!(value.map(|n| n * 10), Some(40));
    assert_eq!(first_even(&[1, 3]).unwrap_or(0), 0);
}
```

常用组合器有 `map`、`and_then`、`filter`、`unwrap_or` 和 `ok_or`。`unwrap`、`expect` 在 `None` 时 panic，生产路径应确认失败确实不可恢复。

## Result 表示可恢复失败

`Result<T, E>` 有 `Ok(T)` 和 `Err(E)`。错误传播的详细规则见[错误处理](./error-handling.md)。

```rust
fn parse_port(text: &str) -> Result<u16, String> {
    match text.parse::<u16>() {
        Ok(0) => Err(String::from("端口不能为 0")),
        Ok(port) => Ok(port),
        Err(error) => Err(format!("无效端口: {error}")),
    }
}

fn main() {
    assert_eq!(parse_port("8080"), Ok(8080));
    assert!(parse_port("bad").is_err());
}
```

## if let 与 while let

只关心一个模式时，`if let` 比完整 `match` 简洁；它会放弃穷尽性检查。循环取值可使用 `while let`。

```rust
fn main() {
    let setting = Some(3);
    if let Some(level) = setting {
        assert_eq!(level, 3);
    }

    let mut stack = vec![1, 2];
    while let Some(value) = stack.pop() {
        println!("{value}");
    }
}
```

## 常见错误与工程注意

- `match` 各分支必须返回兼容类型；语句末尾多一个分号可能把某分支变成 `()`。
- 匹配拥有所有权的枚举可能移出内部 `String`；若还要使用原值，应匹配 `&value` 或使用 `ref` 模式。
- 不要用 `unwrap` 代替错误设计；测试、示例和已经验证不变量的内部代码可酌情使用。
- `if let` 适合忽略其他情况；若每种状态都影响业务逻辑，应优先 `match`。
- 枚举可将非法状态排除在类型系统之外，通常优于多个互相约束的布尔字段。
- 公开枚举新增变体可能影响下游穷尽匹配；库 API 演进时需考虑兼容性。

继续阅读：[结构体](./structs.md)、[泛型与 Trait](./generics-and-traits.md)。
