# 文件与 I/O

Rust 的文件 API 主要位于 `std::fs`、`std::io` 和 `std::path`。文件操作几乎都可能失败，
因此应保留 `io::Result`，而不是在可恢复错误上直接 `unwrap()`。

## `Path` 与 `PathBuf`

`Path` 是借用的路径切片，类似 `str`；`PathBuf` 拥有并可修改路径，类似 `String`。
路径不保证是 UTF-8，因此通用库不要先把路径强制转换为字符串。

```rust
use std::path::{Path, PathBuf};
fn config_path(root: &Path) -> PathBuf {
    root.join("config").join("app.toml")
}

fn main() {
    let path = config_path(Path::new("data"));
    println!("{}", path.display());
}
```

`display()` 适合展示，可能以替换字符处理不可表示内容；需要无损传递时继续使用
`Path`、`PathBuf` 或底层的 `OsStr`、`OsString`。

## 一次性读写

小文件可使用 `std::fs::read_to_string`、`read`、`write`：

```rust
use std::{fs, io};
fn copy_text() -> io::Result<()> {
    let text = fs::read_to_string("input.txt")?;
    fs::write("output.txt", text.to_uppercase())?;
    Ok(())
}

fn main() {
    if let Err(error) = copy_text() {
        eprintln!("复制失败: {error}");
    }
}
```

`read_to_string` 要求内容是有效 UTF-8。二进制或未知编码应使用 `fs::read` 得到
`Vec<u8>`。一次性读取还会按文件大小分配内存，不适合不可信的大文件。

## `File` 与 `OpenOptions`

`File::open` 只读打开，`File::create` 会创建或截断文件。需要追加、读写组合或明确的
创建语义时使用 `OpenOptions`。

```rust
use std::fs::OpenOptions;
use std::io::{self, Write};

fn append_log(message: &str) -> io::Result<()> {
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open("app.log")?;
    writeln!(file, "{message}")?;
    file.flush()?;
    Ok(())
}

fn main() -> io::Result<()> {
    append_log("service started")
}
```

追加模式可避免每次写入都覆盖旧内容，但多进程并发写入的边界和原子性依赖操作系统，
不能把它当作事务日志协议。

## 缓冲读取与写入

频繁的小 I/O 应使用 `BufReader` 和 `BufWriter`：

```rust
use std::fs::File;
use std::io::{self, BufRead, BufReader, BufWriter, Write};

fn numbered_copy() -> io::Result<()> {
    let input = BufReader::new(File::open("input.txt")?);
    let mut output = BufWriter::new(File::create("numbered.txt")?);
    for (index, line) in input.lines().enumerate() {
        writeln!(output, "{}: {}", index + 1, line?)?;
    }
    output.flush()
}

fn main() -> io::Result<()> {
    numbered_copy()
}
```

`lines()` 会移除行尾并验证 UTF-8。处理任意字节流可使用 `Read::read` 或
`BufRead::read_until`。`BufWriter` 在析构时会尝试刷新，但析构无法返回错误，所以关键数据
必须显式 `flush()`；持久化要求更强时还要评估 `File::sync_all()`。

## 错误与工程注意事项

- `?` 会把错误向上传播；边界层再记录上下文或决定退出策略。
- 可用 `error.kind()` 区分 `NotFound`、`PermissionDenied` 等类别，但不要依赖错误文本。
- 检查后再打开存在 TOCTOU 竞态；直接执行目标操作并处理结果更可靠。
- 写配置可先写同目录临时文件、刷新后重命名，以降低半写入风险，但仍需理解平台语义。
- 不可信路径必须限制在允许的根目录内，并谨慎处理 `..`、符号链接和绝对路径。

延伸阅读：[集合与字符串](collections-and-strings.md)、[并发编程](concurrency.md)、
[异步编程](async-programming.md)。
