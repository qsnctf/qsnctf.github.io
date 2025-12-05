# Python 循环语句

## 概述

循环语句允许我们执行一个语句或语句组多次。Python 提供了两种主要的循环结构：`while` 循环和 `for` 循环。循环是编程中处理重复任务的基本工具。

## while 循环

### 基本语法

```python
while condition:
    # 循环体
    statement1
    statement2
    ...
```

### 示例

```python
# 基本的 while 循环
count = 1
while count <= 5:
    print(f"计数: {count}")
    count += 1

# 计算 1 到 100 的和
total = 0
num = 1
while num <= 100:
    total += num
    num += 1
print(f"1 到 100 的和为: {total}")

# 用户输入验证
password = ""
while password != "secret":
    password = input("请输入密码: ")
    if password != "secret":
        print("密码错误，请重新输入")
print("密码正确，欢迎进入系统")
```

## 无限循环

无限循环是指条件永远为 True 的循环，需要使用 break 语句来退出。

### 语法

```python
while True:
    # 循环体
    statement
    if exit_condition:
        break
```

### 示例

```python
# 简单的无限循环
while True:
    user_input = input("请输入命令 (输入 'quit' 退出): ")
    if user_input == "quit":
        print("程序结束")
        break
    else:
        print(f"执行命令: {user_input}")

# 计算器程序
while True:
    print("\n=== 简易计算器 ===")
    print("1. 加法")
    print("2. 减法") 
    print("3. 乘法")
    print("4. 除法")
    print("5. 退出")
    
    choice = input("请选择操作 (1-5): ")
    
    if choice == "5":
        print("感谢使用，再见！")
        break
    
    if choice in ["1", "2", "3", "4"]:
        num1 = float(input("请输入第一个数字: "))
        num2 = float(input("请输入第二个数字: "))
        
        if choice == "1":
            result = num1 + num2
            print(f"结果: {num1} + {num2} = {result}")
        elif choice == "2":
            result = num1 - num2
            print(f"结果: {num1} - {num2} = {result}")
        elif choice == "3":
            result = num1 * num2
            print(f"结果: {num1} × {num2} = {result}")
        elif choice == "4":
            if num2 != 0:
                result = num1 / num2
                print(f"结果: {num1} ÷ {num2} = {result}")
            else:
                print("错误：除数不能为零")
    else:
        print("无效选择，请重新输入")
```

## while 循环使用 else 语句

在 while 循环中，else 子句会在循环正常结束（即条件变为 False）时执行，但如果循环被 break 中断，则不会执行。

### 语法

```python
while condition:
    # 循环体
    statements
else:
    # 循环正常结束时执行
    else_statements
```

### 示例

```python
# while-else 示例
count = 1
while count <= 3:
    print(f"计数: {count}")
    count += 1
else:
    print("循环正常结束")

# 搜索示例
numbers = [1, 3, 5, 7, 9]
search_num = 4
index = 0

while index < len(numbers):
    if numbers[index] == search_num:
        print(f"找到数字 {search_num}，位置: {index}")
        break
    index += 1
else:
    print(f"未找到数字 {search_num}")

# 密码验证示例
attempts = 3
while attempts > 0:
    password = input(f"请输入密码 (剩余尝试次数: {attempts}): ")
    if password == "secret":
        print("密码正确，欢迎进入")
        break
    else:
        print("密码错误")
        attempts -= 1
else:
    print("尝试次数已用完，账户被锁定")
```

## 简单语句组

如果循环体只有一条语句，可以将其与 while 语句写在同一行。

### 语法

```python
while condition: single_statement
```

### 示例

```python
# 简单语句组
count = 0
while count < 5: print(f"计数: {count}"); count += 1

# 但不推荐这种写法，因为可读性较差
# 推荐使用多行格式
```

## for 语句

for 循环用于遍历任何可迭代对象（如列表、元组、字符串、字典等）。

### 基本语法

```python
for variable in iterable:
    # 循环体
    statements
```

### 示例

```python
# 遍历列表
fruits = ["苹果", "香蕉", "橙子", "葡萄"]
for fruit in fruits:
    print(f"我喜欢吃{fruit}")

# 遍历字符串
message = "Hello Python"
for char in message:
    print(char, end=" ")
print()

# 遍历字典
student = {"name": "张三", "age": 20, "major": "计算机科学"}
for key in student:
    print(f"{key}: {student[key]}")

# 同时获取键和值
for key, value in student.items():
    print(f"{key}: {value}")

# 遍历元组
coordinates = [(1, 2), (3, 4), (5, 6)]
for x, y in coordinates:
    print(f"坐标: ({x}, {y})")
```

## for...else 语句

与 while 循环类似，for 循环也可以使用 else 子句，在循环正常结束时执行。

### 语法

```python
for variable in iterable:
    # 循环体
    statements
else:
    # 循环正常结束时执行
    else_statements
```

### 示例

```python
# for-else 示例
numbers = [2, 4, 6, 8, 10]
for num in numbers:
    print(f"数字: {num}")
else:
    print("所有数字已遍历完毕")

# 搜索质数
def is_prime(n):
    """判断是否为质数"""
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

# 查找范围内的质数
for num in range(2, 20):
    if is_prime(num):
        print(f"{num} 是质数")
else:
    print("质数查找完成")

# 文件搜索示例
files = ["document.txt", "image.jpg", "data.csv", "report.pdf"]
search_file = "config.ini"

for file in files:
    if file == search_file:
        print(f"找到文件: {file}")
        break
else:
    print(f"未找到文件: {search_file}")
```

## range() 函数

range() 函数用于生成一个整数序列，常用于 for 循环中。

### 语法

```python
range(stop)                    # 0 到 stop-1
range(start, stop)            # start 到 stop-1
range(start, stop, step)      # start 到 stop-1，步长为 step
```

### 示例

```python
# 基本用法
print("range(5):", list(range(5)))        # [0, 1, 2, 3, 4]
print("range(2, 6):", list(range(2, 6)))  # [2, 3, 4, 5]
print("range(1, 10, 2):", list(range(1, 10, 2)))  # [1, 3, 5, 7, 9]

# 在 for 循环中使用 range
# 打印 1 到 10 的数字
for i in range(1, 11):
    print(i, end=" ")
print()

# 打印乘法表
for i in range(1, 10):
    for j in range(1, i + 1):
        print(f"{j}×{i}={i*j}", end="\t")
    print()

# 反向遍历
for i in range(10, 0, -1):
    print(i, end=" ")
print()

# 生成偶数序列
even_numbers = list(range(0, 20, 2))
print("偶数:", even_numbers)

# 遍历列表索引
fruits = ["苹果", "香蕉", "橙子"]
for i in range(len(fruits)):
    print(f"索引 {i}: {fruits[i]}")
```

## break 和 continue 语句

### break 语句

break 语句用于完全终止循环，跳出循环体。

```python
# break 示例
for i in range(10):
    if i == 5:
        print("遇到 5，终止循环")
        break
    print(i, end=" ")
print("\n循环结束")

# 搜索第一个满足条件的元素
numbers = [3, 7, 2, 8, 1, 9, 4]
for num in numbers:
    if num > 5:
        print(f"找到第一个大于 5 的数: {num}")
        break
else:
    print("没有找到大于 5 的数")
```

### continue 语句

continue 语句用于跳过当前循环的剩余语句，直接进入下一次循环。

```python
# continue 示例
for i in range(10):
    if i % 2 == 0:  # 跳过偶数
        continue
    print(i, end=" ")  # 只打印奇数
print()

# 处理有效数据
data = [1, -2, 3, -4, 5, 0, 7]
positive_sum = 0

for num in data:
    if num <= 0:
        continue  # 跳过非正数
    positive_sum += num
    print(f"处理正数: {num}")

print(f"正数和: {positive_sum}")

# 跳过特定字符
message = "Hello, World! How are you?"
for char in message:
    if char in [",", "!", "?", " "]:
        continue
    print(char, end="")
print()
```

### break 和 continue 的组合使用

```python
# 综合示例
numbers = []
while True:
    user_input = input("请输入数字 (输入 'done' 结束): ")
    
    if user_input == "done":
        break
    
    if not user_input.isdigit():
        print("请输入有效的数字")
        continue
    
    num = int(user_input)
    if num < 0:
        print("请输入正数")
        continue
    
    numbers.append(num)
    print(f"已添加数字: {num}")

print(f"输入的数字列表: {numbers}")
if numbers:
    print(f"最大值: {max(numbers)}")
    print(f"最小值: {min(numbers)}")
    print(f"平均值: {sum(numbers)/len(numbers):.2f}")
```

## 循环中的 else 子句

循环中的 else 子句在循环正常结束时执行（即没有被 break 中断）。

### 语法

```python
for variable in iterable:
    # 循环体
    if condition:
        break
else:
    # 循环正常结束时执行
    statements

# 或者
while condition:
    # 循环体
    if condition:
        break
else:
    # 循环正常结束时执行
    statements
```

### 示例

```python
# 质数判断优化
for num in range(2, 20):
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            print(f"{num} 不是质数")
            break
    else:
        print(f"{num} 是质数")

# 文件扩展名检查
files = ["document.txt", "image.jpg", "data.csv", "report.pdf"]
allowed_extensions = [".txt", ".csv", ".pdf"]

for file in files:
    if not any(file.endswith(ext) for ext in allowed_extensions):
        print(f"文件 {file} 的扩展名不被允许")
        break
else:
    print("所有文件的扩展名都符合要求")

# 密码强度检查
password = "Secure123!"
requirements = [
    (lambda p: len(p) >= 8, "密码长度至少8位"),
    (lambda p: any(c.isupper() for c in p), "包含大写字母"),
    (lambda p: any(c.islower() for c in p), "包含小写字母"),
    (lambda p: any(c.isdigit() for c in p), "包含数字"),
    (lambda p: any(not c.isalnum() for c in p), "包含特殊字符")
]

for check, message in requirements:
    if not check(password):
        print(f"密码不符合要求: {message}")
        break
else:
    print("密码强度符合所有要求")
```

## pass 语句

pass 语句是空语句，用于保持程序结构的完整性，不做任何操作。

### 语法

```python
pass
```

### 示例

```python
# pass 的基本用法
for i in range(5):
    if i == 2:
        pass  # 什么都不做，继续执行
    print(i, end=" ")
print()

# 占位符使用
def calculate_area(shape, *args):
    """计算不同形状的面积（待实现）"""
    pass  # 先定义函数结构，稍后实现

class DatabaseConnection:
    """数据库连接类（待实现）"""
    def connect(self):
        pass
    
    def disconnect(self):
        pass
    
    def execute_query(self, query):
        pass

# 条件判断中的 pass
age = 25
if age < 18:
    print("未成年人")
elif 18 <= age < 60:
    pass  # 成年人，暂时不需要特殊处理
else:
    print("老年人")

# 循环中的 pass
numbers = [1, 2, 3, 4, 5]
for num in numbers:
    if num % 2 == 0:
        print(f"偶数: {num}")
    else:
        pass  # 奇数暂时不处理
```

## 嵌套循环

循环可以嵌套使用，用于处理多维数据或复杂逻辑。

### 示例

```python
# 嵌套 for 循环 - 乘法表
print("乘法表:")
for i in range(1, 10):
    for j in range(1, i + 1):
        print(f"{j}×{i}={i*j}", end="\t")
    print()

# 嵌套 while 循环
print("\n坐标网格:")
x = 1
while x <= 3:
    y = 1
    while y <= 3:
        print(f"({x},{y})", end=" ")
        y += 1
    print()
    x += 1

# 矩阵转置
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

print("\n原矩阵:")
for row in matrix:
    print(row)

print("\n转置矩阵:")
for i in range(len(matrix[0])):
    for j in range(len(matrix)):
        print(matrix[j][i], end=" ")
    print()

# break 在嵌套循环中的使用
print("\n搜索二维数组:")
array_2d = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

search_value = 5
found = False

for i, row in enumerate(array_2d):
    for j, value in enumerate(row):
        if value == search_value:
            print(f"找到 {search_value} 在位置 ({i}, {j})")
            found = True
            break  # 只跳出内层循环
    if found:
        break  # 跳出外层循环
```

## 实际应用示例

### 学生成绩管理系统

```python
# 学生成绩管理系统
students = [
    {"name": "张三", "scores": [85, 92, 78]},
    {"name": "李四", "scores": [76, 88, 95]},
    {"name": "王五", "scores": [90, 87, 93]}
]

# 计算每个学生的平均分
for student in students:
    total = 0
    count = 0
    
    for score in student["scores"]:
        total += score
        count += 1
    
    average = total / count if count > 0 else 0
    student["average"] = average
    print(f"{student['name']} 的平均分: {average:.2f}")

# 查找最高分学生
max_average = 0
best_student = None

for student in students:
    if student["average"] > max_average:
        max_average = student["average"]
        best_student = student["name"]

print(f"\n最高分学生: {best_student}, 平均分: {max_average:.2f}")
```

### 文件内容处理

```python
# 模拟文件内容处理
file_content = """
第一行: 这是第一行的内容
第二行: 这是第二行的内容，包含重要信息
第三行: 这是第三行的内容
第四行: 这是第四行的内容，包含关键词
第五行: 这是第五行的内容
"""

# 按行处理文件内容
lines = file_content.strip().split('\n')
keyword = "重要信息"

print("文件内容分析:")
for i, line in enumerate(lines, 1):
    if keyword in line:
        print(f"第{i}行: ★ {line}")
    else:
        print(f"第{i}行: {line}")

# 统计行数和字符数
total_lines = 0
total_chars = 0

for line in lines:
    total_lines += 1
    total_chars += len(line)

print(f"\n统计信息:")
print(f"总行数: {total_lines}")
print(f"总字符数: {total_chars}")
print(f"平均每行字符数: {total_chars/total_lines:.1f}")
```

### 猜数字游戏

```python
import random

# 猜数字游戏
def guess_number():
    target = random.randint(1, 100)
    attempts = 0
    max_attempts = 7
    
    print("=== 猜数字游戏 ===")
    print(f"我已经想好了一个 1-100 之间的数字，你有 {max_attempts} 次机会猜中它！")
    
    while attempts < max_attempts:
        attempts += 1
        remaining = max_attempts - attempts
        
        try:
            guess = int(input(f"\n第{attempts}次尝试 (剩余{remaining}次): ")
        except ValueError:
            print("请输入有效的数字！")
            continue
        
        if guess < target:
            print("太小了！")
        elif guess > target:
            print("太大了！")
        else:
            print(f"恭喜！你在第{attempts}次猜中了数字 {target}！")
            break
    else:
        print(f"很遗憾，机会用完了。正确答案是 {target}")

# 运行游戏
guess_number()
```

