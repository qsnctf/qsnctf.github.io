# 数据类型与转换

Rust 是静态类型语言。编译器通常能从初始化值和使用方式推断局部类型；存在多种可能时，
需要类型标注或字面量后缀。

## 标量类型

整数类型包括 `i8` 至 `i128`、`u8` 至 `u128`，以及与指针宽度相关的 `isize`、`usize`。
浮点类型是 `f32` 和默认的 `f64`，另有 `bool` 与 Unicode 标量值 `char`。

```rust
fn main() {
    let decimal: i32 = -42;
    let hex = 0xff_u16;
    let grouped = 1_000_000_u64;
    let ratio: f64 = 2.5;
    let enabled: bool = true;
    let symbol: char = '中';

    println!("{decimal} {hex} {grouped} {ratio} {enabled} {symbol}");
}
```

`char` 使用单引号并占 4 字节，可表示一个 Unicode 标量值，但不等同于“用户看到的一个
字符”；组合字符和 emoji 序列可能由多个标量值组成。字符串类型另有所有权和 UTF-8 规则。

## 元组与数组

元组可组合不同类型，数组包含固定数量的同类型元素：

```rust
fn main() {
    let user: (&str, u32, bool) = ("Alice", 30, true);
    let (name, age, active) = user;
    println!("{} {} {}", name, age, active);
    println!("first = {}", user.0);

    let scores: [i32; 4] = [80, 90, 85, 95];
    let zeros = [0_u8; 8];
    println!("score = {}, bytes = {}", scores[2], zeros.len());
}
```

数组长度属于类型的一部分，`[i32; 3]` 与 `[i32; 4]` 是不同类型。运行时越界索引会
panic；若索引来自外部输入，可用 `scores.get(index)` 获得 `Option<&i32>`。

空元组 `()` 称为单元类型，表示没有有意义的返回值。没有显式返回类型的函数默认返回它。

## 推断与转换

Rust 不在不同数值类型间进行普遍隐式转换。`as` 可用于明确的原始类型转换：

```rust
fn main() {
    let small: u16 = 500;
    let wide: u32 = u32::from(small);
    let narrowed = u8::try_from(small);

    println!("wide = {wide}");
    println!("narrowed = {narrowed:?}");
    println!("as u8 = {}", small as u8);
}
```

这里 `u32::from` 是不会丢失信息的转换；`u8::try_from` 检查范围并返回 `Result`；
`small as u8` 会截断高位。外部数据、长度、金额和安全边界应优先使用检查转换。

字符串解析也是显式转换：

```rust
fn main() {
    let port: u16 = "8080".parse().expect("端口必须是 u16");
    println!("port = {port}");
}
```

## 常见错误与工程说明

- `usize` 适合索引和集合长度，但跨平台序列化不应依赖其位宽。
- 无类型约束的整数字面量通常推断为 `i32`，浮点字面量通常为 `f64`。
- `as` 可能截断、回绕式重解释范围或损失浮点精度，语法简短不代表转换安全。
- 金额不要用二进制浮点直接表示最小货币单位，可使用整数或经过评估的十进制定点类型。
- `NaN != NaN`，并且无穷大也是合法浮点值；处理外部浮点输入时检查 `is_finite()`。

## 练习

将字符串 `"255"` 解析为 `u16`，分别尝试安全转换为 `u8` 和把 `256_u16` 转为 `u8`。
打印结果并解释 `TryFrom` 与 `as` 的差异，再用 `get` 安全访问一个数组。
