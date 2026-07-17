# Rust 包、Crate 与模块

Rust 用 Cargo 管理包。包、crate、模块和工作空间处在不同层级：Cargo 负责构建单元，模块系统负责代码中的名称与可见性。

## 基本术语

| 名称 | 含义 |
| --- | --- |
| package | 含一个 `Cargo.toml` 的发布和构建单位 |
| crate | 一次编译形成的库或二进制目标 |
| module | crate 内组织路径、作用域与可见性的单元 |
| workspace | 共享锁文件和目标目录的多个 package 集合 |

一个 package 最多有一个库 crate，可有多个二进制 crate。默认 `src/lib.rs` 是库根，`src/main.rs` 是同名二进制根，`src/bin/*.rs` 可定义额外二进制。

## 定义模块与路径

```rust
mod network {
    pub mod protocol {
        pub fn version() -> &'static str { "1.0" }
    }

    fn private_check() -> bool { true }

    pub fn ready() -> bool {
        private_check()
    }
}

fn main() {
    assert!(crate::network::ready());
    assert_eq!(network::protocol::version(), "1.0");
}
```

路径可从 `crate` 根开始，也可使用相对路径、`self` 或 `super`。父模块不能默认访问子模块私有项，但子模块可以访问祖先模块中的项。

## 文件模块

Rust 2021 常见布局如下：

```text
src/
├── lib.rs
├── config.rs
└── server/
    ├── mod.rs
    └── http.rs
```

在 `lib.rs` 写 `pub mod config;` 和 `pub mod server;`，在 `server/mod.rs` 写 `pub mod http;`。也可使用 `server.rs` 配合 `server/http.rs`；同一模块不要同时创建 `server.rs` 与 `server/mod.rs`。

## pub、use 与再导出

`pub` 使项目可从父级路径访问，但字段和子模块仍需分别公开。`use` 只把路径引入当前作用域，不会自动改变可见性；`pub use` 可建立稳定的公开入口。

```rust
mod api {
    pub mod model {
        pub struct Request { pub id: u64 }
    }
    pub use model::Request;
}

use api::Request;

fn main() {
    let request = Request { id: 7 };
    assert_eq!(request.id, 7);
}
```

## Cargo 与工作空间基础

常用命令是 `cargo new`、`cargo check`、`cargo test`、`cargo run` 和 `cargo build --release`。虚拟工作空间根可写：

```toml
[workspace]
resolver = "2"
members = ["app", "core"]
```

成员之间仍需在各自 `Cargo.toml` 声明路径依赖，例如 `core = { path = "../core" }`。工作空间不会让 crate 自动互相可见。

## 常见错误与工程注意

- `pub` 不会递归公开内部所有内容；API 的每一段路径都必须可访问。
- `use` 的相对位置会影响解析，库内路径优先写清楚 `crate::...`，减少移动代码后的歧义。
- 不要用深层模块路径直接暴露内部布局；可通过 `pub use` 提供较稳定的公共门面。
- crate 名在 Rust 路径中会把连字符转换为下划线，例如 `my-lib` 通过 `my_lib` 引用。
- 工作空间统一依赖解析与构建缓存，但发布版本、特性和 package 元数据仍需分别管理。
- 模块应围绕职责和封装划分，不必机械地“一种类型一个文件”。

继续阅读：[结构体](./structs.md)、[错误处理](./error-handling.md)。
