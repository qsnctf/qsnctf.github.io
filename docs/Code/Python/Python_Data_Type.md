# Python 数据类型

## 1. 变量声明与赋值

### 如何声明变量
在Python中，变量不需要显式声明，直接赋值即可创建变量。

```python
# 直接赋值创建变量
x = 10
name = "Alice"
pi = 3.14159
```

### 如何给变量赋值
使用等号 `=` 进行赋值操作：

```python
# 基本赋值
counter = 0
message = "Hello, World!"

# 重新赋值（变量可以改变类型）
x = 5        # x是整数
x = "hello"  # x现在是字符串
x = [1, 2, 3] # x现在是列表
```

### 多个变量赋值
Python支持多种方式同时给多个变量赋值：

```python
# 同时给多个变量赋相同的值
a = b = c = 10
print(a, b, c)  # 10 10 10

# 同时给多个变量赋不同的值
x, y, z = 1, 2, 3
print(x, y, z)  # 1 2 3

# 交换变量的值
x, y = 10, 20
x, y = y, x  # 交换x和y的值
print(x, y)  # 20 10

# 使用序列解包
numbers = [1, 2, 3]
a, b, c = numbers
print(a, b, c)  # 1 2 3

# 使用星号解包剩余元素
first, *middle, last = [1, 2, 3, 4, 5]
print(first)   # 1
print(middle)  # [2, 3, 4]
print(last)    # 5
```

## 2. 标准数据类型

Python有8种标准数据类型：
- **不可变数据**：Number（数字）、String（字符串）、Tuple（元组）
- **可变数据**：List（列表）、Dictionary（字典）、Set（集合）
- **其他**：Boolean（布尔）、Bytes（字节）

## 3. 数字类型（Number）

数字类型是不可变数据类型。

### 整数（int）
```python
# 整数类型
x = 10
y = -5
z = 0

print(type(x))  # <class 'int'>
print(x + y)    # 5
print(x ** 2)   # 100（平方）

# 大整数（Python支持任意大的整数）
big_number = 123456789012345678901234567890
print(big_number)
```

### 浮点数（float）
```python
# 浮点数类型
pi = 3.14159
temperature = -10.5
zero_point = 0.0

print(type(pi))  # <class 'float'>
print(pi * 2)    # 6.28318

# 科学计数法
scientific = 1.23e-4  # 0.000123
print(scientific)
```

### 布尔值（bool）
```python
# 布尔类型
true_value = True
false_value = False

print(type(true_value))  # <class 'bool'>
print(true_value and false_value)  # False

# bool是int的子类，可以当作整数使用
print(int(True))   # 1
print(int(False))  # 0
print(True + 1)    # 2
print(False * 5)   # 0
```

### 复数（complex）
```python
# 复数类型
z1 = 3 + 4j
z2 = complex(2, -1)  # 2 - 1j

print(type(z1))      # <class 'complex'>
print(z1.real)       # 3.0（实部）
print(z1.imag)       # 4.0（虚部）
print(z1 + z2)       # (5+3j)
print(z1 * z2)       # (10+5j)
```

## 4. 字符串（String）

字符串是不可变数据类型。

### 基本字符串操作
```python
# 字符串定义
s1 = "Hello"
s2 = 'World'
s3 = """多行
字符串"""

print(s1 + " " + s2)  # Hello World
print(s1 * 3)         # HelloHelloHello

# 字符串长度
print(len(s1))  # 5
```

### 字符串索引和切片
```python
text = "Python Programming"

# 索引（从0开始）
print(text[0])   # P
print(text[7])   # P

# 负索引（从末尾开始）
print(text[-1])  # g
print(text[-3])  # i

# 切片 [start:end:step]
print(text[0:6])    # Python
print(text[7:])     # Programming
print(text[:6])     # Python
print(text[::2])    # Pto rgamn（步长为2）
print(text[::-1])   # gnimmargorP nohtyP（反转）
```

### 字符串格式化
```python
# f-string（推荐）
name = "Alice"
age = 25
print(f"姓名: {name}, 年龄: {age}")

# 表达式计算
x, y = 10, 20
print(f"{x} + {y} = {x + y}")

# format方法
print("姓名: {}, 年龄: {}".format(name, age))
print("姓名: {1}, 年龄: {0}".format(age, name))

# %格式化
print("姓名: %s, 年龄: %d" % (name, age))
```

### 字符串方法
```python
text = "  Hello, World!  "

# 大小写转换
print(text.upper())      # "  HELLO, WORLD!  "
print(text.lower())      # "  hello, world!  "
print(text.title())      # "  Hello, World!  "

# 去除空白
print(text.strip())      # "Hello, World!"

# 查找和替换
print(text.find("World"))  # 9
print(text.replace("World", "Python"))  # "  Hello, Python!  "

# 分割和连接
words = text.strip().split(", ")
print(words)  # ['Hello', 'World!']
print("-".join(words))  # "Hello-World!"
```

## 5. 布尔类型（Boolean）

布尔类型是int的子类，因此布尔值可以被看作整数来使用，其中True等价于1，False等价于0。

### 布尔类型的值和类型
```python
a = True
b = False
print(type(a))  # <class 'bool'>
print(type(b))  # <class 'bool'>

# 布尔类型的整数表现
print(int(True))   # 1
print(int(False))  # 0
```

### 使用bool()函数进行转换
```python
# 以下值转换为False
print(bool(0))         # False
print(bool(0.0))       # False
print(bool(0j))        # False
print(bool(''))        # False
print(bool([]))        # False
print(bool(()))        # False
print(bool({}))        # False
print(bool(None))      # False

# 以下值转换为True
print(bool(42))        # True
print(bool(-1))        # True
print(bool('Python'))  # True
print(bool([1, 2, 3])) # True
print(bool((1, 2)))    # True
print(bool({'a': 1}))  # True
```

### 布尔逻辑运算
```python
# 逻辑运算符
print(True and False)  # False
print(True or False)   # True
print(not True)        # False

# 布尔比较运算
print(5 > 3)   # True
print(2 == 2)  # True
print(7 < 4)   # False
print(5 != 3)  # True
```

### 布尔值在控制流中的应用
```python
# 条件判断
if True:
    print("This will always print")
    
if not False:
    print("This will also always print")
    
# 非零值在布尔上下文中为True
x = 10
if x:
    print("x is non-zero and thus True in a boolean context")

# 空值在布尔上下文中为False
name = ""
if not name:
    print("Name is empty")
```

## 6. 列表（List）

列表是可变数据类型，是Python中使用最频繁的数据类型。

### 列表的基本操作
```python
# 创建列表
numbers = [1, 2, 3, 4, 5]
fruits = ["apple", "banana", "cherry"]
mixed = [1, "hello", 3.14, True]

print(type(numbers))  # <class 'list'>

# 列表索引（与字符串类似）
print(fruits[0])   # apple
print(fruits[-1])  # cherry

# 列表切片
print(numbers[1:4])  # [2, 3, 4]
print(numbers[::2])  # [1, 3, 5]
```

### 列表的修改操作
```python
# 修改元素
fruits = ["apple", "banana", "cherry"]
fruits[1] = "blueberry"
print(fruits)  # ['apple', 'blueberry', 'cherry']

# 添加元素
fruits.append("orange")      # 末尾添加
fruits.insert(1, "mango")    # 指定位置插入
print(fruits)  # ['apple', 'mango', 'blueberry', 'cherry', 'orange']

# 删除元素
fruits.remove("blueberry")   # 删除指定元素
del fruits[0]                 # 删除指定索引元素
popped = fruits.pop()         # 删除并返回最后一个元素
print(fruits)  # ['mango', 'cherry']
print(popped)  # orange
```

### 列表的其他操作
```python
# 列表连接和重复
list1 = [1, 2, 3]
list2 = [4, 5, 6]
print(list1 + list2)  # [1, 2, 3, 4, 5, 6]
print(list1 * 2)      # [1, 2, 3, 1, 2, 3]

# 列表方法
numbers = [3, 1, 4, 1, 5, 9, 2]
print(len(numbers))        # 7
print(numbers.count(1))    # 2（元素1出现的次数）
print(numbers.index(4))    # 2（元素4的索引）

numbers.sort()             # 排序（原地修改）
print(numbers)             # [1, 1, 2, 3, 4, 5, 9]

numbers.reverse()          # 反转（原地修改）
print(numbers)             # [9, 5, 4, 3, 2, 1, 1]

# 列表推导式
squares = [x**2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]
```

### 嵌套列表
```python
# 二维列表（矩阵）
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

print(matrix[1][2])  # 6（第二行第三列）

# 遍历嵌套列表
for row in matrix:
    for element in row:
        print(element, end=" ")
    print()
# 输出：
# 1 2 3
# 4 5 6
# 7 8 9
```

## 7. 元组（Tuple）

元组是不可变数据类型。

### 元组的基本操作
```python
# 创建元组
tuple1 = (1, 2, 3)
tuple2 = ("apple", "banana", "cherry")
tuple3 = 1, 2, 3  # 括号可以省略

print(type(tuple1))  # <class 'tuple'>

# 单个元素的元组（需要逗号）
single_tuple = (5,)  # 正确
not_tuple = (5)      # 这不是元组，是整数

# 元组索引和切片
print(tuple1[0])     # 1
print(tuple1[1:])    # (2, 3)
```

### 元组的不可变性
```python
# 元组创建后不能修改
tuple1 = (1, 2, 3)
# tuple1[0] = 10  # 这会报错：TypeError

# 但可以重新赋值
tuple1 = (10, 20, 30)  # 这是创建新的元组
print(tuple1)  # (10, 20, 30)
```

### 元组的用途
```python
# 函数返回多个值
def get_coordinates():
    return 10, 20

x, y = get_coordinates()
print(f"x={x}, y={y}")  # x=10, y=20

# 作为字典的键（因为不可变）
coordinates = {(1, 2): "point A", (3, 4): "point B"}
print(coordinates[(1, 2)])  # point A
```

## 8. 集合（Set）

集合是可变数据类型，元素不重复且无序。

### 集合的基本操作
```python
# 创建集合
set1 = {1, 2, 3, 4, 5}
set2 = set([4, 5, 6, 7, 8])

print(type(set1))  # <class 'set'>

# 自动去重
numbers = {1, 2, 2, 3, 3, 3}
print(numbers)  # {1, 2, 3}
```

### 集合运算
```python
setA = {1, 2, 3, 4, 5}
setB = {4, 5, 6, 7, 8}

# 并集
print(setA | setB)   # {1, 2, 3, 4, 5, 6, 7, 8}
print(setA.union(setB))

# 交集
print(setA & setB)   # {4, 5}
print(setA.intersection(setB))

# 差集
print(setA - setB)   # {1, 2, 3}
print(setA.difference(setB))

# 对称差集（只在其中一个集合中）
print(setA ^ setB)   # {1, 2, 3, 6, 7, 8}
print(setA.symmetric_difference(setB))
```

### 集合方法
```python
# 添加和删除元素
s = {1, 2, 3}
s.add(4)           # 添加元素
s.update([5, 6])   # 添加多个元素
s.remove(1)        # 删除元素（如果不存在会报错）
s.discard(10)      # 删除元素（如果不存在不会报错）
print(s)           # {2, 3, 4, 5, 6}

# 集合操作
s1 = {1, 2, 3}
s2 = {2, 3, 4}

s1.intersection_update(s2)  # s1变为交集
print(s1)  # {2, 3}

s1 = {1, 2, 3}
s1.difference_update(s2)    # s1变为差集
print(s1)  # {1}
```

## 9. 字典（Dictionary）

字典是可变数据类型，存储键值对。

### 字典的基本操作
```python
# 创建字典
person = {
    "name": "Alice",
    "age": 25,
    "city": "Beijing"
}

print(type(person))  # <class 'dict'>

# 访问值
print(person["name"])     # Alice
print(person.get("age"))  # 25

# 修改值
person["age"] = 26
person["job"] = "Engineer"  # 添加新键值对
print(person)
# {'name': 'Alice', 'age': 26, 'city': 'Beijing', 'job': 'Engineer'}
```

### 字典方法
```python
# 获取键、值、键值对
print(person.keys())    # dict_keys(['name', 'age', 'city', 'job'])
print(person.values())  # dict_values(['Alice', 26, 'Beijing', 'Engineer'])
print(person.items())   # dict_items([('name', 'Alice'), ('age', 26), ...])

# 删除元素
age = person.pop("age")  # 删除并返回值
print(age)  # 26

# 遍历字典
for key in person:
    print(f"{key}: {person[key]}")

for key, value in person.items():
    print(f"{key}: {value}")
```

### 字典推导式
```python
# 创建字典
squares = {x: x**2 for x in range(5)}
print(squares)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 条件字典推导式
even_squares = {x: x**2 for x in range(10) if x % 2 == 0}
print(even_squares)  # {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}
```

## 10. 字节类型（Bytes）

字节类型是不可变数据类型，用于处理二进制数据。

### 字节的基本操作
```python
# 创建字节对象
b1 = b"hello"
b2 = bytes([65, 66, 67])  # ASCII: A, B, C

print(type(b1))  # <class 'bytes'>
print(b1)        # b'hello'
print(b2)        # b'ABC'

# 字节索引和切片
print(b1[0])     # 104（h的ASCII码）
print(b1[1:4])   # b'ell'

# 字节与字符串的转换
text = "hello"
bytes_data = text.encode('utf-8')  # 字符串转字节
print(bytes_data)  # b'hello'

text_again = bytes_data.decode('utf-8')  # 字节转字符串
print(text_again)  # hello
```

## 11. 可变数据 vs 不可变数据

### 不可变数据类型
- 创建后不能修改
- 包括：数字、字符串、元组、字节

```python
# 字符串不可变
s = "hello"
# s[0] = 'H'  # 报错：字符串不可变
s = "Hello"   # 这是创建新字符串

# 元组不可变
t = (1, 2, 3)
# t[0] = 10   # 报错：元组不可变
t = (10, 2, 3)  # 创建新元组
```

### 可变数据类型
- 创建后可以修改
- 包括：列表、字典、集合

```python
# 列表可变
lst = [1, 2, 3]
lst[0] = 10  # 可以修改
print(lst)   # [10, 2, 3]

# 字典可变
d = {"a": 1}
d["b"] = 2  # 可以添加
print(d)     # {'a': 1, 'b': 2}
```