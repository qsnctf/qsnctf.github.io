# Git 服务器搭建

除了使用 GitHub、GitLab、Gitee，也可以搭建自己的 Git 服务器。

## 基于 SSH 的裸仓库

在服务器上创建专用用户：

```bash
sudo adduser git
```

创建裸仓库：

```bash
sudo mkdir -p /srv/git/project.git
cd /srv/git/project.git
sudo git init --bare
```

本地添加远程地址：

```bash
git remote add origin git@server:/srv/git/project.git
git push -u origin main
```

## 裸仓库是什么

裸仓库没有工作区，只保存 Git 版本数据，适合作为远程仓库。

普通仓库：

```text
project/.git
```

裸仓库：

```text
project.git/
```

## 权限控制

简单场景可以通过 SSH 公钥控制访问。团队规模较大时，建议使用 GitLab、Gitea 等平台。

## Gitea

Gitea 是轻量级自建 Git 服务，适合个人、小团队和内网环境。

常见能力：

- Web 管理界面
- 仓库权限管理
- Issue 和 Pull Request
- Webhook
- Actions 自动化
