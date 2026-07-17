# Python3 环境搭建

## 概念与用途

开发环境至少包含 Python 解释器、包管理器 `pip` 和文本编辑器。Windows 可从 python.org 或 Microsoft Store 安装；macOS、Linux 可使用官方安装包、包管理器或 `pyenv`。生产项目应选择仍在安全支持期内的版本。

## 安装与检查

安装后执行 `python --version`（部分系统为 `python3 --version`）和 `python -m pip --version`。推荐通过解释器调用 pip，以确认依赖安装到正确环境。

```python
import platform
import sys

print("Python:", sys.version)
print("解释器:", sys.executable)
print("平台:", platform.platform())
```

将代码保存为 `check_env.py` 并运行 `python check_env.py`。退出码为 0 且打印当前解释器路径即说明基本可用。

## 安装选择

| 方式 | 适用场景 | 注意 |
| --- | --- | --- |
| python.org 安装器 | Windows/macOS 学习与开发 | 核对 PATH 与架构 |
| 系统包管理器 | Linux 系统工具 | 不要破坏系统依赖 |
| `pyenv` | 多版本开发 | 仍需为项目建 venv |
| 容器镜像 | 部署和 CI | 固定基础镜像摘要/版本 |

## 示例：检查必要版本

```python
import sys

minimum = (3, 10)
if sys.version_info < minimum:
    raise SystemExit(f"需要 Python {minimum[0]}.{minimum[1]}+")
print("版本符合要求")
print("64 位:", sys.maxsize > 2**32)
```

团队应在 README、CI 和部署配置中声明同一版本范围。仅在个人电脑“能运行”不足以证明环境可复现，还应从干净环境安装依赖并执行测试。

## 常见错误与工程注意

- Windows 安装器应勾选 PATH；若存在多个版本，使用 `py -3` 或解释器绝对路径。
- 不要用管理员权限向系统 Python 随意安装包，应先创建 `.venv`。
- 企业代理或证书错误应配置可信代理和 CA，不能通过关闭 TLS 校验规避。
