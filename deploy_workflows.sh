#!/bin/bash

echo ======================================
echo   MkDocs Material 自动部署脚本
echo ======================================
echo

# 1. 提交 docs 分支的内容
echo 提交当前分支所有更改...
git add .
git commit -m "update docs"
echo

# 2. 推送 docs 分支
echo 推送 docs 分支到远程...
git push origin docs --force
echo

echo ======================================
echo               推送成功
echo ======================================

# 在 Linux/Mac 下可以使用 read 命令代替 pause
echo "按任意键继续..."
read -n 1