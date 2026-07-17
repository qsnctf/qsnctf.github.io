# Python 虚拟环境的创建

## 概念与用途

虚拟环境为项目提供独立解释器入口和第三方包目录，避免不同项目的依赖版本冲突。标准库 `venv` 足以覆盖大多数应用开发需求。

## 核心命令与 API

运行 `python -m venv .venv` 创建环境。Windows PowerShell 使用 `.\.venv\Scripts\Activate.ps1`，Linux/macOS 使用 `source .venv/bin/activate`；随后执行 `python -m pip install -U pip`。

```python
import sys
from pathlib import Path

print("解释器:", sys.executable)
print("虚拟环境:", sys.prefix != sys.base_prefix)
print("前缀存在:", Path(sys.prefix).exists())
```

## 常见错误与工程注意

- `.venv` 不应提交 Git，也不应复制到另一台机器，应通过依赖清单重建。
- 激活仅修改当前终端环境，IDE、计划任务和服务应显式选择解释器路径。
- PowerShell 策略阻止激活时可直接运行 `.venv\Scripts\python.exe`，不要全局放宽安全策略。
