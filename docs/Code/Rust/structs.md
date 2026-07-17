# Rust 结构体与方法

结构体把相关数据组织为具名类型。Rust 支持具名字段结构体、元组结构体和无字段的单元结构体，常结合 `impl` 定义行为。

## 定义与构造

```rust
#[derive(Debug, Clone, PartialEq)]
struct User {
    name: String,
    active: bool,
    login_count: u64,
}

fn build_user(name: String) -> User {
    User { name, active: true, login_count: 0 }
}

fn main() {
    let user = build_user(String::from("Ada"));
    assert_eq!(user.name, "Ada");
    println!("{user:?}");
}
```

字段初始化简写要求变量名与字段名相同。`derive` 可让编译器实现常见 Trait，但应只派生符合领域语义的能力。

## 更新语法与移动

```rust
#[derive(Debug)]
struct Config { host: String, port: u16, enabled: bool }

fn main() {
    let base = Config {
        host: String::from("localhost"), port: 8080, enabled: true,
    };
    let production = Config {
        host: String::from("service.internal"),
        ..base
    };
    assert_eq!(production.port, 8080);
    // host 已显式提供，剩余字段都是 Copy，因此 base 仍完整可用。
    assert_eq!(base.host, "localhost");
    assert!(base.enabled);
}
```

`..base` 会对未显式填写的字段执行移动或复制，并不是“继承”。若移动了非 `Copy` 字段，原结构体将不能作为整体继续使用。

## 解构

模式可以提取、忽略或重命名字段：

```rust
struct Point { x: i32, y: i32 }

fn main() {
    let point = Point { x: 3, y: 4 };
    let Point { x: horizontal, y } = point;
    assert_eq!(horizontal + y, 7);
}
```

匹配借用值时可通过模式得到引用，避免把字段移出。相关模式语法见[枚举与模式匹配](./enums.md)。

## 方法与关联函数

```rust
struct Rectangle { width: u32, height: u32 }

impl Rectangle {
    fn new(width: u32, height: u32) -> Self { Self { width, height } }
    fn area(&self) -> u32 { self.width * self.height }
    fn scale(&mut self, factor: u32) { self.width *= factor; self.height *= factor; }
    fn into_tuple(self) -> (u32, u32) { (self.width, self.height) }
}

fn main() {
    let mut rectangle = Rectangle::new(3, 4);
    assert_eq!(rectangle.area(), 12);
    rectangle.scale(2);
    assert_eq!(rectangle.into_tuple(), (6, 8));
}
```

`&self` 只读借用，`&mut self` 可修改，`self` 消费实例。没有 `self` 参数的 `new` 是关联函数，并非语言特殊的构造器。

## 常见错误与工程注意

- 结构体字段的可变性来自整个绑定：必须写 `let mut value`，Rust 不支持只把某个字段声明为可变。
- 从结构体移出一个 `String` 字段会造成部分移动，之后不能再整体借用该结构体。
- 不要把所有字段都设为 `pub`；用构造函数维持不变量，用方法暴露稳定接口。
- 大型结构体按值传参会移动而非深复制，但 API 是否应消费所有权仍需按语义决定。
- `Default` 适合确有合理默认值的类型，不要用虚假默认值掩盖必填配置。
- 将领域状态编码成结构体与[枚举](./enums.md)，通常比布尔标志组合更易维护。

继续阅读：[泛型与 Trait](./generics-and-traits.md)、[模块与包](./modules.md)。
