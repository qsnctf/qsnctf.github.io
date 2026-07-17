# Python3 PyCharm

## 概念与用途

PyCharm 是面向 Python 的集成开发环境，提供代码补全、重构、测试、调试和版本控制集成。项目最关键的设置是 Python Interpreter，它决定运行代码和安装依赖所使用的环境。

## 核心操作

在项目设置中选择现有 `.venv` 或创建新虚拟环境；为入口文件创建 Run Configuration，并通过行号左侧设置断点。可在内置终端运行 `python -m pip list`，再与设置页中的解释器路径核对。

```python
import sys

def total(prices: list[float]) -> float:
    return sum(prices)

if __name__ == "__main__":
    print(sys.executable)
    print(total([12.5, 7.5]))  # 可在此行设置断点
```

## 关键配置清单

| 配置 | 目的 | 核对方式 |
| --- | --- | --- |
| Interpreter | 统一运行和安装环境 | 打印 `sys.executable` |
| Working directory | 决定相对路径起点 | 打印 `Path.cwd()` |
| Environment variables | 注入非敏感运行配置 | 不提交真实密钥 |
| Test runner | 发现 pytest/unittest | 运行单个测试验证 |

## 示例：验证工作目录

```python
from pathlib import Path

project = Path.cwd()
print("工作目录:", project)
candidate = project / "pyproject.toml"
print("项目配置存在:", candidate.exists())
```

运行配置应可由团队复现。若程序依赖 IDE 特有工作目录才能找到文件，应改用基于配置文件或 `__file__` 的明确路径，而不是继续调整本机设置。

## 常见错误与工程注意

- IDE 解释器与终端环境不一致会导致“已安装但无法导入”，先比较 `sys.executable`。
- 不要提交 `.idea` 中的个人路径、密钥或临时运行配置。
- 自动导入可能引入同名错误模块，提交前运行测试并检查实际导入来源。
