# Python Lambda 函数

## 概述

Lambda 函数（也称为匿名函数）是 Python 中的一种特殊函数，它允许你创建简单的、单行的函数而不需要使用 `def` 关键字。Lambda 函数在需要小型、一次性使用的函数时非常有用。

### 什么是 Lambda 函数？

Lambda 函数是：
- **匿名函数**：没有函数名
- **单行函数**：只能包含一个表达式
- **即时使用**：通常用于需要函数对象的地方
- **函数式编程工具**：与 `map()`, `filter()`, `reduce()` 等函数配合使用

## Lambda 函数特点

### 1. 简洁性

Lambda 函数比传统的 `def` 函数更简洁：

```python
# 传统函数定义
def square(x):
    return x ** 2

# Lambda 函数
square = lambda x: x ** 2
```

### 2. 匿名性

Lambda 函数没有名称，适合一次性使用：

```python
# 不需要给函数命名，直接使用
result = (lambda x, y: x + y)(3, 5)
print(result)  # 8
```

### 3. 单表达式限制

Lambda 函数只能包含一个表达式，不能包含复杂的逻辑或多行代码：

```python
# 正确的 Lambda 函数
add = lambda x, y: x + y

# 错误的 Lambda 函数（包含多个表达式）
# complex_lambda = lambda x: print(x); return x * 2  # 语法错误
```

### 4. 函数对象

Lambda 函数返回一个函数对象，可以像普通函数一样使用：

```python
# Lambda 函数赋值给变量
multiply = lambda x, y: x * y
print(multiply(4, 5))  # 20

# Lambda 函数作为参数传递
def apply_operation(func, a, b):
    return func(a, b)

result = apply_operation(lambda x, y: x ** y, 2, 3)
print(result)  # 8
```

## Lambda 语法格式

### 基本语法

```python
lambda arguments: expression
```

- **`lambda`**：关键字，表示创建 lambda 函数
- **`arguments`**：参数列表，可以包含多个参数
- **`expression`**：单个表达式，函数的返回值

### 参数规则

#### 无参数

```python
# 无参数的 lambda 函数
greet = lambda: "Hello, World!"
print(greet())  # Hello, World!
```

#### 单个参数

```python
# 单个参数的 lambda 函数
double = lambda x: x * 2
print(double(5))  # 10

square = lambda x: x ** 2
print(square(4))  # 16
```

#### 多个参数

```python
# 多个参数的 lambda 函数
add = lambda x, y: x + y
print(add(3, 7))  # 10

multiply = lambda a, b, c: a * b * c
print(multiply(2, 3, 4))  # 24
```

#### 默认参数

```python
# 带默认参数的 lambda 函数
power = lambda x, y=2: x ** y
print(power(3))     # 9 (使用默认参数 y=2)
print(power(3, 3))  # 27 (指定 y=3)
```

#### 可变参数

```python
# 可变参数的 lambda 函数
sum_all = lambda *args: sum(args)
print(sum_all(1, 2, 3, 4, 5))  # 15

# 关键字参数
print_info = lambda **kwargs: ', '.join([f"{k}: {v}" for k, v in kwargs.items()])
print(print_info(name="Alice", age=25, city="Beijing"))  # name: Alice, age: 25, city: Beijing
```

## Lambda 函数示例

### 基础示例

#### 数学运算

```python
# 基本数学运算
add = lambda x, y: x + y
subtract = lambda x, y: x - y
multiply = lambda x, y: x * y
divide = lambda x, y: x / y if y != 0 else "除数不能为零"

print(add(10, 5))       # 15
print(subtract(10, 5))  # 5
print(multiply(10, 5))  # 50
print(divide(10, 5))    # 2.0
print(divide(10, 0))    # 除数不能为零
```

#### 字符串处理

```python
# 字符串操作
uppercase = lambda s: s.upper()
reverse = lambda s: s[::-1]
capitalize_words = lambda s: ' '.join([word.capitalize() for word in s.split()])

print(uppercase("hello"))                # HELLO
print(reverse("python"))                 # nohtyp
print(capitalize_words("hello world"))   # Hello World
```

#### 条件判断

```python
# 条件表达式
is_even = lambda x: x % 2 == 0
is_positive = lambda x: x > 0
grade = lambda score: "优秀" if score >= 90 else "良好" if score >= 70 else "及格" if score >= 60 else "不及格"

print(is_even(4))      # True
print(is_positive(-5)) # False
print(grade(95))       # 优秀
print(grade(75))       # 良好
print(grade(55))       # 不及格
```

### 与内置函数结合使用

#### 与 `map()` 函数结合

```python
# 使用 map() 和 lambda 对列表中的每个元素应用函数
numbers = [1, 2, 3, 4, 5]

# 平方每个数字
squares = list(map(lambda x: x ** 2, numbers))
print(squares)  # [1, 4, 9, 16, 25]

# 转换为字符串
strings = list(map(lambda x: str(x), numbers))
print(strings)  # ['1', '2', '3', '4', '5']

# 处理字符串列表
words = ["apple", "banana", "cherry"]
uppercase_words = list(map(lambda s: s.upper(), words))
print(uppercase_words)  # ['APPLE', 'BANANA', 'CHERRY']
```

#### 与 `filter()` 函数结合

```python
# 使用 filter() 和 lambda 过滤列表
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 过滤偶数
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # [2, 4, 6, 8, 10]

# 过滤大于5的数字
greater_than_5 = list(filter(lambda x: x > 5, numbers))
print(greater_than_5)  # [6, 7, 8, 9, 10]

# 过滤字符串
words = ["apple", "banana", "cherry", "date", "elderberry"]
long_words = list(filter(lambda s: len(s) > 5, words))
print(long_words)  # ['banana', 'cherry', 'elderberry']
```

#### 与 `reduce()` 函数结合

```python
from functools import reduce

# 使用 reduce() 和 lambda 进行累积计算
numbers = [1, 2, 3, 4, 5]

# 计算总和
sum_result = reduce(lambda x, y: x + y, numbers)
print(sum_result)  # 15

# 计算乘积
product_result = reduce(lambda x, y: x * y, numbers)
print(product_result)  # 120

# 找出最大值
max_result = reduce(lambda x, y: x if x > y else y, numbers)
print(max_result)  # 5

# 字符串连接
words = ["Hello", "World", "Python"]
concatenated = reduce(lambda x, y: x + " " + y, words)
print(concatenated)  # Hello World Python
```

#### 与 `sorted()` 函数结合

```python
# 使用 sorted() 和 lambda 进行自定义排序
# 按字符串长度排序
words = ["apple", "banana", "cherry", "date", "elderberry"]
sorted_by_length = sorted(words, key=lambda s: len(s))
print(sorted_by_length)  # ['date', 'apple', 'banana', 'cherry', 'elderberry']

# 按字符串最后一个字符排序
sorted_by_last_char = sorted(words, key=lambda s: s[-1])
print(sorted_by_last_char)  # ['banana', 'apple', 'date', 'elderberry', 'cherry']

# 复杂数据结构排序
students = [
    {"name": "Alice", "age": 25, "score": 85},
    {"name": "Bob", "age": 22, "score": 92},
    {"name": "Charlie", "age": 23, "score": 78}
]

# 按年龄排序
sorted_by_age = sorted(students, key=lambda s: s["age"])
print("按年龄排序:", [s["name"] for s in sorted_by_age])  # ['Bob', 'Charlie', 'Alice']

# 按分数降序排序
sorted_by_score_desc = sorted(students, key=lambda s: s["score"], reverse=True)
print("按分数降序:", [s["name"] for s in sorted_by_score_desc])  # ['Bob', 'Alice', 'Charlie']

# 多重排序条件（先按分数，再按年龄）
sorted_multiple = sorted(students, key=lambda s: (s["score"], s["age"]), reverse=True)
print("多重排序:", [(s["name"], s["score"], s["age"]) for s in sorted_multiple])
# [('Bob', 92, 22), ('Alice', 85, 25), ('Charlie', 78, 23)]
```

### 实际应用场景

#### 数据处理

```python
# 数据处理示例
data = [
    {"product": "A", "price": 100, "quantity": 2},
    {"product": "B", "price": 200, "quantity": 1},
    {"product": "C", "price": 150, "quantity": 3}
]

# 计算每个产品的总价
total_prices = list(map(lambda item: {
    "product": item["product"], 
    "total": item["price"] * item["quantity"]
}, data))
print("总价计算:", total_prices)

# 过滤高价产品
expensive_products = list(filter(lambda item: item["price"] > 120, data))
print("高价产品:", expensive_products)

# 按总价排序
sorted_by_total = sorted(data, key=lambda item: item["price"] * item["quantity"], reverse=True)
print("按总价排序:", sorted_by_total)
```

#### 函数式编程

```python
# 函数组合
compose = lambda f, g: lambda x: f(g(x))

# 定义简单函数
double = lambda x: x * 2
square = lambda x: x ** 2
increment = lambda x: x + 1

# 组合函数
double_then_square = compose(square, double)
print(double_then_square(3))  # (3*2)**2 = 36

square_then_increment = compose(increment, square)
print(square_then_increment(4))  # (4**2)+1 = 17

# 更复杂的组合
complex_operation = compose(increment, compose(square, double))
print(complex_operation(3))  # ((3*2)**2)+1 = 37
```

#### 事件处理

```python
# 简单的事件处理系统
class EventHandler:
    def __init__(self):
        self.handlers = []
    
    def add_handler(self, handler):
        self.handlers.append(handler)
    
    def trigger(self, event_data):
        for handler in self.handlers:
            handler(event_data)

# 创建事件处理器
event_handler = EventHandler()

# 添加 lambda 事件处理器
event_handler.add_handler(lambda data: print(f"日志: {data}"))
event_handler.add_handler(lambda data: print(f"通知: 事件发生 - {data}"))
event_handler.add_handler(lambda data: print(f"处理: 对 {data} 进行处理"))

# 触发事件
event_handler.trigger("用户登录")
print("---")
event_handler.trigger("订单创建")
```

#### GUI 编程中的回调函数

```python
# 模拟 GUI 按钮回调（实际 GUI 库中类似）
class Button:
    def __init__(self, text):
        self.text = text
        self.click_handlers = []
    
    def on_click(self, handler):
        self.click_handlers.append(handler)
    
    def click(self):
        for handler in self.click_handlers:
            handler(self.text)

# 创建按钮
save_button = Button("保存")
delete_button = Button("删除")

# 使用 lambda 作为回调函数
save_button.on_click(lambda btn_text: print(f"{btn_text}按钮被点击 - 执行保存操作"))
save_button.on_click(lambda btn_text: print(f"{btn_text}操作完成"))

delete_button.on_click(lambda btn_text: print(f"{btn_text}按钮被点击 - 确认删除?"))

# 模拟按钮点击
save_button.click()
print("---")
delete_button.click()
```

### 高级用法

#### 嵌套 Lambda 函数

```python
# 嵌套 lambda 函数
outer = lambda x: (lambda y: x + y)

add_five = outer(5)  # 返回一个函数：lambda y: 5 + y
print(add_five(3))   # 8

# 立即调用的嵌套 lambda
result = (lambda x: (lambda y: x * y)(10))(5)
print(result)  # 50
```

#### Lambda 函数与闭包

```python
# Lambda 函数创建闭包
def multiplier_factory(n):
    return lambda x: x * n

# 创建不同的乘数函数
double = multiplier_factory(2)
triple = multiplier_factory(3)
quadruple = multiplier_factory(4)

print(double(5))     # 10
print(triple(5))     # 15
print(quadruple(5))  # 20

# 更复杂的闭包示例
def power_factory(exponent):
    return lambda base: base ** exponent

square = power_factory(2)
cube = power_factory(3)

print(square(4))  # 16
print(cube(3))    # 27
```

#### Lambda 函数与列表推导式

```python
# Lambda 函数与列表推导式结合
numbers = [1, 2, 3, 4, 5]

# 使用 lambda 和列表推导式创建函数列表
operations = [
    lambda x: x + 1,
    lambda x: x * 2,
    lambda x: x ** 2,
    lambda x: x - 1
]

# 对每个数字应用所有操作
results = []
for num in numbers:
    transformed = [op(num) for op in operations]
    results.append(transformed)

print("操作结果:")
for i, result in enumerate(results):
    print(f"数字 {numbers[i]}: {result}")
```

## Lambda 函数的限制和注意事项

### 1. 单表达式限制

Lambda 函数只能包含一个表达式，不能包含：
- 多个语句
- 复杂的逻辑控制（if-elif-else 链）
- 循环语句
- 异常处理

```python
# 错误示例 - 多个语句
# invalid_lambda = lambda x: print(x); return x * 2

# 正确做法 - 使用普通函数
def process_number(x):
    print(f"处理数字: {x}")
    return x * 2
```

### 2. 可读性问题

复杂的 lambda 函数可能降低代码可读性：

```python
# 可读性差的复杂 lambda
complex_lambda = lambda x: "正数" if x > 0 else "零" if x == 0 else "负数"

# 更好的做法 - 使用普通函数
def classify_number(x):
    if x > 0:
        return "正数"
    elif x == 0:
        return "零"
    else:
        return "负数"
```

### 3. 调试困难

Lambda 函数没有名称，调试时难以识别：

```python
# 调试时难以识别
functions = [lambda x: x + 1, lambda x: x * 2, lambda x: x ** 2]

# 更好的做法 - 给函数命名或使用普通函数
def increment(x): return x + 1
def double(x): return x * 2
def square(x): return x ** 2

functions = [increment, double, square]
```

### 4. 变量作用域

Lambda 函数中的变量作用域需要注意：

```python
# 变量作用域问题
functions = []
for i in range(3):
    functions.append(lambda x: x + i)  # 所有函数都引用同一个 i

# 执行时 i 的值为 2
print([f(10) for f in functions])  # [12, 12, 12]，不是期望的 [10, 11, 12]

# 正确的做法 - 使用默认参数捕获当前值
functions = []
for i in range(3):
    functions.append(lambda x, i=i: x + i)  # 使用默认参数捕获 i 的当前值

print([f(10) for f in functions])  # [10, 11, 12]
```

## 最佳实践

### 1. 何时使用 Lambda 函数

**适合使用 Lambda 的情况：**
- 简单的、一次性的函数
- 作为高阶函数的参数
- 函数逻辑非常简单（单行表达式）
- 需要函数对象但不需要命名

**不适合使用 Lambda 的情况：**
- 复杂的业务逻辑
- 需要多次重用的函数
- 需要文档字符串的函数
- 包含多个语句或复杂控制流的函数

### 2. 可读性优先

```python
# 可读性差的例子
result = sorted(data, key=lambda x: (x['score'], -x['age']))

# 更好的做法
def sort_key(item):
    return (item['score'], -item['age'])

result = sorted(data, key=sort_key)
```

### 3. 适当使用注释

```python
# 对复杂的 lambda 添加注释
# 按（分数降序，年龄升序）排序
sorted_students = sorted(
    students, 
    key=lambda s: (-s['score'], s['age'])  # 负数实现降序
)
```

