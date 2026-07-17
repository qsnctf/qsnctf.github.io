# Python3 简介

## 概念与用途

Python 是解释执行、动态类型且强类型的通用语言。它强调可读性，拥有成熟的标准库和第三方生态，常用于自动化、Web 服务、数据分析、人工智能、测试和安全工具。Python 3 与已经停止维护的 Python 2 不完全兼容，新项目应使用仍受支持的 Python 3 版本。

## 核心语法

源码通常保存为 `.py` 文件，由上到下执行。变量无需声明类型，代码块由缩进界定；`print()` 输出，`type()` 查看运行时类型。

```python
language = "Python"
version = 3
features = ["清晰", "跨平台", "生态丰富"]

print(f"{language} {version}")
for feature in features:
    print(feature, type(feature).__name__)
```

## 运行模型与边界

| 特性 | 实际含义 | 不应误解为 |
| --- | --- | --- |
| 解释执行 | 源码先编译为字节码再由虚拟机执行 | 每行都直接解释文本 |
| 动态类型 | 名称可绑定不同类型对象 | 数据没有类型 |
| 自动内存管理 | 引用计数与垃圾回收协作 | 资源无需主动关闭 |
| 跨平台 | 大部分源码可移植 | 所有系统 API 行为一致 |

## 示例：强类型边界

```python
left = "12"
right = 3
try:
    print(left + right)
except TypeError as error:
    print("不能隐式混合文本和数字:", error)

print(int(left) + right)
```

Python 适合快速迭代，但性能、安全和部署质量仍取决于架构、依赖与测试。对高性能热点可先分析，再考虑 NumPy、原生扩展或其他语言，而不是仅凭语言标签判断。

## 常见错误与工程注意

- 动态类型不等于没有类型；对象有确定类型，不兼容运算会抛出 `TypeError`。
- 项目应固定 Python 版本和依赖，并使用虚拟环境隔离。
- 避免继续使用 Python 2 教程中的 `print x`、`raw_input()` 等语法。
