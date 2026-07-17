# 多容器编排与集群生态

单个容器适合运行一个进程或一个服务实例。真实应用通常包含 Web、数据库、缓存、队列和后台任务，需要用编排工具描述服务关系、网络、卷和生命周期。

## Docker Compose 单机编排

Compose 使用 YAML 文件描述单机多容器应用。现代 Docker 通常使用 `docker compose` 子命令。

### 配置规范

典型 `compose.yml`：

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    depends_on:
      api:
        condition: service_healthy
    networks:
      - app-net

  api:
    build: ./api
    environment:
      APP_ENV: production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 10s
      timeout: 3s
      retries: 3
    volumes:
      - app-data:/var/lib/app
    networks:
      - app-net

networks:
  app-net:

volumes:
  app-data:
```

顶级节点常见包括 `services`、`networks`、`volumes`、`configs` 和 `secrets`。

### 生命周期编排

启动并创建资源：

```bash
docker compose up -d
```

停止并删除容器和默认网络：

```bash
docker compose down
```

常用命令：

```bash
docker compose ps
docker compose logs -f
docker compose start
docker compose stop
docker compose restart api
```

删除卷需要显式使用：

```bash
docker compose down -v
```

执行前应确认不会删除数据库或上传文件等状态数据。

### 环境变量级联注入

Compose 会读取项目目录下的 `.env` 文件，用于变量替换：

```env
APP_TAG=1.0.0
HTTP_PORT=8080
```

```yaml
services:
  web:
    image: registry.example.com/app:${APP_TAG}
    ports:
      - "${HTTP_PORT}:80"
```

`.env` 适合非敏感配置。密码、令牌和私钥应使用 secret 管理或外部密钥系统。

### depends_on 与健康检查

`depends_on` 控制启动顺序，不等于应用已经可用。需要配合 `healthcheck` 才能表达“服务健康后再启动依赖方”。

即使配置了健康检查，应用也应实现重试逻辑，因为运行期依赖服务可能随时重启或短暂不可用。

## Swarm 集群原生编排

Docker Swarm 是 Docker 原生集群编排能力。它适合学习服务编排、滚动更新、内置负载均衡和多节点调度。

### 集群构建

初始化 Manager：

```bash
docker swarm init --advertise-addr <manager-ip>
```

获取 Worker 加入命令：

```bash
docker swarm join-token worker
```

Swarm 节点角色：

| 角色 | 职责 |
| --- | --- |
| Manager | 管理集群状态、调度服务、维护 Raft 一致性 |
| Worker | 运行任务并向 Manager 上报状态 |

Manager 使用 Raft 协议维护集群期望状态。生产集群通常部署奇数个 Manager，降低脑裂和选举风险。

### 服务编排对象

Service 是声明式服务定义：

```bash
docker service create --name web --replicas 3 -p 8080:80 nginx:alpine
```

Stack 是多服务编排的集群版，可使用 Compose 格式部署：

```bash
docker stack deploy -c compose.yml app
docker stack services app
docker stack ps app
```

### 运行调度

Replicated 模式指定副本数：

```bash
docker service scale web=5
```

Global 模式在每个符合条件的节点运行一个任务，适合日志采集、监控 agent 和节点级守护进程：

```bash
docker service create --mode global --name agent image
```

滚动更新：

```bash
docker service update --image nginx:1.27 --update-parallelism 1 web
```

回滚：

```bash
docker service rollback web
```

调度时可结合资源限制、节点标签和约束，把服务放到合适节点。

### 集群路由

Swarm 的 Ingress Routing Mesh 允许访问任意节点的发布端口，再由集群转发到实际任务。

优点：

- 发布端口统一。
- 内置负载均衡。
- 服务副本迁移后入口不变。

注意点：

- 转发路径可能增加延迟。
- 需要放通集群通信端口。
- 与外部负载均衡、TLS 终止和真实客户端 IP 保留策略一起设计。

## Compose 与 Swarm 的边界

| 项目 | Compose | Swarm |
| --- | --- | --- |
| 主要场景 | 单机开发、测试、小规模部署 | 多节点集群 |
| 调度能力 | 本机容器生命周期 | 跨节点调度 |
| 负载均衡 | 依赖本机网络和外部组件 | 内置服务发现和 Routing Mesh |
| 运维复杂度 | 较低 | 较高 |

更大规模或云原生生产环境通常会引入 Kubernetes，但学习 Docker Compose 和 Swarm 有助于理解容器编排的基本对象和运行模型。
