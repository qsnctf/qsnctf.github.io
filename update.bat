@echo off
echo ===========================================
echo   拉取 qsnctf/qsnctf.github.io 的 docs 分支
echo ===========================================
echo.

REM 确保在仓库目录中执行此脚本
echo 当前路径：%cd%
echo.

REM 1. 切换到 docs 分支
echo 切换到 docs 分支...
git checkout docs
if %ERRORLEVEL% NEQ 0 (
    echo 错误：无法切换到 docs 分支，请检查你是否有此分支。
    pause
    exit /b
)
echo.

REM 2. 拉取远程最新代码
echo 开始拉取远程最新代码...
git pull origin docs
if %ERRORLEVEL% NEQ 0 (
    echo 拉取时出现冲突或错误，请手动处理。
    pause
    exit /b
)
echo.

echo ===========================================
echo   已成功拉取最新 docs 分支代码！
echo ===========================================

pause
