# Go 语言递归函数

递归函数会直接或间接调用自身。每次调用都有独立栈帧，因此必须设计可到达的终止条件，
并确保每一步都让问题规模向终止条件靠近。

## 基本递归

```go
package main

import "fmt"

func factorial(n uint64) uint64 {
	if n < 2 {
		return 1
	}
	return n * factorial(n-1)
}

func main() {
	fmt.Println(factorial(5)) // 120
}
```

`n < 2` 是终止条件，`n-1` 是递归推进。示例只说明语法：`uint64` 的阶乘很快溢出，
生产代码应限制输入、返回错误，或使用 `math/big.Int`。

## 递归与迭代的差异

```go
func factorialLoop(n uint64) uint64 {
	result := uint64(1)
	for i := uint64(2); i <= n; i++ {
		result *= i
	}
	return result
}
```

第一个差异示例：递归版本更直接表达数学定义，迭代版本不为每一步创建调用栈，通常更节省内存。
Go 不保证尾调用优化，把递归调用写在 return 位置也不能假设栈空间恒定。

## 树形数据更适合递归

```go
type Node struct {
	Value    int
	Children []*Node
}

func sum(root *Node) int {
	if root == nil {
		return 0
	}
	total := root.Value
	for _, child := range root.Children {
		total += sum(child)
	}
	return total
}
```

第二个差异示例：树遍历用递归能自然对应节点层级；若树可能极深或输入不可信，应改用显式栈，
以便控制内存、深度和取消逻辑。

## 记忆化

朴素 Fibonacci 会重复计算相同子问题，时间复杂度呈指数增长。可把结果放入 map：

```go
func fib(n int, memo map[int]uint64) uint64 {
	if n < 2 {
		return uint64(n)
	}
	if value, ok := memo[n]; ok {
		return value
	}
	memo[n] = fib(n-1, memo) + fib(n-2, memo)
	return memo[n]
}
```

共享 memo 给多个 goroutine 时需要同步；单次计算中也要限制 `n`，避免整数溢出和过深递归。

## 常见错误

- 缺少终止条件，最终耗尽栈空间。
- 递归参数未向终止条件推进，例如负数输入不断减小。
- 使用指数级重复递归，却没有记忆化或动态规划。
- 假设 Go 会进行尾递归优化。
- 遍历图时不记录已访问节点，遇到环后无限递归。

## 性能与工程实践

Go 的 goroutine 栈会按需增长，但递归深度仍不是无限的，增长和函数调用也有成本。解析用户可控的
嵌套数据时应设置最大深度，防止资源耗尽。对链表、深目录或图遍历，显式 `[]T` 栈通常更安全；
对深度受控的语法树和树形配置，递归通常更清晰。优化前用基准测试和 CPU profile 找到真实热点。
