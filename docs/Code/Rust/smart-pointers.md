# 智能指针

智能指针是拥有额外语义的类型：它们可管理堆分配、引用计数、内部可变性或自定义清理。
所有权模型仍然有效；智能指针不是绕过借用检查的通用工具。

## `Box<T>`

`Box<T>` 在堆上拥有一个值，适合递归类型、大对象转移和 trait object。

```rust
enum List {
    Node(i32, Box<List>),
    End,
}

fn main() {
    let list = List::Node(1, Box::new(List::Node(2, Box::new(List::End))));
    if let List::Node(value, _) = list {
        println!("{value}");
    }
}
```

`Box` 本身通常只有一个指针大小，但堆分配有成本。不要仅为“看起来像对象”而装箱小值。

## `Deref` 与自动解引用

`Deref` 让智能指针表现得像目标类型的引用，函数调用时可发生 deref coercion。

```rust
use std::ops::Deref;
struct Name(String);
impl Deref for Name {
    type Target = str;
    fn deref(&self) -> &str { &self.0 }
}
fn print_name(name: &str) { println!("{name}"); }
fn main() {
    let name = Name(String::from("Ferris"));
    print_name(&name);
}
```

自定义 `Deref` 应表达自然的智能指针关系，不要用它模拟继承或隐藏昂贵、可能失败的操作。

## `Drop`

`Drop::drop` 在值离开作用域时执行清理。不能直接调用 `value.drop()`；需要提前释放时使用
`std::mem::drop(value)`。析构不能返回错误，因此需要报告失败的资源应提供显式 `close` 或
`flush` 方法，并把 `Drop` 作为最后保障。

## `Rc<T>`、`Arc<T>` 与 `Weak<T>`

`Rc` 是单线程引用计数，`Arc` 是原子引用计数并可跨线程共享。二者默认只提供共享不可变访问，
克隆只增加计数，不会深拷贝内部值。

```rust
use std::rc::{Rc, Weak};
struct Node {
    name: String,
    parent: Weak<Node>,
}
fn main() {
    let root = Rc::new(Node { name: "root".into(), parent: Weak::new() });
    let child = Rc::new(Node {
        name: "child".into(),
        parent: Rc::downgrade(&root),
    });
    if let Some(parent) = child.parent.upgrade() {
        println!("{} -> {}", child.name, parent.name);
    }
}
```

`Weak` 不拥有目标，`upgrade()` 返回 `Option<Rc<T>>`。父节点、缓存和观察者等非拥有关系应
使用 `Weak`，以打破强引用环。

## 引用环

若 A 和 B 通过 `Rc` 强引用彼此，即使外部引用都释放，强计数也不会归零，`Drop` 不会运行。
Rust 的内存安全并不等于绝不泄漏。设计对象图时应明确拥有边方向，并用 `Weak` 表达反向边。

## `RefCell<T>` 与内部可变性

`RefCell` 把借用规则推迟到运行时，适合单线程中外部只持有共享引用但内部确实需要修改的场景。

```rust
use std::cell::RefCell;
use std::rc::Rc;
fn main() {
    let values = Rc::new(RefCell::new(vec![1, 2]));
    Rc::clone(&values).borrow_mut().push(3);
    println!("{:?}", values.borrow());
}
```

同时存在冲突的 `borrow()` 和 `borrow_mut()` 会 panic。应缩短借用守卫的生命周期；需要自行
处理冲突时使用 `try_borrow`。`RefCell` 不是线程安全的，跨线程共享可变状态通常使用
`Arc<Mutex<T>>` 或 `Arc<RwLock<T>>`。

## 选型与注意事项

- 唯一所有权默认用普通值，确需堆间接层时用 `Box`。
- 单线程共享所有权用 `Rc`，跨线程共享所有权用 `Arc`，但先判断能否避免共享。
- `Rc<RefCell<T>>` 灵活却容易形成运行时借用失败和复杂对象图，不应成为默认架构。
- `Arc<T>` 并不会让任意 `T` 自动线程安全，跨线程使用仍要求相应的 `Send`、`Sync` 条件。
- 不要依赖引用计数精确值实现业务协议；临时克隆和弱引用升级都会影响观察结果。

延伸阅读：[并发编程](concurrency.md)、[面向对象思想](object-oriented.md)、
[文件与 I/O](files-and-io.md)。
