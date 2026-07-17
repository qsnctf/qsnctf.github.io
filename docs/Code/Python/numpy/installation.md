# NumPy 安装

NumPy 可通过 Python 包管理器或 Conda 安装。隔离环境能避免不同项目对 Python、NumPy 和底层 BLAS 库的版本要求互相冲突。

## 安装与验证

使用标准库 `venv` 和 pip：

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install numpy
```

Conda 环境可使用：

```bash
conda create -n numpy-demo python=3.12 numpy
conda activate numpy-demo
```

安装后运行以下代码，确认解释器和包版本：

```python
import sys
import numpy as np

print(sys.executable)
print(np.__version__)
print(np.arange(5) ** 2)
np.show_config()
```

`np.show_config()` 会输出 BLAS/LAPACK 等构建信息，排查线性代数性能或二进制兼容问题时很有用。

## 版本管理

应用项目应在依赖文件中声明经过测试的范围，例如：

```text
numpy>=2.0,<3
```

可复现分析则应生成锁文件或记录精确版本。升级主版本前阅读迁移指南，因为弃用 API、类型提升规则和 C ABI 都可能发生变化。

## 常见问题与工程注意事项

- `ModuleNotFoundError` 通常是 pip 与运行程序使用了不同解释器；用 `python -m pip` 和 `sys.executable` 对照检查。
- 不要在项目中创建 `numpy.py` 文件或 `numpy/` 目录，否则可能遮蔽真正的包。
- Windows、Linux 和 macOS 的 wheel 包含平台相关二进制代码，不应复制虚拟环境到另一平台。
- 源码编译需要 C/C++/Fortran 工具链和 BLAS/LAPACK；无特殊需求时优先使用官方 wheel 或 Conda 二进制包。
- Jupyter 内核可能不属于当前终端环境。应为环境安装并选择对应 kernel，而不是反复全局安装。
- 服务部署时同时锁定 Python 与 NumPy 版本，并在目标架构上运行测试，尤其是依赖 SciPy、Pandas 或本地扩展时。
