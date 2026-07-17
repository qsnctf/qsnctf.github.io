# Go 语言环境安装

本篇以 Go 1.22+ 为基线，介绍 Windows、macOS 和 Linux 的可信安装方式以及模块环境验证。
安装目标不是让 `go version` 偶然成功，而是建立版本明确、路径可解释、项目可复现的环境。

## 安装前选择

优先使用以下来源之一：

- Go 官方发行包：适合需要明确版本和官方布局的场景。
- 操作系统包管理器：适合统一维护，但仓库版本可能较旧。
- 可信版本管理器：适合维护多个 Go 版本，但应记录团队统一用法。

不要从不明镜像下载二进制，也不要同时叠加多种安装方式后依赖 PATH 的偶然顺序。
生产项目的最低版本应写入 `go.mod`，而不是只记录在个人电脑中。

## Windows 安装

从 <https://go.dev/dl/> 下载官方 MSI，按默认方式安装后重新打开终端。
在 PowerShell 中验证：

```powershell
go version
Get-Command go
go env GOROOT GOPATH GOENV
```

默认情况下，SDK 常位于 `C:\Program Files\Go`，用户工作区通常位于 `%USERPROFILE%\go`。
实际路径以 `go env` 输出为准，不要手工假设。

## macOS 安装

可以使用官方 PKG，或使用 Homebrew：

```bash
brew install go
go version
command -v go
go env GOROOT GOPATH
```

若之前安装过其他版本，检查 shell 启动文件是否残留旧的 PATH 或 GOROOT。

## Linux 安装

发行版包管理器安装方便，但版本可能落后：

```bash
go version
command -v go
```

使用官方压缩包时，应严格遵循 <https://go.dev/doc/install> 的当前步骤并校验下载来源。
升级官方压缩包安装时，先移除旧的 GOROOT 目录，再解压完整新版本；不要把新文件覆盖到旧目录形成混合 SDK。

## 环境变量边界

`GOROOT` 指向 Go SDK，官方安装通常能自动推导，不建议无理由手工设置。
`GOPATH` 默认是用户目录下的 `go`，现在主要存放模块缓存和安装的命令。
项目源码不再要求放入 GOPATH，Go Modules 项目可以位于任意普通目录。

常用检查命令：

```bash
go env GOROOT GOPATH GOMOD GOMODCACHE GOPROXY
go env -json
```

不要把包含私有模块路径、代理凭据或公司内部地址的完整 `go env` 输出公开发布。

## 创建验证模块

```bash
mkdir go-install-check
cd go-install-check
go mod init example.com/go-install-check
```

创建 `main.go`：

```go
package main

import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Println(runtime.Version())
	fmt.Println(runtime.GOOS, runtime.GOARCH)
}
```

执行：

```bash
go fmt ./...
go run .
go build .
go test ./...
```

即使没有测试文件，`go test ./...` 也能验证包是否可编译。

## 差异示例一：`go install` 与 `go get`

安装命令行工具应使用带版本的 `go install`：

```bash
go install golang.org/x/tools/gopls@latest
```

为当前模块添加或调整库依赖通常使用：

```bash
go get example.com/some/module@v1.2.3
```

现代 Go 中不要照搬旧教程用 `go get` 安装全局可执行工具。

## 差异示例二：GOROOT 与 GOPATH

`GOROOT` 是 SDK 本身，包含编译器、标准库源码和工具。
`GOPATH` 是用户级工作区及缓存位置；两者不是同一个目录，也不应互相覆盖。
模块项目的位置通常既不是 GOROOT，也不必在 GOPATH 下。

## 私有模块和代理

公共模块默认可通过 `GOPROXY` 获取。
私有模块可按组织域名设置 `GOPRIVATE`，避免把私有模块查询发送到公共代理或校验服务：

```bash
go env -w GOPRIVATE=git.example.com
```

团队环境应通过安全的凭据管理和内部文档配置访问，不要把令牌写入 `go.env` 示例或仓库。
执行 `go env -w` 会持久化用户配置；临时实验可优先使用当前 shell 环境变量。

## 常见错误

- `go` 命令仍指向旧版本：检查 `where.exe go` 或 `command -v -a go`。
- 手工设置了错误 GOROOT：删除无必要设置，让工具链自动识别。
- 代理下载失败：区分网络问题、模块不存在、私有仓库权限和校验失败。
- 在系统受保护目录创建项目：改用普通用户可写目录。
- 直接删除 `go.sum` 试图修复依赖：先理解依赖和校验错误来源。

## 工程实践

- 团队明确最低 Go 版本，并在 CI 中使用同一主次版本验证。
- 提交 `go.mod` 和 `go.sum`，不要提交模块缓存或 GOROOT 内容。
- 升级 Go 后执行完整测试、竞态检查和关键基准，不只看编译结果。
- 使用 `go env GOMOD` 确认当前命令作用于预期模块。
- 使用 `go clean -modcache` 前确认确有缓存损坏；它会导致依赖重新下载。

环境验证完成后，再配置编辑器和调试器，避免把 SDK 问题误判为 IDE 问题。
