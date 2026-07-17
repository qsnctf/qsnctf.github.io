# Dockerfile 进阶与构建艺术

Dockerfile 决定镜像的可复现性、体积、安全边界和运行行为。生产级构建应追求明确、可审计、缓存友好和最小运行面。

## 核心构建指令详解

### 基础上下文

`FROM` 指定基础镜像：

```dockerfile
FROM python:3.12-slim
```

生产构建建议固定主版本，并在关键场景使用 Digest 锁定内容。

`WORKDIR` 设置工作目录：

```dockerfile
WORKDIR /app
```

`USER` 切换运行用户：

```dockerfile
USER appuser
```

容器默认 root 不等于宿主机 root，但仍会扩大风险。服务进程应尽量使用非 root 用户运行。

### 执行与复制

`RUN` 在构建时执行命令并生成新层：

```dockerfile
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
```

`COPY` 从构建上下文复制文件：

```dockerfile
COPY . /app
```

`ADD` 也能复制文件，但额外支持 URL 下载和本地压缩包自动解压。多数情况下优先使用 `COPY`，因为语义更明确。

### 生命周期变量

`ARG` 是构建期变量：

```dockerfile
ARG APP_VERSION=dev
```

`ENV` 写入镜像运行环境：

```dockerfile
ENV APP_ENV=production
```

敏感信息不应通过 `ARG` 或 `ENV` 固化进镜像层。构建密钥应使用 BuildKit secret 等机制。

### 暴露配置

`EXPOSE` 声明容器预期监听端口：

```dockerfile
EXPOSE 8080
```

它不自动发布端口，仍需 `docker run -p` 或 Compose 端口映射。

`VOLUME` 声明挂载点：

```dockerfile
VOLUME ["/data"]
```

生产镜像中是否使用 `VOLUME` 需要谨慎。它会影响后续层对该路径写入的可见性和 Compose 挂载行为。

## CMD vs ENTRYPOINT

`CMD` 提供默认命令或默认参数：

```dockerfile
CMD ["python", "app.py"]
```

`ENTRYPOINT` 定义容器主入口：

```dockerfile
ENTRYPOINT ["python", "app.py"]
```

常见组合：

```dockerfile
ENTRYPOINT ["python", "app.py"]
CMD ["--host", "0.0.0.0"]
```

运行时追加参数会覆盖或追加到默认参数，具体行为取决于 `CMD` 和 `ENTRYPOINT` 的组合。

### Shell 格式与 Exec 格式

Shell 格式：

```dockerfile
CMD python app.py
```

Exec 格式：

```dockerfile
CMD ["python", "app.py"]
```

Shell 格式会通过 `/bin/sh -c` 启动，可能影响 PID 1、信号传递和参数转义。Exec 格式更明确，通常更适合生产服务。

容器内 PID 1 对信号处理和僵尸进程回收有特殊影响。复杂服务可考虑使用 `--init` 或专门的 init 进程。

### 覆盖规则

`docker run image arg` 会替换 `CMD`。覆盖入口可使用：

```bash
docker run --entrypoint sh image
```

调试时覆盖入口很方便，但生产配置应保持入口命令稳定，避免不同环境启动行为不一致。

## 生产级构建优化

### 多阶段构建

多阶段构建把编译环境和运行环境分离：

```dockerfile
FROM golang:1.22 AS build
WORKDIR /src
COPY . .
RUN go build -o app ./cmd/app

FROM gcr.io/distroless/base-debian12
COPY --from=build /src/app /app
USER nonroot:nonroot
ENTRYPOINT ["/app"]
```

最终镜像只包含运行所需文件，减少体积和攻击面。

### 构建缓存

Docker 按指令顺序计算缓存。前面的层变化会导致后续层缓存失效。

常见优化：

- 先复制依赖清单，再安装依赖。
- 最后复制频繁变化的业务源码。
- 合理合并安装和清理命令。
- 避免把无关文件放进构建上下文。

示例：

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
```

### .dockerignore

`.dockerignore` 控制发送给 Docker daemon 的构建上下文。

```gitignore
.git
node_modules
dist
*.log
.env
```

它既能减少构建时间，也能降低把密钥和无关文件写入镜像的风险。

### 基础镜像瘦身

常见选择：

| 类型 | 特点 |
| --- | --- |
| Debian/Ubuntu slim | 兼容性较好，体积适中 |
| Alpine | 体积小，musl libc 可能带来兼容差异 |
| Distroless | 运行面极小，缺少 shell 和包管理器 |
| Scratch | 空镜像，适合静态二进制 |

镜像越小不一定越好。调试能力、依赖兼容、安全更新和团队经验都应纳入选择。

## 构建检查清单

1. 基础镜像来源是否可信。
2. 是否使用非 root 用户运行。
3. 是否把密钥、`.env`、缓存和测试数据排除出上下文。
4. 是否区分构建依赖和运行依赖。
5. 是否正确处理 PID 1 和信号。
6. 是否能用 Dockerfile 完整复现镜像，而不是依赖 `docker commit`。
