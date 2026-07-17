# Git 标签

标签用于给某个提交打上固定名称，常用于发布版本，例如 `v1.0.0`。

## 查看标签

```bash
git tag
```

## 创建轻量标签

```bash
git tag v1.0.0
```

## 创建附注标签

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
```

附注标签包含标签信息、作者、时间，更适合正式发布。

## 给历史提交打标签

```bash
git tag -a v1.0.0 <commit-id> -m "Release v1.0.0"
```

## 推送标签

推送单个标签：

```bash
git push origin v1.0.0
```

推送所有标签：

```bash
git push origin --tags
```

## 删除标签

删除本地标签：

```bash
git tag -d v1.0.0
```

删除远程标签：

```bash
git push origin --delete v1.0.0
```
