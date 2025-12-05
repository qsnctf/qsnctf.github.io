# Python 数据类型转换

## 1. 类型转换概述

Python中的数据类型转换分为两种：
- **隐式类型转换**：自动完成，无需程序员干预
- **显式类型转换**：需要使用类型函数来强制转换

## 2. 隐式类型转换（自动完成）

隐式类型转换是Python自动进行的类型转换，主要发生在不同数据类型的运算中。

### 数字类型的隐式转换
```python
# 整数和浮点数运算
x = 10      # int
y = 3.14    # float
result = x + y  # 自动转换为float
print(result, type(result))  # 13.14 <class 'float'>

# 布尔值参与运算
flag = True  # bool (相当于1)
num = 5      # int
result = flag + num  # 自动转换为int
print(result, type(result))  # 6 <class 'int'>

# 复数运算
z1 = 2 + 3j  # complex
z2 = 4       # int
result = z1 + z2  # 自动转换为complex
print(result, type(result))  # (6+3j) <class 'complex'>
```

### 条件判断中的隐式转换
```python
# 非布尔值在条件判断中自动转换为布尔值
if "hello":  # 非空字符串转换为True
    print("字符串非空")

if 0:        # 0转换为False
    print("这不会执行")
else:
    print("0在布尔上下文中为False")

if []:       # 空列表转换为False
    print("这不会执行")
else:
    print("空列表在布尔上下文中为False")
```

## 3. 显式类型转换（使用类型函数）

显式类型转换需要使用Python内置的类型转换函数。

### int(x [,base]) - 转换为整数
```python
# 基本转换
print(int(3.14))        # 3（浮点数转整数，截断小数部分）
print(int("123"))       # 123（字符串转整数）
print(int(True))        # 1（布尔值转整数）

# 指定基数（进制）
print(int("1010", 2))   # 10（二进制转十进制）
print(int("FF", 16))    # 255（十六进制转十进制）
print(int("77", 8))     # 63（八进制转十进制）

# 错误示例
# print(int("3.14"))     # ValueError: invalid literal for int()
# print(int("abc"))      # ValueError: invalid literal for int()
```

### float(x) - 转换为浮点数
```python
print(float(10))        # 10.0（整数转浮点数）
print(float("3.14"))    # 3.14（字符串转浮点数）
print(float(True))      # 1.0（布尔值转浮点数）
print(float("inf"))     # inf（无穷大）
print(float("-inf"))    # -inf（负无穷大）
print(float("nan"))     # nan（非数字）

# 科学计数法
print(float("1.23e-4"))  # 0.000123
```

### complex(real [,imag]) - 创建复数
```python
print(complex(3, 4))     # (3+4j)
print(complex("3+4j"))   # (3+4j)（字符串转复数）
print(complex(5))        # (5+0j)（只有实部）
print(complex(0, 2))     # 2j（只有虚部）
```

### str(x) - 转换为字符串
```python
print(str(123))          # "123"（整数转字符串）
print(str(3.14))         # "3.14"（浮点数转字符串）
print(str(True))         # "True"（布尔值转字符串）
print(str([1, 2, 3]))    # "[1, 2, 3]"（列表转字符串）
print(str((1, 2)))       # "(1, 2)"（元组转字符串）
print(str({"a": 1}))     # "{'a': 1}"（字典转字符串）

# 格式化数字
num = 3.1415926
print(f"{num:.2f}")     # "3.14"（保留两位小数）
```

### repr(x) - 转换为表达式字符串
```python
# repr()返回的是对象的正式字符串表示，通常可以eval()重新创建对象
x = [1, 2, 3]
print(str(x))    # [1, 2, 3]
print(repr(x))   # [1, 2, 3]（对于简单对象，与str()相同）

class Person:
    def __init__(self, name):
        self.name = name
    
    def __str__(self):
        return f"Person: {self.name}"
    
    def __repr__(self):
        return f"Person('{self.name}')"

p = Person("Alice")
print(str(p))    # Person: Alice
print(repr(p))   # Person('Alice')（可以用于重新创建对象）
```

### eval(str) - 执行字符串中的Python表达式
```python
# 基本数学表达式
result = eval("3 + 4 * 2")
print(result)  # 11

# 使用变量
x = 10
y = 20
result = eval("x + y")
print(result)  # 30

# 创建列表
eval_result = eval("[1, 2, 3, 4]")
print(eval_result, type(eval_result))  # [1, 2, 3, 4] <class 'list'>

# 注意：eval()可以执行任意代码，存在安全风险
# 不要对不可信的输入使用eval()
```

### tuple(s) - 转换为元组
```python
# 列表转元组
lst = [1, 2, 3, 4]
tup = tuple(lst)
print(tup, type(tup))  # (1, 2, 3, 4) <class 'tuple'>

# 字符串转元组（每个字符成为元组元素）
string = "hello"
tup = tuple(string)
print(tup)  # ('h', 'e', 'l', 'l', 'o')

# 字典转元组（只保留键）
d = {"a": 1, "b": 2}
tup = tuple(d)
print(tup)  # ('a', 'b')

# 集合转元组
s = {1, 2, 3}
tup = tuple(s)
print(tup)  # (1, 2, 3)（顺序可能不同）
```

### list(s) - 转换为列表
```python
# 元组转列表
tup = (1, 2, 3, 4)
lst = list(tup)
print(lst, type(lst))  # [1, 2, 3, 4] <class 'list'>

# 字符串转列表（每个字符成为列表元素）
string = "hello"
lst = list(string)
print(lst)  # ['h', 'e', 'l', 'l', 'o']

# 字典转列表（只保留键）
d = {"a": 1, "b": 2}
lst = list(d)
print(lst)  # ['a', 'b']

# 集合转列表
s = {1, 2, 3}
lst = list(s)
print(lst)  # [1, 2, 3]（顺序可能不同）

# 范围对象转列表
r = range(5)
lst = list(r)
print(lst)  # [0, 1, 2, 3, 4]
```

### set(s) - 转换为可变集合
```python
# 列表转集合（自动去重）
lst = [1, 2, 2, 3, 3, 3]
s = set(lst)
print(s, type(s))  # {1, 2, 3} <class 'set'>

# 字符串转集合（每个字符成为集合元素，去重）
string = "hello"
s = set(string)
print(s)  # {'h', 'e', 'l', 'o'}（顺序可能不同）

# 元组转集合
tup = (1, 2, 2, 3)
s = set(tup)
print(s)  # {1, 2, 3}

# 字典转集合（只保留键）
d = {"a": 1, "b": 2}
s = set(d)
print(s)  # {'a', 'b'}
```

### dict(d) - 创建字典
```python
# 从键值对列表创建
pairs = [("a", 1), ("b", 2), ("c", 3)]
d = dict(pairs)
print(d, type(d))  # {'a': 1, 'b': 2, 'c': 3} <class 'dict'>

# 从关键字参数创建
d = dict(a=1, b=2, c=3)
print(d)  # {'a': 1, 'b': 2, 'c': 3}

# 从两个列表创建（使用zip）
keys = ["a", "b", "c"]
values = [1, 2, 3]
d = dict(zip(keys, values))
print(d)  # {'a': 1, 'b': 2, 'c': 3}

# 从字典推导式创建
d = {x: x**2 for x in range(5)}
print(d)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

### frozenset(s) - 转换为不可变集合
```python
# 创建不可变集合
lst = [1, 2, 3, 3, 4]
fs = frozenset(lst)
print(fs, type(fs))  # frozenset({1, 2, 3, 4}) <class 'frozenset'>

# 不可变集合不能修改
# fs.add(5)  # AttributeError: 'frozenset' object has no attribute 'add'

# 可以作为字典的键（因为不可变）
d = {fs: "frozen set"}
print(d)  # {frozenset({1, 2, 3, 4}): 'frozen set'}

# 集合运算仍然可用
fs1 = frozenset([1, 2, 3])
fs2 = frozenset([2, 3, 4])
print(fs1 | fs2)   # frozenset({1, 2, 3, 4})
print(fs1 & fs2)   # frozenset({2, 3})
```

### chr(x) - 整数转换为字符
```python
# ASCII字符
print(chr(65))     # 'A'
print(chr(97))     # 'a'
print(chr(48))     # '0'

# Unicode字符
print(chr(20320))  # '你'（中文"你"的Unicode编码）
print(chr(0x1F600)) # '😀'（表情符号）

# 特殊字符
print(chr(10))     # '\n'（换行符）
print(chr(9))      # '\t'（制表符）
```

### ord(x) - 字符转换为整数
```python
# ASCII字符
print(ord('A'))    # 65
print(ord('a'))    # 97
print(ord('0'))    # 48

# Unicode字符
print(ord('你'))   # 20320
print(ord('😀'))   # 128512（0x1F600）

# 特殊字符
print(ord('\n'))   # 10
print(ord('\t'))   # 9

# 只能转换单个字符
# print(ord('ab'))  # TypeError: ord() expected a character, but string of length 2 found
```

### hex(x) - 整数转换为十六进制字符串
```python
print(hex(255))     # '0xff'
print(hex(16))      # '0x10'
print(hex(-42))     # '-0x2a'
print(hex(0))       # '0x0'

# 去掉前缀
print(hex(255)[2:])  # 'ff'

# 格式化输出
num = 255
print(f"{num:#x}")  # '0xff'
print(f"{num:x}")   # 'ff'
```

### oct(x) - 整数转换为八进制字符串
```python
print(oct(8))       # '0o10'
print(oct(64))      # '0o100'
print(oct(-10))     # '-0o12'
print(oct(0))       # '0o0'

# 去掉前缀
print(oct(8)[2:])   # '10'

# 格式化输出
num = 8
print(f"{num:#o}")  # '0o10'
print(f"{num:o}")   # '10'
```

## 4. 类型转换的注意事项

### 转换失败的处理
```python
# 使用try-except处理转换错误
def safe_int_conversion(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

print(safe_int_conversion("123"))    # 123
print(safe_int_conversion("abc"))    # None
print(safe_int_conversion([1, 2]))   # None
```

### 数据丢失问题
```python
# 浮点数转整数（丢失小数部分）
print(int(3.99))  # 3（不是四舍五入）

# 大整数转浮点数（可能丢失精度）
big_num = 10**20
float_num = float(big_num)
print(big_num == float_num)  # False（精度丢失）

# 使用round()进行四舍五入
print(round(3.99))  # 4
```

### 布尔转换的特殊规则
```python
# 以下值转换为False
false_values = [0, 0.0, 0j, "", [], (), {}, None, False]
for value in false_values:
    print(f"bool({value!r}) = {bool(value)}")

# 其他所有值转换为True
true_values = [1, -1, 3.14, "hello", [1], (1,), {"a": 1}, True]
for value in true_values:
    print(f"bool({value!r}) = {bool(value)}")
```

## 5. 实际应用示例

### 用户输入处理
```python
# 安全处理用户输入
def get_number(prompt):
    while True:
        user_input = input(prompt)
        try:
            return float(user_input)
        except ValueError:
            print("请输入有效的数字！")

# number = get_number("请输入一个数字：")
# print(f"你输入的数字是：{number}")
```

### 数据清洗
```python
# 将字符串列表转换为数字列表
str_numbers = ["1", "2", "3", "4", "5"]
int_numbers = [int(x) for x in str_numbers]
print(int_numbers)  # [1, 2, 3, 4, 5]

# 处理混合类型数据
data = ["123", 456, "789", 3.14]
cleaned_data = [int(str(x)) for x in data]
print(cleaned_data)  # [123, 456, 789, 3]
```

### 格式化输出
```python
# 数字格式化
price = 19.99
quantity = 3
total = price * quantity

print(f"单价: ￥{price:.2f}")
print(f"数量: {quantity}")
print(f"总价: ￥{total:.2f}")

# 十六进制显示内存地址
obj = [1, 2, 3]
print(f"对象内存地址: {hex(id(obj))}")
```

## 总结

Python的类型转换功能非常强大和灵活：

1. **隐式转换**：自动处理不同类型间的运算
2. **显式转换**：使用内置函数进行精确控制
3. **安全性**：注意转换失败和精度丢失问题
4. **实用性**：在数据处理、用户输入处理、格式化输出等方面有广泛应用

掌握类型转换是编写健壮Python程序的重要基础。