# Docker 镜像管理与底座

镜像是容器运行环境的只读模板。理解镜像管理、rootfs、分层文件系统和仓库机制，能避免构建膨胀、缓存失效、标签混乱和供应链风险。

## 本地镜像管理

### 查询与检索

查看本地镜像：

```bash
docker images
docker image ls
```

搜索远程镜像：

```bash
docker search nginx
```

查看镜像元数据：

```bash
docker inspect nginx:alpine
```

`inspect` 输出包含镜像 ID、入口命令、环境变量、暴露端口、架构、层信息和配置摘要。排查问题时应关注 `Config.Cmd`、`Config.Entrypoint`、`Config.Env`、`Architecture`、`Os` 和 `RootFS.Layers`。

### 清理与维护

删除指定镜像：

```bash
docker rmi nginx:alpine
docker image rm nginx:alpine
```

清理悬空镜像和无用构建缓存：

```bash
docker image prune
docker builder prune
```

清理所有未被使用的镜像、容器、网络和构建缓存前应先确认影响范围：

```bash
docker system df
docker system prune
```

`prune` 会回收未被引用的对象，不适合在不清楚运行依赖的生产主机上直接执行。

### 标签与分类

镜像标签用于命名和分发：

```bash
docker tag local-app:dev registry.example.com/team/app:1.0.0
```

标签不是强校验，只是可变引用。更强的校验方式是 Digest：

```text
nginx@sha256:<digest>
```

Digest 基于内容寻址，能确保拉取的是特定内容。生产发布中常结合语义化标签和 Digest，兼顾可读性与可验证性。

## 容器的 root 文件系统

容器启动时会基于镜像层组合出 rootfs。容器中的 `/bin`、`/etc`、`/usr`、`/app` 等路径来自镜像层和运行时挂载。

rootfs 不是完整虚拟机磁盘。容器共享宿主机内核，隔离边界主要依赖 namespace、cgroup、capabilities、seccomp、AppArmor/SELinux 和文件系统挂载策略。

## 分层联合文件系统

Docker 镜像由多个只读层组成。容器运行时会在只读层上方添加一个可写层。

```text
container writable layer
image layer N
image layer N-1
...
base image layer
```

UnionFS 将多个层级叠加为统一视图。只读层可被多个容器共享，可写层属于具体容器。

## 写时复制

Copy-on-Write 表示容器修改镜像中已有文件时，不会直接改动只读层，而是先把文件复制到容器可写层，再在可写层修改。

这带来两个影响：

- 多个容器共享相同镜像层，节省磁盘空间。
- 修改大文件可能触发复制成本，造成空间和性能开销。

频繁变化的数据不应放在镜像层或容器可写层中，应使用 volume、bind mount 或外部存储。

## 存储驱动

存储驱动负责实现镜像层和可写层的叠加。现代 Linux 环境中常用 `overlay2`。

查看当前驱动：

```bash
docker info | grep -i "Storage Driver"
```

### Overlay2 核心原理

Overlay2 基于 Linux OverlayFS。它使用 lowerdir 表示只读层，upperdir 表示容器可写层，merged 表示叠加后的视图。

特点：

- 性能和稳定性适合多数现代 Linux 发行版。
- 依赖底层文件系统能力，常见选择是 ext4 或 xfs。
- xfs 场景通常要求 `ftype=1`。

### 与旧驱动对比

| 驱动 | 特点 | 现状 |
| --- | --- | --- |
| Overlay2 | 主流、简单、性能较好 | 推荐默认选择 |
| AUFS | 早期常见，依赖内核支持 | 多数场景已被替代 |
| Devicemapper | 基于块设备快照 | 配置复杂，旧环境常见 |

优化时应先确认宿主机文件系统、Docker 版本、内核版本和实际 I/O 模式，不要只凭单个指标更换驱动。

## 镜像仓库

Registry 用于存储和分发镜像。镜像名通常包含仓库地址、命名空间、名称和标签：

```text
registry.example.com/team/app:1.0.0
```

### 公共仓库

Docker Hub 是最常见公共仓库。使用时应注意：

- 官方镜像与社区镜像的来源差异。
- 匿名和免费账户的拉取速率限制。
- 多架构镜像通过 manifest list 支持不同 CPU 架构。
- 不应把敏感配置写入公开镜像层。

### 私有仓库搭建

开源 Docker Registry 可用于内部镜像分发：

```bash
docker run -d --name registry -p 5000:5000 registry:2
```

生产环境应配置 TLS 证书、认证、访问控制、备份和存储后端。客户端访问自签证书仓库时，需要正确安装 CA，而不是长期使用不安全配置绕过校验。

### Harbor

Harbor 是企业级镜像与制品仓库，常见能力包括：

- 多租户项目和 RBAC 权限。
- 镜像复制和跨仓同步。
- 漏洞扫描和安全策略。
- 镜像签名、保留策略和垃圾回收。
- OCI 制品管理，例如 Helm Chart。

企业环境中，镜像仓库不仅是下载源，也是供应链治理入口。
