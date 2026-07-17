# 命令行输出与格式化

Rust 的格式化宏在编译期检查格式字符串与参数数量。`println!` 写标准输出并换行，
`eprintln!` 写标准错误并换行，`format!` 返回拥有所有权的 `String`。

## 基本宏

```rust
fn main() {
    print!("loading...");
    println!("done");
    eprintln!("warning: using defaults");

    let message = format!("{} + {} = {}", 20, 22, 20 + 22);
    println!("{message}");
}
```

`print!` 不自动换行，并且标准输出可能被缓冲。交互式提示需要立即可见时，应显式刷新：

```rust
use std::io::{self, Write};

fn main() {
    print!("请输入名称: ");
    io::stdout().flush().expect("刷新标准输出失败");
}
```

## 占位符

```rust
fn main() {
    let name = "Ferris";
    let score = 95;

    println!("姓名: {}, 分数: {}", name, score);
    println!("姓名: {name}, 分数: {score}");
    println!("{0} + {0} = {1}", 5, 10);
    println!("十进制 {score}, 十六进制 {score:x}, 二进制 {score:b}");
    println!("右对齐: |{score:>6}|, 补零: |{score:06}|");
    println!("小数: {:.2}", 3.14159);
}
```

`{}` 通常使用 `Display`，面向用户；`{:?}` 使用 `Debug`，面向开发与诊断。美化调试输出
使用 `{:#?}`：

```rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let point = Point { x: 3, y: 4 };
    println!("point = {point:?}");
    println!("point = {point:#?}");
}
```

## 标准输出与标准错误

命令行程序应把正常机器可读结果写入 stdout，把诊断、警告和错误写入 stderr。这样用户可
安全地重定向结果：

```bash
cargo run > result.txt 2> error.txt       # Bash、PowerShell
```

日志较复杂时应使用日志生态，而不是到处散布 `eprintln!`；库代码尤其不应擅自打印。

## 常见错误与工程说明

- 格式字符串必须是字面量；不要把外部输入直接当格式字符串。
- 类型未实现 `Display` 时 `{}` 会编译失败，可实现该 trait 或在诊断场景使用 `{:?}`。
- `format!` 会分配新的 `String`；若只需输出，不必先 `format!` 再 `println!`。
- `{name}` 捕获当前作用域变量，但复杂表达式仍应作为后续参数传入。
- 输出密码、令牌、个人数据和完整调试结构前必须评估信息泄露风险。
- 管道关闭时写 stdout 可能失败；严肃的 CLI 应显式处理 I/O 错误，而非总依赖打印宏。

## 练习

编写程序输出商品名、数量、单价和总价：总价保留两位小数，正常结果写 stdout；当数量为
零时额外用 `eprintln!` 输出警告。再将 stdout 和 stderr 分别重定向到两个文件检查结果。
