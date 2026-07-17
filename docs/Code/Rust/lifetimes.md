# Rust 生命周期

生命周期描述引用之间的有效期关系，防止悬垂引用。标注不会延长任何值的实际寿命，也不会改变运行时行为；它只是帮助编译器验证借用关系。

## 何时需要标注

多数局部借用可由编译器推断。函数接收多个引用并返回引用时，编译器可能无法判断返回值来自哪个输入，此时要声明生命周期参数。

```rust
fn longest<'a>(left: &'a str, right: &'a str) -> &'a str {
    if left.len() >= right.len() { left } else { right }
}

fn main() {
    let first = String::from("abcd");
    let second = String::from("xyz");
    let result = longest(&first, &second);
    assert_eq!(result, "abcd");
}
```

这里 `'a` 表示返回引用不会比两个输入中较短的有效期更长。它不是要求两个输入实际存活完全相同的时间。

## 结构体中的引用

结构体保存引用时必须声明引用有效期，使结构体实例不能比被引用数据活得更久。

```rust
#[derive(Debug)]
struct Excerpt<'a> {
    text: &'a str,
}

impl<'a> Excerpt<'a> {
    fn first_word(&self) -> &str {
        self.text.split_whitespace().next().unwrap_or("")
    }
}

fn main() {
    let document = String::from("Rust ownership");
    let excerpt = Excerpt { text: &document };
    assert_eq!(excerpt.first_word(), "Rust");
}
```

若结构体本应独立拥有数据，使用 `String` 通常比给每层都添加生命周期更简单。引用字段适合视图、解析结果或明确绑定到输入的零复制数据。

## 生命周期省略规则

函数签名中的省略主要遵循三条规则：每个输入引用获得独立生命周期；只有一个输入引用时其生命周期赋给所有省略的输出引用；方法若有 `&self` 或 `&mut self`，其生命周期赋给省略的输出引用。

```rust
fn first(text: &str) -> &str { // 等价于 fn first<'a>(text: &'a str) -> &'a str
    text.split(',').next().unwrap_or("")
}

struct Name(String);
impl Name {
    fn as_str(&self) -> &str { &self.0 }
}

fn main() {
    let name = Name(String::from("Ada"));
    assert_eq!(first(name.as_str()), "Ada");
}
```

省略是固定规则，不是编译器凭函数体猜测。规则无法确定输出来源时，必须显式标注或重新设计返回所有权。

## 'static 的正确理解

`&'static str` 表示引用在整个程序运行期间有效，字符串字面量就是典型例子。类型约束 `T: 'static` 表示 `T` 不包含生命周期短于 `'static` 的借用数据；它不表示该值永远存在，也不表示一定是全局变量。

拥有所有权的 `String` 通常满足 `T: 'static`，但它仍会在所有者离开作用域时析构。不要用泄漏内存的方式制造 `'static` 引用来绕过设计问题。

## 常见错误与工程注意

- 不能返回局部 `String` 的 `&str`，因为函数结束后数据被释放；应返回 `String` 或借用输入。
- 给所有引用都写同一个 `'a` 可能建立过强关系，导致借用被不必要地延长。
- `'static` 不是“活得很久”的模糊标签；线程或异步任务要求它时，通常意味着任务不能借用短期栈数据。
- 生命周期错误常源于所有权边界不清；先判断应该拥有、共享还是临时查看数据，再调整标注。
- 自引用结构体在安全 Rust 中较难直接表达，因为移动结构体会改变地址；通常改用索引、拥有数据或专门抽象。
- 生命周期标注不能修复真实悬垂引用，只能描述本来就安全的关系。

继续阅读：[所有权与借用](./ownership.md)、[闭包](./closures.md)、[切片](./slices.md)。
