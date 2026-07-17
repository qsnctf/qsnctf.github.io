@echo off
echo ======================================
echo   MkDocs Material deployment
echo ======================================
echo.

for /f "delims=" %%B in ('git branch --show-current') do set "CURRENT_BRANCH=%%B"
if not "%CURRENT_BRANCH%"=="docs" (
    echo Error: switch to the docs branch before running this script.
    exit /b 1
)

set "WORKTREE_DIRTY="
for /f "delims=" %%S in ('git status --porcelain') do set "WORKTREE_DIRTY=1"
if defined WORKTREE_DIRTY (
    echo Error: uncommitted changes cannot be deployed.
    echo.
    git status --short
    echo.
    echo Review and commit the intended files, then run this script again:
    echo   git add ^<files^>
    echo   git commit -m "update docs"
    exit /b 1
)

echo Validating site build...
mkdocs build --strict
if errorlevel 1 exit /b 1
echo.

echo Pushing docs branch...
git push origin docs
if errorlevel 1 exit /b 1
echo.

echo ======================================
echo             Push completed
echo ======================================
pause
