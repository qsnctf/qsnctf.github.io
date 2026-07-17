# 环境、语法与代码风格
本篇建立可复现的运行环境，并介绍 Python 3.10+ 最常用的语法和工程约定。
## 选择解释器
优先从 Python 官方发行版、操作系统包管理器或可信环境管理器安装。
确认实际运行的是预期解释器：
```bash
python --version
python -c "import sys; print(sys.executable); print(sys.version)"
```
在同一台机器上可能同时存在多个 Python。
使用 `python -m pip` 比直接执行 `pip` 更可靠，因为它明确绑定当前解释器。
```bash
python -m pip --version
```
不要使用管理员权限向系统 Python 随意安装项目依赖。
隔离依赖的方法见[文件、路径、标准库与虚拟环境](files-paths-stdlib-and-venv.md)。
## 三种运行方式
交互模式适合实验：
```pycon
>>> 2 ** 10
1024
```
脚本适合保存和复用：
```python
# hello.py
name = "Python"
print(f"Hello, {name}!")
```
模块方式可正确建立包上下文：
```bash
python -m package.module
```
运行包内代码时，通常优先 `python -m`，不要依赖当前工作目录偶然可导入。
## 源文件与入口
Python 3 源文件默认使用 UTF-8。现代代码通常无需编码声明。
可执行模块常使用入口保护：
```python
def main() -> int:
    print("running")
    return 0
if __name__ == "__main__":
    raise SystemExit(main())
```
导入模块时，模块级语句仍会执行，但入口保护中的代码不会执行。
因此避免在导入阶段发网络请求、解析命令行或执行耗时工作。
## 缩进与语句块
缩进属于语法。使用 4 个空格，不混用 Tab：
```python
temperature = 28
if temperature >= 30:
    level = "hot"
else:
    level = "normal"
```
冒号开始一个语句块。空块可临时使用 `pass`：
```python
def not_implemented_yet() -> None:
    pass
```
一行写多个语句虽合法但不利于阅读，应避免分号拼接。
## 名称与赋值
标识符区分大小写，可包含字母、数字和下划线，但不能以数字开头。
不要覆盖内置名称：
```python
# 不推荐：list = [1, 2]
items = [1, 2]
```
赋值是名称绑定：
```python
count = 1
count = count + 1
```
支持解包与交换：
```python
left, right = 10, 20
left, right = right, left
first, *middle, last = range(5)
```
右侧会先求值，再完成左侧绑定。
## 行连接与括号
优先利用圆括号、方括号或花括号进行隐式续行：
```python
total = (
    first_value
    + second_value
    + third_value
)
```
反斜杠续行脆弱，尾随空格也会导致问题，通常不推荐。
相邻字符串字面量会自动拼接：
```python
message = (
    "第一部分，"
    "第二部分。"
)
```
变量字符串不能依靠相邻写法拼接，应使用 `+`、`join()` 或 f-string。
## 注释与文档字符串
注释解释原因、约束或不明显的权衡，而不是逐字复述代码：
```python
# 协议字段固定为网络字节序，不能使用本机字节序。
header = value.to_bytes(4, "big")
```
模块、公共类和公共函数可使用文档字符串：
```python
def normalize_name(name: str) -> str:
    """移除首尾空白，并将连续单词规范为标题形式。"""
    return name.strip().title()
```
文档字符串是运行时对象，可由 `help()` 和文档工具读取。
## 字面量
整数支持不同进制和分隔符：
```python
decimal = 1_000_000
binary = 0b1010
octal = 0o755
hexadecimal = 0xFF
```
字符串可用单引号、双引号或三引号。原始字符串减少反斜杠转义：
```python
pattern = r"\d+\.\d+"
multiline = """first line
second line"""
```
原始字符串仍不能以单个反斜杠结尾，也不是“完全不处理转义”的任意字节表示。
`None` 表示缺失或无返回值，判断时使用身份比较：
```python
if result is None:
    print("no result")
```
## 表达式与语句
表达式产生值，如 `2 + 3`、函数调用和列表推导式。
语句组织控制流程或绑定名称，如 `if`、`for`、`def`、`class`、`import`。
赋值表达式 `:=` 可复用刚计算的值，但不应牺牲可读性：
```python
while chunk := stream.read(4096):
    process(chunk)
```
普通赋值 `=` 本身不是表达式，不能放在条件中。
## 输入与输出
`input()` 总是返回字符串，并在读取失败时可能抛出 `EOFError`：
```python
raw = input("count: ")
try:
    count = int(raw)
except ValueError:
    print("请输入整数")
```
`print()` 适合交互输出，不应代替长期运行程序的日志系统：
```python
print("a", "b", sep=",", end="\n")
```
日志基础见[文件、路径、标准库与虚拟环境](files-paths-stdlib-and-venv.md)。
## 命名约定
- 模块和包：`lowercase_name`。
- 函数和变量：`snake_case`。
- 类和异常：`CapWords`。
- 常量：`UPPER_CASE`，这是约定而非运行时只读。
- 内部实现：前导单下划线，如 `_cache`。
- 避免自创双下划线结尾名称，以免与特殊方法冲突。
名称应表达业务含义。循环索引可使用 `i`，但跨越较长逻辑时应改为明确名称。
## PEP 8 与自动化工具
PEP 8 是通用风格指南，项目自身约定可以更具体。
不要手工争论可自动处理的格式问题。
Ruff 是第三方工具，需要安装：
```bash
python -m pip install ruff
ruff check .
ruff format .
```
工具配置应由项目统一管理。学习示例中也应保持一致缩进、合理行长和清晰导入。
## 导入风格
导入通常按标准库、第三方库、本地包分组：
```python
import json
from pathlib import Path
import requests
from my_package import parser
```
`requests` 是第三方库，使用前必须安装：
```bash
python -m pip install requests
```
避免 `from module import *`，它会污染命名空间并让来源不清晰。
模块和包机制见后续专题。
## 最小调试方法
先观察类型和可重现表示：
```python
value = "a\tb"
print(type(value).__name__)
print(repr(value))
```
临时断点可使用标准库：
```python
breakpoint()
```
默认会进入 `pdb`。生产代码提交前应删除无意保留的断点。
## 常见环境问题
- `ModuleNotFoundError`：确认使用的解释器、虚拟环境和安装命令一致。
- 文件找不到：确认当前工作目录，不要误认为它等于脚本所在目录。
- 乱码：确认文本编码，明确使用 UTF-8，不要对任意二进制强制解码。
- 命令找不到：检查 PATH，Windows 可尝试 `py` 启动器。
- 导入到错误模块：检查当前目录是否存在与标准库同名的文件，如 `json.py`。
## 小结
可靠的 Python 程序从可确认的解释器、清晰的入口和稳定的代码风格开始。
下一篇将深入对象、可变性、文本、字节和内置容器。
