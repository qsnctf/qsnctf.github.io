# Python 条件控制语句

## 概述

Python 条件语句是通过一条或多条语句的执行结果（True 或者 False）来决定执行的代码块。条件控制是编程中的基本结构，用于根据不同的条件执行不同的代码路径。

## if 语句

### 基本语法

```python
if condition:
    # 条件为 True 时执行的代码块
    statement1
    statement2
    ...
```

### 示例

```python
# 简单的 if 语句
age = 18
if age >= 18:
    print("您已成年，可以进入")

# 使用比较运算符
score = 85
if score >= 60:
    print("及格")
```

## if-else 语句

### 语法

```python
if condition:
    # 条件为 True 时执行的代码块
    statements_if_true
else:
    # 条件为 False 时执行的代码块
    statements_if_false
```

### 示例

```python
# if-else 语句
temperature = 25
if temperature > 30:
    print("天气炎热")
else:
    print("天气适宜")

# 判断奇偶数
number = 7
if number % 2 == 0:
    print(f"{number} 是偶数")
else:
    print(f"{number} 是奇数")
```

## if-elif-else 语句

### 语法

```python
if condition1:
    # 条件1为 True 时执行
    statements1
elif condition2:
    # 条件2为 True 时执行
    statements2
elif condition3:
    # 条件3为 True 时执行
    statements3
else:
    # 所有条件都为 False 时执行
    statements_else
```

### 示例

```python
# 成绩等级判断
score = 85

if score >= 90:
    print("优秀")
elif score >= 80:
    print("良好")
elif score >= 70:
    print("中等")
elif score >= 60:
    print("及格")
else:
    print("不及格")

# 月份季节判断
month = 3
if month in [12, 1, 2]:
    season = "冬季"
elif month in [3, 4, 5]:
    season = "春季"
elif month in [6, 7, 8]:
    season = "夏季"
elif month in [9, 10, 11]:
    season = "秋季"
else:
    season = "无效月份"
print(f"{month}月是{season}")
```

## 比较运算符

Python 提供了多种比较运算符用于条件判断：

| 操作符 | 描述 | 示例 |
|--------|------|------|
| `<` | 小于 | `a < b` |
| `<=` | 小于或等于 | `a <= b` |
| `>` | 大于 | `a > b` |
| `>=` | 大于或等于 | `a >= b` |
| `==` | 等于，比较两个值是否相等 | `a == b` |
| `!=` | 不等于 | `a != b` |
| `is` | 对象身份比较 | `a is b` |
| `is not` | 对象身份不相等 | `a is not b` |
| `in` | 成员测试 | `a in list` |
| `not in` | 非成员测试 | `a not in list` |

### 比较运算符示例

```python
# 数值比较
a = 10
b = 20

print(a < b)    # True
print(a <= b)   # True
print(a > b)    # False
print(a >= b)   # False
print(a == b)   # False
print(a != b)   # True

# 字符串比较
name1 = "Alice"
name2 = "Bob"
print(name1 < name2)  # True (按字母顺序)

# 列表比较
list1 = [1, 2, 3]
list2 = [1, 2, 3]
print(list1 == list2)  # True (内容相同)
print(list1 is list2)  # False (不同对象)

# 成员测试
fruits = ["apple", "banana", "orange"]
print("apple" in fruits)     # True
print("grape" not in fruits) # True
```

## 逻辑运算符

逻辑运算符用于组合多个条件：

| 运算符 | 描述 | 示例 |
|--------|------|------|
| `and` | 逻辑与 | `a and b` |
| `or` | 逻辑或 | `a or b` |
| `not` | 逻辑非 | `not a` |

### 逻辑运算符示例

```python
# and 运算符
age = 25
has_license = True

if age >= 18 and has_license:
    print("可以开车")
else:
    print("不能开车")

# or 运算符
is_weekend = False
is_holiday = True

if is_weekend or is_holiday:
    print("休息日")
else:
    print("工作日")

# not 运算符
is_raining = False

if not is_raining:
    print("天气晴朗，适合外出")
else:
    print("下雨了，带伞")

# 复杂逻辑组合
score = 85
attendance = 0.9

if (score >= 60 and attendance >= 0.8) or score >= 90:
    print("通过考试")
else:
    print("需要补考")
```

## if 嵌套

可以在 if 语句内部嵌套另一个 if 语句：

### 语法

```python
if condition1:
    # 外层条件为 True
    if condition2:
        # 内层条件为 True
        statements_inner_if
    else:
        # 内层条件为 False
        statements_inner_else
else:
    # 外层条件为 False
    statements_outer_else
```

### 示例

```python
# 多层条件判断
age = 25
has_license = True
is_sober = True

if age >= 18:
    if has_license:
        if is_sober:
            print("可以安全驾驶")
        else:
            print("不能酒后驾驶")
    else:
        print("需要驾照")
else:
    print("年龄不足，不能驾驶")

# 登录系统示例
username = "admin"
password = "123456"

if username == "admin":
    if password == "123456":
        print("登录成功")
    else:
        print("密码错误")
else:
    print("用户名不存在")
```

## match...case 语句（Python 3.10+）

Python 3.10 引入了 `match...case` 语句，提供更简洁的模式匹配语法。

### 基本语法

```python
match value:
    case pattern1:
        # 匹配 pattern1 时执行
        statements1
    case pattern2:
        # 匹配 pattern2 时执行
        statements2
    case _:
        # 默认情况（类似 else）
        statements_default
```

### 示例

```python
# 简单的值匹配
def get_day_type(day):
    match day:
        case "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday":
            return "工作日"
        case "Saturday" | "Sunday":
            return "周末"
        case _:
            return "无效输入"

print(get_day_type("Monday"))    # 工作日
print(get_day_type("Sunday"))    # 周末
print(get_day_type("Holiday"))   # 无效输入

# 模式匹配与解构
def process_point(point):
    match point:
        case (0, 0):
            return "原点"
        case (x, 0):
            return f"X轴上的点: ({x}, 0)"
        case (0, y):
            return f"Y轴上的点: (0, {y})"
        case (x, y):
            return f"普通点: ({x}, {y})"
        case _:
            return "无效点"

print(process_point((0, 0)))     # 原点
print(process_point((5, 0)))     # X轴上的点: (5, 0)
print(process_point((0, 3)))     # Y轴上的点: (0, 3)
print(process_point((2, 4)))     # 普通点: (2, 4)

# 类型匹配
def process_data(data):
    match data:
        case int() if data > 0:
            return f"正整数: {data}"
        case int() if data < 0:
            return f"负整数: {data}"
        case float():
            return f"浮点数: {data}"
        case str():
            return f"字符串: {data}"
        case list():
            return f"列表长度: {len(data)}"
        case _:
            return "未知类型"

print(process_data(10))          # 正整数: 10
print(process_data(-5))          # 负整数: -5
print(process_data(3.14))        # 浮点数: 3.14
print(process_data("hello"))     # 字符串: hello
print(process_data([1, 2, 3]))   # 列表长度: 3
```

## 条件表达式（三元运算符）

Python 提供了简洁的条件表达式语法：

### 语法

```python
value_if_true if condition else value_if_false
```

### 示例

```python
# 传统 if-else
age = 20
if age >= 18:
    status = "成年"
else:
    status = "未成年"

# 条件表达式
status = "成年" if age >= 18 else "未成年"

# 更多示例
score = 85
grade = "优秀" if score >= 90 else "良好" if score >= 80 else "及格" if score >= 60 else "不及格"
print(f"成绩: {score}, 等级: {grade}")

# 在函数中使用
def get_max(a, b):
    return a if a > b else b

print(get_max(10, 20))  # 20
```

## 实际应用示例

### 用户输入验证

```python
# 用户输入验证
def validate_user_input(username, password):
    if not username or not password:
        return "用户名和密码不能为空"
    elif len(username) < 3:
        return "用户名至少3个字符"
    elif len(password) < 6:
        return "密码至少6个字符"
    elif " " in username:
        return "用户名不能包含空格"
    else:
        return "验证通过"

print(validate_user_input("admin", "123456"))     # 验证通过
print(validate_user_input("ad", "123456"))        # 用户名至少3个字符
print(validate_user_input("admin", "123"))        # 密码至少6个字符
```

### 成绩管理系统

```python
# 成绩管理系统
def calculate_grade(score, attendance):
    if attendance < 0.7:
        return "不及格（出勤率不足）"
    
    match score:
        case s if s >= 90:
            return "优秀"
        case s if s >= 80:
            return "良好"
        case s if s >= 70:
            return "中等"
        case s if s >= 60:
            return "及格"
        case _:
            return "不及格"

# 测试
grades = [
    (95, 0.9),  # 优秀
    (85, 0.8),  # 良好
    (75, 0.6),  # 不及格（出勤率不足）
    (55, 0.9)   # 不及格
]

for score, attendance in grades:
    result = calculate_grade(score, attendance)
    print(f"成绩: {score}, 出勤率: {attendance*100}% -> {result}")
```

### 购物车折扣系统

```python
# 购物车折扣系统
def calculate_discount(total_amount, is_vip=False, has_coupon=False):
    discount = 0
    
    if total_amount >= 1000:
        discount = 0.2  # 20% 折扣
    elif total_amount >= 500:
        discount = 0.1  # 10% 折扣
    elif total_amount >= 200:
        discount = 0.05 # 5% 折扣
    
    # VIP 额外折扣
    if is_vip:
        discount += 0.05
    
    # 优惠券折扣
    if has_coupon:
        discount += 0.1
    
    # 折扣上限
    discount = min(discount, 0.3)
    
    final_amount = total_amount * (1 - discount)
    return final_amount, discount * 100

# 测试
orders = [
    (1500, True, True),   # 大额订单 + VIP + 优惠券
    (800, False, True),   # 中等订单 + 优惠券
    (300, True, False),   # 小额订单 + VIP
    (100, False, False)   # 小订单
]

for amount, vip, coupon in orders:
    final, discount = calculate_discount(amount, vip, coupon)
    print(f"原价: {amount}, 折扣: {discount:.1f}%, 实付: {final:.2f}")
```
