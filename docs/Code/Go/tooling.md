# Go 语言开发工具

本页聚焦命令行开发循环、测试、静态分析、代码生成和性能诊断。
IDE、编辑器、语言服务器选择属于开发环境主题，不在此重复讨论。
以下命令以 Go 1.22+ 模块项目为基础，并应从模块或 workspace 的适当目录运行。

## 日常命令

```text
go version
go env
go run ./cmd/server
go build ./...
go install example.com/tool/cmd/tool@latest
go doc net/http.Server
```

`go run` 编译并运行目标，适合本地迭代；`go build` 验证构建并按参数生成二进制。
`go install package@version` 安装命令时不修改当前项目的 `go.mod`，自动化环境应固定版本而非使用 `@latest`。
`go env` 可检查 `GOMOD`、`GOWORK`、`GOPATH`、`GOPROXY` 和构建缓存位置。

```text
go list ./...
go list -m all
go clean -testcache
```

`go clean -testcache` 只应在确实需要排查缓存影响时使用；正常测试不应依赖手工清缓存。

## gofmt 与格式检查

`gofmt` 是 Go 源码的标准格式化工具，团队不应争论空格和对齐风格。

```text
gofmt -w main.go internal/parser/parser.go
gofmt -d main.go internal/parser/parser.go
go fmt ./...
```

`gofmt -w` 直接写回文件，`gofmt -d` 显示差异。
`go fmt ./...` 对匹配的包运行格式化；需要覆盖仓库中不属于已发现 package 的 Go 文件时，应由脚本枚举 `.go` 文件交给 `gofmt`。
CI 可检查 `gofmt -d` 的输出或格式化后的 Git diff，确保没有未格式化文件。
差异示例 1：`gofmt` 操作源码格式；`go vet` 分析可疑语义，两者不能互相替代。

## go test

```text
go test ./...
go test -v ./internal/parser
go test -run '^TestParse/empty$' ./internal/parser
go test -count=1 ./...
go test -shuffle=on ./...
go test -cover ./...
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

`./...` 表示当前模块下的所有包，但通常不包含其他独立模块。
`-run` 使用正则筛选测试和子测试；`-count=1` 禁用成功测试结果缓存，适合诊断不稳定问题。
`-shuffle=on` 可暴露依赖执行顺序的测试。
覆盖率是未测试区域的线索，不等同于正确性或高质量断言。

测试超时、随机数、时间和网络时，应注入依赖或使用受控测试服务器，避免依赖公网和真实时钟。
需要测试不同包使用视角时采用外部测试包 `package name_test`；需要访问未导出实现时使用同包测试。

## Race Detector

```text
go test -race ./...
go test -race -count=1 ./internal/worker
go run -race ./cmd/server
```

race detector 在执行过程中发现未同步的共享内存访问。
它会显著增加时间和内存成本，适合 CI、预发布和针对性测试，不等于对所有调度路径的证明。
差异示例 2：普通 `go test` 验证断言；`go test -race` 还插桩检查已执行路径的数据竞争。

## go vet 与静态分析

```text
go vet ./...
go test ./...
```

`go vet` 检查格式化参数、不可达或可疑构造、复制锁值等问题，但不是完整的代码规范工具。
`go test` 会运行部分 vet 检查，不过 CI 中显式执行 `go vet ./...` 更清晰。
第三方分析器应固定版本，并记录配置；不要无评估地启用会制造大量噪声的规则。

```text
go install honnef.co/go/tools/cmd/staticcheck@v0.6.1
staticcheck ./...
```

外部工具版本示例会随项目升级；实际仓库应在工具模块、脚本或 CI 配置中统一固定。
不要依赖开发者机器上偶然存在的全局版本。

## 基准测试

基准函数名以 `Benchmark` 开头，并接收 `*testing.B`。
Go 1.24 引入 `b.Loop`；面向 Go 1.22 基线的项目继续使用 `for i := 0; i < b.N; i++`。

```go
func BenchmarkEncode(b *testing.B) {
	value := Payload{Name: "go"}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = json.Marshal(value)
	}
}
```

```text
go test -bench=. -benchmem ./internal/codec
go test -bench=BenchmarkEncode -count=10 ./internal/codec
```

基准结果受 CPU 调频、后台进程和机器差异影响，应多次运行并使用统计工具比较。
只优化经 profile 证明的重要路径，避免为了微小数字牺牲可读性和正确性。

## pprof 性能剖析

测试可直接生成 CPU 和内存 profile：

```text
go test -bench=. -cpuprofile=cpu.out -memprofile=mem.out ./internal/codec
go tool pprof cpu.out
go tool pprof -http=:8080 cpu.out
```

服务也可按控制面策略暴露 `net/http/pprof`，但 pprof 端点包含敏感运行信息且开销可被滥用。
不要把调试端点直接暴露到公网；应绑定管理网络、加认证，并限制访问时间与采样时长。

CPU profile 适合定位耗时热点，heap profile 适合分析仍存活的内存，allocs profile 关注累计分配。
goroutine profile 可帮助查找泄漏和阻塞，mutex/block profile 需要理解采样配置及额外开销。

## trace 与诊断

```text
go test -trace=trace.out ./internal/worker
go tool trace trace.out
```

execution trace 展示 goroutine 调度、阻塞、网络与 GC 事件，适合分析并发延迟。
trace 文件可能很大且包含应用行为信息，应限制采集时长并按敏感工件保存。

```text
go test -json ./... > test-report.json
go test -timeout=2m ./...
```

`-json` 便于 CI 或工具消费测试事件；超时应根据测试性质设置，而非用无限超时掩盖死锁。

## go generate

`go generate` 执行源码中紧邻 `//go:generate` 的命令，它不会在 `go build` 中自动运行。

```go
//go:generate go run ./internal/cmd/schema-gen -out schema_gen.go
```

```text
go generate ./...
git diff --exit-code
```

生成器和输入必须可复现，CI 可重新生成并检查 diff。
生成命令会执行代码，不可信仓库中的 `go generate` 与运行脚本具有同等风险，应先审查指令。
生成文件应标明来源和“DO NOT EDIT”，是否提交生成物由仓库策略统一决定。

## 依赖与漏洞检查

```text
go mod tidy
go mod verify
go list -m -u all
govulncheck ./...
```

`go mod tidy` 同步依赖声明，`go mod verify` 校验模块缓存内容与校验记录。
`govulncheck` 根据实际调用路径减少仅凭版本列表产生的噪声，但结果仍需人工评估和升级验证。
安装安全工具时固定受信任版本，并在受控 CI 环境更新。

## 推荐的本地与 CI 顺序

```text
go fmt ./...
go vet ./...
go test ./...
go test -race ./...
govulncheck ./...
```

大型项目可把慢测试、race、漏洞扫描和基准回归分层运行，但合并前应有明确门禁。
性能基准不宜仅用一个硬阈值跨机器比较，应固定环境并保存历史分布。

## 常见错误与工程注意

- 不要把 IDE 无报错当作 `go test ./...` 已通过。
- 不要混淆格式化、静态分析、测试、race 和漏洞扫描，它们覆盖不同失败类型。
- 不要在 CI 中安装 `@latest` 工具，否则构建无法复现且可能突然失败。
- 不要提交包含敏感路径、请求参数或生产数据的 profile、trace 和测试报告。
- 不要为提高覆盖率编写没有有效断言的测试。
- 不要在不可信仓库中盲目执行 `go generate`、测试或构建脚本。
- 缓存能加快构建，但供应链敏感环境仍需锁定工具链、校验依赖并保护 CI 凭据。
- 先用 benchmark 建立基线，再用 pprof 定位原因，修改后以统计比较验证收益。

## 小结

日常循环以 `gofmt`、`go test` 和 `go vet` 为基础，并用 race detector 覆盖并发风险。
性能工作遵循“benchmark 建基线、pprof/trace 定位、再次 benchmark 验证”的闭环。
生成器、安全扫描和外部分析器都应固定版本、可复现，并按执行不可信代码的标准管理。
