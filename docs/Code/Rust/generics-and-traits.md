# Rust 泛型与 Trait
泛型让代码适用于多种具体类型，Trait 定义共享行为。编译器通常通过单态化生成具体代码，获得静态分发性能；Trait 对象则提供运行时动态分发。

## 泛型函数与类型
```rust
fn largest<T: Ord + Copy>(values: &[T]) -> Option<T> {
    values.iter().copied().max()
}

#[derive(Debug)]
struct Pair<T> { left: T, right: T }

impl<T> Pair<T> {
    fn new(left: T, right: T) -> Self { Self { left, right } }
}

fn main() {
    assert_eq!(largest(&[3, 8, 2]), Some(8));
    let pair = Pair::new("left", "right");
    assert_eq!(pair.left, "left");
    assert_eq!(pair.right, "right");
}
```

约束可写在参数后，也可用 `where` 子句提高复杂签名的可读性。不要无理由要求 `Clone`、`Copy` 或 `'static`，过强约束会排除合法类型。

## 定义和实现 Trait
```rust
trait Summary {
    fn title(&self) -> &str;
    fn summarize(&self) -> String {
        format!("标题: {}", self.title())
    }
}

struct Article { title: String }

impl Summary for Article {
    fn title(&self) -> &str { &self.title }
}

fn print_summary<T>(item: &T)
where
    T: Summary,
{
    println!("{}", item.summarize());
}

fn main() {
    let article = Article { title: String::from("Rust") };
    print_summary(&article);
}
```

`impl Summary` 参数是泛型约束的简写。返回位置的 `impl Trait` 隐藏单一具体返回类型，调用者只知道它实现指定 Trait。

```rust
fn numbers() -> impl Iterator<Item = i32> {
    (1..=3).map(|value| value * 2)
}

fn main() { assert_eq!(numbers().sum::<i32>(), 12); }
```

不同控制流分支不能用返回位置 `impl Trait` 返回不同具体类型。需要异构值时可使用枚举，或使用 Trait 对象。

## dyn Trait 与动态分发
```rust
trait Draw { fn draw(&self) -> String; }
struct Button;
impl Draw for Button { fn draw(&self) -> String { String::from("button") } }

fn render(items: &[Box<dyn Draw>]) -> Vec<String> {
    items.iter().map(|item| item.draw()).collect()
}

fn main() {
    let items: Vec<Box<dyn Draw>> = vec![Box::new(Button)];
    assert_eq!(render(&items), vec!["button"]);
}
```

`dyn Trait` 允许同一集合保存不同具体类型，代价通常包括指针间接访问、可能的堆分配和无法内联。并非所有 Trait 都能构成 Trait 对象，方法签名需满足对象安全规则。

## 孤儿规则与一致性

实现 `impl Trait for Type` 时，Trait 或 Type 至少有一个必须由当前 crate 定义。这一孤儿规则保证整个依赖图中实现一致，避免两个 crate 对同一外部类型提供冲突实现。

需要为外部类型实现外部 Trait 时，可创建本地新类型包装它，即 newtype 模式。不要期待通过类型别名绕过规则，类型别名不会创建新类型。

## 常见错误与工程注意

- 泛型参数未被字段使用会报错；类型状态设计可使用 `PhantomData<T>`，但需理解其所有权含义。
- Trait 方法不在作用域时可能无法调用，需要通过 `use` 引入对应 Trait。
- 过度使用 Trait 对象会隐藏具体能力和错误类型；同构且性能敏感的路径优先泛型。
- 返回 `impl Trait` 不是任意类型联合，而是编译期确定的一个具体类型。
- blanket implementation 会影响未来可实现空间，公开库添加前需考虑一致性冲突。
- API 约束应表达实际操作需求，例如只比较就要求 `Ord`，不要图方便要求无关 Trait。

继续阅读：[生命周期](./lifetimes.md)、[迭代器](./iterators.md)。
