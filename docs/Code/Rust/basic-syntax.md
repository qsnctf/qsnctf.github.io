# 基础语法

Rust 使用花括号组织代码块，语句通常以分号结束。编译器会推断许多局部类型，但函数签名
等接口位置通常要求显式类型。

## 绑定与可变性

`let` 创建变量绑定，默认不可变；确实需要原地修改时添加 `mut`：

```rust
fn main() {
    let language = "Rust";
    let mut count = 1;
    count += 1;
    println!("{language}: {count}");
}
```

不可变不等于常量。`const` 必须标注类型，并以可在编译期求值的表达式初始化：

```rust
const MAX_RETRIES: u32 = 3;
```

常量命名通常使用全大写下划线形式，可定义在模块作用域。局部 `let` 可以接收运行时结果。

## 遮蔽

再次使用 `let` 可以创建同名新绑定，这叫 shadowing：

```rust
fn main() {
    let input = " 42 ";
    let input = input.trim();
    let input: i32 = input.parse().expect("应为整数");
    println!("next = {}", input + 1);
}
```

遮蔽可以改变类型；`mut` 修改的是同一个绑定，不能随意改变其类型。遮蔽适合表示值经过验证
或转换后的不同阶段，但过度复用名称会妨碍调试。

## 语句与表达式

语句执行操作但不产生可供使用的值，表达式会求出一个值。Rust 中代码块也是表达式：

```rust
fn main() {
    let width = 5;
    let area = {
        let height = 8;
        width * height
    };
    println!("area = {area}");
}
```

块中最后一个没有分号的表达式成为块的值。若写成 `width * height;`，块的值会变成单元类型
`()`，从而导致类型不匹配。函数返回值也遵循同一规则。

## 作用域

绑定从声明处开始有效，离开花括号作用域后失效：

```rust
fn main() {
    let outer = 10;
    {
        let inner = outer + 5;
        println!("{inner}");
    }
    // println!("{inner}"); // 编译错误：inner 已离开作用域
}
```

拥有资源的值通常在离开作用域时自动运行 `drop`。这使文件、锁和堆内存能以结构化方式释放。

## 常见错误与工程说明

- 忘记 `mut` 会得到“cannot assign twice to immutable variable”，应确认修改是否真的必要。
- 在尾表达式后误加分号，常导致期望某类型却得到 `()`。
- 未使用变量默认产生警告；临时占位可用 `_name`，完全忽略值可用 `_`。
- 标识符区分大小写，通常变量和函数用 `snake_case`，类型用 `UpperCamelCase`。
- `let value;` 可延迟初始化，但编译器要求使用前所有控制流路径都已赋值；一般优先就地初始化。
- 用 `cargo fmt` 统一格式，不要依赖手工对齐制造难维护的空格。

## 练习

读取一个字符串字面量，依次用遮蔽完成去除空白、解析为 `u32`、计算平方，并让一个代码块
表达式返回最终结果。尝试给尾表达式加分号，阅读编译器报告的类型变化。
