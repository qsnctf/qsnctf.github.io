# Python3 解释器

## 概念与用途

解释器读取源码，将其编译为字节码并在 Python 虚拟机中执行。交互式 REPL 适合验证表达式，脚本模式适合可复现任务，`python -m package.module` 可按模块语义运行代码。

## 核心命令与 API

`python` 进入 REPL，`python app.py arg` 运行脚本，`python -m pip` 运行当前环境中的模块。`sys.version`、`sys.executable` 和 `sys.path` 可诊断版本与导入路径。

```python
import sys

print("版本:", sys.version_info[:3])
print("路径:", sys.executable)
print("参数:", sys.argv)
```

## 执行方式

| 命令 | 作用 | 适用场景 |
| --- | --- | --- |
| `python` | 交互式 REPL | 快速实验 |
| `python file.py` | 按脚本运行 | 单文件入口 |
| `python -m pkg.mod` | 按模块运行 | 包内相对导入 |
| `python -c "..."` | 执行短代码 | 自动化检查 |

## 示例：查看字节码

```python
import dis

def add(left: int, right: int) -> int:
    return left + right

dis.dis(add)
```

字节码属于解释器实现细节，不应作为跨版本稳定接口。CPython、PyPy 等实现可能有不同性能特征，依赖 C 扩展的项目还需检查解释器兼容性。

## 常见错误与工程注意

- 双击脚本窗口瞬间关闭时，应从终端运行以查看异常和退出码。
- `.pyc` 是缓存，不是可靠的源码分发或安全保护机制。
- 多解释器共存时不要假设 `python` 和 `pip` 指向同一环境。
