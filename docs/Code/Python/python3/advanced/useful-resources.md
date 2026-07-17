# Python 有用的资源

## 概念与用途

高质量资源应优先回答三个问题：语言行为以什么为准、库 API 如何使用、工程决策为何如此。官方文档和 PEP 是权威来源，PyPI 用于核对包信息，社区教程适合补充实践视角。

## 核心资源与检查 API

- Python 文档：`https://docs.python.org/3/`
- Python 教程：`https://docs.python.org/3/tutorial/`
- PEP 索引：`https://peps.python.org/`
- PyPI：`https://pypi.org/`
- Python 安全响应：`https://www.python.org/dev/security/`

```python
import sys
import webbrowser

url = f"https://docs.python.org/{sys.version_info.major}.{sys.version_info.minor}/"
print("当前版本文档:", url)
# 在桌面环境中可取消下一行注释：webbrowser.open(url)
```

## 资源选择规则

| 需求 | 首选来源 | 核对点 |
| --- | --- | --- |
| 语言语义 | Python Language Reference | 对应版本 |
| 标准库 API | Library Reference | 弃用说明 |
| 设计动机 | PEP | 状态与替代提案 |
| 第三方包 | 官方文档与 PyPI | 发布者、版本、许可证 |

## 示例：检查包元数据

```python
from importlib.metadata import metadata, version

package = "pip"
info = metadata(package)
print(package, version(package))
print("主页:", info.get("Home-page") or info.get("Project-URL"))
print("许可证:", info.get("License"))
```

示例只使用标准库，无需安装。元数据字段可能缺失或不规范，因此安全审查还应查看源码仓库、签名/哈希、维护活动和已知漏洞，而不能只信一个字段。

## 常见错误与工程注意

- 搜索结果中的旧版文档可能与当前解释器不符，应核对页面版本选择器。
- 安装包前检查规范化名称、维护状态、许可证、发布历史和项目链接。
- 博客代码不能替代测试与官方说明，尤其是安全和并发主题。
