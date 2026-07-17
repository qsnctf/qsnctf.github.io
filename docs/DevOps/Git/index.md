# Git 教程

Git 是分布式版本控制系统，用来记录代码变化、协作开发、管理分支和回滚历史。无论是 CTF 项目、靶场配置、脚本仓库，还是生产环境部署流程，Git 都是最基础的工程工具之一。

## 学习路线

1. [Git 安装配置](installation-and-configuration.md)
2. [Git 工作流程](workflow.md)
3. [Git 工作区、暂存区和版本库](areas.md)
4. [Git 创建仓库](repository.md)
5. [Git 基本操作](basic-operations.md)
6. [Git 分支管理](branch-management.md)
7. [Git 查看提交历史](commit-history.md)
8. [Git 标签](tags.md)
9. [Git Flow](git-flow.md)
10. [Git 进阶操作](advanced-operations.md)
11. [Git GitHub](github.md)
12. [Git 服务器搭建](server.md)
13. [Sourcetree](sourcetree.md)
14. [Git 测验](quiz.md)
15. [GitHub Actions](github-actions.md)

## 常用命令速查

| 场景 | 命令 |
| ---- | ---- |
| 查看状态 | `git status` |
| 暂存文件 | `git add <file>` |
| 提交改动 | `git commit -m "message"` |
| 查看历史 | `git log --oneline --graph --decorate --all` |
| 创建分支 | `git checkout -b <branch>` |
| 切换分支 | `git switch <branch>` |
| 拉取更新 | `git pull origin <branch>` |
| 推送分支 | `git push origin <branch>` |
