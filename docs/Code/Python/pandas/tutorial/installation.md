# Pandas 安装

## 概念与用途

建议在项目独立虚拟环境中安装 Pandas，避免解释器、依赖和系统环境互相污染。Excel、Parquet 等格式需要额外引擎，应按实际功能显式安装。

## 核心 API 与命令

```bash
python -m venv .venv
# Windows
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\python -m pip install pandas
# 常见可选依赖
.venv\Scripts\python -m pip install openpyxl pyarrow sqlalchemy lxml matplotlib
```

## 可运行示例

```python
import pandas as pd

print(pd.__version__)
frame = pd.DataFrame({"value": [1, 2, 3]})
assert frame["value"].sum() == 6
print(frame)
```

## 示例二：检查可选依赖

```python
from importlib.util import find_spec
import pandas as pd

optional = {name: find_spec(name) is not None for name in ["openpyxl", "pyarrow", "sqlalchemy"]}
print("pandas:", pd.__version__)
print("optional engines:", optional)
```

`openpyxl` 常用于 `.xlsx`，`pyarrow` 用于 Parquet/Feather，SQLAlchemy 用于多种数据库方言。只安装实际需要的额外依赖，并在部署清单中固定版本。

## 兼容性边界

本教程要求 Pandas 2.0 以上；`DataFrame.map` 等个别 API 要求 2.1+并在对应页面给出替代。CPU 架构、Python 版本和二进制 wheel 会影响可安装版本，CI 应在与生产一致的 Python 版本上验证导入和 I/O 引擎。

## 注意事项

使用 `python -m pip` 可确保 pip 对应当前解释器。`ImportError` 常来自虚拟环境未激活或缺少 `openpyxl`、`pyarrow` 等可选引擎；用 `python -c "import pandas; print(pandas.__version__)"` 验证。生产环境应通过锁文件或精确版本约束保证可复现，并先阅读大版本迁移说明再升级。
