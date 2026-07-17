# Git 进阶操作

## rebase

`rebase` 可以把当前分支的提交移动到另一个分支最新提交之后，使历史更线性。

```bash
git switch feature/login
git rebase main
```

不要随意 rebase 已经推送并被多人协作使用的公共分支。

## cherry-pick

把某个提交应用到当前分支：

```bash
git cherry-pick <commit-id>
```

常用于只挑选某个修复提交。

## revert

创建一个新的提交，用来撤销历史提交的影响：

```bash
git revert <commit-id>
```

`revert` 不会删除历史，适合公共分支。

## reset

移动当前分支指针：

```bash
git reset --soft HEAD~1
git reset --mixed HEAD~1
git reset --hard HEAD~1
```

`--hard` 会丢弃工作区修改，使用前必须确认没有重要改动。

## reflog

查看 HEAD 变化记录：

```bash
git reflog
```

误删分支、错误 reset 后，`reflog` 经常能救回提交。

## bisect

二分查找引入 Bug 的提交：

```bash
git bisect start
git bisect bad
git bisect good <commit-id>
```

Git 会不断切换提交，让你判断当前版本是好还是坏，最终定位问题提交。
