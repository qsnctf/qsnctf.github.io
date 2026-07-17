# Git 查看提交历史

## 基本查看

```bash
git log
```

## 单行显示

```bash
git log --oneline
```

## 图形化显示分支

```bash
git log --oneline --graph --decorate --all
```

## 查看最近几次提交

```bash
git log -5 --oneline
```

## 查看某个文件历史

```bash
git log -- filename
```

## 查看提交详情

```bash
git show <commit-id>
```

## 按作者过滤

```bash
git log --author="Alice"
```

## 按时间过滤

```bash
git log --since="2026-01-01" --until="2026-12-31"
```

## 查看每行代码最后修改者

```bash
git blame filename
```

`git blame` 常用于定位某行代码是什么时候、由谁修改的。
