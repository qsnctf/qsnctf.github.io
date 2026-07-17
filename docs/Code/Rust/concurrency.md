# 并发编程

Rust 通过所有权、`Send` 和 `Sync` 在编译期排除大量数据竞争，但逻辑竞态、死锁、饥饿和
错误的关闭协议仍需工程设计。标准库提供线程、通道和同步原语。

## 创建线程与 `move`

`thread::spawn` 的闭包可能在线程结束前离开当前作用域，因此通常需要取得捕获值的所有权。

```rust
use std::thread;
fn main() {
    let values = vec![1, 2, 3];
    let handle = thread::spawn(move || values.into_iter().sum::<i32>());

    match handle.join() {
        Ok(sum) => println!("sum={sum}"),
        Err(_) => eprintln!("worker panicked"),
    }
}
```

`move` 移动捕获，不等于深拷贝。线程 panic 会由 `join` 返回；忽略句柄可能让主线程在任务
完成前退出，也会丢失失败信息。

## scoped threads

稳定的 `thread::scope` 允许线程借用局部数据，因为作用域保证退出前完成所有子线程。

```rust
use std::thread;

fn main() {
    let numbers = [1, 2, 3, 4, 5, 6];
    thread::scope(|scope| {
        let left = scope.spawn(|| numbers[..3].iter().sum::<i32>());
        let right = scope.spawn(|| numbers[3..].iter().sum::<i32>());
        println!("{}", left.join().unwrap() + right.join().unwrap());
    });
}
```

借用被作用域约束，不需要为只读数据强行使用 `Arc`。

## 通道传递消息

`std::sync::mpsc` 是多生产者、单消费者通道。克隆 `Sender` 可增加生产者；所有发送端释放后，
接收迭代结束。

```rust
use std::sync::mpsc;
use std::thread;
fn main() {
    let (tx, rx) = mpsc::channel();
    for id in 0..3 {
        let tx = tx.clone();
        thread::spawn(move || tx.send(id * id).unwrap());
    }
    drop(tx);
    for value in rx {
        println!("{value}");
    }
}
```

无界通道可能因生产快于消费而耗尽内存；需要背压时使用 `sync_channel`。发送或接收失败通常
表示另一端已关闭，应成为正常关闭协议的一部分，而不是一律 panic。

## `Arc<Mutex<T>>`

`Arc` 提供线程安全共享所有权，`Mutex` 提供互斥可变访问。

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0_u64));
    let mut handles = Vec::new();
    for _ in 0..4 {
        let counter = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            for _ in 0..1_000 { *counter.lock().unwrap() += 1; }
        }));
    }
    for handle in handles { handle.join().unwrap(); }
    println!("{}", *counter.lock().unwrap());
}
```

持锁范围应尽量短，不要在锁内执行慢 I/O 或调用未知回调。线程持锁 panic 会使标准库
`Mutex` 中毒；`lock()` 返回 `PoisonError`，应用应按数据是否仍可恢复决定策略。

## `Send`、`Sync` 与死锁

`Send` 表示值可安全转移到另一线程，`Sync` 表示 `&T` 可在线程间共享。多数类型自动获得这些
标记 trait；`Rc`、`RefCell` 不是线程安全类型，因此不能用它们绕过并发约束。

Rust 不会阻止死锁。多个锁必须建立统一获取顺序，避免持锁等待通道消息，也不要假设
`try_lock` 能修复协议缺陷。共享状态复杂时，消息传递或单所有者任务通常更易推理。

## 工程注意事项

- 并发不保证加速；小任务的线程创建、调度和同步成本可能更高。
- 为线程设置明确的启动、停止、超时和错误汇报协议。
- 原子类型适合简单计数或标志，但内存顺序选择错误会产生隐蔽缺陷。
- 测试应包含高并发和关闭路径，但测试通过不能证明不存在竞态或死锁。

延伸阅读：[智能指针](smart-pointers.md)、[异步编程](async-programming.md)、
[文件与 I/O](files-and-io.md)。
