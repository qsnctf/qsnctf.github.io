# Python 基本运算符

## 1. 运算符概述

Python 语言支持多种类型的运算符，用于对变量和值进行各种操作。运算符是编程语言中用于执行特定操作的符号或关键字。

## 2. 算术运算符

算术运算符用于执行基本的数学运算。

### 基本算术运算符
```python
# 加法 +
a = 10
b = 3
print(a + b)  # 13

# 减法 -
print(a - b)  # 7

# 乘法 *
print(a * b)  # 30

# 除法 /
print(a / b)  # 3.3333333333333335

# 取模 %
print(a % b)  # 1

# 幂运算 **
print(a ** b)  # 1000

# 取整除 //
print(a // b)  # 3
```

### 算术运算符的特殊用法
```python
# 字符串连接
str1 = "Hello"
str2 = "World"
print(str1 + " " + str2)  # Hello World

# 字符串重复
print("Python" * 3)  # PythonPythonPython

# 列表连接
list1 = [1, 2, 3]
list2 = [4, 5, 6]
print(list1 + list2)  # [1, 2, 3, 4, 5, 6]

# 列表重复
print([0] * 5)  # [0, 0, 0, 0, 0]
```

## 3. 比较（关系）运算符

比较运算符用于比较两个值，返回布尔值（True 或 False）。

### 基本比较运算符
```python
a = 10
b = 5

# 等于 ==
print(a == b)  # False

# 不等于 !=
print(a != b)  # True

# 大于 >
print(a > b)   # True

# 小于 <
print(a < b)   # False

# 大于等于 >=
print(a >= b)  # True

# 小于等于 <=
print(a <= b)  # False
```

### 字符串比较
```python
# 字符串按字典序比较
print("apple" < "banana")  # True
print("cat" > "dog")       # False
print("hello" == "hello")  # True
print("Hello" == "hello")  # False（区分大小写）
```

### 链式比较
```python
# Python 支持链式比较
x = 5
print(1 < x < 10)     # True
print(1 < x < 3)      # False
print(1 < x < 10 < 20)  # True

# 等价于
print(1 < x and x < 10)  # True
```

## 4. 赋值运算符

赋值运算符用于给变量赋值。

### 基本赋值运算符
```python
# 简单赋值 =
x = 10
print(x)  # 10

# 多重赋值
a = b = c = 5
print(a, b, c)  # 5 5 5

# 序列解包
x, y, z = 1, 2, 3
print(x, y, z)  # 1 2 3

# 交换变量值
x, y = 10, 20
x, y = y, x
print(x, y)  # 20 10
```

### 复合赋值运算符
```python
x = 10

# 加法赋值 += 
x += 5      # 等价于 x = x + 5
print(x)    # 15

# 减法赋值 -=
x -= 3      # 等价于 x = x - 3
print(x)    # 12

# 乘法赋值 *=
x *= 2      # 等价于 x = x * 2
print(x)    # 24

# 除法赋值 /=
x /= 4      # 等价于 x = x / 4
print(x)    # 6.0

# 取模赋值 %=
x %= 4      # 等价于 x = x % 4
print(x)    # 2.0

# 幂赋值 **=
x **= 3     # 等价于 x = x ** 3
print(x)    # 8.0

# 取整除赋值 //=
x //= 3     # 等价于 x = x // 3
print(x)    # 2.0
```

### 复合赋值运算符的特殊用法
```python
# 字符串操作
s = "Hello"
s += " World"
print(s)  # Hello World

# 列表操作
lst = [1, 2, 3]
lst += [4, 5]
print(lst)  # [1, 2, 3, 4, 5]

lst *= 2
print(lst)  # [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]
```

## 5. 逻辑运算符

逻辑运算符用于组合条件语句。

### 基本逻辑运算符
```python
x = True
y = False

# 与运算 and
print(x and y)  # False
print(x and x)  # True

# 或运算 or
print(x or y)   # True
print(y or y)   # False

# 非运算 not
print(not x)    # False
print(not y)    # True
```

### 逻辑运算符的短路特性
```python
# and 运算符：如果第一个操作数为False，直接返回False，不计算第二个操作数
def false_func():
    print("false_func被调用")
    return False

def true_func():
    print("true_func被调用")
    return True

print("测试and短路:")
result = false_func() and true_func()  # 只调用false_func
print(f"结果: {result}")

print("\n测试or短路:")
result = true_func() or false_func()   # 只调用true_func
print(f"结果: {result}")
```

### 逻辑运算符的实际应用
```python
# 条件判断
age = 25
has_license = True

if age >= 18 and has_license:
    print("可以开车")
else:
    print("不能开车")

# 默认值设置
name = ""
display_name = name or "匿名用户"
print(display_name)  # 匿名用户

# 多重条件
score = 85
if score >= 90:
    grade = "A"
elif score >= 80 and score < 90:
    grade = "B"
elif score >= 70 and score < 80:
    grade = "C"
else:
    grade = "D"
print(f"成绩等级: {grade}")
```

## 6. 位运算符

位运算符用于对整数进行二进制位操作。

### 基本位运算符
```python
a = 60      # 60 = 0011 1100
b = 13      # 13 = 0000 1101

# 按位与 &
print(a & b)   # 12 = 0000 1100

# 按位或 |
print(a | b)   # 61 = 0011 1101

# 按位异或 ^
print(a ^ b)   # 49 = 0011 0001

# 按位取反 ~
print(~a)      # -61 = 1100 0011（补码表示）

# 左移 <<
print(a << 2)  # 240 = 1111 0000

# 右移 >>
print(a >> 2)  # 15 = 0000 1111
```

### 位运算符的实际应用
```python
# 权限控制
READ_PERMISSION = 1    # 0001
WRITE_PERMISSION = 2   # 0010
EXECUTE_PERMISSION = 4 # 0100

# 设置权限
user_permissions = READ_PERMISSION | WRITE_PERMISSION
print(f"用户权限: {bin(user_permissions)}")  # 0b11

# 检查权限
can_read = user_permissions & READ_PERMISSION
print(f"可读权限: {bool(can_read)}")  # True

can_execute = user_permissions & EXECUTE_PERMISSION
print(f"可执行权限: {bool(can_execute)}")  # False

# 快速乘除2的幂次
num = 10
print(num << 1)  # 20（相当于乘以2）
print(num >> 1)  # 5（相当于除以2）

# 奇偶判断
number = 7
if number & 1:
    print("奇数")
else:
    print("偶数")
```

## 7. 成员运算符

成员运算符用于测试序列（如字符串、列表、元组、集合、字典）中是否包含某个成员。

### in 和 not in 运算符
```python
# 字符串
s = "Hello Python"
print('H' in s)        # True
print('hello' in s)    # False（区分大小写）
print('Python' in s)   # True

# 列表
fruits = ['apple', 'banana', 'orange']
print('apple' in fruits)      # True
print('grape' not in fruits)  # True

# 元组
numbers = (1, 2, 3, 4, 5)
print(3 in numbers)    # True
print(6 not in numbers)  # True

# 集合
colors = {'red', 'green', 'blue'}
print('red' in colors)    # True
print('yellow' in colors) # False

# 字典（检查键）
person = {'name': 'Alice', 'age': 25}
print('name' in person)     # True
print('Alice' in person)    # False（只检查键，不检查值）
print('age' not in person)  # False
```

### 成员运算符的实际应用
```python
# 输入验证
valid_colors = ['red', 'green', 'blue', 'yellow', 'purple']
user_color = input("请输入颜色: ")

if user_color.lower() in valid_colors:
    print("颜色有效")
else:
    print("无效颜色")

# 过滤数据
data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = [x for x in data if x % 2 == 0]
print(f"偶数: {even_numbers}")

# 检查子字符串
text = "Python是一种强大的编程语言"
keywords = ["Python", "编程", "强大"]

for keyword in keywords:
    if keyword in text:
        print(f"找到关键词: {keyword}")
```

## 8. 身份运算符

身份运算符用于比较两个对象的内存地址（是否指向同一个对象）。

### is 和 is not 运算符
```python
# 基本使用
a = [1, 2, 3]
b = a          # b指向同一个对象
c = [1, 2, 3]  # c指向不同的对象（内容相同）

print(a is b)      # True
print(a is c)      # False
print(a is not c)  # True

# 小整数缓存（Python对小整数有优化）
x = 256
y = 256
print(x is y)  # True（小整数缓存）

x = 257
y = 257
print(x is y)  # False（超出缓存范围）

# 字符串驻留
s1 = "hello"
s2 = "hello"
print(s1 is s2)  # True（字符串驻留）

s3 = "hello world"
s4 = "hello world"
print(s3 is s4)  # False（较长的字符串不驻留）
```

### 身份运算符与比较运算符的区别
```python
# == 比较值，is 比较身份（内存地址）
list1 = [1, 2, 3]
list2 = [1, 2, 3]
list3 = list1

print("值比较:")
print(list1 == list2)  # True（值相同）
print(list1 == list3)  # True（值相同）

print("\n身份比较:")
print(list1 is list2)  # False（不同对象）
print(list1 is list3)  # True（同一对象）

print("\n内存地址:")
print(id(list1))
print(id(list2))
print(id(list3))
```

### 身份运算符的实际应用
```python
# 检查None
value = None
if value is None:
    print("值为空")

# 单例模式检查
def get_singleton():
    singleton = object()
    return singleton

instance1 = get_singleton()
instance2 = get_singleton()

print(instance1 is instance2)  # False（每次调用返回新对象）

# 检查可变对象是否被修改
def process_data(data):
    original_data = data
    # 处理数据...
    if data is original_data:
        print("数据未被修改")
    else:
        print("数据已被修改")

my_list = [1, 2, 3]
process_data(my_list)
```

## 9. 运算符优先级

运算符优先级决定了表达式中运算的执行顺序。

### 运算符优先级表（从高到低）

| 运算符 | 描述 |
|--------|------|
| `**` | 幂运算 |
| `~` `+` `-` | 按位取反、正号、负号 |
| `*` `/` `%` `//` | 乘、除、取模、取整除 |
| `+` `-` | 加、减 |
| `<<` `>>` | 左移、右移 |
| `&` | 按位与 |
| `^` `\|` | 按位异或、按位或 |
| `<=` `<` `>` `>=` | 比较运算符 |
| `==` `!=` | 等于、不等于 |
| `=` `%=` `/=` `//=` `-=` `+=` `*=` `**=` | 赋值运算符 |
| `is` `is not` | 身份运算符 |
| `in` `not in` | 成员运算符 |
| `not` | 逻辑非 |
| `and` | 逻辑与 |
| `or` | 逻辑或 |

### 优先级示例
```python
# 算术运算符优先级
result = 2 + 3 * 4 ** 2  # 等价于 2 + (3 * (4 ** 2))
print(result)  # 50

# 比较运算符优先级
x = 5
y = 10
z = 15
result = x < y <= z  # 等价于 (x < y) and (y <= z)
print(result)  # True

# 逻辑运算符优先级
a = True
b = False
c = True
result = not a or b and c  # 等价于 (not a) or (b and c)
print(result)  # False

# 使用括号改变优先级
result = (2 + 3) * 4 ** 2  # 先计算括号内的加法
print(result)  # 80

result = not (a or b) and c  # 先计算括号内的or运算
print(result)  # False
```

### 优先级最佳实践
```python
# 使用括号提高可读性
# 虽然知道优先级，但使用括号更清晰

# 不清晰的写法
result = a and b or c and not d or e

# 清晰的写法
result = (a and b) or (c and (not d)) or e

# 复杂表达式分解
# 复杂的数学表达式
def calculate_volume(radius, height):
    # 使用括号明确优先级
    volume = (4 / 3) * 3.14159 * (radius ** 3) + 3.14159 * (radius ** 2) * height
    return volume

# 条件判断
def check_eligibility(age, income, has_insurance):
    # 使用括号分组条件
    if (age >= 18 and age <= 65) and (income > 30000 or has_insurance):
        return "符合条件"
    else:
        return "不符合条件"
```

## 10. 综合应用示例

### 计算器程序
```python
class Calculator:
    """简单的计算器类"""
    
    def __init__(self):
        self.result = 0
    
    def add(self, x, y):
        """加法运算"""
        return x + y
    
    def subtract(self, x, y):
        """减法运算"""
        return x - y
    
    def multiply(self, x, y):
        """乘法运算"""
        return x * y
    
    def divide(self, x, y):
        """除法运算"""
        if y == 0:
            raise ValueError("除数不能为0")
        return x / y
    
    def power(self, x, y):
        """幂运算"""
        return x ** y
    
    def calculate(self, expression):
        """计算表达式"""
        # 简单的表达式解析（实际应用中应该使用更复杂的方法）
        try:
            # 使用eval计算表达式（注意安全风险）
            return eval(expression)
        except:
            return "表达式错误"

# 使用示例
calc = Calculator()

# 基本运算
print("加法:", calc.add(10, 5))
print("减法:", calc.subtract(10, 5))
print("乘法:", calc.multiply(10, 5))
print("除法:", calc.divide(10, 5))
print("幂运算:", calc.power(2, 3))

# 表达式计算
print("表达式:", calc.calculate("2 + 3 * 4"))
```

### 数据验证工具
```python
def validate_data(data):
    """数据验证函数"""
    errors = []
    
    # 检查数据类型
    if not isinstance(data, dict):
        errors.append("数据必须是字典类型")
        return errors
    
    # 检查必需字段
    required_fields = ['name', 'age', 'email']
    for field in required_fields:
        if field not in data:
            errors.append(f"缺少必需字段: {field}")
    
    # 验证年龄
    if 'age' in data:
        age = data['age']
        if not isinstance(age, int) or age <= 0 or age > 150:
            errors.append("年龄必须是1-150之间的整数")
    
    # 验证邮箱格式（简单验证）
    if 'email' in data:
        email = data['email']
        if '@' not in email or '.' not in email:
            errors.append("邮箱格式不正确")
    
    return errors

# 测试数据
test_data = {
    'name': 'Alice',
    'age': 25,
    'email': 'alice@example.com'
}

errors = validate_data(test_data)
if errors:
    print("验证错误:")
    for error in errors:
        print(f"- {error}")
else:
    print("数据验证通过")
```

## 总结

Python 提供了丰富的运算符来支持各种编程需求：

1. **算术运算符**：用于数学计算
2. **比较运算符**：用于值比较
3. **赋值运算符**：用于变量赋值
4. **逻辑运算符**：用于条件组合
5. **位运算符**：用于二进制位操作
6. **成员运算符**：用于序列成员检查
7. **身份运算符**：用于对象身份比较
8. **运算符优先级**：决定了运算的执行顺序

掌握这些运算符的使用方法和优先级规则，是编写高效、可读性强的Python代码的基础。在实际编程中，合理使用括号可以提高代码的可读性，避免因优先级问题导致的错误。