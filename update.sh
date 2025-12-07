#!/usr/bin/env bash
set -u

echo "==========================================="
echo "  拉取 qsnctf/qsnctf.github.io 的 docs 分支"
echo "==========================================="
echo

# 确保在仓库目录中执行此脚本（检查是否存在 .git）
echo "当前路径：$(pwd)"
echo
if [ ! -d ".git" ]; then
  echo "错误：当前目录不是 Git 仓库（未找到 .git），请在仓库根目录运行。"
  read -r -p "按回车退出..."
  exit 1
fi

# 1. 切换到 docs 分支
echo "切换到 docs 分支..."
if ! git checkout docs; then
  echo "错误：无法切换到 docs 分支，请检查你是否有此分支。"
  read -r -p "按回车退出..."
  exit 1
fi
echo

# 2. 拉取远程最新代码
echo "开始拉取远程最新代码..."
if ! git pull origin docs; then
  echo "拉取时出现冲突或错误，请手动处理。"
  read -r -p "按回车退出..."
  exit 1
fi
echo

echo "==========================================="
echo "  已成功拉取最新 docs 分支代码！"
echo "==========================================="
read -r -p "按回车退出..."