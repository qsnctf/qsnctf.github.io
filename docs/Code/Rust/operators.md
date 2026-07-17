# 运算符

Rust 运算符大多要求两侧类型兼容，不会像一些语言那样普遍执行隐式数值转换。运算符语义
还可能由 trait 实现定义，但基本类型具有稳定、明确的行为。

## 算术与赋值

```rust
fn main() {
    let a = 17;
    let b = 5;
    println!("+ {}", a + b);
    println!("- {}", a - b);
    println!("* {}", a * b);
    println!("/ {}", a / b);
    println!("% {}", a % b);

    let mut total = 10;
    total += 3;
    total *= 2;
    println!("total = {total}");
}
```

整数除法向零截断，因此 `17 / 5 == 3`，`-17 / 5 == -3`。整数除以零会 panic；浮点数
除以零按 IEEE 754 产生无穷大或 NaN。

## 比较与逻辑

`==`、`!=` 比较相等性，`<`、`<=`、`>`、`>=` 比较顺序。逻辑运算使用 `&&`、`||`、
`!`，条件必须是 `bool`：

```rust
fn main() {
    let age = 20;
    let has_ticket = true;
    let allowed = age >= 18 && has_ticket;
    println!("allowed = {allowed}");
}
```

`&&` 和 `||` 会短路求值。Rust 不把 `0`、空字符串或空集合隐式视为 `false`。

## 位运算与移位

整数支持 `&`、`|`、`^`、`!`、`<<`、`>>`：

```rust
fn main() {
    let flags: u8 = 0b1010;
    let mask: u8 = 0b0010;
    println!("set = {}", flags & mask != 0);
    println!("left = {:08b}", flags << 1);
}
```

对有符号整数右移通常进行算术右移并保留符号位；处理协议、掩码和序列化时优先明确使用
无符号整数。移位量超出类型位宽应视为错误，不要依赖目标平台偶然行为。

## 溢出行为

固定宽度整数无法表示无限大的值。普通 `+` 等运算在启用溢出检查时会 panic；发布配置
默认通常按二进制补码回绕。不要让正确性依赖构建模式，显式选择所需 API：

```rust
fn main() {
    let value = u8::MAX;
    println!("checked = {:?}", value.checked_add(1));
    println!("wrapping = {}", value.wrapping_add(1));
    println!("saturating = {}", value.saturating_add(1));
    let (result, overflowed) = value.overflowing_add(1);
    println!("overflowing = ({result}, {overflowed})");
}
```

`checked_*` 返回 `Option`，`wrapping_*` 明确回绕，`saturating_*` 钳制到边界，
`overflowing_*` 同时返回结果和是否溢出。

## 常见错误与工程说明

- `1 / 2` 是整数 `0`；需要小数时至少让一个操作数成为浮点数，如 `1.0 / 2.0`。
- 不同整数类型不能直接相加，应先验证范围，再显式转换。
- 浮点数含 NaN，因此只实现部分顺序；不要假设所有浮点值都可安全 `unwrap()` 比较结果。
- `==` 比较浮点计算结果可能受舍入误差影响，工程中常比较可接受误差。
- 位运算优先加括号并写清类型，避免优先级和符号扩展造成误读。

## 练习

实现一个 `u8` 计数器，分别演示检查溢出、回绕和饱和三种策略，并说明哪种适合余额、
环形序号和图像像素累加。
