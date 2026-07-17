# Git 基本操作

## 查看状态

```bash
git status
```

## 添加文件到暂存区

```bash
git add filename
git add .
```

## 提交更改

```bash
git commit -m "Update feature"
```

## 查看差异

```bash
git diff
git diff --cached
```

## 查看提交历史

```bash
git log
git log --oneline
```

## 撤销工作区修改

撤销某个文件未暂存的修改：

```bash
git restore filename
```

## 取消暂存

```bash
git restore --staged filename
```

## 删除文件

```bash
git rm filename
git commit -m "Remove filename"
```

## 移动或重命名文件

```bash
git mv oldname newname
git commit -m "Rename file"
```

## 临时保存修改

```bash
git stash
git stash pop
```
