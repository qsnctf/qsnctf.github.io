# Go Modules

Go Modules 管理模块身份、依赖版本、可复现下载和跨仓库引用。
一个模块由根目录的 `go.mod` 定义，可包含多个 package；package 与 module 不是同一概念。
现代项目通常在模块模式下工作，依赖解析遵循最小版本选择（MVS）。

## 创建模块

```text
mkdir hello
cd hello
go mod init example.com/hello
go mod tidy
```

模块路径应是稳定、可被导入的标识，公开模块通常使用代码托管域名路径。
`go mod init` 创建 `go.mod`，`go mod tidy` 根据源码和测试同步依赖声明及校验记录。

```go
module example.com/hello

go 1.22
```

`go` 指令声明模块使用的语言版本和工具链行为基线，不只是文档注释。
较新的 Go 版本还可能在 `go.mod` 中维护 `toolchain` 指令，用于建议使用的工具链版本。

## go.mod 的核心指令

```go
module example.com/service

go 1.22

require (
	github.com/google/uuid v1.6.0
	golang.org/x/sync v0.7.0
)

require golang.org/x/sys v0.20.0 // indirect
```

`require` 声明最低需要的模块版本；`// indirect` 表示当前模块源码未直接导入它，但模块图仍需要它。
不要手工删除所有 indirect 依赖，交给 `go mod tidy` 根据当前 Go 版本和源码维护。

```text
go mod edit -json
go list -m all
go mod graph
go mod why -m golang.org/x/sys
```

这些命令分别查看结构化 go.mod、最终模块列表、依赖图和某模块为何被需要。

## go.sum 的职责

`go.sum` 保存下载过的模块内容及其 `go.mod` 文件的加密校验值。
它用于验证以后下载的内容没有改变，应与 `go.mod` 一起提交版本控制。
它不是锁文件的完全等价物，也不只包含当前一次构建直接使用的模块。

```text
go mod download
go mod verify
```

`go mod download` 预下载模块，`go mod verify` 检查缓存中的依赖是否仍与校验值一致。
默认公共模块校验可借助 checksum database；私有模块需正确配置 `GOPRIVATE` 等环境边界。

## 版本与最小版本选择

模块版本通常采用语义化版本 `vMAJOR.MINOR.PATCH`。
MVS 在依赖图中选择每个模块被要求的最高最低版本，而不是求解所有版本约束的全局最优解。

```text
go get example.com/lib@v1.4.2
go get example.com/lib@latest
go get example.com/lib@none
go list -m -u all
```

自动化更新应指定经过审查的版本；`@latest` 适合交互式发现，不适合不可控地写入 CI。
`@none` 可移除对模块的要求，但最终结果仍由源码导入和 `go mod tidy` 决定。

差异示例 1：`go get module@version` 调整当前模块依赖；`go install command@version` 安装命令且不修改当前 `go.mod`。

## 主版本与模块路径

`v0` 表示 API 尚不稳定，`v1` 表示第一代稳定 API。
从 `v2` 开始，模块路径通常必须包含主版本后缀，例如 `example.com/lib/v2`。

```go
import "example.com/lib/v2/client"
```

这允许 v1 和 v2 同时存在于同一构建中，也让不兼容升级在导入路径上可见。
`gopkg.in` 等路径有特殊规则，但新模块应遵循标准主版本后缀约定。

## 伪版本与预发布版本

未打 tag 的提交可由 Go 表示为伪版本，其中包含基础版本、时间戳和提交摘要。
预发布版本如 `v1.3.0-rc.1` 的优先级低于最终的 `v1.3.0`。
业务项目优先依赖有明确 tag 的版本；临时伪版本应记录原因并尽快回到正式发布。

## replace 指令

`replace` 可把模块版本替换为另一个版本、分叉模块或本地目录。

```go
replace example.com/lib => ../lib
```

```go
replace example.com/lib v1.2.0 => example.com/fork/lib v1.2.1-0.20240601000000-abcdefabcdef
```

本地 replace 适合短期联调，但依赖开发机目录结构，不能被远程消费者复现。
主模块中的 replace 不会自动传递给依赖该模块的其他项目。
发布库前应检查并移除意外的本地 replace；长期 fork 还应有补丁维护和安全更新策略。

差异示例 2：`replace` 改变单个主模块的解析规则；workspace 在本地开发会话中同时组合多个模块而不改各自发布声明。

## Go Workspace

workspace 由 `go.work` 描述，适合同时修改多个相互依赖的模块。

```text
go work init ./service ./shared
go work use ./tools
go work sync
```

```go
go 1.22

use (
	./service
	./shared
	./tools
)
```

Go 会在当前目录及父目录查找 `go.work`，`GOWORK=off` 可显式禁用 workspace。
CI 必须明确构建是在 workspace 还是单模块模式下执行，避免本地成功但发布模块缺少依赖声明。
是否提交 `go.work` 取决于仓库是否把多模块协作视为共享构建入口，而不是一概提交或忽略。

## 私有模块

`GOPRIVATE` 告诉 Go 哪些模块路径不应通过公共代理和公共 checksum database 查询。

```text
go env -w GOPRIVATE=git.example.com/company/*
```

在 CI 中通常通过受控环境变量配置，而不是修改开发者全局环境。
同时检查 `GONOPROXY`、`GONOSUMDB` 和 `GOPROXY` 的组织策略。
凭据应由 Git credential helper、SSH agent 或 CI secret 管理，绝不能写入模块路径、go.mod 或仓库 URL。

## 安全更新流程

```text
go list -m -u all
govulncheck ./...
go get example.com/lib@v1.4.3
go mod tidy
go test ./...
go test -race ./...
```

先确认漏洞是否影响实际调用路径和目标平台，再选择包含修复的最小合适版本。
审查新版本发布说明、传递依赖变化和许可证，再执行单元、集成与并发测试。
安全扫描可能有误报或尚未覆盖的风险，不能代替供应商公告、代码审查和运行时防护。

对废弃或无人维护的依赖，应评估替换、内部维护或减少功能面，而不是无限停留在已知漏洞版本。
依赖更新机器人应限制权限，生成可审查的小变更，并禁止未经测试自动进入生产。

## 可复现与供应链注意

提交 `go.mod` 和 `go.sum`，在 CI 中使用明确的 Go 工具链版本。
模块缓存和代理提升速度，但不能替代来源审查、校验与构建环境隔离。
执行 `go test`、`go generate` 和构建过程都可能运行依赖或仓库中的代码，应按不可信代码管理凭据和网络权限。

```text
go env GOMOD GOWORK GOPROXY GOPRIVATE GOSUMDB
go mod verify
go mod tidy
git diff -- go.mod go.sum
```

更新后检查 diff，避免意外升级大量无关依赖或留下本地路径。
`go mod vendor` 可生成 vendor 目录；只有组织需要离线、审计或特定构建策略时才采用，并保持更新流程一致。

```text
go mod vendor
go build -mod=vendor ./...
```

vendor 并不自动提升安全性，过期副本反而可能隐藏已修复版本，应明确由谁更新和验证。

## 常见错误与工程注意

- 不要混淆 module、package 和 repository；一个仓库可以包含多个模块，一个模块包含多个包。
- 不要把 `go.sum` 删除当作常规故障修复，它会丢失已有校验记录并掩盖真正原因。
- 不要在发布的库中留下依赖个人目录的 `replace ../x`。
- 不要盲目运行全量 `go get -u`，应控制升级范围并审查兼容性。
- 不要把私有仓库令牌写入 URL 或提交到配置文件。
- 不要只在 workspace 中测试；发布独立模块前还应使用 `GOWORK=off` 验证。
- 不要假设 indirect 依赖无安全影响，它们同样进入构建或工具链路径。
- 不要仅凭版本号判断漏洞可利用性，结合 `govulncheck`、平台、构建标签和调用路径评估。
- 模块路径或主版本设计一旦发布会影响所有消费者，应在 v1 前仔细确定。

## 小结

`go.mod` 定义模块和依赖要求，`go.sum` 提供下载内容的校验记录，MVS 决定最终版本。
`replace` 用于有边界的替换，workspace 用于本地多模块协作，两者都要防止开发环境泄漏到发布流程。
安全更新应经过影响确认、最小升级、依赖审查、测试与 race 检测，并保护私有模块凭据和构建环境。
