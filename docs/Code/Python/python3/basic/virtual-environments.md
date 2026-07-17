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

## 生命周期命令

| 动作 | 命令 | 说明 |
| --- | --- | --- |
| 创建 | `python -m venv .venv` | 使用当前解释器 |
| 激活 | 平台对应 activate | 仅调整当前 shell |
| 安装 | `python -m pip install ...` | 绑定当前环境 |
| 退出 | `deactivate` | 恢复 shell 环境 |

## 示例：确认 site-packages

```python
import site
import sys

print("base:", sys.base_prefix)
print("current:", sys.prefix)
for path in site.getsitepackages():
    print("packages:", path)
```

虚拟环境不解决依赖版本锁定，也不隔离操作系统动态库。CI 应从空环境重建，部署时还需固定 Python、系统包和平台架构。

## 常见错误与工程注意

- `.venv` 不应提交 Git，也不应复制到另一台机器，应通过依赖清单重建。
- 激活仅修改当前终端环境，IDE、计划任务和服务应显式选择解释器路径。
- PowerShell 策略阻止激活时可直接运行 `.venv\Scripts\python.exe`，不要全局放宽安全策略。
