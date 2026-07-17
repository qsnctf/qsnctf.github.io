# 数据持久化与网络矩阵

容器默认可写层适合短生命周期数据，不适合持久保存业务状态。网络方面，Docker 通过不同驱动提供单机、宿主机、隔离和跨主机场景的通信模型。

## 卷与存储方案

### Data Volumes

Volume 由 Docker 管理，数据保存在宿主机 Docker 数据目录中。

```bash
docker volume create app-data
docker run -v app-data:/var/lib/app image
```

特点：

- 性能通常较好。
- 生命周期独立于容器。
- 适合数据库、上传文件和状态数据。
- 可被多个容器挂载，但并发写入要由应用或存储保证一致性。

查看和清理：

```bash
docker volume ls
docker volume inspect app-data
docker volume prune
```

### Bind Mounts

绑定挂载把宿主机任意绝对路径映射进容器：

```bash
docker run -v /host/path:/container/path image
```

它适合开发实时调试、挂载配置文件和读取宿主机目录。缺点是强依赖宿主机路径，权限和 SELinux/AppArmor 策略也更容易影响运行结果。

### Tmpfs Mounts

Tmpfs 把数据存放在宿主机内存中：

```bash
docker run --tmpfs /run/secrets:rw,noexec,nosuid,size=64m image
```

它适合临时敏感数据、缓存和不需要落盘的中间文件。容器停止后数据消失。

### 数据维护

卷备份示例：

```bash
docker run --rm \
  -v app-data:/data \
  -v "$PWD":/backup \
  alpine tar czf /backup/app-data.tar.gz -C /data .
```

恢复示例：

```bash
docker run --rm \
  -v app-data:/data \
  -v "$PWD":/backup \
  alpine sh -c 'cd /data && tar xzf /backup/app-data.tar.gz'
```

清理容量前应先使用 `docker system df -v` 和应用侧检查确认哪些卷仍被需要。

## 网络架构拓扑

查看网络：

```bash
docker network ls
docker network inspect bridge
```

### Bridge

Bridge 是单机默认网络模型。容器连接到 Linux 网桥，通过 NAT 访问外部网络。

创建自定义网桥：

```bash
docker network create app-net
docker run --network app-net --name api api-image
docker run --network app-net --name web web-image
```

自定义网桥提供内置 DNS，容器可通过服务名互相访问。相比默认 `bridge`，自定义网桥更适合单机多容器应用。

### Host

Host 网络不隔离网络命名空间，容器直接使用宿主机网络：

```bash
docker run --network host image
```

优点是网络路径短、延迟低、端口开销少。缺点是端口冲突和隔离弱化，服务直接暴露在宿主机网络面上。

### None

None 网络提供独立但无外部连接的网络命名空间：

```bash
docker run --network none image
```

它适合离线计算、高隔离任务或手动配置网络的实验。

### Overlay

Overlay 网络用于跨主机容器通信，常见于 Swarm。它通常基于 VxLAN 隧道，把不同宿主机上的容器放入同一逻辑网络。

```bash
docker network create -d overlay app-overlay
```

Overlay 依赖集群控制面、节点间连通和必要端口放通。排查时要同时检查防火墙、MTU、节点状态和服务发现。

### Macvlan

Macvlan 让容器直接出现在物理局域网中，拥有独立 MAC 和局域网 IP。

```bash
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 lan-net
```

它适合需要被局域网直接访问的服务，但会引入交换机、网卡混杂模式、宿主机与容器互通等额外约束。

## 端口发布

发布端口：

```bash
docker run -p 8080:80 nginx:alpine
```

仅绑定本地地址：

```bash
docker run -p 127.0.0.1:8080:80 nginx:alpine
```

生产环境应明确绑定地址，不要默认把管理服务暴露到所有网卡。

## 存储与网络检查清单

1. 状态数据是否放在 volume 或外部存储中。
2. 备份恢复流程是否实际演练过。
3. bind mount 是否依赖不可移植的宿主机路径。
4. 容器间通信是否使用自定义网络和服务名。
5. 对外端口是否只绑定必要地址。
6. 是否明确日志、缓存和临时文件的落盘位置。
