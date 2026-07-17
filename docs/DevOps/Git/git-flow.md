# Git Flow

Git Flow 是一种分支管理模型，适合有版本发布节奏的团队。

## 常见分支

| 分支 | 作用 |
| ---- | ---- |
| `main` | 线上稳定版本 |
| `develop` | 日常开发集成分支 |
| `feature/*` | 新功能开发分支 |
| `release/*` | 发布准备分支 |
| `hotfix/*` | 线上紧急修复分支 |

## 工作方式

新功能从 `develop` 创建：

```bash
git switch develop
git switch -c feature/login
```

开发完成后合并回 `develop`：

```bash
git switch develop
git merge feature/login
```

准备发布时创建 `release` 分支：

```bash
git switch -c release/1.0.0
```

发布后合并到 `main` 并打标签：

```bash
git switch main
git merge release/1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
```

## 适用场景

- 有稳定版本发布流程。
- 多人长期维护同一项目。
- 需要区分开发、测试和生产分支。

小项目不一定需要完整 Git Flow，使用 `main + feature branch + PR` 往往更简单。
