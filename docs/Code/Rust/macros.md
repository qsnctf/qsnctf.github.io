# 宏

Rust 宏在编译期生成语法。宏适合减少重复结构、实现可变参数式接口或构造领域专用语法，
但它不是普通函数的替代品：宏更难调试，错误信息和工具支持也可能更复杂。

## 声明宏 `macro_rules!`

声明宏通过模式匹配输入 token，并展开为 Rust 代码。

```rust
macro_rules! make_vector {
    ($($value:expr),* $(,)?) => {{
        let mut result = Vec::new();
        $(result.push($value);)*
        result
    }};
}

fn main() {
    let numbers = make_vector![1, 2, 3,];
    println!("{numbers:?}");
}
```

`$value:expr` 捕获表达式，`$(...)*` 表示重复零次或多次，分隔符逗号写在重复结构中。
`$(,)?` 允许可选的尾逗号。双层花括号让展开内部形成独立块并返回最后一个表达式。

## 多个匹配分支

宏可按不同输入形式展开：

```rust
macro_rules! log_value {
    ($value:expr) => {
        println!("{} = {:?}", stringify!($value), &$value);
    };
    ($label:literal, $value:expr) => {
        println!("{}: {:?}", $label, &$value);
    };
}

fn main() {
    let answer = 42;
    log_value!(answer);
    log_value!("结果", answer + 1);
}
```

宏输入不是运行时值，而是 token tree。片段说明符包括 `expr`、`ident`、`ty`、`pat`、
`item`、`stmt`、`path` 和 `tt`。应尽可能选具体片段类型，避免用 `tt` 接收任意结构后产生
难以理解的匹配失败。

## 展开次数与所有权

宏可能重复使用参数。若参数有副作用，重复展开会重复执行；若值被移动，多次使用还会导致
编译错误。需要只求值一次时，在展开块中先绑定临时变量。

```rust
macro_rules! twice {
    ($value:expr) => {{
        let value = $value;
        value + value
    }};
}

fn main() {
    println!("{}", twice!(20 + 1));
}
```

这个宏仍要求结果类型支持相加，并且绑定后的值可被相应方式使用；宏不能隐藏真实的类型和
所有权约束。

## 卫生性与名称解析

Rust 宏具有卫生性：宏内部引入的普通局部绑定不会意外捕获调用方同名局部变量。宏中引用
当前 crate 的项目时可使用 `$crate`，这样导出宏被其他 crate 调用时仍能正确解析。

卫生性不是完全隔离。传入的标识符会在调用上下文解析，公开宏引用的项目还涉及可见性。
不要依赖展开后的隐式导入；优先写完整路径，例如 `::std::collections::HashMap`。

## 过程宏的类别

过程宏接收并返回 token 流，必须定义在具有 `proc-macro = true` 的独立 crate 中。稳定 Rust
有三类过程宏：

- 派生宏：`#[derive(MyTrait)]`，为结构体或枚举生成实现。
- 属性宏：`#[route(...)]`，转换被标注的项目。
- 函数式过程宏：`sql!(...)`，以类似函数调用的形式生成语法。

过程宏生态通常使用第三方 `syn`、`quote` 等 crate 解析和生成代码；它们不是标准库。
过程宏在编译器中运行，应像构建脚本一样审查依赖和输入，不应执行不必要的网络或文件操作。

## 限制与工程建议

- 能用函数、泛型、trait 或 `const` 表达时优先使用语言结构。
- 宏展开必须产生语法正确的代码，不能像文本预处理器那样任意拼接标识符。
- 为宏覆盖空输入、尾逗号、类型错误和表达式副作用等测试场景。
- 使用 `cargo expand` 可辅助观察展开，但它是第三方工具，不属于 Cargo 内置稳定命令。
- 公开宏应提供小而明确的语法，错误尽量靠近调用位置，必要时使用 `compile_error!`。

延伸阅读：[面向对象思想](object-oriented.md)、[集合与字符串](collections-and-strings.md)、
[异步编程](async-programming.md)。
