# Matplotlib 安装

## 概念与用途

Matplotlib 是第三方 Python 包，不随解释器默认安装。推荐在项目虚拟环境中安装，这样可以隔离依赖、固定版本，并避免系统 Python 与项目 Python 混用。桌面交互绘图还依赖 GUI 后端，服务器批处理则通常使用无窗口后端。

## 安装与验证

使用当前解释器调用 pip，能减少 `pip` 指向另一个 Python 的问题：

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install matplotlib numpy
python -m pip show matplotlib
```

核心检查项是 `matplotlib.__version__`、配置目录和当前后端：

```python
import matplotlib
import matplotlib.pyplot as plt

print("version:", matplotlib.__version__)
print("backend:", matplotlib.get_backend())
print("config:", matplotlib.get_configdir())

fig, ax = plt.subplots()
ax.plot([0, 1, 2], [0, 1, 4])
ax.set_title("Installation check")
fig.savefig("installation-check.png", dpi=120)
plt.show()
```

只要脚本能生成 `installation-check.png`，绘图与文件输出链路就已正常。即使无桌面环境导致 `plt.show()` 不弹窗，保存文件仍可能成功。

## 后端选择

后端负责把图形渲染到窗口或文件。桌面环境常见 QtAgg、TkAgg，服务器常用 Agg。无界面任务应在导入 `pyplot` 前选择后端：

```python
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3])
fig.savefig("server-output.png")
```

也可设置环境变量 `MPLBACKEND=Agg`，但不要在共享库中强制修改全局后端，以免影响调用方。

## 常见错误

- `ModuleNotFoundError`：安装命令与运行脚本不是同一个解释器。比较 `python -m pip --version` 和 `python -c "import sys; print(sys.executable)"`。
- `ImportError` 或二进制加载失败：NumPy、Matplotlib 与 Python 版本不兼容。优先在新虚拟环境中重新安装，而不是混合多个包管理器。
- Linux 上无法打开窗口：缺少显示服务或 GUI 工具包。批处理改用 Agg；需要交互窗口时安装对应 Qt/Tk 依赖。
- 安装速度慢或失败：检查网络、代理和包索引配置，不要随意执行来源不明的安装脚本。

## 工程注意事项

应用项目应在 `requirements.txt`、锁文件或 `pyproject.toml` 中记录版本。容器和 CI 中使用 `fig.savefig()` 验证渲染，不要把窗口弹出作为测试条件。升级大版本前检查弃用警告、默认样式和图像基线测试，因为同一代码在不同版本中可能出现细微排版变化。
