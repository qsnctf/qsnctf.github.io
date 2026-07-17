# Go 并发

并发是同时管理多个任务，并行是多个任务在同一时刻实际执行。
goroutine 和 channel 是组织并发的工具，但不会自动消除共享状态、死锁或资源泄漏。
先明确任务所有权、取消路径和结束条件，再选择 channel、互斥锁或原子操作。

## goroutine 的生命周期

在函数调用前加 `go` 会启动 goroutine；调用者不会自动等待它结束。
每个启动点都应能回答：谁等待、谁取消、阻塞时如何退出。

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	for i := range 3 {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			fmt.Println("worker", id)
		}(i)
	}
	wg.Wait()
}
```

Go 1.22 起，`for` 循环每轮拥有新的迭代变量，减少了闭包捕获旧式陷阱。
显式传参仍能清楚表达 goroutine 使用的数据，也便于阅读和兼容旧代码认知。
不要用 `time.Sleep` 等待 goroutine，调度和机器速度会使这种测试不稳定。

## channel：传递值与所有权

无缓冲 channel 的发送与接收会同步；缓冲 channel 在容量未满时允许发送方继续。
缓冲区用于吸收有限突发，不是修复死锁或无限积压的手段。

```go
func squares(in <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for n := range in {
			out <- n * n
		}
	}()
	return out
}
```

方向类型 `<-chan T` 和 `chan<- T` 能在编译期限制误用。
通常由发送方关闭 channel，因为发送方知道不会再产生值。
关闭表示“不会再发送”，不是释放内存；接收方一般不应关闭它。
从已关闭 channel 接收会立即得到零值且 `ok == false`，向已关闭 channel 发送会 panic。

```go
v, ok := <-ch
if !ok {
	fmt.Println("channel closed")
}
```

差异示例 1：无缓冲 channel 提供交接同步；容量为 10 的 channel 只允许最多 10 个尚未消费的值，并不保证消费者已处理。

## select：等待多个事件

`select` 在多个可执行通信中选择一个；没有可执行分支时阻塞。
`default` 会使它变成非阻塞操作，循环中滥用会导致忙等和高 CPU。

```go
func receive(ctx context.Context, ch <-chan string) (string, error) {
	select {
	case value, ok := <-ch:
		if !ok {
			return "", errors.New("input closed")
		}
		return value, nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}
```

超时可使用 `context.WithTimeout`；在循环中反复调用 `time.After` 会反复分配计时器。
需要复用或停止计时器时使用 `time.NewTimer`，并正确处理 `Stop` 与 channel。

## context：取消、截止时间与请求范围值

`context.Context` 应作为第一个参数显式传递，通常命名为 `ctx`。
不要把 context 存入结构体，不要传 nil，也不要用它承载可选业务参数。

```go
func Run(ctx context.Context) error {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	select {
	case <-time.After(100 * time.Millisecond):
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}
```

派生 context 后应尽快 `defer cancel()`，即使依赖截止时间也要释放内部资源。
goroutine 中的阻塞发送和接收通常都要同时监听 `ctx.Done()`，否则取消无法终止流水线。

## sync：保护共享状态

共享内存确实更直接时，可使用 `sync.Mutex`、`sync.RWMutex`、`sync.Once` 和 `sync.WaitGroup`。
互斥锁保护的是不变量，不只是某个字段；锁的临界区应短且边界一致。

```go
type Counter struct {
	mu sync.Mutex
	n  int
}

func (c *Counter) Add(delta int) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.n += delta
}

func (c *Counter) Value() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.n
}
```

差异示例 2：channel 适合传递任务、结果和所有权；mutex 适合多个方法共同维护一个小型内存状态。
`RWMutex` 只有在读操作占绝对多数且竞争经测量存在时才可能更快，不应默认替代 `Mutex`。
复制正在使用的 mutex 或 WaitGroup 是错误的，因此含锁结构的方法通常使用指针接收者。

## 有界并发

为每个输入无限启动 goroutine 可能耗尽内存、文件描述符或下游连接。
固定 worker 数量能提供背压，并让资源预算可预测。

```go
func worker(ctx context.Context, jobs <-chan int, results chan<- int) {
	for {
		select {
		case job, ok := <-jobs:
			if !ok {
				return
			}
			select {
			case results <- job * 2:
			case <-ctx.Done():
				return
			}
		case <-ctx.Done():
			return
		}
	}
}
```

生产者负责关闭 `jobs`，协调者等待所有 worker 后再关闭 `results`，可避免向已关闭 channel 发送。

## Race Detector

数据竞争指不同 goroutine 并发访问同一内存，至少一个是写，并且缺少同步。
使用以下命令运行测试和程序：

```text
go test -race ./...
go run -race ./cmd/server
```

race detector 只能发现实际执行路径上的竞争，不是静态证明；应配合覆盖关键并发路径的测试。
它会增加 CPU 和内存开销，通常用于测试、CI 或预发布环境，而非生产常态运行。

## 常见错误与工程注意

- 不要并发写普通 `map`；使用 mutex 保护，或在合适模型下评估 `sync.Map`。
- 不要让 goroutine 永久阻塞在无人接收的发送、无人发送的接收或永不触发的 context 上。
- 不要由多个发送方随意关闭同一 channel；集中关闭责任。
- 不要把 channel 缓冲调大来掩盖消费者速度不足，应测量吞吐并建立背压。
- 不要持锁执行网络请求、磁盘 I/O 或调用未知回调，以免扩大阻塞与死锁风险。
- 锁多个资源时保持固定顺序，并尽量避免嵌套锁。
- goroutine 中的 panic 若未恢复会终止整个程序；只应在明确的任务边界恢复并转换为可观测故障。
- 服务关闭时先停止接收新工作，再取消任务、等待退出，并设置总的关闭期限。
- CI 中运行 `go test -race ./...`，并对超时、取消、channel 关闭和错误路径编写测试。

## 小结

goroutine 承载任务，channel 传递数据和所有权，`select` 组合事件，context 传播取消。
共享状态使用 `sync` 明确保护，并通过有界并发控制资源。
最后用 race detector 和覆盖取消路径的测试验证实现，而不是依赖直觉判断线程安全。
