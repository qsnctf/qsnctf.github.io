# Rust 切片与字符串切片

切片是对连续序列的一段借用视图，不拥有元素。`&[T]` 用于任意元素切片，`&str` 用于有效 UTF-8 文本切片；它们都包含指针和长度。

## 数组与 Vec 的切片

```rust
fn sum(values: &[i32]) -> i32 {
    values.iter().sum()
}

fn main() {
    let numbers = vec![10, 20, 30, 40];
    assert_eq!(sum(&numbers), 100);      // &Vec<i32> 自动转为 &[i32]
    assert_eq!(sum(&numbers[1..3]), 50); // 半开区间 [1, 3)

    let array = [1, 2, 3];
    assert_eq!(sum(&array), 6);
}
```

API 参数通常优先使用 `&[T]` 而不是 `&Vec<T>`，这样数组、向量和子切片都能调用。需要修改元素时使用 `&mut [T]`。

```rust
fn double(values: &mut [i32]) {
    for value in values { *value *= 2; }
}

fn main() {
    let mut values = [1, 2, 3];
    double(&mut values[1..]);
    assert_eq!(values, [1, 4, 6]);
}
```

## String 与 &str

`String` 拥有、可增长且保证内容为 UTF-8；`&str` 是借用的 UTF-8 文本视图。字符串字面量类型是 `&'static str`。

```rust
fn greet(name: &str) -> String {
    format!("你好，{name}")
}

fn main() {
    let owned = String::from("Rust");
    assert_eq!(greet(&owned), "你好，Rust");
    assert_eq!(greet("读者"), "你好，读者");
}
```

## 边界与 UTF-8

字符串范围索引使用字节偏移，而且起止位置必须落在 UTF-8 字符边界，否则运行时 panic。Rust 不支持 `text[0]`，因为 Unicode 字符并非固定字节宽度。

```rust
fn main() {
    let text = "你好Rust";
    assert_eq!(&text[0..3], "你");
    assert_eq!(text.get(0..3), Some("你"));
    assert_eq!(text.get(0..1), None); // 非字符边界，不 panic

    let chars: Vec<char> = text.chars().collect();
    assert_eq!(chars[1], '好');
    assert_eq!(text.as_bytes()[0], 0xE4);
}
```

`chars()` 按 Unicode 标量值遍历，不等同于用户感知的字形簇；例如组合字符可能由多个 `char` 组成。需要字形簇时使用专门的 Unicode 库。

## 常见错误与工程注意

- 数组和切片越界索引会 panic；不确定边界时使用 `get`，它返回 `Option<&T>`。
- `&text[a..b]` 既检查范围也检查 UTF-8 边界；外部输入的偏移不要直接用于切片。
- 不要把 `String` 参数写成 `&String`，除非确实需要 `String` 特有 API；大多数只读文本接口用 `&str`。
- 切片不能比原集合活得更久，也不能在持有元素切片时改变可能重分配的 `Vec`。
- `len()` 对 `str` 返回字节数，不是字符数；协议长度、显示宽度、字符数量必须区分。
- 大字符串的小切片会让原始分配继续存活；若需长期保存很小片段，可以复制成新的 `String`。

继续阅读：[所有权与借用](./ownership.md)、[枚举与模式匹配](./enums.md)。
