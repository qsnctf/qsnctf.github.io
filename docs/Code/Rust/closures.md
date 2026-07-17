# Rust 闭包

闭包是可捕获周围环境的匿名函数，语法为 `|参数| 表达式` 或 `|参数| { ... }`。闭包常用于[迭代器](./iterators.md)、线程和回调。

## 基本语法与类型推断

```rust
fn apply_twice<F>(mut operation: F, value: i32) -> i32
where
    F: FnMut(i32) -> i32,
{
    let once = operation(value);
    operation(once)
}

fn main() {
    let offset = 3;
    let add = |value: i32| value + offset;
    assert_eq!(apply_twice(add, 1), 7);
}
```

编译器通常能推断参数和返回值。一个闭包实例的参数类型一旦由首次使用确定，不能再用另一种参数类型调用。

## Fn、FnMut 与 FnOnce

三种调用 Trait 描述闭包如何使用捕获值：

| Trait | 捕获值的使用方式 | 调用次数 |
| --- | --- | --- |
| `Fn` | 共享借用，不修改或移出 | 可多次 |
| `FnMut` | 可变借用，可能修改 | 可多次，调用者需持有可变闭包 |
| `FnOnce` | 可能消费捕获值 | 至少可调用一次 |

每个 `Fn` 也满足 `FnMut` 和 `FnOnce`；每个 `FnMut` 也满足 `FnOnce`。函数参数应选择所需的最弱约束，以接受更多调用者。

```rust
fn run_once<F: FnOnce() -> String>(job: F) -> String {
    job()
}

fn main() {
    let mut count = 0;
    let mut increment = || { count += 1; count };
    assert_eq!(increment(), 1); // FnMut

    let message = String::from("finished");
    let consume = || message; // 从环境移出，只有 FnOnce
    assert_eq!(run_once(consume), "finished");
}
```

## move 闭包

`move` 强制闭包按值捕获变量，但不保证变量一定被消费；若类型实现 `Copy`，捕获的是副本。跨线程或返回闭包时常需要 `move`，因为闭包不能借用即将离开作用域的局部值。

```rust
use std::thread;

fn main() {
    let label = String::from("worker");
    let handle = thread::spawn(move || {
        format!("{label} started")
    });
    assert_eq!(handle.join().unwrap(), "worker started");
}
```

闭包有编译器生成的匿名类型，无法直接写出。参数通常使用泛型 `F: Fn(...)`，返回单一闭包可使用 `impl Fn(...)`，异构闭包集合则可使用 `Box<dyn Fn(...)>`。

## 常见错误与工程注意

- 捕获可变引用的闭包本身通常也要声明为 `mut` 才能调用。
- `move` 后原变量可能不可用；若还需要它，应先显式 `clone`，并确认复制成本合理。
- 不要把 `FnOnce` 误写成 `Fn`；消费捕获值的闭包无法重复调用。
- 长期保存闭包会同时延长其捕获资源的生命周期，可能保留大对象、锁或引用。
- `Box<dyn Fn()>` 有堆分配和动态分发；性能敏感且类型固定时优先泛型。
- 多线程闭包还需满足 `Send`，共享数据通常还需 `Sync`；所有权正确不等于并发逻辑正确。

继续阅读：[所有权与借用](./ownership.md)、[生命周期](./lifetimes.md)。
