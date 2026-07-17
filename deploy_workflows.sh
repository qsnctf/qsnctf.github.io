#!/bin/bash
set -eu

echo ======================================
echo   MkDocs Material 自动部署脚本
echo ======================================
echo

if [ "$(git branch --show-current)" != "docs" ]; then
  echo "错误：请切换到 docs 分支后再运行。"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "错误：未提交的修改无法被部署。"
  echo
  git status --short
  echo
  echo "请检查并提交需要发布的文件，然后重新运行此脚本："
  echo "  git add <files>"
  echo "  git commit -m \"update docs\""
  exit 1
fi

echo 验证站点构建...
mkdocs build --strict
echo

echo 推送 docs 分支到远程...
git push origin docs
echo

echo ======================================
echo               推送成功
echo ======================================
