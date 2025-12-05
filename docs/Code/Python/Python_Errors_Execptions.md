# Python3 错误和异常

作为 Python 初学者，在刚学习 Python 编程时，经常会看到一些报错信息，在前面我们没有提及，这章节我们会专门介绍。

Python 有两种错误很容易辨认：语法错误和异常。

Python assert（断言）用于判断一个表达式，在表达式条件为 false 的时候触发异常。

## 语法错误

Python 的语法错误或者称之为解析错，是初学者经常碰到的，如下实例：

```python
>>> while True print('Hello world')
  File "<stdin>", line 1, in ?
    while True print('Hello world')
                   ^
SyntaxError: invalid syntax
```

这个例子中，函数 `print()` 被检查到有错误，是它前面缺少了一个冒号 `:`。

语法分析器指出了出错的一行，并且在最先找到的错误的位置标记了一个小小的箭头。

### 常见语法错误

```python
# 1. 缺少冒号
if True
    print("缺少冒号")  # SyntaxError: expected ':'

# 2. 括号不匹配
print("hello"  # SyntaxError: '(' was never closed

# 3. 关键字拼写错误
whle True:  # SyntaxError: invalid syntax
    pass

# 4. 缩进错误
def my_function():
print("缩进错误")  # IndentationError: expected an indented block

# 5. 赋值表达式错误
x = 5
if x = 3:  # SyntaxError: invalid syntax
    print("test")
```

## 异常

即便 Python 程序的语法是正确的，在运行它的时候，也有可能发生错误。运行期检测到的错误被称为异常。

大多数的异常都不会被程序处理，都以错误信息的形式展现在这里：

### 常见异常示例

```python
>>> 10 * (1/0)             # 0 不能作为除数，触发异常
Traceback (most recent call last):
  File "<stdin>", line 1, in ?
ZeroDivisionError: division by zero

>>> 4 + spam*3             # spam 未定义，触发异常
Traceback (most recent call last):
  File "<stdin>", line 1, in ?
NameError: name 'spam' is not defined

>>> '2' + 2               # int 不能与 str 相加，触发异常
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: can only concatenate str (not "int") to str
```

异常以不同的类型出现，这些类型都作为信息的一部分打印出来: 例子中的类型有 `ZeroDivisionError`，`NameError` 和 `TypeError`。

错误信息的前面部分显示了异常发生的上下文，并以调用栈的形式显示具体信息。

### Python 内置异常类型

```python
# 1. ZeroDivisionError - 除零错误
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"除零错误: {e}")

# 2. TypeError - 类型错误
try:
    result = "hello" + 5
except TypeError as e:
    print(f"类型错误: {e}")

# 3. ValueError - 值错误
try:
    num = int("abc")
except ValueError as e:
    print(f"值错误: {e}")

# 4. NameError - 名称错误
try:
    print(undefined_variable)
except NameError as e:
    print(f"名称错误: {e}")

# 5. IndexError - 索引错误
try:
    my_list = [1, 2, 3]
    print(my_list[5])
except IndexError as e:
    print(f"索引错误: {e}")

# 6. KeyError - 键错误
try:
    my_dict = {"a": 1, "b": 2}
    print(my_dict["c"])
except KeyError as e:
    print(f"键错误: {e}")

# 7. AttributeError - 属性错误
try:
    text = "hello"
    text.nonexistent_method()
except AttributeError as e:
    print(f"属性错误: {e}")

# 8. FileNotFoundError - 文件未找到错误
try:
    with open("nonexistent_file.txt") as f:
        content = f.read()
except FileNotFoundError as e:
    print(f"文件未找到错误: {e}")

# 9. ImportError - 导入错误
try:
    import nonexistent_module
except ImportError as e:
    print(f"导入错误: {e}")
```

## 异常处理

### try/except

异常捕捉可以使用 `try/except` 语句。

以下例子中，让用户输入一个合法的整数，但是允许用户中断这个程序（使用 Control-C 或者操作系统提供的方法）。用户中断的信息会引发一个 `KeyboardInterrupt` 异常。

```python
while True:
    try:
        x = int(input("请输入一个数字: "))
        break
    except ValueError:
        print("您输入的不是数字，请再次尝试输入！")
```

#### try 语句工作原理

try 语句按照如下方式工作：

1. 首先，执行 try 子句（在关键字 try 和关键字 except 之间的语句）。
2. 如果没有异常发生，忽略 except 子句，try 子句执行后结束。
3. 如果在执行 try 子句的过程中发生了异常，那么 try 子句余下的部分将被忽略。如果异常的类型和 except 之后的名称相符，那么对应的 except 子句将被执行。
4. 如果一个异常没有与任何的 except 匹配，那么这个异常将会传递给上层的 try 中。

### 多个异常处理

一个 try 语句可能包含多个except子句，分别来处理不同的特定的异常。最多只有一个分支会被执行。

处理程序将只针对对应的 try 子句中的异常进行处理，而不是其他的 try 的处理程序中的异常。

```python
try:
    # 尝试执行可能出错的代码
    x = int(input("请输入一个数字: "))
    result = 10 / x
    print(f"结果是: {result}")
except ValueError:
    print("输入的不是有效数字！")
except ZeroDivisionError:
    print("不能除以零！")
except KeyboardInterrupt:
    print("用户中断了程序")
except Exception as e:
    print(f"发生了其他错误: {e}")
```

### 处理多个异常类型

一个except子句可以同时处理多个异常，这些异常将被放在一个括号里成为一个元组：

```python
import sys

try:
    f = open('myfile.txt')
    s = f.readline()
    i = int(s.strip())
except (RuntimeError, TypeError, NameError):
    print("发生了运行时、类型或名称错误")
except OSError as err:
    print(f"OS 错误: {err}")
except ValueError:
    print("无法将数据转换为整数")
except:
    print(f"未知错误: {sys.exc_info()[0]}")
    raise
```

最后一个except子句可以忽略异常的名称，它将被当作通配符使用。你可以使用这种方法打印一个错误信息，然后再次把异常抛出。

### try/except...else

try/except 语句还有一个可选的 else 子句，如果使用这个子句，那么必须放在所有的 except 子句之后。

else 子句将在 try 子句没有发生任何异常的时候执行。

```python
import sys

for arg in sys.argv[1:]:
    try:
        f = open(arg, 'r')
    except IOError:
        print('无法打开', arg)
    else:
        print(arg, '有', len(f.readlines()), '行')
        f.close()
```

使用 else 子句比把所有的语句都放在 try 子句里面要好，这样可以避免一些意想不到，而 except 又无法捕获的异常。

异常处理并不仅仅处理那些直接发生在 try 子句中的异常，而且还能处理子句中调用的函数（甚至间接调用的函数）里抛出的异常。例如：

```python
def this_fails():
    x = 1/0

try:
    this_fails()
except ZeroDivisionError as err:
    print('处理运行时错误:', err)
# 输出: 处理运行时错误: int division or modulo by zero
```

### try-finally 语句

try-finally 语句无论是否发生异常都将执行最后的代码。

以下实例中 finally 语句无论异常是否发生都会执行：

```python
try:
    # 可能抛出异常的代码
    file = open('test.txt', 'r')
    content = file.read()
    print(content)
except FileNotFoundError:
    print("文件不存在")
except Exception as e:
    print(f"发生错误: {e}")
finally:
    # 无论是否发生异常都会执行
    print('这句话，无论异常是否发生都会执行。')
    if 'file' in locals():
        file.close()
```

### 完整的异常处理结构

一个完整的异常处理结构包含 try、except、else、finally：

```python
def divide(x, y):
    try:
        result = x / y
    except ZeroDivisionError:
        print("除零错误！")
    except TypeError:
        print("类型错误！")
    else:
        print("结果是:", result)
    finally:
        print("执行 finally 子句")

# 测试
divide(10, 2)    # 正常执行
divide(10, 0)    # 除零错误
divide(10, "2")  # 类型错误
```

## 抛出异常

Python 使用 raise 语句抛出一个指定的异常。

### raise 语法格式

```python
raise [Exception [, args [, traceback]]
```

以下实例如果 x 大于 5 就触发异常：

```python
x = 10
if x > 5:
    raise Exception('x 不能大于 5。x 的值为: {}'.format(x))
```

执行以上代码会触发异常：

```
Traceback (most recent call last):
  File "test.py", line 3, in <module>
    raise Exception('x 不能大于 5。x 的值为: {}'.format(x))
Exception: x 不能大于 5。x 的值为: 10
```

raise 唯一的一个参数指定了要被抛出的异常。它必须是一个异常的实例或者是异常的类（也就是 Exception 的子类）。

### 重新抛出异常

如果你只想知道这是否抛出了一个异常，并不想去处理它，那么一个简单的 raise 语句就可以再次把它抛出。

```python
try:
    raise NameError('HiThere')  # 模拟一个异常
except NameError:
    print('一个异常飞过!')
    raise
```

### 抛出特定类型的异常

```python
def validate_age(age):
    if age < 0:
        raise ValueError("年龄不能为负数")
    if age > 120:
        raise ValueError("年龄不能超过120岁")
    return True

try:
    validate_age(-5)
except ValueError as e:
    print(f"验证失败: {e}")
```

### 创建异常实例

```python
# 直接创建异常实例
error = ValueError("这是一个值错误")
raise error

# 创建并抛出自定义消息
try:
    user_input = input("请输入一个正数: ")
    number = float(user_input)
    if number <= 0:
        raise ValueError(f"{number} 不是正数")
    print(f"您输入的正数是: {number}")
except ValueError as e:
    print(f"错误: {e}")
```

## 用户自定义异常

你可以通过创建一个新的异常类来拥有自己的异常。异常类继承自 Exception 类，可以直接继承，或者间接继承。

### 基本自定义异常

```python
class MyError(Exception):
    def __init__(self, value):
        self.value = value
    
    def __str__(self):
        return repr(self.value)

try:
    raise MyError(2*2)
except MyError as e:
    print('我的异常发生了, 值:', e.value)
# 输出: 我的异常发生了, 值: 4

raise MyError('糟糕!')
```

在这个例子中，类 Exception 默认的 `__init__()` 被覆盖。

### 完整的自定义异常系统

当创建一个模块有可能抛出多种不同的异常时，一种通常的做法是为这个包建立一个基础异常类，然后基于这个基础类为不同的错误情况创建不同的子类：

```python
class Error(Exception):
    """模块异常的基类"""
    pass

class InputError(Error):
    """输入错误异常

    Attributes:
        expression -- 输入表达式
        message -- 错误解释
    """

    def __init__(self, expression, message):
        self.expression = expression
        self.message = message

class TransitionError(Error):
    """状态转换错误异常

    当一个操作试图执行一个不被允许的状态转换时被引发。

    Attributes:
        previous -- 开始转换时的状态
        next -- 尝试的新状态
        message -- 为什么特定转换不被允许的解释
    """

    def __init__(self, previous, next, message):
        self.previous = previous
        self.next = next
        self.message = message

# 使用示例
def process_input(user_input):
    try:
        if not user_input:
            raise InputError(user_input, "输入不能为空")
        if len(user_input) < 3:
            raise InputError(user_input, "输入长度至少为3")
        print(f"处理输入: {user_input}")
    except InputError as e:
        print(f"输入错误: {e.message}")

def state_transition(current_state, new_state):
    try:
        if current_state == "locked" and new_state != "unlocked":
            raise TransitionError(current_state, new_state, "锁定状态只能转换到解锁状态")
        print(f"状态从 {current_state} 转换到 {new_state}")
    except TransitionError as e:
        print(f"状态转换错误: {e.message}")

# 测试
process_input("")  # 空输入
process_input("ab")  # 长度不足
process_input("hello")  # 正常

state_transition("locked", "closed")  # 错误转换
state_transition("locked", "unlocked")  # 正常转换
```

大多数的异常的名字都以"Error"结尾，就跟标准的异常命名一样。

## 定义清理行为

### finally 子句

try 语句还有另外一个可选的子句，它定义了无论在任何情况下都会执行的清理行为。

```python
try:
    raise KeyboardInterrupt
finally:
    print('Goodbye, world!')
```

以上例子不管 try 子句里面有没有发生异常，finally 子句都会执行。

如果一个异常在 try 子句里（或者在 except 和 else 子句里）被抛出，而又没有任何的 except 把它截住，那么这个异常会在 finally 子句执行后被抛出。

### 复杂的异常处理示例

下面是一个更加复杂的例子（在同一个 try 语句里包含 except 和 finally 子句）：

```python
def divide(x, y):
    try:
        result = x / y
    except ZeroDivisionError:
        print("除零错误!")
    else:
        print("结果是", result)
    finally:
        print("执行 finally 子句")

# 测试各种情况
divide(2, 1)    # 正常情况
divide(2, 0)    # 除零错误
divide("2", "1") # 类型错误
```

### 资源清理的最佳实践

```python
import sys

def file_operations():
    file = None
    try:
        file = open('example.txt', 'r')
        content = file.read()
        print(f"文件内容: {content}")
        
        # 模拟可能发生的错误
        if "error" in content:
            raise ValueError("文件包含错误内容")
            
    except FileNotFoundError:
        print("文件不存在")
    except ValueError as e:
        print(f"内容错误: {e}")
    except Exception as e:
        print(f"未知错误: {e}")
    finally:
        # 确保文件被关闭
        if file is not None:
            file.close()
            print("文件已关闭")

file_operations()
```

## 预定义的清理行为

### with 语句

一些对象定义了标准的清理行为，无论系统是否成功的使用了它，一旦不需要它了，那么这个标准的清理行为就会执行。

下面这个例子展示了尝试打开一个文件，然后把内容打印到屏幕上：

```python
# 有问题的代码
for line in open("myfile.txt"):
    print(line, end="")
```

以上这段代码的问题是，当执行完毕后，文件会保持打开状态，并没有被关闭。

使用 with 语句就可以保证诸如文件之类的对象在使用完之后一定会正确的执行他的清理方法：

```python
with open("myfile.txt") as f:
    for line in f:
        print(line, end="")
```

以上这段代码执行完毕后，就算在处理过程中出问题了，文件 f 总是会关闭。

### 多个 with 语句

```python
# 同时打开多个文件
with open('input.txt', 'r') as input_file, \
     open('output.txt', 'w') as output_file:
    content = input_file.read()
    output_file.write(content.upper())
```

### 自定义支持 with 语句的类

```python
class DatabaseConnection:
    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.connection = None
    
    def __enter__(self):
        print(f"连接数据库: {self.connection_string}")
        self.connection = f"连接到 {self.connection_string}"
        return self.connection
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("关闭数据库连接")
        if self.connection:
            self.connection = None
        # 如果返回 True，异常会被抑制
        return False

# 使用自定义的上下文管理器
with DatabaseConnection("mysql://localhost/mydb") as conn:
    print(f"使用连接: {conn}")
    # 模拟异常
    # raise ValueError("数据库操作错误")
```

## 异常处理的最佳实践

### 1. 具体的异常处理

```python
# 好的做法：捕获具体的异常
try:
    num = int(user_input)
    result = 10 / num
except ValueError:
    print("请输入有效的数字")
except ZeroDivisionError:
    print("不能除以零"

# 不好的做法：捕获所有异常
try:
    num = int(user_input)
    result = 10 / num
except:
    print("发生了错误")  # 太模糊
```

### 2. 记录异常信息

```python
import logging

logging.basicConfig(level=logging.ERROR)

def process_data(data):
    try:
        # 处理数据
        result = int(data)
        return result * 2
    except ValueError as e:
        logging.error(f"数据转换失败: {data}, 错误: {e}")
        return 0
    except Exception as e:
        logging.exception("处理数据时发生未知错误")
        return 0
```

### 3. 异常链

```python
def read_config():
    try:
        with open('config.json') as f:
            return json.load(f)
    except FileNotFoundError as e:
        raise ConfigurationError("配置文件不存在") from e
    except json.JSONDecodeError as e:
        raise ConfigurationError("配置文件格式错误") from e

class ConfigurationError(Exception):
    pass
```

### 4. 断言的使用

```python
def calculate_discount(price, discount_rate):
    assert price >= 0, "价格不能为负数"
    assert 0 <= discount_rate <= 1, "折扣率必须在0到1之间"
    
    discounted_price = price * (1 - discount_rate)
    assert discounted_price >= 0, "折扣后价格不能为负数"
    
    return discounted_price

# 使用
try:
    calculate_discount(100, 0.2)  # 正常
    calculate_discount(-100, 0.2)  # 会触发 AssertionError
except AssertionError as e:
    print(f"断言错误: {e}")
```

## 异常处理性能考虑

```python
import time

def without_exception():
    start = time.time()
    for i in range(1000000):
        # 正常的处理逻辑
        if i >= 0:
            result = i * 2
    return time.time() - start

def with_exception():
    start = time.time()
    for i in range(1000000):
        try:
            if i >= 0:
                result = i * 2
        except:
            pass
    return time.time() - start

print(f"无异常处理时间: {without_exception():.6f} 秒")
print(f"有异常处理时间: {with_exception():.6f} 秒")

# 异常处理比正常的条件判断慢很多
```

## 总结

Python 的错误和异常处理机制提供了强大的错误管理能力：

1. **语法错误**：代码编写阶段的错误，需要在运行前修复
2. **异常**：运行时错误，可以通过异常处理机制捕获和处理
3. **异常处理结构**：try/except/else/finally 提供了完整的错误处理流程
4. **自定义异常**：可以根据需要创建特定的异常类型
5. **资源管理**：使用 with 语句确保资源正确清理

### 最佳实践建议

1. **具体化异常处理**：捕获具体的异常类型，而不是使用裸露的 except
2. **适当的异常范围**：只对可能出错的代码使用异常处理
3. **日志记录**：记录异常信息便于调试
4. **资源清理**：使用 with 语句或 finally 确保资源释放
5. **异常链**：使用 raise...from 保持原始异常信息
6. **性能考虑**：避免在性能关键路径过度使用异常处理

掌握异常处理是编写健壮 Python 程序的重要技能。合理的异常处理可以提高程序的可靠性和用户体验。