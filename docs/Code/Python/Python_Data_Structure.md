# Python3 数据结构

Python 中最常用的数据结构是序列，包括列表（list）、元组（tuple）、字符串（str）等。此外还有集合（set）和字典（dict）等重要的数据结构。

## 列表（List）

列表是 Python 中最基本也是最常用的数据结构之一。列表是有序的可变序列，可以包含任意类型的对象。

### 列表的基本操作

```python
# 创建列表
my_list = [1, 2, 3, 4, 5]
empty_list = []
mixed_list = [1, "hello", 3.14, True]

# 访问元素
print(my_list[0])     # 1
print(my_list[-1])    # 5

# 切片操作
print(my_list[1:3])   # [2, 3]
print(my_list[:3])    # [1, 2, 3]
print(my_list[2:])    # [3, 4, 5]

# 修改元素
my_list[1] = 99
print(my_list)        # [1, 99, 3, 4, 5]
```

### 列表的方法

```python
fruits = ['apple', 'banana', 'orange']

# 添加元素
fruits.append('grape')           # 在末尾添加
print(fruits)                    # ['apple', 'banana', 'orange', 'grape']

fruits.insert(1, 'mango')        # 在指定位置插入
print(fruits)                    # ['apple', 'mango', 'banana', 'orange', 'grape']

fruits.extend(['kiwi', 'pear'])  # 扩展列表
print(fruits)                    # ['apple', 'mango', 'banana', 'orange', 'grape', 'kiwi', 'pear']

# 删除元素
fruits.remove('banana')          # 删除指定元素
print(fruits)                    # ['apple', 'mango', 'orange', 'grape', 'kiwi', 'pear']

popped = fruits.pop()            # 删除并返回最后一个元素
print(popped)                    # 'pear'
print(fruits)                    # ['apple', 'mango', 'orange', 'grape', 'kiwi']

fruits.pop(1)                    # 删除指定位置的元素
print(fruits)                    # ['apple', 'orange', 'grape', 'kiwi']

fruits.clear()                   # 清空列表
print(fruits)                    # []

# 查找和统计
numbers = [1, 2, 3, 2, 4, 2, 5]
print(numbers.count(2))          # 3 - 统计元素出现次数
print(numbers.index(3))          # 2 - 查找元素位置

# 排序
numbers.sort()                   # 升序排序
print(numbers)                   # [1, 2, 2, 2, 3, 4, 5]

numbers.sort(reverse=True)       # 降序排序
print(numbers)                   # [5, 4, 3, 2, 2, 2, 1]

# 反转
numbers.reverse()
print(numbers)                   # [1, 2, 2, 2, 3, 4, 5]

# 复制
numbers_copy = numbers.copy()
print(numbers_copy)              # [1, 2, 2, 2, 3, 4, 5]
```

## 将列表当做栈使用

栈（Stack）是一种后进先出（LIFO）的数据结构。Python 的列表可以直接用作栈，使用 `append()` 方法进行压入操作，使用 `pop()` 方法进行弹出操作。

### 栈操作

#### 1、创建一个空栈

```python
# 方法一：直接使用空列表
stack = []

# 方法二：使用类封装
class Stack:
    def __init__(self):
        self.items = []
    
    def __str__(self):
        return str(self.items)
    
    def __repr__(self):
        return f"Stack({self.items})"

# 创建栈实例
my_stack = Stack()
print(my_stack)  # Stack([])
```

#### 2、压入（Push）操作

```python
# 使用列表直接实现
stack = []
stack.append(10)   # 压入 10
stack.append(20)   # 压入 20
stack.append(30)   # 压入 30
print(stack)       # [10, 20, 30]

# 使用类实现
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        """压入元素到栈顶"""
        self.items.append(item)
        return True
    
    def __str__(self):
        return str(self.items)

# 使用
my_stack = Stack()
my_stack.push(10)
my_stack.push(20)
my_stack.push(30)
print(my_stack)  # [10, 20, 30]
```

#### 3、弹出（Pop）操作

```python
# 使用列表直接实现
stack = [10, 20, 30]
popped_item = stack.pop()  # 弹出栈顶元素
print(popped_item)         # 30
print(stack)               # [10, 20]

# 使用类实现
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
        return True
    
    def pop(self):
        """弹出栈顶元素"""
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def __str__(self):
        return str(self.items)

# 使用
my_stack = Stack()
my_stack.push(10)
my_stack.push(20)
my_stack.push(30)
print(my_stack.pop())  # 30
print(my_stack)        # [10, 20]
```

#### 4、查看栈顶元素（Peek/Top）

```python
# 使用列表直接实现
stack = [10, 20, 30]
top_item = stack[-1]  # 查看栈顶元素但不删除
print(top_item)       # 30
print(stack)          # [10, 20, 30] - 栈不变

# 使用类实现
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
        return True
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def peek(self):
        """查看栈顶元素但不删除"""
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def __str__(self):
        return str(self.items)

# 使用
my_stack = Stack()
my_stack.push(10)
my_stack.push(20)
my_stack.push(30)
print(my_stack.peek())  # 30
print(my_stack)         # [10, 20, 30] - 栈不变
```

#### 5、检查是否为空（IsEmpty）

```python
# 使用列表直接实现
stack = []
print(len(stack) == 0)     # True - 检查是否为空
print(not stack)            # True - 更简洁的方式

stack = [10, 20]
print(len(stack) == 0)      # False
print(not stack)            # False

# 使用类实现
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
        return True
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        """检查栈是否为空"""
        return len(self.items) == 0
    
    def __str__(self):
        return str(self.items)

# 使用
my_stack = Stack()
print(my_stack.is_empty())  # True

my_stack.push(10)
print(my_stack.is_empty())  # False
```

#### 6、获取栈的大小（Size）

```python
# 使用列表直接实现
stack = [10, 20, 30]
stack_size = len(stack)
print(stack_size)  # 3

# 使用类实现
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
        return True
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        """获取栈的大小"""
        return len(self.items)
    
    def __str__(self):
        return str(self.items)

# 使用
my_stack = Stack()
print(my_stack.size())  # 0

my_stack.push(10)
my_stack.push(20)
my_stack.push(30)
print(my_stack.size())  # 3
```

### 完整的栈实现

```python
class Stack:
    """完整的栈实现"""
    
    def __init__(self):
        """初始化空栈"""
        self.items = []
    
    def push(self, item):
        """压入元素到栈顶"""
        self.items.append(item)
        return True
    
    def pop(self):
        """弹出栈顶元素"""
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def peek(self):
        """查看栈顶元素但不删除"""
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        """检查栈是否为空"""
        return len(self.items) == 0
    
    def size(self):
        """获取栈的大小"""
        return len(self.items)
    
    def clear(self):
        """清空栈"""
        self.items.clear()
    
    def __str__(self):
        return str(self.items)
    
    def __len__(self):
        return len(self.items)

# 使用示例
if __name__ == "__main__":
    stack = Stack()
    
    print(f"栈是否为空: {stack.is_empty()}")  # True
    print(f"栈的大小: {stack.size()}")       # 0
    
    # 压入元素
    stack.push(10)
    stack.push(20)
    stack.push(30)
    
    print(f"栈: {stack}")                    # [10, 20, 30]
    print(f"栈顶元素: {stack.peek()}")       # 30
    print(f"栈的大小: {stack.size()}")       # 3
    
    # 弹出元素
    popped = stack.pop()
    print(f"弹出的元素: {popped}")           # 30
    print(f"栈: {stack}")                    # [10, 20]
    
    # 继续操作
    stack.push(40)
    print(f"栈: {stack}")                    # [10, 20, 40]
```

## 将列表当作队列使用

队列（Queue）是一种先进先出（FIFO）的数据结构。虽然列表可以用作队列，但由于列表在头部插入和删除操作的效率较低（O(n)），通常建议使用 `collections.deque` 来实现队列。

### 使用 collections.deque 实现队列

`deque`（双端队列）是专门为在两端快速添加和删除元素而设计的。

```python
from collections import deque

# 创建队列
queue = deque()

# 入队操作
queue.append('A')    # 在右端添加
queue.append('B')
queue.append('C')
print(queue)         # deque(['A', 'B', 'C'])

# 出队操作
item = queue.popleft()  # 从左端取出
print(item)             # 'A'
print(queue)            # deque(['B', 'C'])

# 查看队首元素
first_item = queue[0]
print(first_item)       # 'B'

# 查看队尾元素
last_item = queue[-1]
print(last_item)        # 'C'

# 队列大小
print(len(queue))       # 2

# 检查是否为空
print(len(queue) == 0)  # False
```

### 封装队列类

```python
from collections import deque

class Queue:
    """队列实现"""
    
    def __init__(self):
        """初始化空队列"""
        self.items = deque()
    
    def enqueue(self, item):
        """入队操作"""
        self.items.append(item)
        return True
    
    def dequeue(self):
        """出队操作"""
        if not self.is_empty():
            return self.items.popleft()
        return None
    
    def front(self):
        """查看队首元素"""
        if not self.is_empty():
            return self.items[0]
        return None
    
    def rear(self):
        """查看队尾元素"""
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        """检查队列是否为空"""
        return len(self.items) == 0
    
    def size(self):
        """获取队列大小"""
        return len(self.items)
    
    def clear(self):
        """清空队列"""
        self.items.clear()
    
    def __str__(self):
        return str(list(self.items))
    
    def __len__(self):
        return len(self.items)

# 使用示例
queue = Queue()
queue.enqueue('任务1')
queue.enqueue('任务2')
queue.enqueue('任务3')

print(f"队列: {queue}")              # ['任务1', '任务2', '任务3']
print(f"队首: {queue.front()}")       # 任务1
print(f"队尾: {queue.rear()}")        # 任务3

processed = queue.dequeue()
print(f"处理的任务: {processed}")     # 任务1
print(f"队列: {queue}")              # ['任务2', '任务3']
```

### 使用列表实现队列

虽然不如 `deque` 高效，但在某些简单场景下可以使用列表实现队列：

```python
class ListQueue:
    """使用列表实现的队列（效率较低）"""
    
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        """入队：在列表末尾添加"""
        self.items.append(item)
        return True
    
    def dequeue(self):
        """出队：从列表头部删除（效率低，O(n)）"""
        if not self.is_empty():
            return self.items.pop(0)
        return None
    
    def front(self):
        """查看队首元素"""
        if not self.is_empty():
            return self.items[0]
        return None
    
    def rear(self):
        """查看队尾元素"""
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        """检查队列是否为空"""
        return len(self.items) == 0
    
    def size(self):
        """获取队列大小"""
        return len(self.items)
    
    def __str__(self):
        return str(self.items)

# 使用示例
queue = ListQueue()
queue.enqueue(1)
queue.enqueue(2)
queue.enqueue(3)

print(f"队列: {queue}")  # [1, 2, 3]
print(f"出队: {queue.dequeue()}")  # 1
print(f"队列: {queue}")  # [2, 3]
```

### 实例（使用列表实现队列）

```python
def simulate_bank_queue():
    """模拟银行排队系统"""
    class BankQueue:
        def __init__(self):
            self.customers = []
            self.processed = []
        
        def arrive(self, customer_name):
            """顾客到达"""
            self.customers.append(customer_name)
            print(f"{customer_name} 排队等待")
        
        def serve_customer(self):
            """服务顾客"""
            if not self.customers:
                print("没有顾客在等待")
                return None
            
            customer = self.customers.pop(0)  # 从队首取出
            self.processed.append(customer)
            print(f"正在为 {customer} 办理业务")
            return customer
        
        def show_queue(self):
            """显示当前排队情况"""
            if self.customers:
                print("当前排队:", " -> ".join(self.customers))
            else:
                print("当前无人排队")
        
        def show_processed(self):
            """显示已服务的顾客"""
            if self.processed:
                print("已服务:", ", ".join(self.processed))
            else:
                print("暂无已服务顾客")
    
    # 模拟银行营业
    bank = BankQueue()
    
    print("=== 银行开始营业 ===")
    bank.arrive("张三")
    bank.arrive("李四")
    bank.arrive("王五")
    
    print("\n=== 排队情况 ===")
    bank.show_queue()
    
    print("\n=== 开始服务 ===")
    bank.serve_customer()
    bank.serve_customer()
    
    print("\n=== 排队情况 ===")
    bank.show_queue()
    
    print("\n=== 已服务顾客 ===")
    bank.show_processed()

# 运行模拟
simulate_bank_queue()
```

输出结果：
```
=== 银行开始营业 ===
张三 排队等待
李四 排队等待
王五 排队等待

=== 排队情况 ===
当前排队: 张三 -> 李四 -> 王五

=== 开始服务 ===
正在为 张三 办理业务
正在为 李四 办理业务

=== 排队情况 ===
当前排队: 王五

=== 已服务顾客 ===
已服务: 张三, 李四
```

## 列表推导式

列表推导式是 Python 中创建列表的简洁方式，可以用一行代码生成复杂的列表。

### 基本语法

```python
# 基本语法：[expression for item in iterable]
# 带条件：[expression for item in iterable if condition]

# 生成 0-9 的平方
squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 生成 0-9 中的偶数
evens = [x for x in range(10) if x % 2 == 0]
print(evens)    # [0, 2, 4, 6, 8]

# 字符串处理
words = ['hello', 'world', 'python']
uppercase = [word.upper() for word in words]
print(uppercase)  # ['HELLO', 'WORLD', 'PYTHON']

# 条件表达式
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
result = ['偶数' if x % 2 == 0 else '奇数' for x in numbers]
print(result)  # ['奇数', '偶数', '奇数', '偶数', '奇数', '偶数', '奇数', '偶数', '奇数', '偶数']
```

### 复杂示例

```python
# 多重循环
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
print(flattened)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# 字典推导配合
students = [
    {'name': '张三', 'score': 85},
    {'name': '李四', 'score': 92},
    {'name': '王五', 'score': 78}
]

优秀学生 = [student['name'] for student in students if student['score'] >= 90]
print(优秀学生)  # ['李四']

# 函数应用
import math
numbers = [1, 2, 3, 4, 5]
roots = [math.sqrt(x) for x in numbers]
print(roots)  # [1.0, 1.4142135623730951, 1.7320508075688772, 2.0, 2.23606797749979]
```

## 嵌套列表解析

嵌套列表解析用于处理多维数据结构。

### 二维矩阵操作

```python
# 创建 3x3 矩阵
matrix = [[j for j in range(3)] for i in range(3)]
print(matrix)
# [[0, 1, 2], [0, 1, 2], [0, 1, 2]]

# 转置矩阵
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

transpose = [[row[i] for row in matrix] for i in range(3)]
print(transpose)
# [[1, 4, 7], [2, 5, 8], [3, 6, 9]]

# 提取对角线元素
diagonal = [matrix[i][i] for i in range(3)]
print(diagonal)  # [1, 5, 9]

# 扁平化嵌套列表
nested = [[1, 2, [3, 4]], [5, 6], [7, [8, 9]]]

def flatten(lst):
    return [item for sublist in lst for item in 
            (flatten(sublist) if isinstance(sublist, list) else [sublist])]

flattened = flatten(nested)
print(flattened)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 实际应用示例

```python
# 处理学生成绩数据
students_data = [
    {'name': '张三', 'scores': [85, 92, 78]},
    {'name': '李四', 'scores': [95, 88, 92]},
    {'name': '王五', 'scores': [76, 85, 80]}
]

# 计算每个学生的平均分
averages = [
    {
        'name': student['name'],
        'average': sum(student['scores']) / len(student['scores'])
    }
    for student in students_data
]
print(averages)
# [{'name': '张三', 'average': 85.0}, {'name': '李四', 'average': 91.66666666666667}, {'name': '王五', 'average': 80.33333333333333}]

# 找出每科最高分
subjects = ['数学', '英语', '物理']
max_scores = [
    max(student['scores'][i] for student in students_data)
    for i in range(len(subjects))
]
print(dict(zip(subjects, max_scores)))
# {'数学': 95, '英语': 92, '物理': 92}
```

## del 语句

`del` 语句用于删除对象或对象的一部分。

### 删除变量

```python
x = 10
print(x)  # 10

del x
# print(x)  # NameError: name 'x' is not defined
```

### 删除列表元素

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# 删除单个元素
del numbers[5]  # 删除索引 5 的元素（值为 5）
print(numbers)   # [0, 1, 2, 3, 4, 6, 7, 8, 9]

# 删除切片
del numbers[2:5]  # 删除索引 2 到 4 的元素
print(numbers)    # [0, 1, 6, 7, 8, 9]

# 删除整个列表
del numbers
# print(numbers)  # NameError: name 'numbers' is not defined
```

### 删除字典元素

```python
student = {
    'name': '张三',
    'age': 20,
    'grade': '大二',
    'major': '计算机科学'
}

# 删除指定键
del student['grade']
print(student)  # {'name': '张三', 'age': 20, 'major': '计算机科学'}

# 清空字典
student.clear()
print(student)  # {}
```

### 删除对象属性

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

person = Person('李四', 25)
print(person.name)  # 李四

del person.age
# print(person.age)  # AttributeError: 'Person' object has no attribute 'age'
```

## 元组和序列

元组（Tuple）是不可变的序列类型，一旦创建就不能修改。

### 元组的基本操作

```python
# 创建元组
empty_tuple = ()
single_tuple = (1,)  # 注意逗号
multiple_tuple = (1, 2, 3, 4, 5)
tuple_from_list = tuple([1, 2, 3, 4, 5])

# 访问元素
print(multiple_tuple[0])    # 1
print(multiple_tuple[-1])   # 5

# 切片操作
print(multiple_tuple[1:4])  # (2, 3, 4)

# 元组解包
a, b, c, d, e = multiple_tuple
print(a, b, c, d, e)  # 1 2 3 4 5

# 元组拼接
tuple1 = (1, 2, 3)
tuple2 = (4, 5, 6)
combined = tuple1 + tuple2
print(combined)  # (1, 2, 3, 4, 5, 6)

# 元组重复
repeated = tuple1 * 3
print(repeated)  # (1, 2, 3, 1, 2, 3, 1, 2, 3)
```

### 元组与列表的区别

```python
# 元组是不可变的
tuple_immutable = (1, 2, 3)
# tuple_immutable[0] = 10  # TypeError: 'tuple' object does not support item assignment

# 列表是可变的
list_mutable = [1, 2, 3]
list_mutable[0] = 10
print(list_mutable)  # [10, 2, 3]

# 性能比较
import timeit

# 元组创建更快
tuple_time = timeit.timeit('(1, 2, 3, 4, 5)', number=1000000)
list_time = timeit.timeit('[1, 2, 3, 4, 5]', number=1000000)

print(f"元组创建时间: {tuple_time}")
print(f"列表创建时间: {list_time}")
```

### 元组的应用场景

```python
# 函数返回多个值
def calculate(a, b):
    sum_ab = a + b
    diff_ab = a - b
    product_ab = a * b
    return sum_ab, diff_ab, product_ab

result = calculate(10, 5)
print(result)  # (15, 5, 50)

s, d, p = calculate(10, 5)
print(f"和: {s}, 差: {d}, 积: {p}")  # 和: 15, 差: 5, 积: 50

# 字典键必须是不可变的
coordinate_dict = {
    (0, 0): "原点",
    (1, 1): "第一象限",
    (-1, -1): "第三象限"
}
print(coordinate_dict[(1, 1)])  # 第一象限

# 作为集合元素
unique_coordinates = {(0, 0), (1, 1), (0, 0), (2, 2)}
print(unique_coordinates)  # {(0, 0), (1, 1), (2, 2)}
```

## 集合

集合（Set）是无序的不重复元素集合。

### 集合的基本操作

```python
# 创建集合
empty_set = set()
set_from_list = set([1, 2, 3, 4, 5, 3, 2, 1])
set_literal = {1, 2, 3, 4, 5}

print(set_from_list)  # {1, 2, 3, 4, 5}  # 自动去重

# 添加元素
my_set = {1, 2, 3}
my_set.add(4)
print(my_set)  # {1, 2, 3, 4}

# 删除元素
my_set.remove(2)  # 如果元素不存在会报错
my_set.discard(5)  # 如果元素不存在不会报错
print(my_set)  # {1, 3, 4}

# 检查元素是否存在
print(3 in my_set)   # True
print(5 in my_set)   # False

# 集合大小
print(len(my_set))   # 3

# 清空集合
my_set.clear()
print(my_set)  # set()
```

### 集合运算

```python
set1 = {1, 2, 3, 4, 5}
set2 = {4, 5, 6, 7, 8}

# 并集
union_set = set1.union(set2)  # 或 set1 | set2
print(union_set)  # {1, 2, 3, 4, 5, 6, 7, 8}

# 交集
intersection_set = set1.intersection(set2)  # 或 set1 & set2
print(intersection_set)  # {4, 5}

# 差集
difference_set = set1.difference(set2)  # 或 set1 - set2
print(difference_set)  # {1, 2, 3}

# 对称差集
symmetric_difference = set1.symmetric_difference(set2)  # 或 set1 ^ set2
print(symmetric_difference)  # {1, 2, 3, 6, 7, 8}

# 子集检查
subset = {1, 2, 3}
print(subset.issubset(set1))  # True

# 超集检查
print(set1.issuperset(subset))  # True
```

### 集合的应用

```python
# 去重
numbers = [1, 2, 3, 2, 1, 4, 5, 3, 2]
unique_numbers = list(set(numbers))
print(unique_numbers)  # [1, 2, 3, 4, 5]  # 顺序可能不同

# 找出两个列表中的共同元素
list1 = ['apple', 'banana', 'orange', 'grape']
list2 = ['banana', 'grape', 'kiwi', 'melon']

common = set(list1) & set(list2)
print(common)  # {'banana', 'grape'}

# 批量数据处理
def find_duplicates(items):
    """找出重复的元素"""
    seen = set()
    duplicates = set()
    
    for item in items:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)
    
    return duplicates

data = ['a', 'b', 'c', 'a', 'd', 'b', 'e', 'a']
duplicates = find_duplicates(data)
print(duplicates)  # {'a', 'b'}
```

## 字典

字典（Dictionary）是无序的键值对集合（Python 3.7+ 中保持插入顺序）。

### 字典的基本操作

```python
# 创建字典
empty_dict = {}
person_dict = {'name': '张三', 'age': 25, 'city': '北京'}

# 访问元素
print(person_dict['name'])     # 张三
print(person_dict.get('age'))  # 25
print(person_dict.get('email', '未提供'))  # 未提供

# 添加和修改元素
person_dict['email'] = 'zhangsan@example.com'  # 添加
person_dict['age'] = 26  # 修改

# 删除元素
del person_dict['city']  # 删除指定键
removed_value = person_dict.pop('age')  # 删除并返回值
print(removed_value)  # 26

# 检查键是否存在
print('name' in person_dict)  # True
print('city' in person_dict)  # False

# 字典大小
print(len(person_dict))  # 2

# 获取所有键、值、键值对
keys = person_dict.keys()
values = person_dict.values()
items = person_dict.items()

print(list(keys))    # ['name', 'email']
print(list(values))  # ['张三', 'zhangsan@example.com']
print(list(items))   # [('name', '张三'), ('email', 'zhangsan@example.com')]
```

### 字典的高级操作

```python
# 字典推导式
squares_dict = {x: x**2 for x in range(1, 6)}
print(squares_dict)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# 条件字典推导式
even_squares = {x: x**2 for x in range(1, 11) if x % 2 == 0}
print(even_squares)  # {2: 4, 4: 16, 6: 36, 8: 64, 10: 100}

# 合并字典 (Python 3.9+)
dict1 = {'a': 1, 'b': 2}
dict2 = {'c': 3, 'd': 4}
merged = dict1 | dict2
print(merged)  # {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# 更新字典 (Python 3.9+)
dict1 |= {'e': 5}
print(dict1)  # {'a': 1, 'b': 2, 'e': 5}

# 传统合并方式
merged_traditional = {**dict1, **dict2}
print(merged_traditional)  # {'a': 1, 'b': 2, 'e': 5, 'c': 3, 'd': 4}
```

### 字典的应用

```python
# 频率统计
text = "hello world hello python hello programming"
words = text.split()
word_count = {}

for word in words:
    word_count[word] = word_count.get(word, 0) + 1

print(word_count)
# {'hello': 3, 'world': 1, 'python': 1, 'programming': 1}

# 使用 Counter（更简洁）
from collections import Counter
word_count = Counter(words)
print(word_count)  # Counter({'hello': 3, 'world': 1, 'python': 1, 'programming': 1})

# 配置管理
config = {
    'database': {
        'host': 'localhost',
        'port': 5432,
        'name': 'mydb'
    },
    'api': {
        'key': 'your-api-key',
        'timeout': 30
    }
}

def get_config(path, default=None):
    """获取嵌套配置值"""
    keys = path.split('.')
    value = config
    
    try:
        for key in keys:
            value = value[key]
        return value
    except (KeyError, TypeError):
        return default

print(get_config('database.host'))  # localhost
print(get_config('api.timeout'))   # 30
print(get_config('cache.size', 100))  # 100 (默认值)
```

## 遍历技巧

### 遍历序列

```python
# 基本遍历
fruits = ['apple', 'banana', 'orange']
for fruit in fruits:
    print(fruit)

# 带索引遍历
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# 使用 range
for i in range(len(fruits)):
    print(f"{i}: {fruits[i]}")

# 反向遍历
for fruit in reversed(fruits):
    print(fruit)

# 同时遍历多个序列
names = ['张三', '李四', '王五']
scores = [85, 92, 78]

for name, score in zip(names, scores):
    print(f"{name}: {score}分")

# 使用 zip_longest 处理不等长序列
from itertools import zip_longest

subjects = ['数学', '英语', '物理', '化学']
grades = [90, 85, 88]

for subject, grade in zip_longest(subjects, grades, fillvalue='未评分'):
    print(f"{subject}: {grade}")
```

### 字典遍历

```python
student = {
    'name': '张三',
    'age': 20,
    'grade': '大二',
    'major': '计算机科学'
}

# 遍历键
for key in student:
    print(key)
for key in student.keys():
    print(key)

# 遍历值
for value in student.values():
    print(value)

# 遍历键值对
for key, value in student.items():
    print(f"{key}: {value}")

# 字典推导式遍历
uppercase_keys = {k.upper(): v for k, v in student.items()}
print(uppercase_keys)
# {'NAME': '张三', 'AGE': 20, 'GRADE': '大二', 'MAJOR': '计算机科学'}
```

### 嵌套结构遍历

```python
# 遍历嵌套字典
students = {
    'class_1': [
        {'name': '张三', 'scores': [85, 92, 78]},
        {'name': '李四', 'scores': [90, 88, 95]}
    ],
    'class_2': [
        {'name': '王五', 'scores': [82, 79, 85]},
        {'name': '赵六', 'scores': [91, 87, 89]}
    ]
}

for class_name, class_students in students.items():
    print(f"\n{class_name}:")
    for student in class_students:
        avg_score = sum(student['scores']) / len(student['scores'])
        print(f"  {student['name']}: 平均分 {avg_score:.2f}")

# 遍历矩阵
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# 按行遍历
print("\n按行遍历:")
for row in matrix:
    print(row)

# 按列遍历
print("\n按列遍历:")
for col in range(len(matrix[0])):
    column = [matrix[row][col] for row in range(len(matrix))]
    print(column)

# 按对角线遍历
print("\n主对角线:")
main_diagonal = [matrix[i][i] for i in range(len(matrix))]
print(main_diagonal)

print("\n副对角线:")
secondary_diagonal = [matrix[i][len(matrix)-1-i] for i in range(len(matrix))]
print(secondary_diagonal)
```

### 高级遍历技巧

```python
# 使用 itertools
import itertools

# 笛卡尔积
colors = ['红', '蓝', '绿']
sizes = ['S', 'M', 'L']
combinations = list(itertools.product(colors, sizes))
print(combinations)
# [('红', 'S'), ('红', 'M'), ('红', 'L'), ('蓝', 'S'), ('蓝', 'M'), ('蓝', 'L'), ('绿', 'S'), ('绿', 'M'), ('绿', 'L')]

# 排列
import itertools
items = ['A', 'B', 'C']
permutations = list(itertools.permutations(items, 2))
print(permutations)  # [('A', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'C'), ('C', 'A'), ('C', 'B')]

# 组合
combinations = list(itertools.combinations(items, 2))
print(combinations)  # [('A', 'B'), ('A', 'C'), ('B', 'C')]

# 分组遍历
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
group_size = 3

# 方法一：使用列表推导式
groups = [numbers[i:i+group_size] for i in range(0, len(numbers), group_size)]
print(groups)  # [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# 方法二：使用 zip
def group_iterable(iterable, n):
    args = [iter(iterable)] * n
    return zip(*args)

groups_zip = list(group_iterable(numbers, 3))
print(groups_zip)  # [(1, 2, 3), (4, 5, 6), (7, 8, 9)]
```

### 条件遍历和过滤

```python
# 过滤遍历
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 方法一：列表推导式
even_numbers = [x for x in numbers if x % 2 == 0]
print(even_numbers)  # [2, 4, 6, 8, 10]

# 方法二：filter
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # [2, 4, 6, 8, 10]

# 方法三：for 循环
even_numbers = []
for x in numbers:
    if x % 2 == 0:
        even_numbers.append(x)
print(even_numbers)  # [2, 4, 6, 8, 10]

# 复杂条件过滤
students = [
    {'name': '张三', 'age': 20, 'score': 85},
    {'name': '李四', 'age': 22, 'score': 92},
    {'name': '王五', 'age': 19, 'score': 78},
    {'name': '赵六', 'age': 21, 'score': 88}
]

# 找出年龄大于等于20且分数大于等于85的学生
qualified_students = [
    student for student in students 
    if student['age'] >= 20 and student['score'] >= 85
]
print(qualified_students)
# [{'name': '张三', 'age': 20, 'score': 85}, {'name': '李四', 'age': 22, 'score': 92}, {'name': '赵六', 'age': 21, 'score': 88}]
```

