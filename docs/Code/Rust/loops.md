# 循环
Rust 提供 `loop`、`while` 和 `for`。三者都可配合 `break` 提前结束、`continue` 跳过本轮；
循环标签用于明确控制嵌套循环。
## loop 与 break 值
`loop` 表示无限循环，直到 `break`、`return`、panic 或其他发散行为结束。`break` 可携带值，
使整个 `loop` 成为表达式：

```rust
fn main() {
    let mut number = 1;
    let power = loop {
        number *= 2;
        if number >= 32 {
            break number;
        }
    };
    println!("power = {power}");
}
```
同一个循环中所有带值 `break` 的类型必须兼容。没有返回值的 `break;` 对应 `()`。
## while
条件为 `true` 时重复执行：

```rust
fn main() {
    let mut remaining = 3;
    while remaining > 0 {
        println!("{remaining}");
        remaining -= 1;
    }
    println!("start");
}
```
`while` 适合迭代次数取决于运行时状态的场景。应确保状态会推进，并考虑异常输入能否导致
无限循环。
## for 与迭代器
遍历集合和范围通常优先 `for`，它比手写索引更安全：

```rust
fn main() {
    let values = [10, 20, 30];
    for value in values {
        println!("{value}");
    }

    for index in 0..3 {
        println!("index = {index}");
    }

    for number in (1..=3).rev() {
        println!("{number}");
    }
}
```
`0..3` 不包含 3，`1..=3` 包含 3。需要索引和值时使用
`for (index, value) in values.iter().enumerate()`，不要仅为索引而手工维护计数器。
## continue、标签与嵌套循环
标签以单引号开头，可让 `break` 或 `continue` 指向指定循环：

```rust
fn main() {
    'search: for row in 0..3 {
        for column in 0..3 {
            if row == 1 && column == 2 {
                println!("found at ({row}, {column})");
                break 'search;
            }
            if column == 0 {
                continue;
            }
        }
    }
}
```
不带标签的 `break` 和 `continue` 只影响最内层循环。标签应使用能表达目的的名称，复杂搜索
若需要大量标签，可能更适合提取函数并用 `return` 返回结果。
## 所有权与遍历
`for value in collection` 可能消费集合；借用遍历使用 `for value in &collection`，可变借用
使用 `for value in &mut collection`。选择方式取决于循环后是否还要使用集合以及是否要修改元素。
## 常见错误与工程说明

- 不要在可用迭代器时写 `while index < values.len()`，索引更新和边界更容易出错。
- 修改集合长度时同时遍历它通常会遇到借用冲突；可先收集变更，或选择合适的容器 API。
- 长时间循环应设计取消、超时、退避或资源上限，避免忙等占满 CPU。
- `continue` 可能跳过状态更新，使用 `while` 时尤其要检查是否会因此无限循环。
- 对外部输入驱动的循环设置最大迭代次数，防止拒绝服务和意外资源耗尽。
## 练习

用两层 `for` 搜索二维数组中的目标值，找到后通过标签退出外层循环。再改写为函数，使用
`return Some((row, column))` 返回位置，搜索失败返回 `None`，比较两种结构的可读性。
