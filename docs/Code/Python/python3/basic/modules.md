# Python3 模块

## 概念与用途

每个 `.py` 文件都是模块，目录包用于组织模块和公开接口。导入模块时，Python 会执行其顶层代码并缓存模块对象；模块有助于隔离职责和复用功能。

## 核心语法与 API

使用 `import math`、`from pathlib import Path` 或相对导入 `from .utils import helper`。`__all__` 可声明星号导出的公共名称，但显式导入仍更清晰。

| 导入形式 | 名称绑定 | 建议 |
| --- | --- | --- |
| `import package.module` | 绑定顶级包 | 来源最明确 |
| `from package import name` | 直接绑定名称 | 常用公开 API |
| `from . import utils` | 包内相对导入 | 仅在包上下文使用 |
| `importlib.import_module(name)` | 运行时动态导入 | 插件系统，名称需白名单 |

```python
import importlib
import math

module = importlib.import_module("json")
print(math.isqrt(81))
print(module.dumps({"ok": True}))
```

## 示例：建立最小包

目录 `calculator/` 中放置 `__init__.py` 和 `core.py`。`__init__.py` 定义稳定公开接口，调用者不必依赖内部文件布局。

```python
# calculator/core.py
def add(left: int, right: int) -> int:
    return left + right

# calculator/__init__.py
from .core import add
__all__ = ["add"]

# app.py
from calculator import add
print(add(2, 3))
```

实际运行时应分别创建上述三个文件，并从其共同父目录执行 `python app.py` 或安装该包。模块首次导入后记录在 `sys.modules`，后续普通导入不会重新执行顶层代码；`importlib.reload()` 也不能可靠重置外部引用和全局资源。

## 包与执行边界

- 包内存在相对导入时，使用 `python -m package.module`，不要直接执行深层文件。
- `__init__.py` 应保持轻量，只重导出稳定 API，不应连接数据库或扫描网络。
- 插件式动态导入必须限制可导入名称；用户提供任意模块名会扩大代码执行面。

## 常见错误与工程注意

- 不要把文件命名为 `json.py`、`random.py` 等标准库名称，否则会遮蔽真实模块。
- 顶层不要执行网络请求或重任务，导入应快速且副作用可控。
- 循环导入通常说明模块职责或依赖方向需要调整。
- 开发项目应通过 `pyproject.toml` 安装为可编辑包，而不是长期修改 `sys.path`。
