# 青少年 CTF 文库

一个使用 MkDocs Material 构建的知识库网站，旨在为正在学习网络安全、热爱信息攻防、准备参加 CTF 竞赛的你，提供一个 **结构化、系统化、易理解、可实战** 的知识库。

## 共同维护

请联系 QQ：1044631097。

## 本地运行

建议使用 Python 3.10 或更高版本：

```bash
python -m pip install -r requirements.txt
mkdocs serve
```

提交前验证站点能够完整构建：

```bash
mkdocs build --strict
```

## 维护方式

### 内容编写

文档源文件位于 `docs/`，导航在 `mkdocs.yml` 中维护。Markdown 写法可参考 [MkDocs Material 参考文档](https://squidfunk.github.io/mkdocs-material/reference/)。

### 拉取代码

```bash
git clone https://github.com/qsnctf/qsnctf.github.io.git
```

### 更新项目

```cmd
update.bat
```

### 推送项目

向 `docs` 分支推送后，GitHub Actions 会自动构建并发布到 `main` 分支：

```bash
git add <修改的文件>
git commit -m "update docs"
git push origin docs
```

也可以在已经提交修改后执行：

```cmd
deploy_workflows.bat
```

脚本不会自动暂存或提交文件，以免误提交本地内容。不要使用强制推送覆盖共享分支历史。
