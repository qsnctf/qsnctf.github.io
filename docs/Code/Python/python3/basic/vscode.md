# Python3 VS Code

## 概念与用途

VS Code 通过 Python 扩展和 Pylance 提供补全、类型检查、调试与测试发现，适合轻量脚本和多语言项目。工作区选择的解释器会影响运行按钮、语言服务和调试器。

## 核心操作

安装 Microsoft Python 与 Pylance 扩展，执行命令面板中的 `Python: Select Interpreter` 选择 `.venv`。使用 `Run Python File` 运行文件，或创建 `.vscode/launch.json` 调试带参数程序。

```python
import sys

def greet(name: str) -> str:
    return f"Hello, {name}!"

print(sys.executable)
print(greet("VS Code"))
```

## 工作区规则

| 能力 | 推荐设置 | 验证 |
| --- | --- | --- |
| 解释器 | 项目 `.venv` | `sys.executable` |
| 格式化 | 团队统一工具 | 保存后 diff 稳定 |
| 类型检查 | Pylance 基本/严格模式 | 查看 Problems |
| 调试 | `launch.json` 参数化 | 断点与参数均生效 |

## 示例：调试命令行参数

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--name", default="VS Code")
arguments = parser.parse_args()
print(f"Hello, {arguments.name}")
```

可在调试配置的 `args` 中传入 `--name` 和测试值。不要把生产密钥写入 `launch.json`；本地秘密使用未提交的环境文件或操作系统密钥方案。

## 常见错误与工程注意

- 集成终端可能在选解释器前已打开，重新创建终端才能自动激活环境。
- Pylance 报错不等于运行时异常，但类型警告不应未经判断直接忽略。
- 工作区设置可能覆盖用户设置；不要提交本机绝对路径或密钥。
