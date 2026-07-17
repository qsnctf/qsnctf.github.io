# Rust 简介

Rust 是一门强调内存安全、并发安全与可预测性能的系统编程语言。它不依赖垃圾回收器，
而是通过所有权、借用和生命周期在编译期约束资源使用。

## 适合解决什么问题

- 命令行工具、网络服务、嵌入式程序和操作系统组件。
- 对延迟、内存占用或故障隔离有明确要求的基础设施。
- 希望用强类型和编译器检查降低空指针、数据竞争等风险的应用。

Rust 不能自动消除所有缺陷：业务逻辑错误、死锁、资源耗尽以及 `unsafe` 中的错误仍需工程控制。

## 工具链与编译模型

日常开发主要使用三个命令：

- `rustup` 管理 Rust 工具链和组件。
- `rustc` 编译单个 Rust 源文件。
- `cargo` 管理项目、依赖、构建、测试和文档。

Rust 源文件通常以 `.rs` 结尾。程序入口是 `main` 函数：

```rust
fn main() {
    println!("Hello, Rust!");
}
```

可直接编译运行：

```bash
rustc hello.rs
./hello             # Linux、macOS
.\hello.exe         # Windows PowerShell
```

实际项目优先使用 Cargo，环境安装见[环境搭建](environment-setup.md)，项目命令见
[Cargo 项目管理](cargo.md)。

## 第一个 Cargo 程序

```bash
cargo new hello-rust --edition 2021
cd hello-rust
cargo run
```

`cargo new` 会创建 `Cargo.toml` 和 `src/main.rs`。示例使用 Rust 2021 edition；edition
控制部分语法和兼容性规则，不等同于编译器版本，也不会阻止使用稳定工具链中的新 API。

将 `src/main.rs` 改为：

```rust
fn main() {
    let language = "Rust";
    let year = 2015;
    println!("{language} 1.0 发布于 {year} 年");
}
```

这是完整可运行程序。`let` 创建绑定，字符串字面量类型是 `&str`，`println!` 是宏，
末尾的 `!` 表示它不是普通函数调用。

## Rust 的核心思维

1. 值有明确的所有者，所有者离开作用域时通常自动释放资源。
2. 默认绑定不可变，需要修改时显式写 `mut`。
3. `Result` 和 `Option` 显式表达失败与缺失，而不是依赖异常或空指针。
4. 编译错误通常包含原因、位置和修复建议，应先读第一条根因错误。

## 常见误区

- 不要一开始绕过借用检查器；先理解值由谁拥有、借用持续多久。
- 不要把 `clone()` 当作通用修复，它可能隐藏数据流设计问题和额外分配。
- 学习示例中的 `unwrap()` 适合快速暴露失败，生产代码应根据上下文传播或处理错误。
- `cargo run` 默认是调试构建；性能测量应使用 `cargo run --release`。

## 入门检查

- 能解释 `rustc`、`cargo` 与 `rustup` 的职责。
- 能创建并运行一个 edition 2021 的 Cargo 二进制项目。
- 能区分编译期错误、运行时错误和业务逻辑错误。
- 尝试修改输出文本，并用 `cargo check` 在不生成最终可执行文件的情况下检查代码。
