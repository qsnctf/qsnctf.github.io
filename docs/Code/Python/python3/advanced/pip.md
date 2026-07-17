# Python3 pip

## 概念与用途

pip 从 Python Package Index 或指定索引安装 Python 分发包，并解析依赖。它管理当前解释器环境，不负责隔离环境，因此应与 `venv` 配合。

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

## 常见错误与安全注意

- 不要混用系统 pip 与虚拟环境解释器，安装前检查 `python -m pip --version`。
- 包名拼写错误可能遭遇依赖混淆或恶意仿冒，应核对发布者和项目主页。
- `pip freeze` 包含全部传递依赖但不表达意图；团队应选择明确的锁定工作流。
