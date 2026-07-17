# 函数
函数把行为组织成可测试、可复用的接口。Rust 使用 `fn` 定义函数，参数和返回类型写在签名中；
函数位置通常不依赖类型推断，以便调用者和编译器明确契约。
## 签名与调用
```rust
fn add(left: i32, right: i32) -> i32 {
    left + right
}

fn print_sum(left: i32, right: i32) {
    println!("sum = {}", add(left, right));
}

fn main() {
    print_sum(20, 22);
}
```

参数必须逐个标注类型。没有写 `-> T` 时返回单元类型 `()`。Rust 不支持按参数数量或类型
重载同名自由函数，通常使用不同名称、泛型或 trait 表达不同能力。
## 表达式返回值
函数体是代码块，最后一个无分号表达式可作为返回值：

```rust
fn absolute(value: i32) -> Option<i32> {
    value.checked_abs()
}

fn main() {
    assert_eq!(absolute(-7), Some(7));
    assert_eq!(absolute(i32::MIN), None);
}
```

`i32::MIN` 的正绝对值无法用 `i32` 表示，因此示例使用 `checked_abs()` 明确返回失败。若需要
无符号幅值，可使用 `unsigned_abs()` 返回 `u32`，不要直接对所有负数执行 `-value`。

也可用 `return value;` 提前返回，适合先处理错误或边界条件：

```rust
fn first_byte(text: &str) -> Option<u8> {
    if text.is_empty() {
        return None;
    }
    Some(text.as_bytes()[0])
}
```
尾表达式后增加分号会使结果变成 `()`，这是初学时常见的返回类型错误。
## 引用参数
无需取得所有权时可借用参数：

```rust
fn word_count(text: &str) -> usize {
    text.split_whitespace().count()
}

fn main() {
    let message = String::from("safe fast productive");
    println!("{}", word_count(&message));
    println!("仍可使用: {message}");
}
```
参数选择应表达需求：只读文本通常接收 `&str`，需要修改时接收 `&mut T`，确实要保存或转移
资源时再接收拥有所有权的 `T`。
## 发散函数
返回类型 `!` 表示函数永不正常返回，例如始终 panic 或无限循环：

```rust
fn fatal(message: &str) -> ! {
    panic!("fatal: {message}");
}

fn main() {
    let configured = false;
    let port = if configured { 8080 } else { fatal("缺少端口配置") };
    println!("{port}");
}
```
`!` 可与其他分支协调，因为发散分支不会产生普通值。生产程序仍应区分可恢复错误与真正
不可继续的状态，不应把 `panic!` 当作常规错误返回。
## 常见错误与工程说明
- 调用实参数量或类型必须匹配，Rust 不进行任意隐式转换。
- 公共函数签名是长期接口，应优先使用能准确表达所有权和失败方式的类型。
- 函数过长、参数过多通常提示职责混杂，但不要为追求短小拆出没有语义的薄包装。
- `unwrap()` 和 `expect()` 会 panic；库函数通常返回 `Result`/`Option` 让调用者决定策略。
- 可使用 `#[must_use]` 标记不应被静默丢弃的自定义返回值或函数结果。
## 练习

实现 `fn clamp(value: i32, min: i32, max: i32) -> i32`，用提前返回处理两端边界，最后用
尾表达式返回中间值。再设计一个非法区间时返回 `Result<i32, &'static str>` 的版本。
