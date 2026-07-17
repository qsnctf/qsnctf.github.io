# 异步编程

Rust 的 `async`/`.await` 提供构造和组合异步计算的语言能力。标准库定义 `Future`、任务唤醒
接口及基础类型，但不提供通用 executor、异步网络栈或计时器；实际应用通常选择第三方运行时。

## `Future`、`async fn` 与 `.await`

`async fn` 调用时不会立即执行函数体，而是返回实现 `Future` 的匿名值。future 被 executor
反复轮询，返回 `Poll::Pending` 时应安排将来通过 `Waker` 再次唤醒。

下面的程序仅使用标准库，可用 `rustc --edition=2021 main.rs` 编译。它构造 future 后释放，
用于说明“调用异步函数不等于运行它”。

```rust
use std::future::Future;
async fn add_one(value: u32) -> u32 {
    value + 1
}
fn accepts_future<F>(future: F)
where
    F: Future<Output = u32>,
{
    drop(future);
}
fn main() {
    accepts_future(add_one(41));
}
```

`.await` 只能出现在异步上下文中，它在当前 future 尚未就绪时让出执行权，而不是阻塞整个
executor 线程。

```rust
async fn add_one(value: u32) -> u32 {
    value + 1
}

async fn calculate() -> u32 {
    let first = add_one(10).await;
    add_one(first).await
}
```

这段函数同样可编译，但要取得结果仍需 executor 驱动最外层 future。

## 运行时中立的结构

业务逻辑可保持为普通同步函数，异步边界负责等待 I/O，再把数据交给纯逻辑处理。库如果不
需要直接创建任务、套接字或计时器，应避免把某个运行时类型渗透到公共 API。

```rust
fn parse_count(text: &str) -> Result<u64, std::num::ParseIntError> {
    text.trim().parse()
}

async fn transform(input: String) -> Result<u64, std::num::ParseIntError> {
    parse_count(&input)
}
```

稳定 Rust 已支持在 Trait 中使用 `async fn`，这与 Edition 选择无关。不过公共 Trait 的异步
方法仍需考虑返回 Future 的 `Send` 等边界是否能由下游表达，以及包含异步方法的 Trait 默认
不能直接用作 `dyn Trait`。库也可接收返回 Future 的回调，公开 API 前应评估生命周期、对象
安全和运行时耦合。

## Tokio 示例：第三方运行时

Tokio 不是标准库。以下是一个独立 Cargo 项目的最小配置：

```toml
[package]
name = "async-demo"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1", features = ["macros", "rt-multi-thread", "time"] }
```

```rust
use std::time::Duration;

async fn job(id: u32) -> u32 {
    tokio::time::sleep(Duration::from_millis(20)).await;
    id * id
}

#[tokio::main]
async fn main() {
    let (left, right) = tokio::join!(job(2), job(3));
    println!("{left}, {right}");
}
```

`#[tokio::main]` 宏创建并启动 Tokio runtime。`join!` 在同一任务内并发轮询多个 future；
`spawn` 创建可独立调度的任务，并通常要求 future 为 `Send + 'static`。

## 阻塞、取消与资源

异步任务中调用阻塞文件 I/O、长时间计算或线程锁会占住 executor 工作线程。应使用运行时的
专用阻塞任务接口，或把 CPU 密集工作交给受控线程池。标准库 `File` 是阻塞 API，不会因放入
`async fn` 自动变为异步。

Rust future 通常通过丢弃来取消。取消可能发生在任意 `.await` 处，因此跨等待点更新多个资源
时要考虑取消安全、临时文件、锁和外部事务。不要在异步互斥锁持有期间执行不相关等待。

## 常见错误与工程注意事项
- 忘记 `.await` 常得到“未使用的 future”警告，操作实际上没有执行。
- 不要编写忙循环反复轮询；正确实现必须通过 `Waker` 通知 executor。
- 并发不是并行；单线程 executor 也可并发处理大量等待 I/O 的任务。
- 为外部请求设置超时、并发上限和背压，避免无限创建任务。
- runtime、网络和计时器 API 来自具体生态 crate，文档中应明确依赖与版本策略。
- 手写 `Future::poll` 常涉及 pinning；普通业务优先使用 `async fn` 和成熟组合工具。

延伸阅读：[并发编程](concurrency.md)、[文件与 I/O](files-and-io.md)、
[智能指针](smart-pointers.md)、[宏](macros.md)。
