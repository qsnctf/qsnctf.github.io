# 集合与字符串

标准库常用集合包括顺序存储的 `Vec<T>`、键值映射 `HashMap<K, V>` 和去重集合
`HashSet<T>`。`String` 与 `&str` 则建立在 UTF-8 字节序列之上。

## `Vec<T>`

`Vec<T>` 拥有连续元素，可动态增长：

```rust
fn main() {
    let mut scores = vec![80, 95, 72];
    scores.push(88);
    scores.retain(|score| *score >= 80);
    scores.sort_unstable();

    for score in &scores {
        println!("{score}");
    }
}
```

索引 `values[i]` 越界会 panic；外部输入形成的索引应使用 `values.get(i)`，它返回
`Option<&T>`。`push` 可能重分配，因此不能在保存元素引用时继续修改同一向量。

```rust
let values = vec![10, 20];
if let Some(value) = values.get(5) {
    println!("{value}");
}
```

## `HashMap` 与 entry API

`HashMap` 不保证迭代顺序。键需要实现 `Eq + Hash`。

```rust
use std::collections::HashMap;
fn main() {
    let mut counts = HashMap::new();
    for word in "red blue red green red".split_whitespace() {
        *counts.entry(word).or_insert(0) += 1;
    }
    if let Some(count) = counts.get("red") {
        println!("red: {count}");
    }
}
```

`entry` 只查找一次，并能按“存在/不存在”统一更新。需要惰性构造默认值时使用
`or_insert_with`。插入拥有值会移动它；若映射需要长期拥有字符串键，常用 `String`。

## `HashSet`

`HashSet<T>` 适合成员测试、去重和集合运算：

```rust
use std::collections::HashSet;
fn main() {
    let left: HashSet<_> = ["rust", "c", "go"].into_iter().collect();
    let right: HashSet<_> = ["rust", "python"].into_iter().collect();
    for language in left.intersection(&right) {
        println!("共同元素: {language}");
    }
}
```

同样不要依赖哈希集合的输出顺序。需要有序键时考虑标准库的 `BTreeMap`、`BTreeSet`。

## `String` 与 `&str`

`String` 拥有、可增长；`&str` 是借用的 UTF-8 字符串切片。函数只读字符串时通常接收
`&str`，这样既可传字符串字面量，也可传 `&String`。

```rust
fn greet(name: &str) -> String {
    format!("你好，{name}")
}
fn main() {
    let mut name = String::from("Rust");
    name.push_str(" 2021");
    println!("{}", greet(&name));
}
```
Rust 字符串不能用整数直接索引，因为 UTF-8 字符长度可变。“字符”也未必等于用户看到的
字形簇。按 Unicode 标量值遍历用 `chars()`，按原始字节遍历用 `bytes()`。

```rust
fn main() {
    let text = "中a";
    println!("bytes={}, chars={}", text.len(), text.chars().count());
    for ch in text.chars() {
        println!("{ch}");
    }
}
```

字符串切片范围是字节下标，且边界必须落在字符边界，否则会 panic。外部范围应通过
`text.get(range)` 安全检查。拼接少量片段可用 `push_str`；格式化优先用 `format!`，
循环中反复 `+` 可能产生不必要分配。

## 常见错误与选型
- 不要为了绕过生命周期而到处 `clone()`；先明确谁拥有数据、借用需要持续多久。
- `HashMap<f64, _>` 不可直接使用，因为浮点数没有满足要求的全等语义。
- 哈希表面对攻击者可控键已有随机种子保护，但它不是稳定序列化格式。
- 预知规模时用 `with_capacity` 减少重分配，但不要信任外部输入提供的巨大容量。
- 文本、字节、路径是不同领域；路径应使用 `Path`，未知编码应使用字节容器。

延伸阅读：[文件与 I/O](files-and-io.md)、[智能指针](smart-pointers.md)、
[并发编程](concurrency.md)。
