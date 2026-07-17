# Docker 教程

Docker 使用镜像描述应用运行环境，用容器提供隔离后的进程运行空间。它适合快速交付服务、复现实验环境、隔离依赖和统一部署流程。

## 核心概念

| 概念 | 含义 |
| --- | --- |
| Image | 只读模板，包含 rootfs、元数据和启动配置 |
| Container | 镜像运行后的实例，包含可写层和运行状态 |
| Dockerfile | 构建镜像的声明式文件 |
| Registry | 镜像仓库，用于存储和分发镜像 |
| Volume | 独立于容器生命周期的数据存储 |
| Network | 容器间和容器外部通信的网络抽象 |
| Compose | 单机多容器编排工具 |

## 阅读路线

1. [Docker 镜像管理与底座](image-management-and-foundation.md)
2. [容器生命周期与核心操作](container-lifecycle-and-operations.md)
3. [Dockerfile 进阶与构建艺术](dockerfile-advanced-builds.md)
4. [数据持久化与网络矩阵](storage-and-networking.md)
5. [多容器编排与集群生态](compose-and-cluster.md)

## 基本工作流

```bash
docker pull nginx:alpine
docker run --name web -p 8080:80 nginx:alpine
docker ps
docker logs web
docker stop web
docker rm web
```

生产环境不要依赖交互式手工命令长期维护服务，应把镜像构建、配置、数据卷、网络和健康检查写入可复现的配置文件。
