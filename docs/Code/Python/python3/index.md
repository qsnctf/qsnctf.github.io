# Python3 教程

Python3 是当前 Python 学习和工程使用的主线版本。本教程覆盖基础语法、内置数据结构、函数、模块、文件、异常、面向对象、虚拟环境和标准库入口。

## Python3 简介

Python3 是解释型、动态类型、强类型语言，常用于脚本自动化、Web 后端、数据分析、CTF 解题、机器学习和安全工具开发。

## Python3 环境搭建

建议安装 Python 3.10 或更新版本，并确认命令可用：

```bash
python --version
python -m pip --version
```

Windows 下可使用官方安装包，Linux/macOS 可使用系统包管理器、pyenv 或发行版提供的 Python。

## Python3 Pycharm

PyCharm 适合较完整的项目开发。重点配置解释器、虚拟环境、代码格式化、运行配置和调试断点。

## Python3 VScode

VS Code 适合轻量开发。常用扩展包括 Python、Pylance、Jupyter。选择解释器后，终端和调试器应使用同一虚拟环境。

## Python3 基础语法

Python 使用缩进表示代码块：

```python
if True:
    print("hello")
```

缩进不一致会导致语法错误。推荐统一使用 4 个空格。

## Python3 基本数据类型

常见类型包括 `int`、`float`、`bool`、`str`、`list`、`tuple`、`dict`、`set`、`bytes` 和 `NoneType`。

## Python3 数据类型转换

常见转换：

```python
int("123")
str(123)
list("abc")
set([1, 1, 2])
```

转换失败会抛出异常，处理用户输入时应捕获 `ValueError`。

## Python3 解释器

解释器负责读取源码、编译字节码并执行。交互式解释器适合快速验证表达式和小片段。

## Python3 注释

单行注释使用 `#`。文档字符串使用三引号，常用于模块、类和函数说明。

## Python3 运算符

常见运算符包括算术、比较、逻辑、成员、身份和位运算。`is` 判断对象身份，`==` 判断值是否相等。

## Python3 数字(Number)

Python3 的整数不固定字长，浮点数遵循二进制浮点规则。金额和高精度计算可使用 `decimal`。

## Python3 字符串

字符串是不可变序列，支持切片、格式化和常用方法：

```python
name = "ctf"
print(f"hello {name}")
```

## Python3 列表

列表是可变序列，适合保存有序集合。

```python
items = [1, 2, 3]
items.append(4)
```

## Python3 元组

元组是不可变序列，常用于固定结构数据和多返回值。

## Python3 字典

字典保存键值对，平均查找复杂度接近 `O(1)`。

```python
user = {"name": "alice", "role": "admin"}
```

## Python3 集合

集合用于去重和集合运算，支持交集、并集、差集。

## Python3 条件控制

```python
if score >= 90:
    grade = "A"
elif score >= 60:
    grade = "P"
else:
    grade = "F"
```

## Python3 循环语句

`for` 用于遍历可迭代对象，`while` 用于条件循环。`break` 退出循环，`continue` 进入下一轮。

## Python3 编程第一步

从输入、处理、输出开始：

```python
name = input("name: ")
print(f"hello {name}")
```

## Python3 推导式

推导式用于简洁构造列表、集合和字典：

```python
squares = [x * x for x in range(10)]
```

## Python3 迭代器与生成器

迭代器实现 `__iter__` 和 `__next__`。生成器用 `yield` 惰性产生值，适合流式处理。

## Python3 with

`with` 使用上下文管理器自动处理资源释放：

```python
with open("data.txt", "r", encoding="utf-8") as f:
    text = f.read()
```

## Python3 函数

函数用 `def` 定义，支持默认参数、关键字参数、可变参数和返回值。

## Python3 lambda

`lambda` 定义匿名函数，适合短小表达式，不适合复杂逻辑。

## Python3 装饰器

装饰器本质是接收函数并返回新函数的高阶函数，常用于日志、鉴权、缓存和计时。

## Python3 数据结构

内置结构包括列表、元组、字典、集合。标准库 `collections` 还提供 `deque`、`Counter`、`defaultdict`、`namedtuple` 等。

## Python3 模块

模块是 `.py` 文件。使用 `import` 导入模块，使用包组织多文件项目。

## Python __name__

当文件直接运行时，`__name__ == "__main__"`。常用于脚本入口：

```python
if __name__ == "__main__":
    main()
```

## Python3 输入和输出

`input()` 读取字符串，`print()` 输出内容。格式化推荐使用 f-string。

## Python3 File

文件读写应显式指定编码，并使用 `with` 管理句柄。

## Python3 OS

`os` 和 `pathlib` 用于路径、环境变量和文件系统操作。新代码优先考虑 `pathlib.Path`。

## Python3 错误和异常

使用 `try/except/finally` 处理异常。不要裸 `except:` 吞掉所有错误。

## Python3 面向对象

类用于封装数据和行为。常见概念包括实例、方法、继承、组合、属性和魔术方法。

## Python3 命名空间/作用域

Python 查找变量遵循 LEGB：Local、Enclosing、Global、Built-in。

## Python 虚拟环境的创建

```bash
python -m venv .venv
.venv\Scripts\activate
python -m pip install -U pip
```

Linux/macOS 激活命令通常是 `source .venv/bin/activate`。

## Python 类型注解

类型注解提升可读性和工具检查能力：

```python
def add(a: int, b: int) -> int:
    return a + b
```

## Python3 标准库概览

常用标准库包括 `pathlib`、`json`、`csv`、`datetime`、`re`、`subprocess`、`threading`、`asyncio`、`logging`、`hashlib`。

## Python3 实例

示例：统计文件中每个单词出现次数。

```python
from collections import Counter
from pathlib import Path

words = Path("data.txt").read_text(encoding="utf-8").split()
print(Counter(words).most_common(10))
```

## Python 测验

自检问题：

1. `is` 和 `==` 有什么区别？
2. 列表和元组的主要差异是什么？
3. 为什么文件读写推荐使用 `with`？
4. `__name__ == "__main__"` 的作用是什么？
5. 虚拟环境解决了什么问题？
