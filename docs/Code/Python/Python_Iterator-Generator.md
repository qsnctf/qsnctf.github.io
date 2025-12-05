# Python 迭代器与生成器

## 迭代器基础

### 什么是迭代器

迭代器（Iterator）是一种可以记住遍历位置的对象，它提供了统一的访问序列元素的方式。迭代器对象从集合的第一个元素开始访问，直到所有的元素被访问完结束。迭代器只能往前不会后退。

### iter() 和 next() 函数

Python 中提供了两个内置函数来处理迭代器：

#### iter() 函数
`iter()` 函数用于创建迭代器对象：

```python
# 创建列表的迭代器
my_list = [1, 2, 3, 4, 5]
my_iterator = iter(my_list)
print(type(my_iterator))  # <class 'list_iterator'>
```

#### next() 函数
`next()` 函数用于获取迭代器的下一个元素：

```python
my_list = [1, 2, 3]
my_iterator = iter(my_list)

print(next(my_iterator))  # 1
print(next(my_iterator))  # 2
print(next(my_iterator))  # 3
```

### StopIteration 异常

当迭代器中没有更多元素时，调用 `next()` 会抛出 `StopIteration` 异常：

```python
my_list = [1, 2, 3]
my_iterator = iter(my_list)

print(next(my_iterator))  # 1
print(next(my_iterator))  # 2
print(next(my_iterator))  # 3
# print(next(my_iterator))  # StopIteration

# 使用 try-except 处理
try:
    while True:
        print(next(my_iterator))
except StopIteration:
    print("迭代结束")
```

更安全的做法是使用 `next()` 的默认值参数：

```python
my_list = [1, 2, 3]
my_iterator = iter(my_list)

print(next(my_iterator, "没有了"))  # 1
print(next(my_iterator, "没有了"))  # 2
print(next(my_iterator, "没有了"))  # 3
print(next(my_iterator, "没有了"))  # 没有了
```

## 创建自定义迭代器

### 实现 __iter__ 和 __next__ 方法

要创建自定义迭代器，需要实现两个魔术方法：

```python
class CountDown:
    def __init__(self, start):
        self.current = start
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

# 使用自定义迭代器
countdown = CountDown(5)
for number in countdown:
    print(number)
# 输出: 5, 4, 3, 2, 1
```

### 可迭代对象 vs 迭代器

**可迭代对象（Iterable）**：实现了 `__iter__()` 方法的对象
**迭代器（Iterator）**：实现了 `__iter__()` 和 `__next__()` 方法的对象

```python
class MyIterable:
    def __init__(self, data):
        self.data = data
    
    def __iter__(self):
        return MyIterator(self.data)

class MyIterator:
    def __init__(self, data):
        self.data = data
        self.index = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.index >= len(self.data):
            raise StopIteration
        value = self.data[self.index]
        self.index += 1
        return value

# 使用
my_iterable = MyIterable([10, 20, 30])
for item in my_iterable:
    print(item)
```

### 使用 iter() 创建迭代器

还可以使用 `iter()` 函数创建迭代器：

```python
class Counter:
    def __init__(self, low, high):
        self.low = low
        self.high = high
    
    def __iter__(self):
        return iter(range(self.low, self.high + 1))

counter = Counter(1, 5)
for num in counter:
    print(num)  # 1, 2, 3, 4, 5
```

## 生成器

### 什么是生成器

生成器（Generator）是一种特殊的迭代器，使用函数语法创建。生成器允许你声明一个像迭代器一样的行为，但不需要编写 `__iter__()` 和 `__next__()` 方法。

### 创建生成器

#### 使用 yield 关键字

```python
def simple_generator():
    yield 1
    yield 2
    yield 3

# 创建生成器对象
gen = simple_generator()
print(type(gen))  # <class 'generator'>

print(next(gen))  # 1
print(next(gen))  # 2
print(next(gen))  # 3
# print(next(gen))  # StopIteration
```

#### 生成器函数示例

```python
def fibonacci_generator(n):
    """生成斐波那契数列的前 n 个数"""
    a, b = 0, 1
    count = 0
    while count < n:
        yield a
        a, b = b, a + b
        count += 1

# 使用生成器
fib_gen = fibonacci_generator(10)
for num in fib_gen:
    print(num, end=' ')  # 0 1 1 2 3 5 8 13 21 34
```

### 生成器表达式

生成器表达式类似于列表推导式，但使用圆括号：

```python
# 列表推导式（立即创建列表）
list_comp = [x**2 for x in range(10)]
print(list_comp)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 生成器表达式（延迟计算）
gen_exp = (x**2 for x in range(10))
print(gen_exp)  # <generator object <genexpr> at 0x...>

for num in gen_exp:
    print(num, end=' ')  # 0 1 4 9 16 25 36 49 64 81
```

### 生成器的高级用法

#### send() 方法

生成器支持通过 `send()` 方法向生成器发送值：

```python
def echo_generator():
    while True:
        received = yield
        print(f"收到: {received}")

gen = echo_generator()
next(gen)  # 启动生成器

gen.send("Hello")  # 收到: Hello
gen.send("World")  # 收到: World
```

#### close() 方法

关闭生成器：

```python
def infinite_generator():
    while True:
        yield "无限循环"

gen = infinite_generator()
print(next(gen))  # 无限循环

gen.close()
try:
    print(next(gen))  # GeneratorExit
except StopIteration:
    print("生成器已关闭")
```

#### throw() 方法

向生成器抛出异常：

```python
def generator_with_exception():
    try:
        while True:
            yield "正常运行"
    except ValueError as e:
        yield f"捕获到异常: {e}"

gen = generator_with_exception()
print(next(gen))  # 正常运行
print(gen.throw(ValueError("测试异常")))  # 捕获到异常: 测试异常
```

## 迭代器和生成器的应用场景

### 1. 处理大数据集

```python
def read_large_file(filename):
    """逐行读取大文件"""
    with open(filename, 'r', encoding='utf-8') as file:
        for line in file:
            yield line.strip()

# 使用生成器处理大文件，节省内存
for line in read_large_file('large_file.txt'):
    # 处理每一行
    if 'error' in line:
        print(f"发现错误: {line}")
```

### 2. 无限序列

```python
def natural_numbers():
    """生成自然数序列"""
    n = 1
    while True:
        yield n
        n += 1

# 取前 10 个自然数
count = 0
for num in natural_numbers():
    print(num)
    count += 1
    if count >= 10:
        break
```

### 3. 管道处理数据

```python
def filter_even(numbers):
    """过滤偶数"""
    for num in numbers:
        if num % 2 == 0:
            yield num

def square(numbers):
    """计算平方"""
    for num in numbers:
        yield num ** 2

# 数据处理管道
numbers = range(1, 11)
result = square(filter_even(numbers))

print(list(result))  # [4, 16, 36, 64, 100]
```

## 迭代器和生成器的区别

| 特性 | 迭代器 | 生成器 |
|------|--------|--------|
| **创建方式** | 实现 `__iter__()` 和 `__next__()` | 使用 `yield` 关键字的函数 |
| **内存使用** | 通常需要存储所有数据 | 延迟计算，节省内存 |
| **代码复杂度** | 需要实现类和方法 | 代码更简洁 |
| **状态管理** | 需要手动管理状态 | 自动管理状态 |
| **功能** | 基本迭代功能 | 支持发送、关闭、异常等高级功能 |

## 性能考虑

### 内存效率

```python
import sys

# 列表：占用较多内存
large_list = [x for x in range(1000000)]
print(f"列表内存占用: {sys.getsizeof(large_list)} 字节")

# 生成器：占用很少内存
large_gen = (x for x in range(1000000))
print(f"生成器内存占用: {sys.getsizeof(large_gen)} 字节")
```

### 执行速度

```python
import timeit

# 列表推导式（更快）
list_time = timeit.timeit('[x for x in range(1000)]', number=1000)

# 生成器表达式（更节省内存）
gen_time = timeit.timeit('(x for x in range(1000))', number=1000)

print(f"列表推导式时间: {list_time}")
print(f"生成器表达式时间: {gen_time}")
```

## 最佳实践

### 1. 何时使用迭代器
- 需要自定义迭代逻辑
- 需要实现特定的数据结构遍历
- 需要复杂的迭代状态管理

### 2. 何时使用生成器
- 处理大型数据集
- 创建无限序列
- 简化代码编写
- 实现协程

### 3. 注意事项
```python
# 生成器只能遍历一次
gen = (x for x in range(3))
print(list(gen))  # [0, 1, 2]
print(list(gen))  # []  # 空列表，因为已经遍历过

# 如果需要多次遍历，重新创建生成器或使用列表
```

