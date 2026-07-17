# 面向对象思想与 Rust

Rust 是多范式语言：它支持封装、接口抽象和动态分派，也支持代数数据类型、模式匹配、
泛型与函数式组合。Rust 没有类继承体系，不应强行照搬传统 OOP 结构。

## 封装与不变量

模块边界和字段可见性用于隐藏实现。公开方法应确保对象始终处于有效状态。

```rust
mod account {
    pub struct Account {
        balance: i64,
    }
    impl Account {
        pub fn new() -> Self {
            Self { balance: 0 }
        }

        pub fn deposit(&mut self, amount: i64) -> Result<(), &'static str> {
            if amount <= 0 {
                return Err("amount must be positive");
            }
            self.balance = self.balance.checked_add(amount).ok_or("overflow")?;
            Ok(())
        }
        pub fn balance(&self) -> i64 {
            self.balance
        }
    }
}
fn main() -> Result<(), &'static str> {
    let mut account = account::Account::new();
    account.deposit(100)?;
    println!("{}", account.balance());
    Ok(())
}
```

字段私有不是目的；关键是让非法状态无法通过公共 API 构造。简单数据载体不必机械添加
getter 和 setter。

## trait 与静态分派
trait 描述共享行为，泛型默认采用静态分派，编译器可为具体类型单态化代码。

```rust
trait Area {
    fn area(&self) -> f64;
}
struct Circle { radius: f64 }
impl Area for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
}
fn print_area(shape: &impl Area) {
    println!("{:.2}", shape.area());
}
fn main() {
    print_area(&Circle { radius: 2.0 });
}
```

## trait object 与动态分派
异构集合可使用 `dyn Trait`。`dyn Trait` 是动态大小类型；指向它的 `&dyn Trait`、
`Box<dyn Trait>`、`Rc<dyn Trait>` 或 `Arc<dyn Trait>` 通常是宽指针，包含数据地址和虚表元数据。

```rust
trait Draw { fn draw(&self); }
struct Button(&'static str);
struct Label(&'static str);
impl Draw for Button { fn draw(&self) { println!("[{}]", self.0); } }
impl Draw for Label { fn draw(&self) { println!("{}", self.0); } }
fn main() {
    let widgets: Vec<Box<dyn Draw>> = vec![
        Box::new(Button("保存")),
        Box::new(Label("状态正常")),
    ];
    for widget in &widgets { widget.draw(); }
}
```

并非所有 trait 都可作为 trait object；例如返回 `Self` 且没有 `Self: Sized` 限制的方法会
影响对象安全。类型集合固定时，`enum` 加 `match` 往往更清晰、更易穷尽检查。

## 状态模式及取舍
传统状态模式可令每个状态实现 trait，再由 `Box<dyn State>` 持有当前状态。它适合状态可由
外部扩展、每个状态行为差异很大的系统，但会引入堆分配、动态分派和分散的转移逻辑。

状态集合固定时优先考虑枚举：
```rust
enum State { Draft, Published }
struct Post { state: State, text: String }
impl Post {
    fn publish(&mut self) { self.state = State::Published; }
    fn content(&self) -> &str {
        match self.state { State::Draft => "", State::Published => &self.text }
    }
}
```
还可用不同类型表达状态，使非法转移在编译期不可表示，但这会改变变量类型，不适合所有
容器和运行时流程。选择模式时应以扩展方向、可测试性和状态数量为依据。

## 工程注意事项
- 优先组合而非模拟继承；把能力拆成小 trait，不要制造庞大的“基类接口”。
- 公开 trait 是长期 API 承诺，新增必需方法可能破坏下游实现，可提供合理默认方法。
- 动态分派不是天然较差，但应只在需要运行时多态时承担其间接调用和对象安全约束。
- 内部可变性不是封装的替代品；`RefCell`、`Mutex` 的运行时检查也可能失败或阻塞。
- 领域模型应让所有权和生命周期清晰，而不是把每个对象都包装成共享可变引用。

延伸阅读：[智能指针](smart-pointers.md)、[并发编程](concurrency.md)、
[宏](macros.md)。
