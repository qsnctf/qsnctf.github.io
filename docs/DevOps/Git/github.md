# Git GitHub

Git 是版本控制工具，GitHub 是代码托管平台。你可以把本地 Git 仓库推送到 GitHub，进行备份、协作、Code Review 和自动化构建。

## 创建仓库

在 GitHub 页面点击 New repository，填写仓库名后创建。

## 连接远程仓库

HTTPS 地址示例：

```bash
git remote add origin https://github.com/username/repo.git
```

SSH 地址示例：

```bash
git remote add origin git@github.com:username/repo.git
```

## 推送代码

```bash
git push -u origin main
```

## Fork

Fork 会把别人的仓库复制一份到自己的账号下。常见开源贡献流程：

1. Fork 原仓库。
2. Clone 自己的 Fork。
3. 创建分支并修改。
4. Push 到自己的 Fork。
5. 向原仓库提交 Pull Request。

## Pull Request

Pull Request 用于请求把一个分支的修改合并到另一个分支。团队通常会在 PR 中做代码审查、自动化测试和讨论。

## Issue

Issue 用于记录 Bug、需求、任务和讨论。良好的 Issue 应包含问题描述、复现步骤、期望结果和环境信息。
