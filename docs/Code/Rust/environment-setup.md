# Rust 环境搭建
官方推荐使用 `rustup` 安装和管理 Rust。它可以并存 stable、beta、nightly 工具链，
本教程只要求当前 stable，并使用 Rust 2021 edition 编写 Cargo 项目。
## 安装 rustup
Linux、macOS 以及装有常见 Unix 工具的环境可运行官方安装脚本：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

阅读提示后选择默认安装，再重新打开终端。不要从不可信镜像执行远程脚本；受管设备应遵循
组织的软件分发策略。

Windows 可从 <https://rustup.rs/> 下载 `rustup-init.exe`。默认 MSVC 工具链还需要
Microsoft C++ Build Tools 和 Windows SDK；安装器缺少前置组件时会给出链接。

也可使用系统包管理器，但发行版中的 Rust 可能较旧，而且 `rustup` 与系统包混装容易造成
PATH 混淆。除非有明确运维要求，开发环境优先只保留一种来源。
## 验证安装
在 PowerShell、CMD、Bash 或 Zsh 中都可执行：

```bash
rustup --version
rustc --version
cargo --version
rustup show active-toolchain
```

前三条分别验证管理器、编译器和项目工具。`rustup --version` 显示的是 rustup 自身版本，
不是 Rust 编译器版本。若提示找不到命令，先重开终端并检查 PATH 中是否有 Cargo bin 目录：

```text
Linux/macOS: $HOME/.cargo/bin
Windows:     %USERPROFILE%\.cargo\bin
```
## 选择并更新 stable
```bash
rustup default stable
rustup update stable
rustup component add rustfmt clippy
```

`rustfmt` 负责格式化，Clippy 提供更深入的静态检查。查看已安装组件：

```bash
rustup component list --installed
```

某个项目需要固定工具链时，可在项目目录执行 `rustup override set stable`，或提交
`rust-toolchain.toml`。学习项目通常无需固定到具体补丁版本。
## 端到端检查

```bash
cargo new rust-check --edition 2021
cd rust-check
cargo check
cargo run
cargo test
```

程序输出 `Hello, world!` 且测试命令成功，即说明编译、链接与执行链路基本正常。
## 编辑器支持

推荐安装实现 Language Server Protocol 的 `rust-analyzer`。VS Code 可安装官方扩展，
其他编辑器也应配置 rust-analyzer，而不是同时启用多个相互竞争的 Rust 语言服务器。

编辑器诊断不能替代命令行验证；提交前仍应运行：

```bash
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test
```

## 常见问题

- Windows 链接错误 `link.exe not found`：补装 MSVC Build Tools，而非重复安装 Rust。
- macOS 链接失败：运行 `xcode-select --install` 安装命令行开发工具。
- Linux 链接器或 C 库缺失：安装发行版的基础构建工具，如 `build-essential`。
- 代理环境下载失败：检查组织代理、证书和 Cargo 配置，不要关闭 TLS 校验规避问题。
- 多版本行为异常：用 `rustup which rustc` 和系统的 PATH 查询命令确认实际可执行文件。

## 检查清单

- `rustc --version` 与 `cargo --version` 均成功。
- active toolchain 是 stable，且 rustfmt、Clippy 已安装。
- 能完成一次 `cargo new`、`cargo check`、`cargo run` 和 `cargo test`。
