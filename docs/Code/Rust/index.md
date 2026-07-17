# Rust 教程

Rust 是面向系统编程的静态类型语言，强调内存安全、零成本抽象和并发安全。它不依赖垃圾回收器，而是通过所有权、借用和生命周期在编译期管理资源，适合命令行工具、网络服务、嵌入式程序、WebAssembly 以及对性能和可靠性要求较高的软件。

本教程以稳定版 Rust 和 Cargo 的 **2021 Edition** 为教学基线。Rust 版本与 Edition 是两个不同概念：工具链可以持续升级，Edition 则通过 `Cargo.toml` 控制少量不兼容语法迁移。新项目可按团队支持范围选择更新 Edition，但应以实际 `rustc` 和依赖兼容性为准。

## 学习路线

### 第一阶段：工具链与基础语法

1. [Rust 简介](introduction.md)
2. [Rust 环境搭建](environment-setup.md)
3. [Cargo 教程](cargo.md)
4. [Rust 输出到命令行](command-line-output.md)
5. [Rust 基础语法](basic-syntax.md)
6. [Rust 运算符](operators.md)
7. [Rust 数据类型](data-types.md)
8. [Rust 注释](comments.md)
9. [Rust 函数](functions.md)
10. [Rust 条件语句](conditionals.md)
11. [Rust 循环](loops.md)

### 第二阶段：所有权与类型抽象

1. [Rust 迭代器](iterators.md)
2. [Rust 闭包](closures.md)
3. [Rust 所有权](ownership.md)
4. [Rust Slice（切片）类型](slices.md)
5. [Rust 结构体](structs.md)
6. [Rust 枚举类](enums.md)
7. [Rust 组织管理](modules.md)
8. [Rust 错误处理](error-handling.md)
9. [Rust 泛型与特性](generics-and-traits.md)
10. [Rust 生命周期](lifetimes.md)

### 第三阶段：工程与高级能力

1. [Rust 文件与 IO](files-and-io.md)
2. [Rust 集合与字符串](collections-and-strings.md)
3. [Rust 面向对象](object-oriented.md)
4. [Rust 并发编程](concurrency.md)
5. [Rust 宏](macros.md)
6. [Rust 智能指针](smart-pointers.md)
7. [Rust 异步编程](async-programming.md)

## 第一个项目

安装工具链后创建项目：

```bash
cargo new --edition 2021 hello-rust
cd hello-rust
cargo run
```

`src/main.rs`：

```rust
fn main() {
    let language = "Rust";
    println!("Hello, {language}!");
}
```

Cargo 负责项目布局、依赖解析、编译、测试和文档生成。日常开发建议形成以下检查闭环：

```bash
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test
cargo build --release
```

## 核心心智模型

### 所有权不是手工内存管理

Rust 值通常在所有者离开作用域时自动释放。开发者不直接调用 `free`，而是通过所有权转移、共享借用 `&T`、可变借用 `&mut T` 和智能指针表达资源关系。借用检查器拒绝悬垂引用、数据竞争和部分迭代器失效问题。

### `Result` 是普通类型

可恢复错误通常使用 `Result<T, E>` 返回，而不是依赖异常。`?` 运算符用于传播错误，但公共接口仍应选择有意义的错误类型并补充上下文。不可恢复的程序不变量被破坏时才考虑 `panic!`。

### Trait 表达共享行为

Rust 没有传统类继承。结构体和枚举保存数据，`impl` 定义方法，Trait 定义共享能力；泛型提供静态分派，`dyn Trait` 提供动态分派。应根据 API 是否需要异构集合、二进制大小和性能选择抽象方式。

### 安全 Rust 与 `unsafe`

大多数程序可以只使用安全 Rust。`unsafe` 不会关闭所有检查，它只允许执行解引用裸指针、调用不安全函数等少数额外操作。使用时必须把不变量封装在小范围、可审计的安全接口后，并通过测试、Miri 或 Sanitizer 等工具验证假设。

## CTF 与安全方向

Rust 可用于编写高性能解题工具、协议解析器和二进制处理程序，也越来越常见于 Reverse 题目。学习时应重点理解：

- `String`、`&str`、`Vec<u8>` 与字节切片的区别。
- 整数溢出在调试和发布构建中的策略，以及显式检查 API。
- 所有权、Trait、闭包和迭代器如何影响反编译后的控制流。
- panic、边界检查、符号改编和泛型单态化在二进制中的表现。
- `unsafe`、FFI、依赖供应链和不可信输入解析仍可能引入安全问题。

安全与 CTF 实验只应在自有程序、赛事附件和明确授权环境中进行。

## 学完后的目标

完成本系列后，应能够：

- 使用 rustup、rustc 和 Cargo 创建、检查、测试与发布项目。
- 准确解释移动、借用、切片、生命周期和智能指针。
- 使用结构体、枚举、泛型、Trait、迭代器和闭包设计接口。
- 用 `Result`、文件 API、集合和字符串处理真实输入。
- 编写线程并发程序，并理解异步运行时的职责边界。
- 阅读宏调用和模块结构，识别常见所有权及并发错误。

下一篇：[Rust 简介](introduction.md)。
