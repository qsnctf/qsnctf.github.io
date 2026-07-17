# 文件、路径、标准库与虚拟环境
文件和环境问题常因当前目录、编码、资源关闭或依赖混用而产生。
现代 Python 应优先使用 `pathlib`、上下文管理器和虚拟环境。
## 当前目录与脚本目录
相对路径相对于进程当前工作目录，不一定相对于脚本文件：
```python
from pathlib import Path
cwd = Path.cwd()
module_dir = Path(__file__).resolve().parent
```
交互式解释器和某些运行环境可能没有 `__file__`。
应用配置应明确规定路径基准，不要靠偶然启动位置。
## pathlib 基础
```python
from pathlib import Path
base = Path("data")
report = base / "reports" / "result.json"
print(report.name, report.suffix, report.stem)
```
`Path` 使用操作系统路径规则，避免手工拼接 `/` 或 `\`。
`resolve()` 会转为绝对路径并解析部分路径语义；不要误以为它自动证明路径安全。
## 遍历与创建目录
```python
output_dir = Path("build") / "reports"
output_dir.mkdir(parents=True, exist_ok=True)
for path in Path("data").glob("*.json"):
    print(path)
for path in Path("data").rglob("*.txt"):
    print(path)
```
目录迭代顺序不应视为稳定排序，需要稳定结果时显式 `sorted()`。
处理不可信目录树时，应限制数量、深度、文件大小并考虑符号链接。
## 读写文本
小文件可直接读写：
```python
path = Path("notes.txt")
path.write_text("第一行\n", encoding="utf-8")
text = path.read_text(encoding="utf-8")
```
流式处理大文件：
```python
with path.open("r", encoding="utf-8", newline="") as stream:
    for line in stream:
        process(line.rstrip("\n"))
```
始终明确文本编码。`newline=""` 让 CSV 模块正确管理换行；
普通文本是否保留换行应由格式需求决定。
## 二进制文件
```python
raw = Path("sample.bin").read_bytes()
Path("copy.bin").write_bytes(raw)
```
大文件应分块读取，避免一次占满内存：
```python
with Path("sample.bin").open("rb") as source:
    while chunk := source.read(64 * 1024):
        process(chunk)
```
文本模式返回 `str`，二进制模式返回 `bytes`，两者不可无意识混用。
## with 与上下文管理器
`with` 确保正常或异常退出时执行清理：
```python
with Path("input.txt").open(encoding="utf-8") as stream:
    content = stream.read()
```
标准库 `contextlib` 可帮助实现上下文管理器：
```python
from contextlib import contextmanager
@contextmanager
def temporary_setting(config: dict[str, bool]):
    old = config.get("debug", False)
    config["debug"] = True
    try:
        yield
    finally:
        config["debug"] = old
```
## 安全路径组合
不要直接相信用户提供的文件名：
```python
root = Path("uploads").resolve()
candidate = (root / user_name).resolve()
try:
    candidate.relative_to(root)
except ValueError as exc:
    raise ValueError("path escapes upload root") from exc
```
这是一项基础检查，但符号链接、竞态、平台规则和后续创建操作仍需按威胁模型处理。
高风险服务应使用操作系统隔离和专用存储接口，而非只靠字符串检查。
## JSON
JSON 是文本格式，标准库 `json` 可处理：
```python
import json
from pathlib import Path
data = {"name": "Alice", "active": True}
path = Path("user.json")
with path.open("w", encoding="utf-8") as stream:
    json.dump(data, stream, ensure_ascii=False, indent=2)
with path.open(encoding="utf-8") as stream:
    loaded = json.load(stream)
```
JSON 对象键读取后是字符串。JSON 不支持任意 Python 对象、注释或尾随逗号。
解析成功不代表数据可信，仍应验证字段、类型、范围和大小。
不要对不可信数据使用 `eval()`；JSON 应使用 `json.loads()`。
## CSV
```python
import csv
from pathlib import Path
path = Path("scores.csv")
with path.open("w", encoding="utf-8", newline="") as stream:
    writer = csv.DictWriter(stream, fieldnames=["name", "score"])
    writer.writeheader()
    writer.writerow({"name": "Alice", "score": 95})
with path.open(encoding="utf-8", newline="") as stream:
    for row in csv.DictReader(stream):
        score = int(row["score"])
```
CSV 没有单一全球方言，分隔符、引号和编码应由数据契约规定。
向电子表格导出不可信单元格时，应评估公式注入风险，而不只是正确转义 CSV。
## 常用标准库
- `collections`：`deque`、`Counter`、`defaultdict`。
- `itertools`：组合迭代器和惰性流水线。
- `functools`：`wraps`、`lru_cache`、`partial`。
- `datetime` / `zoneinfo`：日期时间与 IANA 时区。
- `decimal` / `fractions`：精确十进制和有理数。
- `hashlib` / `hmac` / `secrets`：摘要、消息认证和安全随机数。
- `subprocess`：启动子进程。
- `argparse`：命令行参数解析。
- `tempfile`：临时文件和目录。
- `shutil`：高级文件操作。
安全令牌使用 `secrets`，不要使用 `random`：
```python
import secrets
token = secrets.token_urlsafe(32)
```
## subprocess 基础安全
优先传参数列表并避免 shell：
```python
import subprocess
result = subprocess.run(
    ["python", "--version"],
    check=True,
    capture_output=True,
    text=True,
    timeout=10,
)
```
不要把不可信输入拼入 `shell=True` 命令。还应设置超时、限制输出并处理返回码。
## 日志基础
库代码使用命名 logger，不在导入时调用 `basicConfig()`：
```python
import logging
logger = logging.getLogger(__name__)
def parse_record(raw: str) -> dict[str, str]:
    logger.debug("parsing record length=%d", len(raw))
    return {"raw": raw}
```
应用入口配置日志：
```python
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
```
参数化日志延迟字符串格式化。不要记录密码、令牌、会话、完整个人数据或大块二进制。
异常处理中可用 `logger.exception("message")` 记录当前回溯。
## unittest 基础
标准库测试无需安装：
```python
import unittest
def add(a: int, b: int) -> int:
    return a + b
class AddTests(unittest.TestCase):
    def test_adds_two_numbers(self) -> None:
        self.assertEqual(add(2, 3), 5)
if __name__ == "__main__":
    unittest.main()
```
运行发现：
```bash
python -m unittest discover
```
测试应覆盖正常路径、边界、失败路径和重要副作用，不依赖执行顺序或真实外部服务。
## pytest 基础
pytest 是第三方工具，需安装：
```bash
python -m pip install pytest
pytest
```
```python
import pytest
def test_invalid_port() -> None:
    with pytest.raises(ValueError):
        parse_port("invalid")
```
小型项目可选标准库或 pytest；团队应统一约定，不需要同时堆叠多套风格。
## 创建虚拟环境
```bash
python -m venv .venv
```
激活命令因平台和 shell 不同：
```powershell
.\.venv\Scripts\Activate.ps1
```
```bash
source .venv/bin/activate
```
激活只是修改当前 shell 的命令查找路径；也可直接运行虚拟环境中的解释器。
确认环境：
```bash
python -c "import sys; print(sys.prefix); print(sys.executable)"
```
## 安装与记录依赖
```bash
python -m pip install package-name
python -m pip list
```
`pip freeze` 可记录当前环境的精确安装结果，但它不总等于经过设计的直接依赖清单。
应用与库的依赖管理策略不同，应遵循项目的 `pyproject.toml` 和锁定方案。
虚拟环境通常不提交版本控制；环境不可跨平台可靠搬运，应从依赖声明重新创建。
## 临时文件
不要手工猜测临时文件名：
```python
from pathlib import Path
from tempfile import TemporaryDirectory
with TemporaryDirectory() as directory:
    path = Path(directory) / "data.bin"
    path.write_bytes(b"sample")
```
退出上下文后自动清理。若其他程序需要通过名称重新打开临时文件，需考虑平台差异。
## 小结
路径要有明确基准，文本要有明确编码，资源要有明确生命周期，依赖要有明确环境。
标准库足以覆盖大量脚本需求；引入第三方库时应安装、记录并隔离。
