# Python 注释

## 1. 注释概述

在 Python3 中，注释不会影响程序的执行，但是会使代码更易于阅读和理解。注释是程序员在代码中添加的说明性文字，用于解释代码的功能、目的或实现细节。

## 2. 单行注释

单行注释使用井号 `#` 开头，从 `#` 开始到行尾的内容都会被 Python 解释器忽略。

### 基本用法
```python
# 这是一个单行注释
print("Hello, World!")  # 在代码行尾添加注释

# 计算两个数的和
num1 = 10
num2 = 20
result = num1 + num2  # 将结果存储在result变量中
print(result)
```

### 注释掉代码
```python
# 暂时禁用下面的代码
# print("这行代码不会执行")
# x = 5 + 3
# print(x)

print("只有这行代码会执行")
```

### 多行单行注释
```python
# 第一行注释
# 第二行注释
# 第三行注释
def calculate_area(radius):
    # 计算圆的面积
    # 使用公式：π * r²
    pi = 3.14159
    area = pi * radius ** 2
    return area
```

## 3. 多行注释（文档字符串）

Python 没有专门的多行注释语法，但可以使用三引号 `'''` 或 `"""` 来创建多行字符串，这些字符串如果不赋值给变量，就相当于多行注释。

### 使用三引号作为多行注释
```python
'''
这是一个多行注释
可以跨越多行
用于说明复杂的功能
'''

def complex_function():
    """
    这个函数执行复杂的计算：
    1. 第一步：数据预处理
    2. 第二步：核心计算
    3. 第三步：结果验证
    """
    pass
```

### 模块级别的文档字符串
```python
"""
math_operations.py

这个模块提供基本的数学运算功能
包括加法、减法、乘法、除法等

作者: Python 学习者
创建时间: 2024年
"""

def add(a, b):
    """返回两个数的和"""
    return a + b

def subtract(a, b):
    """返回两个数的差"""
    return a - b
```

## 4. 文档字符串（Docstrings）

文档字符串是 Python 中一种特殊的注释，用于描述模块、函数、类和方法。它们可以通过 `__doc__` 属性访问。

### 函数文档字符串
```python
def calculate_bmi(weight, height):
    """
    计算身体质量指数 (BMI)
    
    参数:
        weight (float): 体重，单位：千克
        height (float): 身高，单位：米
    
    返回:
        float: BMI 值
    
    示例:
        >>> calculate_bmi(70, 1.75)
        22.86
    """
    return weight / (height ** 2)

# 访问文档字符串
print(calculate_bmi.__doc__)
```

### 类文档字符串
```python
class Person:
    """
    表示一个人的类
    
    属性:
        name (str): 姓名
        age (int): 年龄
    
    方法:
        introduce(): 打印自我介绍
    """
    
    def __init__(self, name, age):
        """初始化 Person 实例"""
        self.name = name
        self.age = age
    
    def introduce(self):
        """打印这个人的基本信息"""
        print(f"我叫{self.name}，今年{self.age}岁")

# 访问类的文档字符串
print(Person.__doc__)
```

## 5. 注释的最佳实践

### 5.1 注释应该解释"为什么"而不是"是什么"
```python
# 不好的注释（解释明显的事情）
x = x + 1  # 将x加1

# 好的注释（解释为什么这样做）
x = x + 1  # 补偿数组索引从0开始的问题
```

### 5.2 保持注释简洁明了
```python
# 不好的注释（过于冗长）
# 这个函数接收一个数字作为参数，然后检查它是否大于零，如果大于零就返回True，否则返回False
def is_positive(n):
    return n > 0

# 好的注释
# 检查数字是否为正数
def is_positive(n):
    return n > 0
```

### 5.3 及时更新注释
```python
# 原始代码和注释
def process_data(data):
    # 处理数据并返回结果
    return data * 2

# 修改后的代码，注释也需要更新
def process_data(data):
    # 处理数据：先验证，再乘以系数2.5
    if not isinstance(data, (int, float)):
        raise ValueError("数据必须是数字")
    return data * 2.5
```

### 5.4 使用有意义的变量名减少注释需求
```python
# 不好的做法（需要大量注释）
def calc(a, b):
    # a是半径，b是高度
    return 3.14 * a * a * b  # 计算圆柱体积

# 好的做法（变量名自解释）
def calculate_cylinder_volume(radius, height):
    pi = 3.14
    return pi * radius ** 2 * height
```

## 6. 特殊注释

### TODO 注释
```python
# TODO: 添加错误处理
def read_file(filename):
    with open(filename, 'r') as file:
        return file.read()

# FIXME: 这个函数有性能问题，需要优化
def slow_function():
    import time
    time.sleep(5)  # 模拟耗时操作
    return "完成"

# NOTE: 这个算法使用了动态规划
# 时间复杂度为O(n^2)，空间复杂度为O(n)
def dynamic_programming_solution():
    pass
```

### 类型提示注释
```python
from typing import List, Dict, Optional

def process_items(items: List[str]) -> Dict[str, int]:
    """
    处理字符串列表，返回每个字符串的出现次数
    
    参数:
        items: 字符串列表
    
    返回:
        每个字符串出现次数的字典
    """
    result = {}
    for item in items:
        result[item] = result.get(item, 0) + 1
    return result

def get_user_age(user_id: int) -> Optional[int]:
    """
    根据用户ID获取年龄，如果用户不存在返回None
    """
    # 模拟数据库查询
    users = {1: 25, 2: 30, 3: 35}
    return users.get(user_id)
```

## 7. 注释的常见错误

### 7.1 注释与代码不一致
```python
# 计算圆的周长（注释说计算周长，但代码计算面积）
def calculate_circle(radius):
    return 3.14 * radius ** 2  # 这实际上是面积公式
```

### 7.2 过度注释
```python
# 初始化计数器
count = 0  # 将count设置为0

# 循环10次
for i in range(10):  # i从0到9
    count = count + 1  # 每次循环count加1
```

### 7.3 无意义的注释
```python
# 这是一个函数
def my_function():
    # 开始
    x = 5  # 设置x为5
    # 结束
    return x
```

## 8. 实际应用示例

### 完整的模块示例
```python
"""
calculator.py - 简单的计算器模块

提供基本的数学运算功能，包括加减乘除和更复杂的运算。
支持整数和浮点数运算。
"""

import math


def add(a: float, b: float) -> float:
    """
    返回两个数的和
    
    参数:
        a: 第一个加数
        b: 第二个加数
    
    返回:
        两个数的和
    
    示例:
        >>> add(2, 3)
        5.0
        >>> add(2.5, 3.7)
        6.2
    """
    return a + b


def subtract(a: float, b: float) -> float:
    """返回两个数的差（a - b）"""
    return a - b


def multiply(a: float, b: float) -> float:
    """返回两个数的乘积"""
    return a * b


def divide(a: float, b: float) -> float:
    """
    返回两个数的商（a / b）
    
    注意:
        如果除数为0，会抛出ZeroDivisionError
    """
    if b == 0:
        raise ZeroDivisionError("除数不能为0")
    return a / b


def power(base: float, exponent: float) -> float:
    """
    计算base的exponent次方
    
    使用math.pow()函数实现，支持小数指数
    """
    return math.pow(base, exponent)


# 测试代码
if __name__ == "__main__":
    # 测试基本运算
    print("测试加法:", add(5, 3))        # 期望输出: 8.0
    print("测试减法:", subtract(5, 3))   # 期望输出: 2.0
    print("测试乘法:", multiply(5, 3))   # 期望输出: 15.0
    print("测试除法:", divide(6, 3))     # 期望输出: 2.0
    
    # 测试幂运算
    print("测试幂运算:", power(2, 3))    # 期望输出: 8.0
    
    # TODO: 添加更多测试用例
    # FIXME: 除法测试需要添加异常处理测试
```