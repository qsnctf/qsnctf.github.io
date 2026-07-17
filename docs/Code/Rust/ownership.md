# Rust 所有权、移动与借用

所有权让 Rust 在没有垃圾回收器的情况下管理资源。每个值有一个所有者；所有者离开作用域时值被释放；同一时刻只能遵守一组受编译器检查的借用规则。

## 移动与 Copy

赋值或按值传参通常会移动值。移动后旧绑定不能再使用，避免两个变量重复释放同一资源。

```rust
fn consume(text: String) -> usize { text.len() }

fn main() {
    let first = String::from("rust");
    let second = first;
    // println!("{first}"); // 错误：first 已移动
    assert_eq!(consume(second), 4);

    let x = 7;
    let y = x; // i32 实现 Copy，这里复制位模式
    assert_eq!(x + y, 14);
}
```

`Copy` 适用于无需自定义析构且可安全按位复制的小型类型，如整数、布尔值和只含 `Copy` 字段的元组。`String`、`Vec<T>` 和文件句柄不实现 `Copy`。深复制应显式调用 `clone`，使成本可见。

## 共享借用与可变借用

`&T` 允许读取，`&mut T` 允许修改。一个值可以同时有多个共享引用，或有一个可变引用，但不能在同一有效区间混用。

```rust
fn length(text: &str) -> usize { text.len() }
fn append_period(text: &mut String) { text.push('.'); }

fn main() {
    let mut message = String::from("safe");
    let size = length(&message);
    assert_eq!(size, 4);

    append_period(&mut message);
    assert_eq!(message, "safe.");
}
```

引用的有效范围通常到最后一次使用，而非机械地到作用域结尾。这称为非词法生命周期，但编译器仍禁止悬垂引用。

## 重借用

把 `&mut T` 传给函数时，Rust 通常创建临时重借用，而不是永久移动原引用，因此调用结束后还能继续使用它。

```rust
fn increment(value: &mut i32) { *value += 1; }

fn main() {
    let mut number = 1;
    let reference = &mut number;
    increment(&mut *reference); // 显式重借用
    increment(reference);       // 调用位置也会自动重借用
    assert_eq!(*reference, 3);
}
```

方法调用和参数传递经常自动解引用与重借用。理解这一点有助于区分“引用被移动”和“引用指向的值被暂时借用”。

## 返回所有权还是借用

需要独立长期保存的数据时返回拥有所有权的 `String`、`Vec<T>` 等；仅提供某个输入内部的视图时返回引用，并用[生命周期](./lifetimes.md)描述关系。函数不应返回指向局部变量的引用。

## 常见错误与工程注意

- 值被传入按值参数后再使用会触发“use of moved value”；可改为借用，或确有需要时克隆。
- 持有元素引用时修改 `Vec` 可能导致重新分配，因此借用检查器会拒绝这类代码。
- 不要为了绕过借用错误到处 `clone`；先明确谁应拥有数据、借用应持续多久。
- 锁守卫、文件和网络连接也遵守作用域析构；尽量缩短持有锁与可变借用的范围。
- `Copy` 不是普通“可复制”接口，而是隐式复制语义；有资源身份的类型通常不应实现它。
- 共享所有权可用 `Rc<T>` 或 `Arc<T>`，内部可变性可用 `RefCell<T>` 或锁，但运行时检查与同步成本需要明确。

继续阅读：[切片与字符串切片](./slices.md)、[结构体](./structs.md)。
