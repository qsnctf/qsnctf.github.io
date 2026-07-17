# Rust 错误处理

Rust 区分不可恢复错误和可恢复错误：前者通常使用 `panic!`，后者使用 `Result<T, E>`。错误边界应让调用者获得足够上下文并选择恢复、重试或退出。

## panic 与 Result

`panic!` 表示程序无法继续满足内部假设，例如数组越界或被破坏的不变量。库面对无效输入、I/O 失败和网络异常时通常应返回 `Result`，而不是替调用者终止进程。

```rust
fn percentage(part: u32, total: u32) -> Result<f64, &'static str> {
    if total == 0 {
        return Err("total 不能为 0");
    }
    Ok(part as f64 / total as f64 * 100.0)
}

fn main() {
    match percentage(2, 5) {
        Ok(value) => println!("{value:.1}%"),
        Err(error) => eprintln!("计算失败: {error}"),
    }
}
```

`unwrap` 和 `expect` 会把 `Err` 转为 panic。仅当错误确实代表程序缺陷，或示例、测试已建立必要前提时使用；`expect` 应说明必须成功的原因。

## 使用 ? 传播错误

`?` 在成功时取出值，在失败时提前返回，并通过 `From` 转换错误类型。它只能用于返回兼容 `Result` 或 `Option` 的函数、闭包等上下文。

```rust
use std::{fs, io};

fn first_line(path: &str) -> Result<String, io::Error> {
    let content = fs::read_to_string(path)?;
    Ok(content.lines().next().unwrap_or("").to_owned())
}

fn main() -> Result<(), io::Error> {
    fs::write("example.txt", "alpha\nbeta")?;
    assert_eq!(first_line("example.txt")?, "alpha");
    fs::remove_file("example.txt")?;
    Ok(())
}
```

`main` 可以返回实现 `Termination` 的类型，常见写法是 `Result<(), E>`。真实程序清理临时资源时应考虑即使中途失败也能执行的策略。

## 自定义错误类型

```rust
use std::{error::Error, fmt, num::ParseIntError};

#[derive(Debug)]
enum PortError { Parse(ParseIntError), Zero }

impl fmt::Display for PortError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Parse(error) => write!(f, "端口不是整数: {error}"),
            Self::Zero => write!(f, "端口不能为 0"),
        }
    }
}

impl Error for PortError {}
impl From<ParseIntError> for PortError {
    fn from(error: ParseIntError) -> Self { Self::Parse(error) }
}

fn parse_port(text: &str) -> Result<u16, PortError> {
    let port = text.parse::<u16>()?;
    if port == 0 { Err(PortError::Zero) } else { Ok(port) }
}

fn main() { assert!(parse_port("8080").is_ok()); }
```

应用程序可用装箱错误统一顶层失败，库通常更适合公开结构化枚举，让调用者可靠匹配。错误类型设计也涉及[枚举](./enums.md)与 Trait。

## 常见错误与工程注意

- 不要无条件 `unwrap` 外部输入、文件、锁或网络结果；失败属于正常运行条件。
- `map_err` 可增加领域上下文，但不要丢失底层来源；自定义错误可实现 `source` 或保存原错误。
- 错误消息应描述操作和关键标识，不应泄露密码、令牌或完整敏感数据。
- panic 默认可能展开栈，也可配置为直接终止；不要依赖析构在 `panic = "abort"` 时完成关键持久化。
- 捕获 panic 不是普通错误处理机制，且无法保证所有状态都适合恢复。
- `?` 简化传播但不会自动添加业务上下文；跨抽象层时应转换成有意义的错误。

继续阅读：[泛型与 Trait](./generics-and-traits.md)、[模块与包](./modules.md)。
