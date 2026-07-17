# Git 安装配置

## 安装 Git

### Windows

访问 Git 官网下载安装包：

```text
https://git-scm.com/download/win
```

安装完成后，可以在 PowerShell、CMD 或 Git Bash 中使用 `git` 命令。

### Linux

Debian/Ubuntu：

```bash
sudo apt update
sudo apt install git
```

CentOS/RHEL：

```bash
sudo yum install git
```

### macOS

可以使用 Homebrew：

```bash
brew install git
```

也可以安装 Xcode Command Line Tools：

```bash
xcode-select --install
```

## 检查版本

```bash
git --version
```

能看到版本号就说明 Git 已安装成功。

## 配置用户名和邮箱

用户名和邮箱会写入提交记录，用于标识是谁提交了代码。

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

查看配置：

```bash
git config --list
```

## 配置默认分支名

现在很多平台默认使用 `main` 作为主分支。

```bash
git config --global init.defaultBranch main
```

## 配置编辑器

例如设置 VS Code 为 Git 默认编辑器：

```bash
git config --global core.editor "code --wait"
```

## 配置换行符

Windows 常用 CRLF，Linux/macOS 常用 LF。团队协作时建议统一策略。

Windows 常见配置：

```bash
git config --global core.autocrlf true
```

Linux/macOS 常见配置：

```bash
git config --global core.autocrlf input
```

## 配置 SSH Key

生成 SSH Key：

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

查看公钥：

```bash
cat ~/.ssh/id_ed25519.pub
```

把公钥添加到 GitHub、GitLab 或其它代码托管平台后，就可以用 SSH 地址克隆和推送仓库。
