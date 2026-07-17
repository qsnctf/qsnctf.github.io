# Git 创建仓库

## 创建本地仓库

进入项目目录后执行：

```bash
git init
```

Git 会创建 `.git` 目录，用来保存版本控制数据。

## 创建第一个提交

```bash
git add .
git commit -m "Initial commit"
```

## 克隆远程仓库

如果项目已经存在于 GitHub、GitLab 等平台，可以直接克隆：

```bash
git clone https://github.com/username/repo.git
cd repo
```

## 添加远程仓库

本地项目创建后，可以关联远程仓库：

```bash
git remote add origin https://github.com/username/repo.git
```

查看远程仓库：

```bash
git remote -v
```

## 推送到远程仓库

```bash
git push -u origin main
```

`-u` 会建立本地分支和远程分支的跟踪关系，以后可以直接使用 `git push`。

## .gitignore

`.gitignore` 用来忽略不需要提交的文件，例如构建产物、缓存、密钥、本地配置。

```gitignore
node_modules/
dist/
.env
*.log
```

不要把密码、Token、私钥提交到仓库。
