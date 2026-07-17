# 模块、包、异常与类型注解
模块组织代码，包组织模块，异常传播失败信息，类型注解表达接口契约。
四者共同决定代码能否被可靠复用和维护。
## 模块是什么
一个 `.py` 文件通常就是一个模块。首次导入时，模块顶层代码会执行，
创建模块对象并缓存到 `sys.modules`：
```python
import math
print(math.sqrt(9))
```
后续普通导入通常复用缓存，而不是重新执行文件。
不要把“导入一次”当作跨进程或所有动态加载场景的永久保证。
## 导入形式
```python
import pathlib
from pathlib import Path
import collections.abc as cabc
```
模块限定名能清楚说明来源；频繁使用且名称明确时可直接导入对象。
避免星号导入，因为它使名称来源、静态分析和重构变得困难。
导入应位于文件顶部，只有解决可选依赖、循环依赖或延迟成本时才考虑局部导入。
## 模块搜索路径
导入系统会根据内置模块、`sys.path`、导入钩子等寻找模块。
当前工作目录、安装环境和启动方式会影响搜索结果。
不要通过随意修改 `sys.path` 修补项目结构。更可靠的方法是：
- 使用规范包布局。
- 在虚拟环境中安装项目。
- 从项目约定入口使用 `python -m package.module`。
- 避免创建 `json.py`、`typing.py` 等遮蔽标准库的文件。
## 包与 __init__.py
常规包目录包含 `__init__.py`：
```text
project/
    pyproject.toml
    src/
        example/
            __init__.py
            parser.py
            cli.py
```
Python 也支持命名空间包，但普通单项目学习场景使用 `__init__.py` 更明确。
`__init__.py` 可公开稳定接口，但应避免执行昂贵副作用。
## 绝对导入与相对导入
包内部绝对导入：
```python
from example.parser import parse
```
显式相对导入：
```python
from .parser import parse
from ..common import normalize
```
相对导入依赖包上下文。直接执行包内文件可能报
“attempted relative import with no known parent package”，应从包外执行：
```bash
python -m example.cli
```
## __name__ 与入口
模块被直接执行时 `__name__ == "__main__"`，被导入时通常是完整模块名。
```python
def main() -> int:
    return 0
if __name__ == "__main__":
    raise SystemExit(main())
```
入口保护不是模块化的替代品；可测试逻辑仍应放入函数。
## 循环导入
模块 A 顶层导入 B，而 B 又顶层读取尚未初始化完成的 A，可能得到部分初始化错误。
优先通过以下方式解决：
- 抽取共同定义到第三个模块。
- 降低模块间双向依赖。
- 让类型专用导入进入 `TYPE_CHECKING`。
- 最后才考虑局部导入。
不要通过吞掉 `ImportError` 掩盖真实结构问题。
## 异常层次与捕获
异常是对象，常见异常包括 `ValueError`、`TypeError`、`KeyError`、
`IndexError`、`OSError`、`TimeoutError`。
```python
try:
    port = int(raw_port)
except ValueError as exc:
    print(f"invalid port: {exc}")
```
捕获能够处理的最具体异常。`except Exception` 适合应用边界记录并结束单项任务，
不应在底层无条件吞掉错误。裸 `except:` 还会捕获 `KeyboardInterrupt`、`SystemExit` 等。
## else 与 finally
```python
try:
    value = parse(raw)
except ParseError as exc:
    report(exc)
else:
    store(value)
finally:
    release_temporary_state()
```
`else` 仅在 `try` 未抛异常时执行，可缩小意外被捕获的代码范围。
`finally` 无论正常、异常或提前返回通常都会执行，适合清理；
但资源管理优先使用 `with`。
不要在 `finally` 中 `return`，它可能压制正在传播的异常。
## 抛出与异常链
```python
def load_port(text: str) -> int:
    try:
        port = int(text)
    except ValueError as exc:
        raise ConfigError("port must be an integer") from exc
    if not 1 <= port <= 65535:
        raise ConfigError("port out of range")
    return port
```
`raise ... from exc` 保留明确因果链。当前异常处理中单独 `raise` 可原样重新抛出；
不要写 `raise exc` 替代它，因为回溯位置会有所不同。
## 自定义异常
业务异常通常继承 `Exception`：
```python
class ParseError(Exception):
    """输入不符合预期格式。"""
```
只有调用者需要区分处理方式时，才建立多个异常子类。
异常消息应包含上下文，但不要泄露密码、令牌或完整敏感数据。
## EAFP 与 LBYL
EAFP 表示先尝试再捕获，LBYL 表示事先检查。
二者按竞态和 API 语义选择：
```python
try:
    value = mapping[key]
except KeyError:
    value = default
```
文件“先检查存在再打开”存在检查与使用之间的竞态，通常应直接打开并处理 `OSError`。
但对于明显无效的业务参数，提前验证更清晰。
## 类型注解的边界
Python 仍是动态类型语言。注解不会默认进行运行时类型强制：
```python
def greet(name: str) -> str:
    return f"hello {name}"
```
注解通常存放在 `__annotations__`，框架可读取它们；
具体求值时机受版本和 `from __future__ import annotations` 等影响。
因此不能笼统地说解释器“完全忽略”注解。
## Python 3.10+ 基础注解
```python
user_id: int = 42
tags: list[str] = ["python"]
scores: dict[str, float] = {"alice": 95.0}
point: tuple[int, int] = (10, 20)
def find(name: str) -> str | None:
    ...
```
固定长度元组写 `tuple[int, int]`，任意长度同类型元组写 `tuple[int, ...]`。
`X | None` 表示可选值，不表示参数自动拥有默认值。
## Any、object 与 Never
`typing.Any` 基本关闭该值周围的静态检查；`object` 表示任意对象，但使用前必须缩窄类型。
```python
from typing import Any, NoReturn
payload: dict[str, Any]
def stop(message: str) -> NoReturn:
    raise RuntimeError(message)
```
Python 3.11 新增 `typing.Never`，3.10 基线可使用 `NoReturn` 表示函数不会正常返回。
注意 `Any` 首字母大写；`any` 是内置聚合函数，不是类型。
## Union 缩窄
```python
def length(value: str | bytes) -> int:
    if isinstance(value, str):
        return len(value.encode("utf-8"))
    return len(value)
```
`isinstance()`、`is None`、模式匹配等可帮助类型检查器缩窄联合类型。
如果类型分支过多，可能意味着接口职责过宽。
## 类型别名、Literal 与 TypedDict
```python
from typing import Literal, TypedDict
UserId = int
Mode = Literal["read", "write"]
class UserRow(TypedDict):
    id: UserId
    name: str
```
Python 3.10 中使用赋值定义类型别名；`type Alias = ...` 是 Python 3.12 语法。
`TypedDict` 只描述字典形状，不创建运行时校验器或普通类实例。
## Callable、Protocol 与 TypeVar
```python
from collections.abc import Callable, Iterable
from typing import Protocol, TypeVar
T = TypeVar("T")
def first(values: Iterable[T]) -> T:
    return next(iter(values))
Transform = Callable[[bytes], bytes]
class SupportsRead(Protocol):
    def read(self, size: int = -1) -> bytes: ...
```
优先从 `collections.abc` 导入运行时容器抽象；部分类型工具仍来自 `typing`。
`Protocol` 支持结构化子类型，只要对象满足所需接口即可。
## 类与前向引用
```python
from __future__ import annotations
class Node:
    def __init__(self, children: list[Node] | None = None) -> None:
        self.children = [] if children is None else children
```
future 导入必须靠近文件顶部。它能简化前向引用，并避免部分导入时求值问题，
但运行时反射代码应使用 `typing.get_type_hints()` 并考虑其可能触发名称解析。
## 静态检查工具
mypy 是第三方工具，需先安装：
```bash
python -m pip install mypy
mypy package_name
```
Pyright 也是常见第三方检查器。类型检查配置应纳入项目，逐步提高严格度。
类型通过不等于运行正确，仍需测试输入边界、异常和副作用。
## 小结
稳定模块应有低副作用导入、清晰包边界、具体异常和可检查接口。
类型注解表达意图，不取代运行时验证、测试或文档。
