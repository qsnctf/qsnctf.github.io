# Cargo 项目管理
Cargo 是 Rust 的构建系统和包管理器。它以 `Cargo.toml` 描述包及依赖，以 `Cargo.lock`
记录解析后的精确依赖版本，并把构建产物放在 `target/` 中。
## 创建项目
```bash
cargo new calculator --edition 2021
cargo new text-utils --lib --edition 2021
```

第一条创建二进制包，入口为 `src/main.rs`；第二条创建库包，入口为 `src/lib.rs`。
已有目录可在其中使用 `cargo init --edition 2021`。

典型结构如下：

```text
calculator/
|-- Cargo.toml
|-- Cargo.lock
`-- src/
    `-- main.rs
```
## Cargo.toml
```toml
[package]
name = "calculator"
version = "0.1.0"
edition = "2021"

[dependencies]
```

`name` 是包名，`version` 通常遵循语义化版本，`edition` 控制语言 edition。Rust edition
与依赖版本相互独立；不同 edition 的 crate 可以共同参与同一次构建。
添加依赖可执行 `cargo add serde --features derive`（需要当前 Cargo 支持该子命令），或谨慎
编辑清单。库项目通常提交 `Cargo.lock` 与否取决于仓库策略；应用程序一般应提交它。
## 高频命令
```bash
cargo check                       # 快速类型检查，不生成最终可执行文件
cargo build                       # 调试构建
cargo build --release             # 优化构建
cargo run -- arg1 arg2            # 构建并运行，-- 后内容传给程序
cargo test                        # 构建并运行测试
cargo fmt                         # 使用 rustfmt 格式化
cargo clippy --all-targets        # 运行 Clippy
cargo doc --open                  # 构建并打开依赖与本包文档
```

日常反馈循环优先 `cargo check`；真正运行、测试或需要二进制时再 `build`/`run`。调试产物位于
`target/debug/`，发布产物位于 `target/release/`。
## 可运行示例与测试
`src/main.rs`：

```rust
fn double(value: i32) -> i32 {
    value * 2
}

fn main() {
    println!("{}", double(21));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn doubles_positive_number() {
        assert_eq!(double(4), 8);
    }
}
```

依次执行 `cargo check`、`cargo run` 和 `cargo test`。可用 `cargo test test_name` 按名称过滤，
用 `cargo test -- --nocapture` 显示测试捕获的标准输出。
## 工程说明

- `cargo clean` 会删除整个 `target/`，通常不是解决编译错误的第一选择。
- 不要手工编辑 `Cargo.lock`；依赖更新使用 `cargo update`，并审查锁文件变化。
- `cargo fmt --check` 只检查格式，适合 CI；本地修复使用 `cargo fmt`。
- `-D warnings` 会把 Clippy 警告视为失败，适合规则稳定的项目，但升级工具链时需审查新 lint。
- `cargo doc --no-deps` 只生成当前包文档，速度更快。

## 练习

1. 创建 edition 2021 的库包，实现 `pub fn add(a: i32, b: i32) -> i32`。
2. 添加两个单元测试，执行 `cargo fmt`、`cargo clippy` 和 `cargo test`。
3. 用 `cargo doc --open` 检查公开函数是否出现在生成文档中。
