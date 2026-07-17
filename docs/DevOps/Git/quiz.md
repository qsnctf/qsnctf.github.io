# Git 测验

## 选择题

### 1. `git add` 的作用是什么？

A. 把代码推送到远程仓库  
B. 把修改加入暂存区  
C. 删除提交历史  
D. 创建标签  

答案：B

### 2. `git commit` 会把改动保存到哪里？

A. 工作区  
B. 暂存区  
C. 本地仓库  
D. 远程仓库  

答案：C

### 3. 推送当前分支到远程仓库常用哪个命令？

A. `git push`  
B. `git fetch`  
C. `git status`  
D. `git diff`  

答案：A

### 4. 哪个命令可以查看当前文件状态？

A. `git status`  
B. `git tag`  
C. `git init`  
D. `git blame`  

答案：A

## 实操题

### 题目 1

创建一个新仓库，添加 `README.md`，并完成第一次提交。

参考命令：

```bash
git init
git add README.md
git commit -m "Initial commit"
```

### 题目 2

创建 `feature/test` 分支，修改文件后提交并推送。

参考命令：

```bash
git switch -c feature/test
git add .
git commit -m "Update test feature"
git push origin feature/test
```
