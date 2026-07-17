# Python3 pip

## 概念与用途

pip 从 Python Package Index 或指定索引安装 Python 分发包，并解析依赖。它管理当前解释器环境，不负责隔离环境，因此应与 `venv` 配合。

Python 3.10 环境建议先升级到团队验证的现代 pip，例如 `python -m pip install "pip>=23.3"`，再使用锁定文件安装项目依赖。pip 自身不需要外部服务才能查看本地包，但在线安装需要可信索引、DNS、TLS 和代理配置。

## 核心命令与 API

常用命令为 `python -m pip install package`、`list`、`show`、`check` 和 `uninstall`。应用部署可使用带版本和哈希的依赖文件增强可复现性。

```python
from importlib.metadata import PackageNotFoundError, version

for package in ("pip", "setuptools"):
    try:
        print(package, version(package))
    except PackageNotFoundError:
        print(package, "未安装")
```

## 命令规则

| 命令 | 用途 | 注意 |
| --- | --- | --- |
| `install -r` | 按清单安装 | 清单应评审和锁定 |
| `check` | 检查已装依赖冲突 | 安装后执行 |
| `download` | 预下载 wheel | 适合离线构建 |
| `--require-hashes` | 校验分发文件 | 所有依赖需提供哈希 |

## 示例：检查解释器绑定

```python
import subprocess
import sys

result = subprocess.run(
    [sys.executable, "-m", "pip", "--version"],
    check=True,
    capture_output=True,
    text=True,
    timeout=10,
)
print(result.stdout.strip())
```

CI 下载依赖应有网络超时和受控镜像，构建完成后不保留凭据。不要在应用运行期间动态 pip install；镜像或发布制品应预先构建并经过漏洞扫描。

## 常见错误与安全注意

- 不要混用系统 pip 与虚拟环境解释器，安装前检查 `python -m pip --version`。
- 包名拼写错误可能遭遇依赖混淆或恶意仿冒，应核对发布者和项目主页。
- `pip freeze` 包含全部传递依赖但不表达意图；团队应选择明确的锁定工作流。
