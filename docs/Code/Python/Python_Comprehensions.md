# Python 推导式

## 概述

Python 推导式（Comprehensions）是一种简洁、优雅的语法结构，用于从一个或多个可迭代对象中快速创建新的数据结构。推导式可以替代传统的循环和条件判断，使代码更加简洁易读。

### 推导式的优势

1. **代码简洁**：一行代码可以完成多行循环的功能
2. **可读性强**：语法直观，易于理解
3. **性能优化**：通常比等效的循环更快
4. **功能强大**：支持条件过滤和嵌套

### 推导式的基本结构

```python
[expression for item in iterable if condition]  # 列表推导式
{expression for item in iterable if condition}  # 集合推导式
{key_expression: value_expression for item in iterable if condition}  # 字典推导式
(expression for item in iterable if condition)  # 生成器表达式（类似元组推导式）
```

## 列表(list)推导式

列表推导式是最常用的推导式类型，用于快速创建列表。

### 基本语法

```python
[expression for item in iterable]
[expression for item in iterable if condition]
```

### 示例

#### 基本用法

```python
# 创建平方数列表
squares = [x**2 for x in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]

# 将字符串列表转换为大写
fruits = ['apple', 'banana', 'cherry']
uppercase_fruits = [fruit.upper() for fruit in fruits]
print(uppercase_fruits)  # ['APPLE', 'BANANA', 'CHERRY']

# 提取字符串中的数字
message = "Hello123World456"
digits = [char for char in message if char.isdigit()]
print(digits)  # ['1', '2', '3', '4', '5', '6']
```

#### 带条件的列表推导式

```python
# 筛选偶数
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = [x for x in numbers if x % 2 == 0]
print(even_numbers)  # [2, 4, 6, 8, 10]

# 筛选长度大于3的字符串
words = ['cat', 'window', 'defenestrate', 'dog']
long_words = [word for word in words if len(word) > 3]
print(long_words)  # ['window', 'defenestrate']

# 同时使用条件和转换
numbers = [1, 2, 3, 4, 5, 6]
squared_evens = [x**2 for x in numbers if x % 2 == 0]
print(squared_evens)  # [4, 16, 36]
```

#### 嵌套循环的列表推导式

```python
# 创建笛卡尔积
colors = ['red', 'green', 'blue']
sizes = ['S', 'M', 'L']
combinations = [(color, size) for color in colors for size in sizes]
print(combinations)
# [('red', 'S'), ('red', 'M'), ('red', 'L'), 
#  ('green', 'S'), ('green', 'M'), ('green', 'L'), 
#  ('blue', 'S'), ('blue', 'M'), ('blue', 'L')]

# 矩阵转置
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
transposed = [[row[i] for row in matrix] for i in range(len(matrix[0]))]
print(transposed)  # [[1, 4, 7], [2, 5, 8], [3, 6, 9]]

# 展平嵌套列表
nested_list = [[1, 2, 3], [4, 5], [6, 7, 8, 9]]
flat_list = [item for sublist in nested_list for item in sublist]
print(flat_list)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

#### 复杂的条件判断

```python
# 多条件筛选
numbers = range(1, 21)
filtered = [x for x in numbers if x % 2 == 0 and x % 3 == 0]
print(filtered)  # [6, 12, 18]

# 使用三元表达式
numbers = [1, 2, 3, 4, 5]
result = ["even" if x % 2 == 0 else "odd" for x in numbers]
print(result)  # ['odd', 'even', 'odd', 'even', 'odd']

# 处理可能为None的值
values = [1, None, 3, None, 5]
cleaned = [x if x is not None else 0 for x in values]
print(cleaned)  # [1, 0, 3, 0, 5]
```

## 字典(dict)推导式

字典推导式用于快速创建字典。

### 基本语法

```python
{key_expression: value_expression for item in iterable}
{key_expression: value_expression for item in iterable if condition}
```

### 示例

#### 基本用法

```python
# 创建数字平方字典
squares_dict = {x: x**2 for x in range(1, 6)}
print(squares_dict)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# 交换键值对
original_dict = {'a': 1, 'b': 2, 'c': 3}
swapped_dict = {value: key for key, value in original_dict.items()}
print(swapped_dict)  # {1: 'a', 2: 'b', 3: 'c'}

# 从两个列表创建字典
keys = ['name', 'age', 'city']
values = ['Alice', 25, 'New York']
person_dict = {keys[i]: values[i] for i in range(len(keys))}
print(person_dict)  # {'name': 'Alice', 'age': 25, 'city': 'New York'}
```

#### 带条件的字典推导式

```python
# 筛选特定条件的键值对
original_dict = {'a': 1, 'b': 2, 'c': 3, 'd': 4}
filtered_dict = {k: v for k, v in original_dict.items() if v % 2 == 0}
print(filtered_dict)  # {'b': 2, 'd': 4}

# 根据值转换键
original_dict = {'apple': 3, 'banana': 5, 'cherry': 2}
uppercase_dict = {k.upper(): v for k, v in original_dict.items() if v > 2}
print(uppercase_dict)  # {'APPLE': 3, 'BANANA': 5}

# 复杂的键值转换
words = ['hello', 'world', 'python', 'programming']
length_dict = {word: len(word) for word in words if len(word) > 5}
print(length_dict)  # {'python': 6, 'programming': 11}
```

#### 处理嵌套结构

```python
# 从嵌套列表创建字典
students = [
    ['Alice', 25, 'Math'],
    ['Bob', 22, 'Physics'],
    ['Charlie', 23, 'Chemistry']
]
student_dict = {student[0]: {'age': student[1], 'major': student[2]} for student in students}
print(student_dict)
# {'Alice': {'age': 25, 'major': 'Math'}, 
#  'Bob': {'age': 22, 'major': 'Physics'}, 
#  'Charlie': {'age': 23, 'major': 'Chemistry'}}

# 合并多个字典
dict1 = {'a': 1, 'b': 2}
dict2 = {'c': 3, 'd': 4}
merged_dict = {k: v for d in [dict1, dict2] for k, v in d.items()}
print(merged_dict)  # {'a': 1, 'b': 2, 'c': 3, 'd': 4}
```

## 集合(set)推导式

集合推导式用于快速创建集合（无序且不重复的元素集合）。

### 基本语法

```python
{expression for item in iterable}
{expression for item in iterable if condition}
```

### 示例

#### 基本用法

```python
# 创建平方数集合
squares_set = {x**2 for x in range(1, 6)}
print(squares_set)  # {1, 4, 9, 16, 25}

# 从字符串创建字符集合（自动去重）
word = "programming"
unique_chars = {char for char in word}
print(unique_chars)  # {'p', 'r', 'o', 'g', 'a', 'm', 'i', 'n'}

# 从列表创建集合（去重）
numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
unique_numbers = {x for x in numbers}
print(unique_numbers)  # {1, 2, 3, 4}
```

#### 带条件的集合推导式

```python
# 筛选偶数
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_set = {x for x in numbers if x % 2 == 0}
print(even_set)  # {2, 4, 6, 8, 10}

# 筛选长度大于3的字符串
words = ['cat', 'window', 'defenestrate', 'dog', 'window']
long_words_set = {word for word in words if len(word) > 3}
print(long_words_set)  # {'window', 'defenestrate'}

# 复杂的条件判断
numbers = range(1, 21)
filtered_set = {x for x in numbers if x % 2 == 0 and x % 3 == 0}
print(filtered_set)  # {18, 12, 6}
```

#### 集合运算

```python
# 使用集合推导式进行集合运算
set1 = {1, 2, 3, 4, 5}
set2 = {4, 5, 6, 7, 8}

# 并集
union_set = {x for x in set1 | set2}
print(union_set)  # {1, 2, 3, 4, 5, 6, 7, 8}

# 交集
intersection_set = {x for x in set1 if x in set2}
print(intersection_set)  # {4, 5}

# 差集
difference_set = {x for x in set1 if x not in set2}
print(difference_set)  # {1, 2, 3}
```

## 元组(tuple)推导式

严格来说，Python 没有元组推导式，但可以使用生成器表达式来创建类似的效果。

### 基本语法

```python
tuple(expression for item in iterable)
tuple(expression for item in iterable if condition)
```

### 示例

#### 基本用法

```python
# 创建平方数元组
squares_tuple = tuple(x**2 for x in range(1, 6))
print(squares_tuple)  # (1, 4, 9, 16, 25)

# 筛选偶数元组
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_tuple = tuple(x for x in numbers if x % 2 == 0)
print(even_tuple)  # (2, 4, 6, 8, 10)

# 字符串处理
words = ['hello', 'world', 'python']
uppercase_tuple = tuple(word.upper() for word in words)
print(uppercase_tuple)  # ('HELLO', 'WORLD', 'PYTHON')
```

#### 生成器表达式

生成器表达式与列表推导式类似，但使用圆括号，并且是惰性求值的。

```python
# 生成器表达式（惰性求值）
squares_gen = (x**2 for x in range(1, 6))
print(squares_gen)  # <generator object <genexpr> at 0x...>

# 转换为元组
squares_tuple = tuple(squares_gen)
print(squares_tuple)  # (1, 4, 9, 16, 25)

# 直接使用生成器表达式
for square in (x**2 for x in range(1, 6)):
    print(square, end=" ")  # 1 4 9 16 25
print()

# 带条件的生成器表达式
even_squares = (x**2 for x in range(1, 11) if x % 2 == 0)
print(tuple(even_squares))  # (4, 16, 36, 64, 100)
```

## 推导式的嵌套使用

推导式可以嵌套使用，创建更复杂的数据结构。

### 示例

```python
# 嵌套列表推导式 - 创建矩阵
matrix = [[i * 3 + j + 1 for j in range(3)] for i in range(3)]
print(matrix)  # [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# 字典中的列表推导式
students = {
    'Alice': [85, 92, 78],
    'Bob': [76, 88, 95],
    'Charlie': [90, 87, 93]
}

# 计算每个学生的平均分
average_scores = {name: sum(scores)/len(scores) for name, scores in students.items()}
print(average_scores)  # {'Alice': 85.0, 'Bob': 86.333..., 'Charlie': 90.0}

# 复杂的嵌套推导式
# 创建学生成绩统计字典
student_stats = {
    name: {
        'average': sum(scores)/len(scores),
        'max': max(scores),
        'min': min(scores),
        'passed': [score for score in scores if score >= 60]
    }
    for name, scores in students.items()
}

for name, stats in student_stats.items():
    print(f"{name}: {stats}")
```

## 推导式与普通循环的对比

### 传统循环方式

```python
# 传统方式创建平方数列表
squares = []
for x in range(1, 6):
    squares.append(x**2)
print(squares)  # [1, 4, 9, 16, 25]

# 传统方式创建筛选后的字典
original_dict = {'a': 1, 'b': 2, 'c': 3, 'd': 4}
filtered_dict = {}
for k, v in original_dict.items():
    if v % 2 == 0:
        filtered_dict[k] = v
print(filtered_dict)  # {'b': 2, 'd': 4}
```

### 推导式方式

```python
# 推导式方式（更简洁）
squares = [x**2 for x in range(1, 6)]
filtered_dict = {k: v for k, v in original_dict.items() if v % 2 == 0}
```

## 推导式的性能考虑

### 内存效率

- **列表推导式**：立即创建完整的列表，占用内存
- **生成器表达式**：惰性求值，内存效率高
- **集合/字典推导式**：立即创建完整的数据结构

### 性能比较

```python
import time

# 测试性能
data = range(1000000)

# 列表推导式
start = time.time()
result1 = [x**2 for x in data]
end = time.time()
print(f"列表推导式耗时: {end - start:.4f}秒")

# 生成器表达式
start = time.time()
result2 = (x**2 for x in data)
# 需要实际使用生成器才会计算
list(result2)  # 强制计算
end = time.time()
print(f"生成器表达式耗时: {end - start:.4f}秒")
```

## 推导式的最佳实践

### 1. 保持简洁

推导式应该保持简洁，如果过于复杂，考虑使用传统循环。

```python
# 好的例子
squares = [x**2 for x in range(10)]

# 过于复杂的例子（不推荐）
# complex_result = [transform(x) for x in data if condition1(x) and condition2(x) or condition3(x)]
```

### 2. 避免副作用

推导式应该专注于数据转换，避免产生副作用。

```python
# 不好的例子（在推导式中执行打印）
# result = [print(x) or x**2 for x in range(5)]

# 好的例子
result = [x**2 for x in range(5)]
for x in result:
    print(x)
```

### 3. 使用适当的推导式类型

根据需求选择最合适的推导式类型。

```python
# 需要有序数据：列表推导式
ordered_data = [x for x in range(10)]

# 需要唯一值：集合推导式
unique_data = {x for x in [1, 2, 2, 3, 3, 3]}

# 需要键值对：字典推导式
key_value_data = {x: x**2 for x in range(5)}

# 需要惰性求值：生成器表达式
lazy_data = (x**2 for x in range(1000000))
```

### 4. 注意可读性

如果推导式变得难以理解，考虑拆分成多行或使用传统循环。

```python
# 可读性好的多行推导式
result = [
    x**2 
    for x in range(10) 
    if x % 2 == 0
]

# 过于复杂的推导式（考虑使用循环）
# complex_result = [f(x) for x in nested_list for y in x if condition(y)]
```

## 实际应用示例

### 数据处理

```python
# 数据清洗和转换
data = [
    {'name': 'Alice', 'age': '25', 'score': '85'},
    {'name': 'Bob', 'age': '22', 'score': '92'},
    {'name': 'Charlie', 'age': '23', 'score': '78'}
]

# 转换数据类型
cleaned_data = [
    {
        'name': item['name'],
        'age': int(item['age']),
        'score': int(item['score'])
    }
    for item in data
]

print(cleaned_data)
```

### 配置文件处理

```python
# 配置文件解析
config_lines = [
    "database.host=localhost",
    "database.port=5432", 
    "database.name=mydb",
    "cache.enabled=true",
    "cache.timeout=300"
]

# 转换为配置字典
config_dict = {
    line.split('=')[0]: line.split('=')[1]
    for line in config_lines
}

print(config_dict)
```

### 数据分析

```python
# 简单的数据分析
sales_data = [
    ('Alice', 1500),
    ('Bob', 2200),
    ('Charlie', 1800),
    ('Alice', 2000),
    ('Bob', 1900)
]

# 按销售人员汇总销售额
from collections import defaultdict
sales_summary = defaultdict(int)

for name, amount in sales_data:
    sales_summary[name] += amount

# 转换为字典
sales_dict = {name: total for name, total in sales_summary.items()}
print(sales_dict)

# 筛选高销售额人员
high_sales = {name: total for name, total in sales_dict.items() if total > 2000}
print(high_sales)
```
