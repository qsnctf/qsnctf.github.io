# Python3 函数

## 函数基础

### 什么是函数

函数是组织好的、可重复使用的、用来实现单一或相关联功能的代码块。函数能提高应用的模块性，和代码的重复利用率。Python 提供了许多内置函数，比如 `print()`、`len()` 等，你也可以自己创建函数。

## 定义一个函数

### 基本语法

```python
def 函数名(参数1, 参数2, ...):
    """函数文档字符串（可选）"""
    函数体
    return [表达式]
```

### 函数定义示例

```python
# 简单的函数定义
def greet():
    """这是一个简单的问候函数"""
    print("Hello, World!")

# 带参数的函数
def greet_person(name):
    """向指定的人问好"""
    print(f"Hello, {name}!")

# 带返回值的函数
def add_numbers(a, b):
    """计算两个数的和"""
    return a + b

# 带默认参数的函数
def power(base, exponent=2):
    """计算 base 的 exponent 次方"""
    return base ** exponent
```

### 函数文档字符串

```python
def calculate_area(radius):
    """
    计算圆的面积
    
    参数:
        radius (float): 圆的半径
        
    返回:
        float: 圆的面积
        
    示例:
        >>> calculate_area(5)
        78.53981633974483
    """
    import math
    return math.pi * radius ** 2

# 查看函数文档
print(calculate_area.__doc__)
```

## 函数调用

### 基本调用

```python
# 调用无参数函数
greet()  # 输出: Hello, World!

# 调用带参数函数
greet_person("Alice")  # 输出: Hello, Alice!

# 调用带返回值函数
result = add_numbers(3, 5)
print(result)  # 输出: 8

# 使用默认参数
print(power(4))      # 输出: 16 (4^2)
print(power(4, 3))   # 输出: 64 (4^3)
```

### 关键字参数调用

```python
def describe_person(name, age, city):
    """描述一个人的信息"""
    return f"{name} 是 {age} 岁，住在 {city}"

# 位置参数
print(describe_person("张三", 25, "北京"))

# 关键字参数
print(describe_person(name="李四", city="上海", age=30))

# 混合使用（位置参数必须在关键字参数之前）
print(describe_person("王五", city="广州", age=28))
```

## 参数传递

### 值传递 vs 引用传递

Python 中的参数传递是"对象引用传递"：

```python
def modify_list(numbers):
    """修改列表"""
    numbers.append(99)
    return numbers

def modify_number(num):
    """修改数字"""
    num = 100
    return num

# 列表是可变对象
my_list = [1, 2, 3]
result_list = modify_list(my_list)
print(my_list)        # [1, 2, 3, 99] - 原列表被修改
print(result_list)    # [1, 2, 3, 99]

# 数字是不可变对象
my_num = 10
result_num = modify_number(my_num)
print(my_num)         # 10 - 原数字不变
print(result_num)     # 100
```

### 参数类型

#### 位置参数

```python
def func(a, b, c):
    return a + b + c

result = func(1, 2, 3)  # 1 传递给 a，2 传递给 b，3 传递给 c
```

#### 默认参数

```python
def create_profile(name, age, city="北京", country="中国"):
    """创建个人档案"""
    return f"姓名: {name}, 年龄: {age}, 城市: {city}, 国家: {country}"

print(create_profile("张三", 25))
print(create_profile("李四", 30, "上海"))
print(create_profile("王五", 35, "深圳", "中国"))
```

#### 可变参数（*args）

```python
def sum_all(*numbers):
    """计算所有数字的和"""
    total = 0
    for num in numbers:
        total += num
    return total

print(sum_all(1, 2, 3, 4, 5))  # 15
print(sum_all(10, 20))         # 30
print(sum_all())               # 0

# 与固定参数混合使用
def mixed_args(name, *scores):
    """混合参数示例"""
    avg_score = sum(scores) / len(scores) if scores else 0
    return f"{name} 的平均分: {avg_score:.2f}"

print(mixed_args("张三", 80, 90, 85))  # 张三 的平均分: 85.00
```

#### 关键字可变参数（**kwargs）

```python
def create_user(**user_info):
    """创建用户信息"""
    user = {}
    for key, value in user_info.items():
        user[key] = value
    return user

# 调用
user1 = create_user(name="张三", age=25, email="zhangsan@example.com")
user2 = create_user(name="李四", city="上海", phone="13800138000")

print(user1)
print(user2)

# 与其他参数类型混合
def complete_example(name, age=18, *hobbies, **details):
    """完整参数示例"""
    return {
        "姓名": name,
        "年龄": age,
        "爱好": list(hobbies),
        "详细信息": details
    }

result = complete_example(
    "王五", 
    30, 
    "读书", "游泳", "编程",
    city="北京", 
    job="工程师", 
    married=True
)
print(result)
```

## 匿名函数

### lambda 函数基础

Lambda 函数是一种小的匿名函数，使用 `lambda` 关键字定义：

```python
# 基本语法
# lambda 参数1, 参数2, ... : 表达式

# 简单的 lambda 函数
square = lambda x: x ** 2
print(square(5))  # 25

# 多个参数
add = lambda x, y: x + y
print(add(3, 7))  # 10

# 条件表达式
max_value = lambda x, y: x if x > y else y
print(max_value(10, 20))  # 20
```

### lambda 函数的应用

#### 与内置函数结合

```python
# map() 函数
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# filter() 函数
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # [2, 4, 6, 8, 10]

# sorted() 函数
students = [
    {"name": "张三", "score": 85},
    {"name": "李四", "score": 92},
    {"name": "王五", "score": 78}
]

# 按分数排序
sorted_students = sorted(students, key=lambda x: x["score"], reverse=True)
print(sorted_students)
```

#### 在数据结构中使用

```python
# 字典排序
grades = {"数学": 90, "英语": 85, "物理": 88, "化学": 92}
sorted_grades = dict(sorted(grades.items(), key=lambda x: x[1], reverse=True))
print(sorted_grades)

# 元组列表排序
people = [
    ("张三", 25, "北京"),
    ("李四", 30, "上海"),
    ("王五", 28, "广州")
]

# 按年龄排序
sorted_by_age = sorted(people, key=lambda x: x[1])
print(sorted_by_age)

# 按城市排序
sorted_by_city = sorted(people, key=lambda x: x[2])
print(sorted_by_city)
```

## return 语句

### 基本返回值

```python
def add(a, b):
    """返回两个数的和"""
    return a + b

result = add(3, 4)
print(result)  # 7
```

### 无返回值（默认返回 None）

```python
def greet(name):
    """问候函数，没有显式返回值"""
    print(f"Hello, {name}!")

result = greet("Alice")
print(f"返回值: {result}")  # 返回值: None
```

### 多个返回值

```python
def calculate(a, b):
    """计算和、差、积、商"""
    sum_ab = a + b
    diff_ab = a - b
    product_ab = a * b
    quotient_ab = a / b if b != 0 else None
    return sum_ab, diff_ab, product_ab, quotient_ab

# 接收多个返回值
s, d, p, q = calculate(10, 2)
print(f"和: {s}, 差: {d}, 积: {p}, 商: {q}")

# 作为元组接收
result = calculate(10, 2)
print(result)  # (12, 8, 20, 5.0)
print(type(result))  # <class 'tuple'>
```

### 条件返回

```python
def get_grade(score):
    """根据分数返回等级"""
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

print(get_grade(95))  # A
print(get_grade(85))  # B
print(get_grade(75))  # C
print(get_grade(55))  # F
```

### 提前返回

```python
def is_prime(n):
    """判断是否为质数"""
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

print(is_prime(17))  # True
print(is_prime(15))  # False
```

### 返回函数（闭包）

```python
def multiplier(factor):
    """返回一个乘法函数"""
    def multiply(number):
        return number * factor
    return multiply

# 创建乘法函数
double = multiplier(2)
triple = multiplier(3)

print(double(5))   # 10
print(triple(5))   # 15
```

## 强制位置参数

### 使用 / 分隔符

Python 3.8 引入了强制位置参数语法，使用斜杠 `/` 来分隔位置参数和关键字参数：

```python
def func(pos1, pos2, /, pos_or_kw, *, kw1, kw2):
    """参数类型示例函数
    
    Args:
        pos1: 仅位置参数
        pos2: 仅位置参数
        pos_or_kw: 位置或关键字参数
        kw1: 仅关键字参数
        kw2: 仅关键字参数
    """
    return f"pos1={pos1}, pos2={pos2}, pos_or_kw={pos_or_kw}, kw1={kw1}, kw2={kw2}"

# 正确调用
result1 = func(1, 2, 3, kw1=4, kw2=5)
print(result1)

# pos_or_kw 可以作为关键字参数
result2 = func(1, 2, pos_or_kw=3, kw1=4, kw2=5)
print(result2)

# 错误调用示例
try:
    # pos1 不能作为关键字参数
    func(pos1=1, pos2=2, pos_or_kw=3, kw1=4, kw2=5)
except TypeError as e:
    print(f"错误1: {e}")

try:
    # kw1 不能作为位置参数
    func(1, 2, 3, 4, kw2=5)
except TypeError as e:
    print(f"错误2: {e}")
```

### 实际应用示例

```python
def divide(a, b, /, precision=2, *, round_up=False):
    """除法函数
    
    Args:
        a: 被除数（仅位置参数）
        b: 除数（仅位置参数）
        precision: 精度（位置或关键字参数）
        round_up: 是否向上取整（仅关键字参数）
    """
    if b == 0:
        raise ValueError("除数不能为零")
    
    result = a / b
    
    if round_up:
        import math
        result = math.ceil(result * (10 ** precision)) / (10 ** precision)
    else:
        result = round(result, precision)
    
    return result

# 正确使用
print(divide(10, 3))                    # 3.33
print(divide(10, 3, precision=4))       # 3.3333
print(divide(10, 3, round_up=True))    # 3.34
print(divide(10, 3, 4, round_up=True))  # 3.3334

# 错误使用
try:
    divide(a=10, b=3)  # a, b 是仅位置参数
except TypeError as e:
    print(f"错误: {e}")
```

### 为什么要使用强制位置参数

1. **提高代码安全性**：防止参数名混淆
2. **API 设计清晰**：明确区分必需位置参数和可选关键字参数
3. **向后兼容性**：可以在不破坏现有代码的情况下添加新参数

```python
# 示例：安全的数学函数
def power(base, exp, /, *, modulo=None):
    """幂运算
    
    Args:
        base: 底数（仅位置参数）
        exp: 指数（仅位置参数）
        modulo: 模数（仅关键字参数）
    """
    result = base ** exp
    if modulo is not None:
        result = result % modulo
    return result

# 必须使用位置参数传递 base 和 exp
print(power(2, 3))                    # 8
print(power(2, 3, modulo=5))          # 3

# 错误用法
try:
    power(base=2, exp=3)  # TypeError
except TypeError as e:
    print(f"错误: {e}")
```

## 函数高级特性

### 函数注解

```python
def greeting(name: str, age: int = 18) -> str:
    """带类型注解的函数"""
    return f"Hello, {name}! You are {age} years old."

# 查看注解
print(greeting.__annotations__)
# {'name': <class 'str'>, 'age': <class 'int'>, 'return': <class 'str'>}
```

### 嵌套函数

```python
def outer_function(x):
    """外层函数"""
    def inner_function(y):
        """内层函数"""
        return x + y
    
    return inner_function

add_five = outer_function(5)
print(add_five(10))  # 15
```

### 递归函数

```python
def factorial(n):
    """递归计算阶乘"""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
```

## 最佳实践

### 1. 函数命名
```python
# 好的命名
def calculate_area(radius):
    pass

def send_email(to_address, subject, body):
    pass

# 避免的命名
def func1(x):
    pass

def do_stuff(a, b, c):
    pass
```

### 2. 单一职责原则
```python
# 好的设计：每个函数只做一件事
def validate_email(email):
    """验证邮箱格式"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def send_email(to_address, subject, body):
    """发送邮件"""
    if not validate_email(to_address):
        raise ValueError("邮箱格式无效")
    # 发送邮件逻辑
    pass

# 避免：一个函数做太多事
def process_user_registration(name, email, password):
    """处理用户注册（做了太多事）"""
    # 验证邮箱
    # 加密密码
    # 保存到数据库
    # 发送确认邮件
    pass
```

### 3. 参数默认值设计
```python
# 好的设计：避免可变默认参数
def process_data(data, cache=None):
    if cache is None:
        cache = {}
    # 处理数据
    pass

# 避免：可变默认参数
def process_data_bad(data, cache={}):  # 这会导致问题
    cache[data] = True
    return cache
```

