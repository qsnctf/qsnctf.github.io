# Python 装饰器

## 概述

装饰器（Decorators）是 Python 中一种强大的高级功能，它允许你在不修改原函数或类代码的情况下，动态地修改或增强其行为。装饰器本质上是一个函数（或类），它接受一个函数（或类）作为参数，并返回一个新的函数（或类）。

### 什么是装饰器？

装饰器是：
- **高阶函数**：接受函数作为参数并返回函数的函数
- **语法糖**：使用 `@decorator` 语法简化函数包装
- **元编程工具**：在运行时修改函数或类的行为
- **代码复用机制**：实现横切关注点的分离

## 装饰器的基本语法

### 1. 函数装饰器基本语法

```python
@decorator
def target_function():
    pass
```

等价于：

```python
def target_function():
    pass

target_function = decorator(target_function)
```

### 2. 装饰器的实现原理

装饰器本质上是一个高阶函数：

```python
def my_decorator(func):
    def wrapper():
        # 在调用原函数前的操作
        print("函数调用前")
        
        # 调用原函数
        result = func()
        
        # 在调用原函数后的操作
        print("函数调用后")
        
        return result
    
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# 输出:
# 函数调用前
# Hello!
# 函数调用后
```

## 使用装饰器

### 1. 基本装饰器示例

#### 计时装饰器

```python
import time

def timer_decorator(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"函数 {func.__name__} 执行时间: {end_time - start_time:.4f} 秒")
        return result
    return wrapper

@timer_decorator
def slow_function():
    time.sleep(1)
    return "完成"

result = slow_function()
print(result)
# 输出:
# 函数 slow_function 执行时间: 1.0010 秒
# 完成
```

#### 日志装饰器

```python
def logger_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"调用函数: {func.__name__}")
        print(f"参数: args={args}, kwargs={kwargs}")
        result = func(*args, **kwargs)
        print(f"返回值: {result}")
        return result
    return wrapper

@logger_decorator
def add_numbers(a, b):
    return a + b

result = add_numbers(3, 5)
# 输出:
# 调用函数: add_numbers
# 参数: args=(3, 5), kwargs={}
# 返回值: 8
```

#### 缓存装饰器

```python
def cache_decorator(func):
    cache = {}
    
    def wrapper(*args):
        if args in cache:
            print(f"缓存命中: {args}")
            return cache[args]
        
        result = func(*args)
        cache[args] = result
        print(f"计算结果: {args} -> {result}")
        return result
    
    return wrapper

@cache_decorator
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(5))
# 输出:
# 计算结果: (1,) -> 1
# 计算结果: (0,) -> 0
# 计算结果: (2,) -> 1
# 计算结果: (3,) -> 2
# 计算结果: (4,) -> 3
# 计算结果: (5,) -> 5
# 5
```

### 2. 保留原函数信息

使用 `functools.wraps` 保留原函数的元信息：

```python
import functools

def preserve_info_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@preserve_info_decorator
def example_function():
    """这是一个示例函数"""
    pass

print(example_function.__name__)    # example_function
print(example_function.__doc__)     # 这是一个示例函数
```

## 带参数的装饰器

### 1. 三层嵌套装饰器

带参数的装饰器需要三层嵌套函数：

```python
def repeat_decorator(times):
    """重复执行函数的装饰器"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            results = []
            for i in range(times):
                print(f"第 {i+1} 次执行:")
                result = func(*args, **kwargs)
                results.append(result)
            return results
        return wrapper
    return decorator

@repeat_decorator(3)
def greet(name):
    return f"Hello, {name}!"

results = greet("Alice")
print(results)
# 输出:
# 第 1 次执行:
# 第 2 次执行:
# 第 3 次执行:
# ['Hello, Alice!', 'Hello, Alice!', 'Hello, Alice!']
```

### 2. 条件装饰器

```python
def conditional_decorator(condition=True):
    """根据条件决定是否应用装饰器"""
    def decorator(func):
        if condition:
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                print("装饰器生效")
                return func(*args, **kwargs)
            return wrapper
        else:
            return func  # 直接返回原函数
    return decorator

@conditional_decorator(condition=True)
def function_with_decorator():
    print("函数执行")

@conditional_decorator(condition=False)
def function_without_decorator():
    print("函数执行")

function_with_decorator()
# 输出:
# 装饰器生效
# 函数执行

function_without_decorator()
# 输出:
# 函数执行
```

### 3. 配置化装饰器

```python
def configurable_logger(level="INFO"):
    """可配置日志级别的装饰器"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            print(f"[{level}] 调用函数: {func.__name__}")
            result = func(*args, **kwargs)
            print(f"[{level}] 函数完成: {func.__name__}")
            return result
        return wrapper
    return decorator

@configurable_logger(level="DEBUG")
def debug_function():
    print("调试函数执行")

@configurable_logger(level="ERROR")
def error_function():
    print("错误函数执行")

debug_function()
# 输出:
# [DEBUG] 调用函数: debug_function
# 调试函数执行
# [DEBUG] 函数完成: debug_function

error_function()
# 输出:
# [ERROR] 调用函数: error_function
# 错误函数执行
# [ERROR] 函数完成: error_function
```

## 类装饰器

### 1. 函数形式的类装饰器

```python
def class_decorator(cls):
    """为类添加新方法和属性"""
    
    # 添加类属性
    cls.version = "1.0"
    
    # 添加类方法
    @classmethod
    def get_version(cls):
        return f"版本: {cls.version}"
    
    cls.get_version = get_version
    
    # 添加实例方法
    def new_method(self):
        return f"这是新方法，类名: {self.__class__.__name__}"
    
    cls.new_method = new_method
    
    return cls

@class_decorator
class MyClass:
    def __init__(self, name):
        self.name = name
    
    def greet(self):
        return f"Hello, {self.name}"

# 使用装饰后的类
obj = MyClass("Alice")
print(obj.greet())          # Hello, Alice
print(obj.new_method())     # 这是新方法，类名: MyClass
print(MyClass.get_version()) # 版本: 1.0
print(MyClass.version)      # 1.0
```

### 2. 类形式的类装饰器（实现 `__call__` 方法）

```python
class ClassDecorator:
    """类形式的装饰器"""
    
    def __init__(self, func):
        self.func = func
        self.call_count = 0
    
    def __call__(self, *args, **kwargs):
        self.call_count += 1
        print(f"函数 {self.func.__name__} 第 {self.call_count} 次调用")
        return self.func(*args, **kwargs)

@ClassDecorator
def say_hello(name):
    return f"Hello, {name}!"

print(say_hello("Alice"))
print(say_hello("Bob"))
# 输出:
# 函数 say_hello 第 1 次调用
# Hello, Alice!
# 函数 say_hello 第 2 次调用
# Hello, Bob!
```

### 3. 带参数的类装饰器

```python
class ConfigurableClassDecorator:
    """带参数的类装饰器"""
    
    def __init__(self, prefix=""):
        self.prefix = prefix
    
    def __call__(self, cls):
        class WrappedClass(cls):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, **kwargs)
                self.prefix = self.prefix
            
            def decorated_greet(self):
                original_greet = super().greet()
                return f"{self.prefix} {original_greet}"
        
        WrappedClass.__name__ = cls.__name__
        WrappedClass.prefix = self.prefix
        
        return WrappedClass

@ConfigurableClassDecorator(prefix="[装饰器]")
class Person:
    def __init__(self, name):
        self.name = name
    
    def greet(self):
        return f"Hello, {self.name}"

person = Person("Alice")
print(person.greet())           # Hello, Alice
print(person.decorated_greet()) # [装饰器] Hello, Alice
```

## 内置装饰器

### 1. `@staticmethod`

静态方法，不需要实例化类即可调用：

```python
class MathUtils:
    @staticmethod
    def add(a, b):
        return a + b
    
    @staticmethod
    def multiply(a, b):
        return a * b

# 不需要实例化即可调用
print(MathUtils.add(3, 5))        # 8
print(MathUtils.multiply(3, 5))   # 15
```

### 2. `@classmethod`

类方法，第一个参数是类本身：

```python
class Person:
    species = "人类"
    count = 0
    
    def __init__(self, name):
        self.name = name
        Person.count += 1
    
    @classmethod
    def get_species(cls):
        return cls.species
    
    @classmethod
    def get_count(cls):
        return f"已创建 {cls.count} 个{cls.species}实例"
    
    @classmethod
    def create_anonymous(cls):
        """工厂方法：创建匿名人物"""
        return cls("匿名")

print(Person.get_species())  # 人类

p1 = Person("Alice")
p2 = Person("Bob")
print(Person.get_count())    # 已创建 2 个人类实例

anonymous = Person.create_anonymous()
print(anonymous.name)        # 匿名
```

### 3. `@property`

将方法转换为属性，实现getter：

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        """半径的getter"""
        return self._radius
    
    @property
    def diameter(self):
        """直径（计算属性）"""
        return self._radius * 2
    
    @property
    def area(self):
        """面积（计算属性）"""
        return 3.14159 * self._radius ** 2

circle = Circle(5)
print(f"半径: {circle.radius}")      # 半径: 5
print(f"直径: {circle.diameter}")    # 直径: 10
print(f"面积: {circle.area:.2f}")    # 面积: 78.54
```

### 4. Setter 和 Deleter

```python
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius
    
    @property
    def celsius(self):
        """摄氏温度"""
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("温度不能低于绝对零度")
        self._celsius = value
    
    @celsius.deleter
    def celsius(self):
        print("删除温度值")
        self._celsius = 0
    
    @property
    def fahrenheit(self):
        """华氏温度（计算属性）"""
        return self._celsius * 9/5 + 32

temp = Temperature(25)
print(f"摄氏温度: {temp.celsius}°C")        # 摄氏温度: 25°C
print(f"华氏温度: {temp.fahrenheit}°F")    # 华氏温度: 77.0°F

temp.celsius = 30  # 使用setter
print(f"新温度: {temp.celsius}°C")          # 新温度: 30°C

del temp.celsius   # 使用deleter
print(f"重置后: {temp.celsius}°C")          # 重置后: 0°C
```

### 5. `@abstractmethod`

抽象方法，用于定义接口：

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    """抽象基类：形状"""
    
    @abstractmethod
    def area(self):
        """计算面积"""
        pass
    
    @abstractmethod
    def perimeter(self):
        """计算周长"""
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14159 * self.radius ** 2
    
    def perimeter(self):
        return 2 * 3.14159 * self.radius

# 使用具体类
rect = Rectangle(4, 5)
print(f"矩形面积: {rect.area()}")        # 矩形面积: 20

circle = Circle(3)
print(f"圆形周长: {circle.perimeter():.2f}")  # 圆形周长: 18.85

# 不能实例化抽象类
# shape = Shape()  # 会报错
```

## 多个装饰器的堆叠

### 1. 装饰器执行顺序

装饰器从下往上执行：

```python
def decorator1(func):
    def wrapper():
        print("装饰器1 - 前")
        result = func()
        print("装饰器1 - 后")
        return result
    return wrapper

def decorator2(func):
    def wrapper():
        print("装饰器2 - 前")
        result = func()
        print("装饰器2 - 后")
        return result
    return wrapper

@decorator1
@decorator2
def my_function():
    print("原函数执行")

my_function()
# 输出:
# 装饰器1 - 前
# 装饰器2 - 前
# 原函数执行
# 装饰器2 - 后
# 装饰器1 - 后
```

等价于：

```python
my_function = decorator1(decorator2(my_function))
```

### 2. 实际应用：组合多个功能

```python
import functools
import time

def timer(func):
    """计时装饰器"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"⏱️  执行时间: {end - start:.4f}秒")
        return result
    return wrapper

def logger(func):
    """日志装饰器"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"📝 调用函数: {func.__name__}")
        print(f"   参数: {args} {kwargs}")
        result = func(*args, **kwargs)
        print(f"   结果: {result}")
        return result
    return wrapper

def retry(max_attempts=3, delay=1):
    """重试装饰器"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"🔄 第 {attempt + 1} 次尝试失败: {e}")
                    if attempt < max_attempts - 1:
                        time.sleep(delay)
                    else:
                        raise
            return None
        return wrapper
    return decorator

# 组合使用多个装饰器
@timer
@logger
@retry(max_attempts=2, delay=0.5)
def risky_operation(x, y):
    """有风险的数学运算"""
    if x < 0:
        raise ValueError("x不能为负数")
    return x * y

# 测试
result = risky_operation(5, 3)
print(f"最终结果: {result}")

print("\n--- 测试失败情况 ---")
result = risky_operation(-1, 3)  # 会触发重试
```

### 3. 类方法的装饰器堆叠

```python
class DataProcessor:
    def __init__(self, data):
        self.data = data
    
    @classmethod
    @logger
    def create_from_list(cls, data_list):
        """从列表创建实例"""
        return cls(data_list)
    
    @property
    @timer
    def processed_data(self):
        """处理数据（带计时）"""
        time.sleep(0.5)  # 模拟处理时间
        return [x * 2 for x in self.data]

# 使用
processor = DataProcessor.create_from_list([1, 2, 3])
print(f"处理后的数据: {processor.processed_data}")
```

## 实际应用场景

### 1. Web 框架中的路由装饰器

```python
# 模拟 Flask 风格的路由装饰器
class Router:
    def __init__(self):
        self.routes = {}
    
    def route(self, path):
        def decorator(func):
            self.routes[path] = func
            return func
        return decorator
    
    def handle_request(self, path):
        if path in self.routes:
            return self.routes[path]()
        else:
            return "404 Not Found"

router = Router()

@router.route("/")
def home():
    return "首页"

@router.route("/about")
def about():
    return "关于我们"

@router.route("/contact")
def contact():
    return "联系我们"

# 测试路由
print(router.handle_request("/"))        # 首页
print(router.handle_request("/about"))   # 关于我们
print(router.handle_request("/admin"))   # 404 Not Found
```

### 2. 权限验证装饰器

```python
class User:
    def __init__(self, username, role):
        self.username = username
        self.role = role

def require_permission(permission):
    """权限验证装饰器"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(user, *args, **kwargs):
            if user.role != permission:
                raise PermissionError(f"用户 {user.username} 没有 {permission} 权限")
            return func(user, *args, **kwargs)
        return wrapper
    return decorator

class AdminPanel:
    @require_permission("admin")
    def delete_user(self, user, target_user):
        return f"用户 {target_user} 已被删除"
    
    @require_permission("moderator")
    def edit_post(self, user, post_id):
        return f"帖子 {post_id} 已编辑"
    
    @require_permission("user")
    def view_profile(self, user, profile_id):
        return f"查看用户 {profile_id} 的资料"

# 测试
admin = User("admin_user", "admin")
moderator = User("mod_user", "moderator")
user = User("normal_user", "user")

panel = AdminPanel()

print(panel.delete_user(admin, "bad_user"))     # 用户 bad_user 已被删除
print(panel.edit_post(moderator, 123))          # 帖子 123 已编辑
print(panel.view_profile(user, 456))            # 查看用户 456 的资料

# 测试权限不足
try:
    panel.delete_user(user, "bad_user")
except PermissionError as e:
    print(f"权限错误: {e}")
```

### 3. 数据库事务装饰器

```python
import sqlite3

def transaction_decorator(db_path):
    """数据库事务装饰器"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            conn = sqlite3.connect(db_path)
            try:
                result = func(conn, *args, **kwargs)
                conn.commit()
                print("✅ 事务提交成功")
                return result
            except Exception as e:
                conn.rollback()
                print(f"❌ 事务回滚: {e}")
                raise
            finally:
                conn.close()
        return wrapper
    return decorator

@transaction_decorator("example.db")
def create_user_table(conn):
    """创建用户表"""
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    """)
    return "用户表创建成功"

@transaction_decorator("example.db")
def add_user(conn, name, email):
    """添加用户"""
    conn.execute("INSERT INTO users (name, email) VALUES (?, ?)", (name, email))
    return f"用户 {name} 添加成功"

# 使用
create_user_table()
add_user("Alice", "alice@example.com")
add_user("Bob", "bob@example.com")
```

## 装饰器的最佳实践

### 1. 使用 `functools.wraps`

始终使用 `@functools.wraps` 保留原函数的元信息：

```python
import functools

def good_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
```

### 2. 保持装饰器简单

装饰器应该专注于单一职责：

```python
# 好的做法：单一职责
def log_call(func):
    """只负责日志记录"""
    pass

def measure_time(func):
    """只负责时间测量"""
    pass

# 不好的做法：功能混杂
def complex_decorator(func):
    """混杂了日志、计时、缓存等多种功能"""
    pass
```

### 3. 提供清晰的文档

为装饰器编写详细的文档字符串：

```python
def rate_limit(max_calls, period):
    """
    限流装饰器
    
    Args:
        max_calls: 在指定时间段内允许的最大调用次数
        period: 时间段（秒）
    
    Example:
        @rate_limit(max_calls=5, period=60)
        def api_call():
            pass
    """
    pass
```

### 4. 处理异常情况

装饰器应该妥善处理异常：

```python
def safe_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            print(f"函数 {func.__name__} 执行出错: {e}")
            # 可以选择重新抛出异常或返回默认值
            raise
    return wrapper
```

## 总结

Python 装饰器是一种强大的元编程工具，它允许你：

### 主要优点
1. **代码复用**：实现横切关注点的分离
2. **动态修改**：在运行时改变函数或类的行为
3. **语法简洁**：使用 `@decorator` 语法糖
4. **功能强大**：支持参数化、类装饰器等多种形式

### 核心概念
- **函数装饰器**：最基本的装饰器形式
- **带参数装饰器**：三层嵌套结构
- **类装饰器**：修改类行为的装饰器
- **内置装饰器**：`@staticmethod`, `@classmethod`, `@property` 等
- **装饰器堆叠**：多个装饰器的组合使用

### 使用建议
1. **适度使用**：不要过度使用装饰器，避免代码难以理解
2. **保持简单**：每个装饰器应该专注于单一功能
3. **保留元信息**：使用 `functools.wraps`
4. **编写文档**：为复杂的装饰器提供清晰的文档

通过合理使用装饰器，你可以编写出更加模块化、可维护和可扩展的 Python 代码。