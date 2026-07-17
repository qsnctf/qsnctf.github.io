# GitHub Actions

GitHub Actions 是 GitHub 提供的 CI/CD 自动化能力。它可以在代码推送、创建 PR、发布版本等事件发生时自动执行任务。

## 常见用途

- 自动运行测试
- 自动构建文档
- 自动部署网站
- 自动检查代码格式
- 自动发布 Release

## 工作流文件位置

工作流文件放在仓库的 `.github/workflows/` 目录下，扩展名通常是 `.yml` 或 `.yaml`。

例如：

```text
.github/workflows/ci.yml
```

## 基本示例

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Show Git version
        run: git --version
```

## 核心概念

| 概念 | 含义 |
| ---- | ---- |
| Workflow | 一个自动化流程 |
| Event | 触发流程的事件，如 push、pull_request |
| Job | 工作流中的任务 |
| Step | Job 中的具体步骤 |
| Runner | 执行任务的机器 |
| Action | 可复用的自动化组件 |

## 安全注意事项

- 不要在 workflow 中明文写入密钥。
- 使用 GitHub Secrets 保存 Token、密码等敏感信息。
- PR 来自外部 Fork 时，要谨慎处理自动部署和密钥访问。
- 尽量固定 Action 版本，例如 `actions/checkout@v4`。
