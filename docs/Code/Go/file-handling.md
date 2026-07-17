# Go 文件处理

Go 的文件 API 主要位于 `os`、`io`、`bufio`、`path/filepath` 和 `io/fs` 包。
文件处理不仅是读写字节，还涉及资源关闭、权限、路径边界、部分写入和崩溃一致性。
对小配置文件可整体读取；对日志、上传和大型数据应采用流式处理。

## 打开、创建与关闭

`os.Open` 以只读方式打开文件，`os.Create` 会创建或截断文件并使用默认权限掩码。
需要明确控制标志和权限时使用 `os.OpenFile`。

```go
f, err := os.Open("config.json")
if err != nil {
	return fmt.Errorf("open config: %w", err)
}
defer f.Close()
```

成功打开资源后立即安排 `defer`，能覆盖后续所有返回路径。
循环中打开大量文件时，不要把 `defer` 堆积到外层函数结束；把单次处理提取为函数。

```go
func process(path string) error {
	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()
	// 处理单个文件。
	return nil
}
```

## 整体读取与流式读取

`os.ReadFile` 简洁但会把全部内容放入内存，适合大小已知且受控的小文件。
流式读取使用 `io.Reader`，可限制内存占用，也便于组合解压、哈希和协议解析。

```go
data, err := os.ReadFile("settings.json")
if err != nil {
	return fmt.Errorf("read settings: %w", err)
}
```

```go
func copyWithLimit(dst io.Writer, src io.Reader, limit int64) error {
	n, err := io.Copy(dst, io.LimitReader(src, limit+1))
	if err != nil {
		return fmt.Errorf("copy: %w", err)
	}
	if n > limit {
		return fmt.Errorf("input exceeds %d bytes", limit)
	}
	return nil
}
```

差异示例 1：`os.ReadFile` 以简单性换取与文件大小相当的内存；`io.Copy` 以固定缓冲流式传输，更适合大文件。
对不可信输入设置上限，避免攻击者通过超大文件或无限流耗尽内存和磁盘。

## bufio 与逐行处理

`bufio.Scanner` 适合逐行或按 token 读取，但默认 token 上限为 64 KiB 左右。
长行输入必须调用 `Scanner.Buffer` 调整上限，并检查 `scanner.Err()`。

```go
scanner := bufio.NewScanner(f)
scanner.Buffer(make([]byte, 64*1024), 1024*1024)
for scanner.Scan() {
	line := scanner.Text()
	fmt.Println(line)
}
if err := scanner.Err(); err != nil {
	return fmt.Errorf("scan file: %w", err)
}
```

需要精确保留分隔符、处理超长记录或更细粒度控制时，使用 `bufio.Reader`。
写入许多小块时使用 `bufio.Writer`，并务必检查 `Flush` 返回的错误。

## 写入、权限与关闭错误

Unix 风格权限 `0o600` 表示仅所有者可读写，`0o644` 表示所有者可写、其他用户只读。
实际权限还受进程 umask 和操作系统语义影响，Windows 不完整实现 Unix 权限模型。

```go
func writePrivate(path string, data []byte) (err error) {
	f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0o600)
	if err != nil {
		return fmt.Errorf("open %q: %w", path, err)
	}
	defer func() {
		err = errors.Join(err, f.Close())
	}()

	if _, err := f.Write(data); err != nil {
		return fmt.Errorf("write %q: %w", path, err)
	}
	return nil
}
```

差异示例 2：`os.WriteFile` 适合一次性写入小内容；`os.OpenFile` 加流式写入适合大内容并提供追加、独占创建等标志控制。
追加日志可使用 `os.O_APPEND`，避免多个写入者自行先 seek 到末尾造成覆盖，但仍要考虑一条记录是否会被拆分。

## 路径处理与安全边界

文件系统路径使用 `path/filepath`；URL 路径使用 `path`，两者不可混用。
`filepath.Join` 会清理分隔符，但不会自动保证结果仍位于预期根目录。
不要把用户输入直接拼到根目录，也不要仅靠检查字符串中是否含 `..`。

```go
func safePath(root, name string) (string, error) {
	if filepath.IsAbs(name) {
		return "", errors.New("absolute path is not allowed")
	}

	clean := filepath.Clean(name)
	full := filepath.Join(root, clean)
	rel, err := filepath.Rel(root, full)
	if err != nil {
		return "", fmt.Errorf("resolve path: %w", err)
	}
	if rel == ".." || strings.HasPrefix(rel, ".."+string(filepath.Separator)) {
		return "", errors.New("path escapes root")
	}
	return full, nil
}
```

这类词法检查不能完全阻止符号链接竞态。
高安全场景应使用操作系统提供的目录句柄和“不跟随符号链接”能力，或把不可信操作隔离到专用目录/进程。
上传文件名应重新生成，不能信任客户端给出的路径、扩展名或 MIME 类型。

## 原子写入概念

直接截断目标文件后写入，进程崩溃时可能留下空文件或半写文件。
常见做法是在目标同一目录创建临时文件，写入并检查错误，必要时 `Sync`，再用 `os.Rename` 替换目标。

```go
func atomicWrite(path string, data []byte, perm fs.FileMode) (err error) {
	dir := filepath.Dir(path)
	tmp, err := os.CreateTemp(dir, ".tmp-*")
	if err != nil {
		return fmt.Errorf("create temp file: %w", err)
	}
	tmpName := tmp.Name()
	defer func() {
		_ = tmp.Close()
		_ = os.Remove(tmpName)
	}()

	if err := tmp.Chmod(perm); err != nil {
		return fmt.Errorf("set temp permission: %w", err)
	}
	if _, err := tmp.Write(data); err != nil {
		return fmt.Errorf("write temp file: %w", err)
	}
	if err := tmp.Sync(); err != nil {
		return fmt.Errorf("sync temp file: %w", err)
	}
	if err := tmp.Close(); err != nil {
		return fmt.Errorf("close temp file: %w", err)
	}
	if err := os.Rename(tmpName, path); err != nil {
		return fmt.Errorf("replace target: %w", err)
	}
	return nil
}
```

同目录临时文件通常确保 rename 不跨文件系统；rename 的覆盖语义在不同操作系统上仍有差异。
严格持久性还可能要求同步父目录，是否需要取决于操作系统、文件系统和业务耐久性要求。

## 常见错误与工程注意

- 不要忽略 `Read` 返回的字节数；`n > 0` 与非 nil 错误可以同时出现。
- 不要假设一次 `Write` 必然写完全部数据；通用 `io.Writer` 允许短写，优先使用 `io.Copy` 或检查 `n`。
- 不要忘记检查 `Scanner.Err`、`Writer.Flush`、关键写入的 `Close` 和 `Sync` 错误。
- 不要对大文件使用无上限的 `io.ReadAll`。
- 不要用 `0777` 作为默认权限，敏感配置和密钥应从最小权限开始。
- 临时文件也可能包含敏感数据，应放在受控目录、设置权限并确保失败时删除。
- 先验证文件类型和大小，再解析不可信内容；压缩文件还要防止解压路径穿越和压缩炸弹。
- 文件名比较、大小写和符号链接行为依赖平台，跨平台程序必须在目标系统测试。

## 小结

小文件可用 `os.ReadFile/WriteFile`，大文件使用 `io.Reader/io.Writer` 流式处理。
资源成功打开后立即安排关闭，并检查关键写入链路中的刷新、关闭和同步错误。
权限、路径约束、输入上限与原子替换共同构成可靠文件处理，而不是附加选项。
