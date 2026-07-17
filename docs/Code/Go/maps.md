# Go 语言 Map（集合）

map 保存键值对，写作 `map[K]V`。键类型必须可比较，例如布尔、数字、字符串、指针、channel、
数组以及字段均可比较的结构体；切片、map 和函数不能作为键。

## 创建与基本操作

```go
package main

import "fmt"

func main() {
	scores := map[string]int{"Alice": 90}
	scores["Bob"] = 85

	score, ok := scores["Alice"]
	fmt.Println(score, ok, len(scores))

	delete(scores, "Bob")
	clear(scores) // Go 1.21+
}
```

索引读取返回值类型的零值；第二个返回值表示键是否存在。`delete` 删除不存在的键是安全的，
`clear` 会删除所有条目，但不会把变量设为 nil。

## nil map 与空 map

```go
var nilMap map[string]int
emptyMap := make(map[string]int)

fmt.Println(nilMap["x"], len(nilMap)) // 0 0
fmt.Println(emptyMap["x"], len(emptyMap))
// nilMap["x"] = 1 // panic: assignment to entry in nil map
```

这是第一个差异示例：nil map 可以读取、查询、删除和遍历，但不能写入；由 `make` 或字面量创建的
空 map 可以写入。若函数只返回只读空结果，nil map 可能足够；若调用方要写入，应明确初始化。

## 缺失键与零值

```go
ages := map[string]int{"newborn": 0}

a, okA := ages["newborn"]
b, okB := ages["missing"]
fmt.Println(a, okA, b, okB) // 0 true 0 false
```

这是第二个差异示例：单值读取无法区分“键不存在”和“键存在但值为零”，需要 comma-ok 形式。
计数器可有意利用零值：`counts[word]++` 无需先检查键。

## map 不是并发安全容器

多个 goroutine 只读且期间绝无写入是安全的；只要存在并发写，或读写并发，就必须同步。
未同步访问可能触发数据竞争甚至 `fatal error: concurrent map read and map write`。

```go
type SafeCounts struct {
	mu sync.RWMutex
	m  map[string]int
}

func (s *SafeCounts) Add(key string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.m[key]++
}
```

通用业务状态通常用 `map` 加 `sync.RWMutex`；`sync.Map` 更适合其文档描述的写一次读多次，
或不同 goroutine 操作不相交键的特殊场景，不是普通 map 的默认替代品。

## 遍历与引用语义

map 遍历顺序未指定。赋值或传参不会复制所有条目，多个变量指向同一 map 数据；修改一个变量的
条目，其他变量可见。若需要独立副本，可用 Go 1.21+ 的 `maps.Clone`，但值若含指针仍是浅拷贝。

## 常见错误

- 向 nil map 写入条目。
- 忽略 `ok`，把缺失键误判为真实零值。
- 依赖遍历顺序生成稳定输出。
- 无锁并发读写 map，认为不同键互不影响。
- 取得 `m[key]` 中结构体字段并直接赋值；map 索引结果不可寻址，应取出、修改后再写回。

## 性能与工程实践

已知条目数量时可用 `make(map[K]V, n)` 提供容量提示，减少增长成本，但它不是硬上限。
键应保持稳定，避免使用巨大结构体增加哈希成本。公开 API 应说明 map 的所有权和可变性；若不能让
调用方修改内部状态，就返回克隆或只暴露查询方法。稳定序列化时收集并排序键，不要依赖运行时顺序。
