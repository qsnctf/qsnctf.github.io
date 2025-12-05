# Python3 命名空间和作用域

Python 的命名空间和作用域是理解变量访问和内存管理的重要概念。它们决定了变量在何处可以被访问以及如何被查找。

## 命名空间

### 什么是命名空间

命名空间（Namespace）是一个从名称到对象的映射。Python 中的命名空间就像字典一样，键是变量名，值是变量的值。命名空间提供了在项目中避免命名冲突的方法。

### 命名空间的类型

Python 中有几种类型的命名空间：

#### 1. 内置命名空间（Built-in Namespace）

包含 Python 内置函数和异常的命名空间，在 Python 解释器启动时创建。

```python
# 内置命名空间中的函数
print(len("hello"))        # 5 - len 是内置函数
print(str(123))           # "123" - str 是内置函数
print(int("456"))         # 456 - int 是内置函数

# 查看内置命名空间
import builtins
print(dir(builtins)[:10])  # 显示前10个内置函数
```

#### 2. 全局命名空间（Global Namespace）

每个模块（文件）都有一个全局命名空间，包含模块级别的变量、函数、类等。

```python
# 全局命名空间示例
module_var = "这是模块级别的变量"

def global_function():
    """全局函数"""
    return "这是全局函数"

class GlobalClass:
    """全局类"""
    pass

# 查看当前全局命名空间
print("全局命名空间中的变量:")
for name in globals():
    if not name.startswith('_'):
        print(f"  {name}: {globals()[name]}")
```

#### 3. 局部命名空间（Local Namespace）

每个函数调用时都会创建一个局部命名空间，包含函数内部的变量。

```python
def local_namespace_demo():
    """演示局部命名空间"""
    local_var = "这是局部变量"
    nested_var = "嵌套局部变量"
    
    def inner_function():
        inner_var = "内部函数的局部变量"
        print("内部函数的局部命名空间:")
        print(f"  inner_var: {inner_var}")
        print(f"  可以访问外部的 nested_var: {nested_var}")
        
        # 查看当前局部命名空间
        print(f"内部函数的 locals(): {locals()}")
    
    print("外部函数的局部命名空间:")
    print(f"  local_var: {local_var}")
    print(f"  nested_var: {nested_var}")
    print(f"外部函数的 locals(): {locals()}")
    
    inner_function()

local_namespace_demo()
```

### 命名空间的层次结构

```python
def namespace_hierarchy_demo():
    """命名空间层次结构演示"""
    
    # 局部命名空间
    local_var = "局部变量"
    
    # 访问全局命名空间
    print("访问不同命名空间中的变量:")
    print(f"局部变量: {local_var}")
    print(f"全局变量: {globals().get('global_var', '不存在')}")
    print(f"内置函数: {len('test')}")  # len 在内置命名空间中
    
    # 查看命名空间
    print(f"\n局部命名空间大小: {len(locals())}")
    print(f"全局命名空间大小: {len(globals())}")

# 在全局命名空间中定义变量
global_var = "全局变量"
namespace_hierarchy_demo()
```

## 作用域

### 什么是作用域

作用域（Scope）决定了变量在程序中的可访问范围。Python 使用 LEGB 规则来确定变量的查找顺序。

### LEGB 规则

LEGB 是 Python 中变量查找的四个层次：

1. **L (Local)** - 局部作用域
2. **E (Enclosing)** - 闭包函数外的函数作用域
3. **G (Global)** - 全局作用域
4. **B (Built-in)** - 内置作用域

```python
# LEGB 规则演示
builtin_var = "内置变量"  # 模拟内置作用域（实际内置变量在内置命名空间中）

def outer_function():
    global_var = "全局变量"  # 全局作用域
    
    def middle_function():
        enclosing_var = "闭包作用域变量"
        
        def inner_function():
            local_var = "局部变量"
            
            print("LEGB 查找顺序演示:")
            print(f"局部作用域: {local_var}")
            print(f"闭包作用域: {enclosing_var}")
            print(f"全局作用域: {globals().get('global_var', '在全局中未找到')}")
            print(f"内置作用域: {len('builtin')}")  # len 是内置函数
            
        inner_function()
    
    middle_function()

outer_function()
```

### 作用域的类型

#### 1. 局部作用域

```python
def local_scope_demo():
    """局部作用域演示"""
    local_var = "局部变量"
    
    def inner_func():
        # 创建新的局部作用域
        inner_local_var = "内部局部变量"
        print(f"内部函数可以访问: {inner_local_var}")
        print(f"内部函数可以访问外部局部变量: {local_var}")
    
    inner_func()
    
    # 外部函数无法访问内部函数的局部变量
    # print(inner_local_var)  # NameError: name 'inner_local_var' is not defined

local_scope_demo()
```

#### 2. 嵌套作用域（闭包）

```python
def closure_demo():
    """闭包作用域演示"""
    outer_var = "外部变量"
    
    def inner_func():
        # inner_func 可以访问 outer_var（闭包作用域）
        print(f"内部函数访问外部变量: {outer_var}")
    
    return inner_func

# 创建闭包
closed_func = closure_demo()
closed_func()  # 调用时仍然可以访问外部变量
```

#### 3. 全局作用域

```python
# 全局作用域中的变量
global_counter = 0

def increment_counter():
    """访问全局变量的函数"""
    global global_counter
    global_counter += 1
    print(f"计数器值: {global_counter}")

def access_global():
    """只访问全局变量（不修改）"""
    print(f"访问全局变量: {global_counter}")

# 测试全局作用域
print(f"初始值: {global_counter}")
access_global()
increment_counter()
access_global()
```

#### 4. 内置作用域

```python
def builtin_scope_demo():
    """内置作用域演示"""
    
    # 使用内置函数
    print(f"字符串长度: {len('hello world')}")
    print(f"列表排序: {sorted([3, 1, 4, 1, 5])}")
    print(f"最大值: {max([1, 2, 3, 4, 5])}")
    
    # 可以覆盖内置函数（不推荐）
    def len(x):
        return f"自定义长度函数: {len(x)}"
    
    # 现在会使用自定义的 len 函数
    # print(len("test"))  # 这会导致递归调用
    
    # 恢复内置函数
    del len
    print(f"恢复后的长度: {len('test')}")

builtin_scope_demo()
```

## 全局变量和局部变量

### 变量作用域示例

```python
# 全局变量
global_var = "全局变量"

def variable_scope_demo():
    """变量作用域演示"""
    
    # 局部变量（与全局变量同名）
    global_var = "局部变量"
    
    print(f"函数内部的 global_var: {global_var}")
    
    # 创建新的局部变量
    local_var = "局部变量"
    print(f"局部变量: {local_var}")

def read_global_demo():
    """只读取全局变量"""
    print(f"读取全局变量: {global_var}")

print(f"函数外部全局变量: {global_var}")
variable_scope_demo()
print(f"函数调用后全局变量: {global_var}")
read_global_demo()
```

### 修改全局变量

```python
# 错误的修改方式（不使用 global）
counter = 0

def wrong_increment():
    """错误的全局变量修改"""
    counter = counter + 1  # 这会创建一个新的局部变量
    print(f"函数内部 counter: {counter}")

def correct_increment():
    """正确的全局变量修改"""
    global counter  # 声明要修改全局变量
    counter = counter + 1
    print(f"函数内部 counter: {counter}")

print(f"初始 counter: {counter}")
wrong_increment()
print(f"wrong_increment 后: {counter}")  # 还是 0
correct_increment()
print(f"correct_increment 后: {counter}")  # 变成 1
```

### 全局变量的使用场景

```python
# 配置变量（全局变量）
APP_CONFIG = {
    'debug': True,
    'version': '1.0.0',
    'max_connections': 100
}

def get_config(key, default=None):
    """获取配置值"""
    return APP_CONFIG.get(key, default)

def set_config(key, value):
    """设置配置值"""
    global APP_CONFIG
    APP_CONFIG[key] = value

# 使用全局配置
print(f"调试模式: {get_config('debug')}")
set_config('debug', False)
print(f"修改后调试模式: {get_config('debug')}")
```

## global 和 nonlocal 关键字

### global 关键字

`global` 关键字用于在函数内部声明要修改全局变量。

```python
# global 关键字示例
global_var = "初始全局变量"

def modify_global():
    """修改全局变量"""
    global global_var  # 声明要修改全局变量
    global_var = "修改后的全局变量"
    print(f"函数内部: {global_var}")

def create_new_global():
    """创建新的全局变量"""
    global new_global_var  # 声明新的全局变量
    new_global_var = "新创建的全局变量"
    print(f"函数内部创建: {new_global_var}")

def access_without_global():
    """不使用 global 访问全局变量"""
    # 只能读取，不能修改
    print(f"只能读取: {global_var}")
    # global_var = "尝试修改"  # 这会创建局部变量

print(f"初始: {global_var}")
modify_global()
print(f"修改后: {global_var}")
create_new_global()
print(f"新变量: {new_global_var}")
```

### nonlocal 关键字

`nonlocal` 关键字用于在嵌套函数中修改外部函数的变量（但不修改全局变量）。

```python
def nonlocal_demo():
    """nonlocal 关键字演示"""
    
    # 外层函数的变量
    outer_var = "外层变量"
    
    def middle_function():
        # 中层函数的变量
        middle_var = "中层变量"
        
        def inner_function():
            nonlocal outer_var, middle_var  # 声明要修改外层和中层变量
            
            # 修改外层和中层变量
            outer_var = "修改后的外层变量"
            middle_var = "修改后的中层变量"
            
            # 创建内部变量
            inner_var = "内部变量"
            
            print(f"  内层函数中:")
            print(f"    outer_var: {outer_var}")
            print(f"    middle_var: {middle_var}")
            print(f"    inner_var: {inner_var}")
        
        print("修改前:")
        print(f"  outer_var: {outer_var}")
        print(f"  middle_var: {middle_var}")
        
        inner_function()
        
        print("修改后:")
        print(f"  outer_var: {outer_var}")
        print(f"  middle_var: {middle_var}")
        
        # 不能访问内部函数的变量
        # print(inner_var)  # NameError
    
    middle_function()

nonlocal_demo()
```

### global vs nonlocal 对比

```python
# 全局变量
global_counter = 0

def global_vs_nonlocal():
    """global 和 nonlocal 的对比"""
    
    # 函数级别的变量
    function_counter = 0
    
    def inner_function():
        global global_counter  # 声明全局变量
        nonlocal function_counter  # 声明外部函数变量
        
        # 修改全局和函数级变量
        global_counter += 1
        function_counter += 1
        
        # 创建局部变量
        local_counter = 1
        
        print(f"全局计数器: {global_counter}")
        print(f"函数计数器: {function_counter}")
        print(f"局部计数器: {local_counter}")
    
    return inner_function

# 测试
counter_func = global_vs_nonlocal()

print("调用内部函数:")
counter_func()
counter_func()
counter_func()

print(f"\n最终全局计数器: {global_counter}")
# print(function_counter)  # NameError: 无法访问函数级变量
```

### 实际应用示例

#### 1. 计数器模式

```python
# 使用闭包和 nonlocal 实现计数器
def create_counter(initial_value=0):
    """创建计数器"""
    count = initial_value
    
    def increment(step=1):
        nonlocal count
        count += step
        return count
    
    def get_count():
        nonlocal count
        return count
    
    def reset():
        nonlocal count
        count = 0
    
    return {
        'increment': increment,
        'get_count': get_count,
        'reset': reset
    }

# 使用计数器
counter1 = create_counter(10)
counter2 = create_counter()

print(f"计数器1: {counter1['get_count']()}")
counter1['increment']()
print(f"计数器1: {counter1['get_count']()}")

print(f"计数器2: {counter2['get_count']()}")
counter2['increment'](5)
print(f"计数器2: {counter2['get_count']()}")
```

#### 2. 配置管理

```python
# 全局配置管理
class ConfigManager:
    """配置管理器"""
    
    def __init__(self):
        self._config = {}
    
    def set(self, key, value):
        """设置配置"""
        self._config[key] = value
    
    def get(self, key, default=None):
        """获取配置"""
        return self._config.get(key, default)
    
    def update(self, updates):
        """批量更新配置"""
        self._config.update(updates)

# 全局配置实例
config = ConfigManager()

def configure_app():
    """配置应用程序"""
    global config
    config.set('debug', True)
    config.set('version', '1.0.0')
    config.set('host', 'localhost')
    config.set('port', 8080)

def show_config():
    """显示配置"""
    print("应用程序配置:")
    print(f"  调试模式: {config.get('debug')}")
    print(f"  版本: {config.get('version')}")
    print(f"  主机: {config.get('host')}")
    print(f"  端口: {config.get('port')}")

# 使用配置
configure_app()
show_config()
```

#### 3. 状态管理

```python
def create_state_manager():
    """创建状态管理器"""
    
    # 状态变量
    state = {
        'is_logged_in': False,
        'user_name': None,
        'session_id': None
    }
    
    def login(user_name):
        """用户登录"""
        nonlocal state
        state['is_logged_in'] = True
        state['user_name'] = user_name
        state['session_id'] = f"session_{hash(user_name)}"
        return True
    
    def logout():
        """用户登出"""
        nonlocal state
        state = {
            'is_logged_in': False,
            'user_name': None,
            'session_id': None
        }
    
    def get_state():
        """获取当前状态"""
        return state.copy()
    
    def is_authenticated():
        """检查是否已认证"""
        return state['is_logged_in']
    
    return {
        'login': login,
        'logout': logout,
        'get_state': get_state,
        'is_authenticated': is_authenticated
    }

# 使用状态管理器
auth_manager = create_state_manager()

print(f"认证状态: {auth_manager['is_authenticated']()}")
auth_manager['login']('张三')
print(f"认证状态: {auth_manager['is_authenticated']()}")
print(f"用户状态: {auth_manager['get_state']()}")
auth_manager['logout']()
print(f"登出后状态: {auth_manager['get_state']()}")
```

## 最佳实践

### 1. 避免过度使用全局变量

```python
# 不好的做法：过多全局变量
user_name = ""
user_age = 0
user_email = ""

def set_user_info(name, age, email):
    global user_name, user_age, user_email
    user_name = name
    user_age = age
    user_email = email

def get_user_info():
    return user_name, user_age, user_email

# 好的做法：使用类封装
class User:
    def __init__(self, name="", age=0, email=""):
        self.name = name
        self.age = age
        self.email = email
    
    def set_info(self, name=None, age=None, email=None):
        if name is not None:
            self.name = name
        if age is not None:
            self.age = age
        if email is not None:
            self.email = email
    
    def get_info(self):
        return {
            'name': self.name,
            'age': self.age,
            'email': self.email
        }

# 使用
user = User()
user.set_info(name="张三", age=25, email="zhang@example.com")
print(user.get_info())
```

### 2. 合理使用闭包

```python
# 好的做法：使用闭包封装状态
def create_multiplier(factor):
    """创建乘法器"""
    def multiply(number):
        return number * factor
    return multiply

# 创建不同的乘法器
double = create_multiplier(2)
triple = create_multiplier(3)

print(f"2 * 5 = {double(5)}")
print(f"3 * 5 = {triple(5)}")
```

### 3. 明确变量作用域

```python
def clear_scope_example():
    """明确的作用域示例"""
    
    # 明确的局部变量
    local_data = {"count": 0}
    
    def increment():
        # 使用 nonlocal 明确修改外部变量
        nonlocal local_data
        local_data["count"] += 1
        return local_data["count"]
    
    def get_count():
        # 明确只读取，不修改
        return local_data["count"]
    
    return increment, get_count

increment_func, get_count_func = clear_scope_example()

print(f"计数: {get_count_func()}")
print(f"递增后: {increment_func()}")
print(f"计数: {get_count_func()}")
```

## 调试作用域问题

### 查看命名空间

```python
def debug_namespaces():
    """调试命名空间"""
    
    # 局部变量
    local_var = "局部变量"
    
    def inner_debug():
        inner_var = "内部变量"
        
        print("=== 命名空间调试 ===")
        print(f"局部命名空间: {list(locals().keys())}")
        print(f"全局命名空间大小: {len(globals())}")
        
        # 查找变量
        print(f"\n变量查找:")
        print(f"inner_var 在局部: {'inner_var' in locals()}")
        print(f"local_var 在局部: {'local_var' in locals()}")
        print(f"local_var 在全局: {'local_var' in globals()}")
    
    inner_debug()

debug_namespaces()
```

### 常见作用域错误

```python
def common_scope_errors():
    """常见的作用域错误"""
    
    # 错误1: 在函数内部尝试修改全局变量而不使用 global
    global_var = "全局变量"
    
    def error1():
        # global_var = "修改"  # 这会创建局部变量，不会修改全局变量
        print(f"错误1中的 global_var: {global_var}")  # 可能会报 UnboundLocalError
    
    # 错误2: 在嵌套函数中修改外部变量而不使用 nonlocal
    def error2():
        outer_var = "外层变量"
        
        def inner_error2():
            # outer_var = "修改"  # 这会创建新的局部变量
            print(f"内部函数中的 outer_var: {outer_var}")  # 可能会报 UnboundLocalError
        
        inner_error2()
    
    # 错误3: 在使用变量前定义
    def error3():
        # print(undefined_var)  # NameError
        undefined_var = "现在定义了"
        print(undefined_var)
    
    # 正确的做法
    def correct_example():
        nonlocal_local = "外部变量"
        
        def inner_correct():
            nonlocal nonlocal_local
            nonlocal_local = "修改后的值"
            return nonlocal_local
        
        return inner_correct()
    
    # 演示
    error1()
    error2()
    error3()
    print(f"正确示例结果: {correct_example()}")

# common_scope_errors()  # 取消注释查看错误
```

## 总结

### 命名空间

1. **内置命名空间**：包含 Python 内置函数和对象
2. **全局命名空间**：模块级别的变量和函数
3. **局部命名空间**：函数内部的变量

### 作用域规则（LEGB）

1. **L (Local)**：局部作用域
2. **E (Enclosing)**：闭包函数外的函数作用域  
3. **G (Global)**：全局作用域
4. **B (Built-in)**：内置作用域

### 关键字

- **global**：声明要修改全局变量
- **nonlocal**：声明要修改闭包作用域变量

