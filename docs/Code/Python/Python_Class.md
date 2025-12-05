# Python 面向对象编程详解

## 1. 面向对象编程概述

### 什么是面向对象编程

面向对象编程（Object-Oriented Programming，OOP）是一种编程范式，它使用"对象"来设计软件和应用程序。Python 是一种支持面向对象编程的语言，提供了类、对象、继承、多态等核心概念。

### 面向对象编程的核心概念

- **类(Class)**：用来描述具有相同的属性和方法的对象的集合
- **对象(Object)**：类的实例，包含数据成员（属性）和方法
- **封装(Encapsulation)**：将数据和方法包装在类中，隐藏实现细节
- **继承(Inheritance)**：子类继承父类的属性和方法
- **多态(Polymorphism)**：同一操作作用于不同对象，可以有不同的解释

## 2. 类(Class)和对象(Object)

### 类定义

```python
# 定义一个简单的类
class Person:
    """这是一个人类"""
    
    # 类变量（所有实例共享）
    species = "Homo sapiens"
    
    def __init__(self, name, age):
        """构造函数，初始化实例变量"""
        self.name = name      # 实例变量
        self.age = age        # 实例变量
    
    def introduce(self):
        """实例方法"""
        return f"我叫{self.name}，今年{self.age}岁"
    
    @classmethod
    def get_species(cls):
        """类方法"""
        return f"人类属于{cls.species}物种"
    
    @staticmethod
    def is_adult(age):
        """静态方法"""
        return age >= 18

# 创建对象（实例化）
person1 = Person("张三", 25)
person2 = Person("李四", 30)

print(person1.introduce())  # 我叫张三，今年25岁
print(person2.introduce())  # 我叫李四，今年30岁
print(Person.get_species()) # 人类属于Homo sapiens物种
print(Person.is_adult(20))  # True
```

### self 参数详解

```python
class Student:
    def __init__(this, name, grade):  # 可以使用其他名称，但推荐使用self
        this.name = name
        this.grade = grade
    
    def display_info(this):
        return f"学生：{this.name}，年级：{this.grade}"

# 创建实例
student = Student("王五", "三年级")
print(student.display_info())  # 学生：王五，年级：三年级
```

## 3. 类变量和实例变量

### 类变量（Class Variables）

```python
class Car:
    # 类变量
    wheels = 4
    count = 0  # 记录创建的汽车数量
    
    def __init__(self, brand, color):
        # 实例变量
        self.brand = brand
        self.color = color
        Car.count += 1  # 每次创建实例时增加计数
    
    def display_info(self):
        return f"{self.color}的{self.brand}汽车，有{self.wheels}个轮子"

# 创建实例
car1 = Car("丰田", "红色")
car2 = Car("本田", "蓝色")

print(car1.display_info())  # 红色的丰田汽车，有4个轮子
print(car2.display_info())  # 蓝色的本田汽车，有4个轮子

# 修改类变量会影响所有实例
Car.wheels = 6
print(car1.display_info())  # 红色的丰田汽车，有6个轮子

print(f"总共创建了{Car.count}辆汽车")  # 总共创建了2辆汽车
```

### 实例变量（Instance Variables）

```python
class BankAccount:
    def __init__(self, account_holder, initial_balance=0):
        self.account_holder = account_holder  # 实例变量
        self.balance = initial_balance        # 实例变量
        self.transactions = []                # 实例变量
    
    def deposit(self, amount):
        """存款"""
        if amount > 0:
            self.balance += amount
            self.transactions.append(f"存款: +{amount}")
            return True
        return False
    
    def withdraw(self, amount):
        """取款"""
        if 0 < amount <= self.balance:
            self.balance -= amount
            self.transactions.append(f"取款: -{amount}")
            return True
        return False
    
    def get_balance(self):
        """获取余额"""
        return self.balance
    
    def get_transaction_history(self):
        """获取交易记录"""
        return self.transactions

# 创建银行账户
account1 = BankAccount("张三", 1000)
account2 = BankAccount("李四", 500)

account1.deposit(500)
account1.withdraw(200)
account2.deposit(1000)

print(f"{account1.account_holder}的余额: {account1.get_balance()}")  # 张三的余额: 1300
print(f"{account2.account_holder}的余额: {account2.get_balance()}")  # 李四的余额: 1500

print("张三的交易记录:", account1.get_transaction_history())
# 输出: ['存款: +500', '取款: -200']
```

## 4. 类的私有属性和方法

### 私有属性

```python
class SecretAgent:
    def __init__(self, code_name, real_name):
        self.code_name = code_name        # 公开属性
        self.__real_name = real_name      # 私有属性（双下划线开头）
        self._security_level = "Top Secret"  # 保护属性（单下划线开头）
    
    def reveal_identity(self):
        """只能在类内部访问私有属性"""
        return f"代号: {self.code_name}, 真实姓名: {self.__real_name}"
    
    def get_security_level(self):
        return self._security_level

# 创建特工对象
agent = SecretAgent("猎鹰", "王小明")

print(agent.code_name)           # 猎鹰
# print(agent.__real_name)       # 错误！无法直接访问私有属性
print(agent._security_level)     # 可以访问，但不推荐（保护属性）

print(agent.reveal_identity())   # 代号: 猎鹰, 真实姓名: 王小明

# 名称重整（Name Mangling）
print(agent._SecretAgent__real_name)  # 王小明（不推荐使用）
```

### 私有方法

```python
class Calculator:
    def __init__(self):
        self.__memory = 0  # 私有属性
    
    def add(self, a, b):
        """公开方法"""
        result = a + b
        self.__log_operation(f"{a} + {b} = {result}")
        return result
    
    def __log_operation(self, operation):
        """私有方法，只能在类内部调用"""
        print(f"操作记录: {operation}")
    
    def _internal_calculation(self):
        """保护方法（单下划线开头）"""
        return "内部计算"

calc = Calculator()
result = calc.add(5, 3)  # 操作记录: 5 + 3 = 8
print(f"计算结果: {result}")  # 计算结果: 8

# calc.__log_operation("测试")  # 错误！无法调用私有方法
# calc._internal_calculation()  # 可以调用，但不推荐
```

## 5. 类的专有方法（魔术方法）

### 基本专有方法

```python
class Book:
    def __init__(self, title, author, pages):
        """构造函数"""
        self.title = title
        self.author = author
        self.pages = pages
    
    def __str__(self):
        """字符串表示（用户友好）"""
        return f"《{self.title}》 by {self.author}"
    
    def __repr__(self):
        """官方字符串表示（开发者友好）"""
        return f"Book('{self.title}', '{self.author}', {self.pages})"
    
    def __len__(self):
        """长度"""
        return self.pages
    
    def __del__(self):
        """析构函数"""
        print(f"《{self.title}》对象被销毁")

# 使用示例
book = Book("Python编程", "Guido van Rossum", 300)

print(str(book))    # 《Python编程》 by Guido van Rossum
print(repr(book))   # Book('Python编程', 'Guido van Rossum', 300)
print(len(book))    # 300

# 删除对象时会调用__del__
del book  # 《Python编程》对象被销毁
```

### 比较运算相关方法

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score
    
    def __eq__(self, other):
        """等于 =="""
        return self.score == other.score
    
    def __ne__(self, other):
        """不等于 !="""
        return self.score != other.score
    
    def __lt__(self, other):
        """小于 <"""
        return self.score < other.score
    
    def __le__(self, other):
        """小于等于 <="""
        return self.score <= other.score
    
    def __gt__(self, other):
        """大于 >"""
        return self.score > other.score
    
    def __ge__(self, other):
        """大于等于 >="""
        return self.score >= other.score

# 创建学生对象
student1 = Student("张三", 85)
student2 = Student("李四", 90)
student3 = Student("王五", 85)

print(student1 == student3)  # True (分数相同)
print(student1 != student2)  # True
print(student1 < student2)   # True
print(student1 <= student3)  # True
print(student2 > student1)   # True
print(student1 >= student3)  # True
```

### 算术运算相关方法

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        """加法 +"""
        return Vector(self.x + other.x, self.y + other.y)
    
    def __sub__(self, other):
        """减法 -"""
        return Vector(self.x - other.x, self.y - other.y)
    
    def __mul__(self, scalar):
        """乘法 *"""
        return Vector(self.x * scalar, self.y * scalar)
    
    def __truediv__(self, scalar):
        """除法 /"""
        return Vector(self.x / scalar, self.y / scalar)
    
    def __str__(self):
        return f"Vector({self.x}, {self.y})"

# 向量运算
v1 = Vector(2, 3)
v2 = Vector(1, 2)

v3 = v1 + v2  # Vector(3, 5)
v4 = v1 - v2  # Vector(1, 1)
v5 = v1 * 2   # Vector(4, 6)
v6 = v1 / 2   # Vector(1.0, 1.5)

print(v3)  # Vector(3, 5)
print(v4)  # Vector(1, 1)
print(v5)  # Vector(4, 6)
print(v6)  # Vector(1.0, 1.5)
```

### 容器类相关方法

```python
class Playlist:
    def __init__(self, name):
        self.name = name
        self.songs = []
    
    def __getitem__(self, index):
        """索引访问"""
        return self.songs[index]
    
    def __setitem__(self, index, value):
        """索引赋值"""
        self.songs[index] = value
    
    def __delitem__(self, index):
        """删除元素"""
        del self.songs[index]
    
    def __len__(self):
        """长度"""
        return len(self.songs)
    
    def __contains__(self, item):
        """包含检查"""
        return item in self.songs
    
    def append(self, song):
        """添加歌曲"""
        self.songs.append(song)
    
    def __iter__(self):
        """迭代器"""
        return iter(self.songs)

# 创建播放列表
playlist = Playlist("我的最爱")
playlist.append("歌曲A")
playlist.append("歌曲B")
playlist.append("歌曲C")

# 使用容器方法
print(len(playlist))           # 3
print(playlist[1])             # 歌曲B
print("歌曲A" in playlist)     # True

playlist[0] = "新歌曲"         # 修改第一个歌曲
print(playlist[0])             # 新歌曲

# 迭代播放列表
for song in playlist:
    print(song)
```

## 6. 继承（Inheritance）

### 单继承

```python
# 父类（基类）
class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def speak(self):
        return "动物发出声音"
    
    def eat(self):
        return f"{self.name}在吃东西"
    
    def sleep(self):
        return f"{self.name}在睡觉"

# 子类（派生类）
class Dog(Animal):  # 继承Animal类
    def __init__(self, name, age, breed):
        # 调用父类的构造函数
        super().__init__(name, age)
        self.breed = breed
    
    # 方法重写（Override）
    def speak(self):
        return "汪汪！"
    
    def fetch(self):
        return f"{self.name}在接飞盘"

class Cat(Animal):
    def __init__(self, name, age, color):
        super().__init__(name, age)
        self.color = color
    
    def speak(self):
        return "喵喵！"
    
    def climb(self):
        return f"{self.name}在爬树"

# 使用继承
animal = Animal("动物", 2)
dog = Dog("旺财", 3, "金毛")
cat = Cat("咪咪", 2, "白色")

print(animal.speak())  # 动物发出声音
print(dog.speak())     # 汪汪！
print(cat.speak())     # 喵喵！

print(dog.eat())       # 旺财在吃东西（继承自父类）
print(dog.fetch())     # 旺财在接飞盘（子类特有方法）

print(cat.sleep())     # 咪咪在睡觉（继承自父类）
print(cat.climb())     # 咪咪在爬树（子类特有方法）
```

### 多继承

```python
class Flyable:
    def fly(self):
        return "飞行中..."
    
    def take_off(self):
        return "起飞！"
    
    def land(self):
        return "降落！"

class Swimmable:
    def swim(self):
        return "游泳中..."
    
    def dive(self):
        return "潜水！"

class Runnable:
    def run(self):
        return "奔跑中..."
    
    def jump(self):
        return "跳跃！"

# 多继承
class Duck(Animal, Flyable, Swimmable, Runnable):
    def __init__(self, name, age):
        super().__init__(name, age)
    
    def speak(self):
        return "嘎嘎！"

# 创建鸭子对象
duck = Duck("唐老鸭", 1)

print(duck.speak())   # 嘎嘎！
print(duck.fly())     # 飞行中...
print(duck.swim())    # 游泳中...
print(duck.run())     # 奔跑中...
print(duck.eat())     # 唐老鸭在吃东西

# 方法解析顺序（MRO）
print(Duck.__mro__)
# (<class '__main__.Duck'>, <class '__main__.Animal'>, 
#  <class '__main__.Flyable'>, <class '__main__.Swimmable'>, 
#  <class '__main__.Runnable'>, <class 'object'>)
```

### 方法重写（Override）和 super() 使用

```python
class Vehicle:
    def __init__(self, brand, speed):
        self.brand = brand
        self.speed = speed
    
    def start(self):
        return f"{self.brand}车辆启动"
    
    def stop(self):
        return f"{self.brand}车辆停止"
    
    def info(self):
        return f"品牌: {self.brand}, 速度: {self.speed} km/h"

class Car(Vehicle):
    def __init__(self, brand, speed, doors):
        # 调用父类构造函数
        super().__init__(brand, speed)
        self.doors = doors
    
    # 方法重写
    def info(self):
        # 调用父类的info方法，并扩展
        parent_info = super().info()
        return f"{parent_info}, 车门数: {self.doors}"
    
    def honk(self):
        return "汽车鸣笛！"

class ElectricCar(Car):
    def __init__(self, brand, speed, doors, battery_capacity):
        super().__init__(brand, speed, doors)
        self.battery_capacity = battery_capacity
    
    def info(self):
        parent_info = super().info()
        return f"{parent_info}, 电池容量: {self.battery_capacity} kWh"
    
    def charge(self):
        return "电动汽车充电中..."

# 使用示例
vehicle = Vehicle("通用", 120)
car = Car("丰田", 180, 4)
electric_car = ElectricCar("特斯拉", 250, 4, 75)

print(vehicle.info())      # 品牌: 通用, 速度: 120 km/h
print(car.info())          # 品牌: 丰田, 速度: 180 km/h, 车门数: 4
print(electric_car.info()) # 品牌: 特斯拉, 速度: 250 km/h, 车门数: 4, 电池容量: 75 kWh
```

## 7. 多态（Polymorphism）

```python
class Shape:
    def area(self):
        raise NotImplementedError("子类必须实现area方法")
    
    def perimeter(self):
        raise NotImplementedError("子类必须实现perimeter方法")

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

class Triangle(Shape):
    def __init__(self, a, b, c):
        self.a = a
        self.b = b
        self.c = c
    
    def area(self):
        # 使用海伦公式计算三角形面积
        s = (self.a + self.b + self.c) / 2
        return (s * (s - self.a) * (s - self.b) * (s - self.c)) ** 0.5
    
    def perimeter(self):
        return self.a + self.b + self.c

def print_shape_info(shape):
    """多态函数：可以处理任何Shape子类的对象"""
    print(f"面积: {shape.area():.2f}")
    print(f"周长: {shape.perimeter():.2f}")
    print("-" * 20)

# 创建不同形状的对象
shapes = [
    Rectangle(5, 3),
    Circle(4),
    Triangle(3, 4, 5)
]

# 多态调用
for shape in shapes:
    print_shape_info(shape)
```

## 8. 抽象基类（Abstract Base Classes）

```python
from abc import ABC, abstractmethod

class Database(ABC):
    """数据库抽象基类"""
    
    @abstractmethod
    def connect(self):
        """连接数据库"""
        pass
    
    @abstractmethod
    def disconnect(self):
        """断开数据库连接"""
        pass
    
    @abstractmethod
    def execute_query(self, query):
        """执行查询"""
        pass

class MySQLDatabase(Database):
    def connect(self):
        return "连接到MySQL数据库"
    
    def disconnect(self):
        return "断开MySQL数据库连接"
    
    def execute_query(self, query):
        return f"在MySQL中执行查询: {query}"

class PostgreSQLDatabase(Database):
    def connect(self):
        return "连接到PostgreSQL数据库"
    
    def disconnect(self):
        return "断开PostgreSQL数据库连接"
    
    def execute_query(self, query):
        return f"在PostgreSQL中执行查询: {query}"

# 使用抽象基类
def use_database(db: Database, query: str):
    """使用数据库的通用函数"""
    print(db.connect())
    print(db.execute_query(query))
    print(db.disconnect())
    print()

mysql_db = MySQLDatabase()
postgresql_db = PostgreSQLDatabase()

use_database(mysql_db, "SELECT * FROM users")
use_database(postgresql_db, "SELECT * FROM products")
```

## 9. 属性装饰器（Property Decorator）

```python
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius
    
    @property
    def celsius(self):
        """摄氏度属性（只读）"""
        return self._celsius
    
    @property
    def fahrenheit(self):
        """华氏度属性（计算属性）"""
        return (self._celsius * 9/5) + 32
    
    @fahrenheit.setter
    def fahrenheit(self, value):
        """设置华氏度，自动转换为摄氏度"""
        self._celsius = (value - 32) * 5/9
    
    @property
    def kelvin(self):
        """开尔文温度（计算属性）"""
        return self._celsius + 273.15
    
    @kelvin.setter
    def kelvin(self, value):
        """设置开尔文温度，自动转换为摄氏度"""
        self._celsius = value - 273.15

# 使用属性装饰器
temp = Temperature(25)

print(f"摄氏度: {temp.celsius}°C")        # 摄氏度: 25°C
print(f"华氏度: {temp.fahrenheit}°F")    # 华氏度: 77.0°F
print(f"开尔文: {temp.kelvin}K")         # 开尔文: 298.15K

# 通过华氏度设置温度
temp.fahrenheit = 100
print(f"设置华氏度为100°F后，摄氏度为: {temp.celsius:.1f}°C")  # 37.8°C

# 通过开尔文设置温度
temp.kelvin = 300
print(f"设置开尔文为300K后，摄氏度为: {temp.celsius:.1f}°C")  # 26.9°C
```

## 10. 类方法和静态方法

```python
class MathUtils:
    PI = 3.14159
    
    def __init__(self, value):
        self.value = value
    
    @classmethod
    def from_string(cls, string_value):
        """类方法：从字符串创建实例"""
        try:
            value = float(string_value)
            return cls(value)
        except ValueError:
            return cls(0)
    
    @classmethod
    def get_pi(cls):
        """类方法：访问类变量"""
        return cls.PI
    
    @staticmethod
    def is_even(number):
        """静态方法：不依赖类或实例"""
        return number % 2 == 0
    
    @staticmethod
    def factorial(n):
        """静态方法：计算阶乘"""
        if n == 0 or n == 1:
            return 1
        result = 1
        for i in range(2, n + 1):
            result *= i
        return result

# 使用类方法
math1 = MathUtils(10)
math2 = MathUtils.from_string("15.5")
math3 = MathUtils.from_string("abc")  # 无效字符串，返回值为0的实例

print(f"math1的值: {math1.value}")  # 10
print(f"math2的值: {math2.value}")  # 15.5
print(f"math3的值: {math3.value}")  # 0

print(f"PI的值: {MathUtils.get_pi()}")  # 3.14159

# 使用静态方法
print(f"10是偶数吗: {MathUtils.is_even(10)}")  # True
print(f"7是偶数吗: {MathUtils.is_even(7)}")    # False
print(f"5的阶乘: {MathUtils.factorial(5)}")    # 120
```

## 11. 实际应用示例

### 学生管理系统

```python
class Student:
    def __init__(self, student_id, name, age, major):
        self.student_id = student_id
        self.name = name
        self.age = age
        self.major = major
        self.courses = []
    
    def enroll_course(self, course):
        """选课"""
        if course not in self.courses:
            self.courses.append(course)
            return True
        return False
    
    def drop_course(self, course):
        """退课"""
        if course in self.courses:
            self.courses.remove(course)
            return True
        return False
    
    def get_courses(self):
        """获取课程列表"""
        return self.courses
    
    def __str__(self):
        return f"学号: {self.student_id}, 姓名: {self.name}, 年龄: {self.age}, 专业: {self.major}"

class Course:
    def __init__(self, course_code, name, credits):
        self.course_code = course_code
        self.name = name
        self.credits = credits
        self.students = []
    
    def add_student(self, student):
        """添加学生"""
        if student not in self.students:
            self.students.append(student)
            student.enroll_course(self)
            return True
        return False
    
    def remove_student(self, student):
        """移除学生"""
        if student in self.students:
            self.students.remove(student)
            student.drop_course(self)
            return True
        return False
    
    def get_students(self):
        """获取学生列表"""
        return self.students
    
    def __str__(self):
        return f"课程代码: {self.course_code}, 课程名: {self.name}, 学分: {self.credits}"

# 创建学生和课程
student1 = Student("2023001", "张三", 20, "计算机科学")
student2 = Student("2023002", "李四", 21, "软件工程")

course1 = Course("CS101", "Python编程", 3)
course2 = Course("CS102", "数据结构", 4)

# 学生选课
course1.add_student(student1)
course1.add_student(student2)
course2.add_student(student1)

print(student1)
print("张三的课程:", [course.name for course in student1.get_courses()])

print(course1)
print("Python编程课程的学生:", [student.name for student in course1.get_students()])
```
