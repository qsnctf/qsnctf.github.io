# Python 3.10+ 知识体系
本目录面向已经会使用命令行、希望系统掌握现代 Python 的读者。
全文以 Python 3.10 及以上版本为基线；不同小版本新增的语法会单独说明。
Python 是动态类型、强类型、自动内存管理的通用编程语言。
学习时应始终区分三件事：名称绑定到对象、对象是否可变、数据是文本还是字节。
## 阅读路线
1. [环境、语法与代码风格](environment-syntax-and-style.md)
2. [类型、字符串、字节与容器](types-strings-bytes-and-collections.md)
3. [运算符、控制流与推导式](operators-control-flow-and-comprehensions.md)
4. [函数、作用域、迭代器与装饰器](functions-scope-iterators-and-decorators.md)
5. [模块、包、异常与类型注解](modules-packages-errors-and-type-hints.md)
6. [文件、路径、标准库与虚拟环境](files-paths-stdlib-and-venv.md)
7. [面向对象编程](object-oriented-programming.md)
8. [Python 在 CTF 中的安全用法](python-for-ctf.md)
建议按顺序阅读。已经熟悉基础语法的读者，可以从函数、模块或 CTF 章节开始，
但应先确认自己理解 `str` 与 `bytes`、可变对象与不可变对象的差异。
## 运行示例
检查解释器版本：
```bash
python --version
```
某些系统将命令命名为 `python3`，Windows 还可使用 `py -3.10`。
本文统一写作 `python`，请按本机环境替换。
运行脚本：
```bash
python example.py
```
进入交互式解释器：
```bash
python
```
短命令适合用 `-c` 验证：
```bash
python -c "print(sum(range(10)))"
```
## 核心心智模型
### 名称绑定，而不是“变量盒子”
赋值语句把名称绑定到对象：
```python
a = [1, 2]
b = a
b.append(3)
print(a)  # [1, 2, 3]
```
`a` 和 `b` 指向同一个列表，所以通过任一名称修改对象都可被另一方观察到。
`b = [9]` 则只是让 `b` 改绑到新列表，不会修改 `a` 所指对象。
### 可变性决定修改行为
常见不可变对象包括 `int`、`float`、`bool`、`str`、`bytes`、`tuple`、`frozenset`。
常见可变对象包括 `list`、`dict`、`set`、`bytearray` 以及多数自定义实例。
不可变并不表示“内部所有对象都不可变”：
```python
items = ([1], [2])
items[0].append(3)
print(items)  # ([1, 3], [2])
```
元组保存的引用不可替换，但其中引用的列表仍可修改。
### 文本与二进制必须显式转换
`str` 表示 Unicode 文本，`bytes` 表示 0 到 255 的字节序列。
编码把文本变成字节，解码把字节变成文本：
```python
raw = "旗帜".encode("utf-8")
text = raw.decode("utf-8")
```
文件格式、网络协议、压缩包和密码学算法通常处理字节；
JSON 字段、日志消息和用户界面通常处理文本。
## 推荐工具链
Python 自带 `venv`、`unittest`、`logging`、`pathlib`、`json` 等工具。
第三方工具必须先安装，推荐在虚拟环境中执行：
```bash
python -m pip install ruff pytest mypy
```
- Ruff：代码检查和格式化。
- pytest：简洁的第三方测试框架。
- mypy：静态类型检查器。
也可以只使用标准库，不必为简单脚本引入依赖。
## 代码质量最低要求
- 使用 4 个空格缩进，不混用制表符。
- 文件和标识符默认使用 UTF-8；源代码文本尽量清晰直接。
- 公共函数写清参数、返回值、异常和副作用。
- 资源使用上下文管理器及时关闭。
- 捕获具体异常，不使用无条件的 `except:` 吞掉错误。
- 不把密钥、令牌、密码写入源码或日志。
- 依赖使用虚拟环境隔离，并记录可复现的安装方式。
- 先写清晰代码，再根据测量结果优化。
## 常见误区
### Python 不是“纯解释型”标签能概括的
以 CPython 为例，源码通常先编译为字节码，再由虚拟机执行。
实现细节不应成为编写可移植 Python 代码的前提。
### 类型注解不会自动阻止错误调用
```python
def double(value: int) -> int:
    return value * 2
print(double("ab"))  # 运行时得到 "abab"
```
注解主要服务于阅读、IDE 和静态检查器；需要运行时校验时应显式实现。
### `is` 不是值相等
`==` 比较值，`is` 比较是否为同一个对象。
判断空值应写 `value is None`，普通数字和字符串比较应使用 `==`。
### 浮点数不是十进制精确值
```python
print(0.1 + 0.2 == 0.3)  # False
```
金额等十进制精确场景可使用 `decimal.Decimal`；近似比较可用 `math.isclose()`。
### 双下划线不等于安全私有
类中 `__name` 会触发名称改写，用于减少子类意外覆盖，
但它不是访问控制或安全边界。Python 通常用单下划线表达“内部实现”。
## 学习与验证方法
遇到不确定行为时，先写最小可运行示例，再查看官方文档：
```python
help(str.removeprefix)
print(type({}))
print(repr("a\n"))
```
`repr()` 特别适合观察空白符、转义字符和字节内容。
不要仅凭输出顺序、对象地址或 CPython 优化推导语言保证。
## 版本边界
本体系可以直接使用 Python 3.10 的以下能力：
- `X | Y` 联合类型语法。
- `match` / `case` 结构化模式匹配。
- 内置容器泛型，如 `list[str]`。
- `str.removeprefix()` 与 `str.removesuffix()`。
若示例需要 3.11+ 或更新版本，会在正文中标明，不把新特性误写为 3.10 可用。
## CTF 使用边界
CTF 章节只讨论授权竞赛或本地练习中的数据处理：编码转换、二进制解析、
正则提取、HTTP/socket 基础、XOR 与文件检查。
示例不包含扫描、利用、凭据攻击、持久化或面向真实目标的攻击自动化。
## 快速自检
完成学习后，应能回答以下问题：
- 为什么修改函数收到的列表可能影响调用者？
- 为什么网络响应体通常先得到 `bytes`，之后才解码？
- `break`、`continue`、循环 `else` 分别何时执行？
- `yield` 如何改变函数的调用结果和执行时机？
- 相对导入为什么依赖包上下文？
- `raise ... from ...` 解决什么问题？
- 为什么 `Path` 通常优于手工拼接路径字符串？
- `dataclass` 生成了哪些常用方法，又不会自动完成哪些校验？
- 如何限制读取不可信文件时的大小、格式和超时？
这些问题也是后续各篇的组织主线。
