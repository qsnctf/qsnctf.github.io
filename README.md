# 说明

一个使用Mkdocs的类知识库网站（文库），青少年CTF文库旨在为正在学习网络安全、热爱信息攻防、准备参加 CTF 竞赛的你，提供一个 **结构化、系统化、易理解、可实战** 的知识库。

# 共同维护

请联系QQ：1044631097

# 维护方式

## 拉取代码

```bash
git clone https://github.com/qsnctf/qsnctf.github.io.git
```

## 更新项目（用于慢协作）

```cmd
update.bat
```

## 推送项目（必须）

因本项目开启了`workflows`，当代码推送后会自动构建，

```bash
git add .
git commit -m "update docs"
git push origin docs --force
```

或直接执行

```cmd
deploy_workflows.bat
```

## 备注

一般不推荐直接覆盖提交，如需覆盖提交可选择执行`deploy.bat`