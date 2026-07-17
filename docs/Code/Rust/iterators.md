# Rust 迭代器

迭代器把“如何产生下一个元素”与“如何处理元素”分离。它们常与[闭包](./closures.md)配合，并受[所有权与借用](./ownership.md)规则约束。

## Iterator 与惰性

`Iterator` 的核心是关联类型 `Item` 和 `next` 方法。`map`、`filter`、`take` 等适配器是惰性的：只构造新迭代器，不主动取值。

```rust
fn main() {
    let source = vec![1, 2, 3, 4, 5];
    let pipeline = source.iter()
        .filter(|value| **value % 2 == 1)
        .map(|value| value * value);

    // collect 是消费者，此时流水线才执行。
    let squares: Vec<i32> = pipeline.collect();
    assert_eq!(squares, vec![1, 9, 25]);
}
```

常见适配器包括 `map`、`filter`、`filter_map`、`flat_map`、`enumerate`、`zip`、`chain` 和 `take_while`。消费者包括 `collect`、`sum`、`fold`、`count`、`find`、`any`、`all` 和 `for_each`。

## iter、iter_mut 与 into_iter

三者的元素类型和所有权效果不同：

| 调用 | 典型 `Item` | 是否取得集合所有权 |
| --- | --- | --- |
| `values.iter()` | `&T` | 否 |
| `values.iter_mut()` | `&mut T` | 否，但可修改元素 |
| `values.into_iter()` | `T` | 是，通常移动集合 |

```rust
fn main() {
    let mut names = vec![String::from("Ada"), String::from("Lin")];
    for name in names.iter_mut() {
        name.push('!');
    }
    let lengths: Vec<usize> = names.into_iter().map(|s| s.len()).collect();
    assert_eq!(lengths, vec![4, 4]);
    // names 已被移动，不能再使用。
}
```

`for item in value` 会调用 `IntoIterator::into_iter(value)`。因此自定义容器若实现 `IntoIterator`，便可自然用于 `for`；也可分别为 `Container`、`&Container`、`&mut Container` 实现三种遍历语义。

## 自定义迭代器

```rust
struct Counter { current: u32, end: u32 }

impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<Self::Item> {
        if self.current >= self.end { return None; }
        self.current += 1;
        Some(self.current)
    }
}

fn main() {
    let total: u32 = Counter { current: 0, end: 4 }.sum();
    assert_eq!(total, 10);
}
```

## 常见错误与工程注意

- 只写 `iter.map(...)` 而没有消费者不会执行闭包；编译器还可能提示未使用的惰性迭代器。
- `Iterator::find`、`next` 等会推进状态；迭代器通常是一次性的，耗尽后应重新创建。
- 不要对无限迭代器直接 `collect` 或 `count`，先用 `take` 等建立边界。
- `filter` 的闭包通常接收元素引用的引用，必要时用模式 `|&&x|` 或显式解引用。
- 流水线过长时可拆分命名步骤，但不要仅为“函数式风格”牺牲可读性和错误上下文。
- 需要返回迭代器时，可使用 `impl Iterator<Item = T>`；不同分支若产生不同具体类型，可装箱为 `Box<dyn Iterator<Item = T>>`，代价是分配与动态分发。

继续阅读：[泛型与 Trait](./generics-and-traits.md)、[切片与字符串切片](./slices.md)。
