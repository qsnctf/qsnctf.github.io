# 容器生命周期与核心操作

容器是镜像运行后的实例。它拥有独立的进程、文件系统可写层、网络配置和资源限制。掌握生命周期命令能帮助定位启动失败、日志异常和资源泄漏。

## 容器生命周期管理

### 初始阶段：create

`create` 根据镜像和参数创建容器上下文，但不启动进程：

```bash
docker create --name web nginx:alpine
```

此时容器已拥有配置、可写层和元数据，适合调试启动参数或预创建对象。

### 运行阶段：run、start、restart

`run` 等价于拉取镜像、创建容器并启动：

```bash
docker run --name web -d -p 8080:80 nginx:alpine
```

启动已存在容器：

```bash
docker start web
```

重启容器：

```bash
docker restart web
```

长期服务应显式配置重启策略：

```bash
docker run --restart unless-stopped nginx:alpine
```

### 暂停与挂起

`pause` 会冻结容器内进程调度，`unpause` 恢复执行：

```bash
docker pause web
docker unpause web
```

它适合短时间冻结状态，不等同于优雅停机。被暂停的服务不会处理请求，也可能造成上游超时。

### 终止阶段：stop 与 kill

`stop` 先发送 `SIGTERM`，等待超时后再发送 `SIGKILL`：

```bash
docker stop web
docker stop -t 30 web
```

`kill` 默认发送 `SIGKILL`，强制终止：

```bash
docker kill web
```

生产服务应正确处理 `SIGTERM`，完成连接关闭、任务落盘和锁释放。

### 销毁阶段：rm 与 prune

删除已停止容器：

```bash
docker rm web
```

清理所有停止容器：

```bash
docker container prune
```

容器删除会移除可写层，但不会自动删除具名卷。清理前应确认数据是否已经备份。

## 容器交互与日常操作

### 执行与接入

`exec` 在运行中的容器里启动新进程：

```bash
docker exec -it web sh
```

它适合临时排查，但不应作为常规变更手段。容器内手动修改不会进入镜像构建记录。

`attach` 绑定容器主进程的标准输入、输出和错误流：

```bash
docker attach web
```

对交互式容器使用 `attach` 时要小心退出方式，避免把主进程一起终止。

### 日志与监控

查看日志：

```bash
docker logs web
docker logs -f --tail 100 web
```

查看进程：

```bash
docker top web
```

查看资源：

```bash
docker stats
```

查看事件流：

```bash
docker events
```

日志驱动可能有截断、轮转和输出后端差异。生产环境应显式设置日志驱动和大小限制，避免容器日志占满磁盘。

### 数据流传输

宿主机与容器互传文件：

```bash
docker cp ./config.yml web:/etc/app/config.yml
docker cp web:/var/log/app.log ./app.log
```

查看容器相对镜像的文件变动：

```bash
docker diff web
```

`diff` 输出中的 `A`、`C`、`D` 分别代表新增、修改和删除。它适合排查运行时写入位置。

### 序列化持久化

把容器当前状态提交为镜像：

```bash
docker commit web web-debug:latest
```

`commit` 会捕获可写层，但缺少可审计构建过程。生产镜像应使用 Dockerfile 构建。

导出容器文件系统：

```bash
docker export web -o web-rootfs.tar
docker import web-rootfs.tar web-imported:latest
```

`export/import` 处理的是文件系统快照，不保留完整镜像历史和配置。镜像迁移通常使用 `docker save` 与 `docker load`。

## 排查顺序

1. `docker ps -a` 查看容器状态和退出码。
2. `docker logs` 查看主进程输出。
3. `docker inspect` 核对环境变量、挂载、网络和入口命令。
4. `docker exec` 进入容器检查文件、进程和端口。
5. `docker stats` 判断资源瓶颈。
6. `docker events` 观察重启、OOM、健康检查和网络事件。
