# 任务计划

## 目标
将根目录的 Solar 应急响应靶场训练合集本地化，归档到 `docs/Emergency_Response/`，并加入 MkDocs 导航。

## 阶段
- [complete] 分析原文、资源和站点导航结构
- [complete] 整理并写入本地化文章
- [complete] 更新 `mkdocs.yml` 导航
- [complete] 校验文件、链接与配置格式
- [complete] 本地化文章图片并更新图片引用

## 验证结果
- `mkdocs build --strict --site-dir site`：通过。
- 编辑器诊断：新文章无诊断问题。
- 本地图片：`docs/Emergency_Response/assets/` 中 13 张 PNG 均已下载并通过 PNG 文件头校验。
- 通用 `yaml.safe_load`：因 MkDocs 配置中的 `python/name` 标签失败；使用 MkDocs 自身构建验证通过。

## 约束与决策
- 保留原文的训练环境信息和授权提示。
- 外部下载地址、相关文章地址继续使用原始链接；内部不可直接复用的图片链接需要本地化处理或明确保留为外部资源。
- 不修改根目录原始文章，新增归档副本。

## 错误记录
暂无。
