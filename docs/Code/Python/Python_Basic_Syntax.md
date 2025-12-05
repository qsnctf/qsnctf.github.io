# Python 基础语法

## 1. 编码

### 默认编码
Python 3 默认使用 UTF-8 编码，这意味着你可以在代码中直接使用中文、日文、韩文等字符。

```python
# 默认UTF-8编码，可以直接使用中文
print("你好，世界！")  # 输出：你好，世界！
```

### 自定义编码
如果需要使用不同的编码，可以在文件开头添加编码声明：

```python
# -*- coding: gbk -*-
# 或者
# coding=gbk

print("使用GBK编码")  # 适用于中文Windows环境
```

## 2. 标识符

### 标识符规则
- 第一个字符必须是字母或下划线 `_`
- 其他字符可以是字母、数字或下划线
- 标识符区分大小写
- 不能使用Python保留关键字

```python
# 合法的标识符
variable_name = "值"
_variable = "私有变量"
VariableName = "类名风格"
variable123 = 123

# 非法的标识符
# 123variable = "值"  # 不能以数字开头
# variable-name = "值"  # 不能包含连字符
# class = "值"  # 不能使用保留关键字
```

## 3. Python保留关键字

Python有一组保留关键字，不能用作标识符名称：

```python
import keyword

# 查看所有保留关键字
print(keyword.kwlist)

# 检查是否为保留关键字
print(keyword.iskeyword("if"))     # True
print(keyword.iskeyword("hello"))  # False
```

Python 3.11 的保留关键字列表：
```python
['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']
```

## 4. 注释

### 单行注释
```python
# 这是一个单行注释
print("Hello, World!")  # 这也是一个单行注释
```

### 多行注释
```python
"""
这是一个多行注释
可以跨越多行
通常用于文档字符串
"""

'''
这也是多行注释
使用单引号
'''

def function():
    """
    函数文档字符串
    描述函数的功能
    """
    pass
```

## 5. 行与缩进

Python使用缩进来表示代码块，而不是大括号。

```python
# 正确的缩进
if True:
    print("True")
    print("这行也在if语句中")
else:
    print("False")

# 错误的缩进会导致IndentationError
# if True:
# print("这会导致错误")  # 缺少缩进
```

### 缩进规则
- 使用4个空格作为标准缩进（推荐）
- 可以使用Tab键，但不要混用空格和Tab
- 同一代码块必须使用相同数量的空格

## 6. 多行语句

### 使用反斜杠 `\` 续行
```python
# 长字符串
long_string = "这是一个非常非常非常非常非常非常非常非常非常非常" + \
              "长的字符串，需要使用反斜杠来换行"

# 长表达式
result = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + \
         11 + 12 + 13 + 14 + 15

print(result)
```

### 括号内的自然换行
```python
# 列表、元组、字典等可以自然换行
my_list = [
    "item1",
    "item2", 
    "item3",
    "item4"
]

# 函数参数也可以自然换行
result = max(
    10, 
    20, 
    30, 
    40, 
    50
)
```

## 7. 等待用户输入

使用 `input()` 函数获取用户输入：

```python
# 基本输入
name = input("请输入你的姓名：")
print(f"你好，{name}！")

# 输入数字（需要类型转换）
age = int(input("请输入你的年龄："))
print(f"你的年龄是：{age}")

# 输入多个值
values = input("请输入多个数字，用空格分隔：")
numbers = [int(x) for x in values.split()]
print(f"你输入的数字是：{numbers}")
```

## 8. 同一行显示多条语句

使用分号 `;` 分隔多条语句：

```python
# 同一行多条语句
x = 1; y = 2; z = x + y
print(f"x={x}, y={y}, z={z}")

# 条件语句也可以写在同一行
if x > 0: print("x是正数"); print("继续执行")

# 但不推荐过度使用，会影响代码可读性
```

## 9. 输入和输出

### 输出函数 `print()`
```python
# 基本输出
print("Hello, World!")

# 输出多个值
name = "Alice"
age = 25
print("姓名:", name, "年龄:", age)

# 格式化输出
print(f"姓名: {name}, 年龄: {age}")  # f-string（推荐）
print("姓名: %s, 年龄: %d" % (name, age))  # %格式化
print("姓名: {}, 年龄: {}".format(name, age))  # format方法

# 输出到文件
with open("output.txt", "w") as f:
    print("Hello, File!", file=f)
```

### 输入函数 `input()`
```python
# 基本输入
user_input = input("请输入一些内容：")
print("你输入的是：", user_input)

# 带提示的输入
number = int(input("请输入一个数字："))
print(f"数字的平方是：{number ** 2}")
```

## 10. 多个语句构成代码组

缩进相同的语句构成一个代码组（代码块）：

```python
# if语句代码组
if condition:
    statement1
    statement2
    statement3

# 函数定义代码组
def my_function():
    """函数文档"""
    statement1
    statement2
    return result

# 循环代码组
for item in collection:
    process(item)
    print(item)

# 类定义代码组
class MyClass:
    """类文档"""
    def method1(self):
        pass
    
    def method2(self):
        pass
```

## 11. import 与 from...import

### import 语句
```python
# 导入整个模块
import math
import os
import sys

# 使用模块中的函数
print(math.sqrt(16))  # 4.0
print(os.getcwd())    # 当前工作目录
```

### from...import 语句
```python
# 导入特定函数
from math import sqrt, pi
from datetime import datetime

# 直接使用函数，无需模块名前缀
print(sqrt(25))        # 5.0
print(pi)              # 3.141592653589793
print(datetime.now())  # 当前时间

# 导入所有函数（不推荐）
from math import *
print(sin(pi/2))       # 1.0
```

### 别名导入
```python
# 给模块起别名
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# 给函数起别名
from math import sqrt as square_root
from datetime import datetime as dt

print(square_root(36))  # 6.0
print(dt.now())         # 当前时间
```

## 12. Python命令行参数

### 使用 sys.argv
```python
import sys

# 获取命令行参数
print("脚本名称:", sys.argv[0])
print("参数个数:", len(sys.argv))
print("所有参数:", sys.argv)

# 处理参数
if len(sys.argv) > 1:
    for i, arg in enumerate(sys.argv[1:], 1):
        print(f"参数 {i}: {arg}")
else:
    print("没有提供额外参数")
```

### 使用 argparse 模块（推荐）
```python
import argparse

# 创建解析器
parser = argparse.ArgumentParser(description='示例程序')

# 添加参数
parser.add_argument('name', help='你的姓名')
parser.add_argument('--age', type=int, help='你的年龄')
parser.add_argument('--verbose', action='store_true', help='详细模式')

# 解析参数
args = parser.parse_args()

print(f"你好，{args.name}!")
if args.age:
    print(f"你的年龄是：{args.age}")
if args.verbose:
    print("详细模式已开启")
```

### 命令行使用示例
```bash
# 运行脚本并传递参数
python script.py Alice --age 25 --verbose

# 输出：
# 你好，Alice!
# 你的年龄是：25
# 详细模式已开启
```