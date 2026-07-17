# Git 分支管理

分支用于并行开发不同功能。常见做法是主分支保持稳定，新功能和 Bug 修复都在独立分支完成。

## 查看分支

```bash
git branch
git branch -a
```

## 创建分支

```bash
git branch new-feature
```

创建并切换：

```bash
git checkout -b new-feature
```

或使用：

```bash
git switch -c new-feature
```

## 切换分支

```bash
git switch main
```

## 合并分支

```bash
git switch main
git merge new-feature
```

## 删除分支

删除本地分支：

```bash
git branch -d new-feature
```

强制删除未合并分支：

```bash
git branch -D new-feature
```

删除远程分支：

```bash
git push origin --delete new-feature
```

## 解决冲突

冲突通常发生在两个分支修改了同一文件的同一位置。解决步骤：

1. 打开冲突文件。
2. 删除 `<<<<<<<`、`=======`、`>>>>>>>` 标记。
3. 保留正确内容。
4. `git add` 标记冲突已解决。
5. 继续提交或合并。

```bash
git add conflicted-file
git commit
```
