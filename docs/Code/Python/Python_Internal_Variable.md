# Python3 内置变量

Python 中有一些特殊的内置变量（也称为魔术变量或特殊变量），它们以双下划线开头和结尾。这些变量在 Python 的运行时环境中具有特殊含义和功能。

## __name__ 和 __main__

### __name__ 变量

`__name__` 是 Python 中的一个特殊变量，用于判断当前模块是被直接运行还是被导入。

#### 基本概念

```python
# 创建一个文件 test_module.py
print(f"__name__ 的值是: {__name__}")

def hello():
    print("Hello from test_module!")

if __name__ == "__main__":
    print("这个文件被直接运行")
    hello()
else:
    print("这个文件被导入为模块")
```

#### 直接运行 vs 导入

```python
# 直接运行 test_module.py
# 输出:
# __name__ 的值是: __main__
# 这个文件被直接运行
# Hello from test_module!

# 在另一个文件中导入
import test_module
# 输出:
# __name__ 的值是: test_module
# 这个文件被导入为模块
```

### 实际应用示例

```python
# calculator.py
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        raise ValueError("除数不能为零")
    return a / b

# 测试代码 - 只在直接运行时执行
if __name__ == "__main__":
    print("计算器测试")
    print(f"5 + 3 = {add(5, 3)}")
    print(f"5 - 3 = {subtract(5, 3)}")
    print(f"5 * 3 = {multiply(5, 3)}")
    print(f"6 / 3 = {divide(6, 3)}")
```

```python
# main.py
import calculator

print("使用计算器模块")
print(f"10 + 20 = {calculator.add(10, 20)}")
print(f"10 - 5 = {calculator.subtract(10, 5)}")
```

### __main__ 的用途

1. **模块测试**：为模块提供独立的测试代码
2. **程序入口**：作为 Python 程序的入口点
3. **避免重复执行**：防止导入时执行不必要的代码

## __file__

`__file__` 变量包含当前文件的路径。

```python
# file_demo.py
import os

print(f"当前文件路径: {__file__}")
print(f"文件名: {os.path.basename(__file__)}")
print(f"目录名: {os.path.dirname(__file__)}")
print(f"绝对路径: {os.path.abspath(__file__)}")

# 构建相对路径
current_dir = os.path.dirname(os.path.abspath(__file__))
config_path = os.path.join(current_dir, 'config.json')
print(f"配置文件路径: {config_path}")
```

## __doc__

`__doc__` 变量包含模块、类或函数的文档字符串。

```python
# doc_demo.py
"""
这是一个示例模块，展示 __doc__ 变量的使用。

这个模块包含了各种示例函数和类，用于演示文档字符串的用法。
"""

class Calculator:
    """简单的计算器类"""
    
    def add(self, a, b):
        """加法运算
        
        Args:
            a (int/float): 第一个数
            b (int/float): 第二个数
            
        Returns:
            int/float: 两数之和
        """
        return a + b

def multiply(a, b):
    """乘法函数
    
    Args:
        a (int/float): 被乘数
        b (int/float): 乘数
        
    Returns:
        int/float: 乘积
    """
    return a * b

# 访问文档字符串
if __name__ == "__main__":
    print("模块文档:")
    print(__doc__)
    
    print("\n类文档:")
    print(Calculator.__doc__)
    
    print("\n方法文档:")
    print(Calculator.add.__doc__)
    
    print("\n函数文档:")
    print(multiply.__doc__)
```

## __package__

`__package__` 变量指示模块所属的包。

```python
# 在包结构中
# my_package/__init__.py
print(f"包的 __package__: {__package__}")  # None

# my_package/module.py
print(f"模块的 __package__: {__package__}")  # my_package
```

## __version__

虽然不是内置变量，但常用于版本控制。

```python
# my_module.py
__version__ = "1.0.0"
__author__ = "张三"
__email__ = "zhangsan@example.com"

def get_version():
    return __version__

def get_module_info():
    return {
        'version': __version__,
        'author': __author__,
        'email': __email__
    }
```

## __all__

`__all__` 变量定义模块的公共接口。

```python
# my_module.py
__all__ = ['public_function', 'PublicClass']

def public_function():
    """公共函数"""
    return "这是公共函数"

def _private_function():
    """私有函数"""
    return "这是私有函数"

class PublicClass:
    """公共类"""
    pass

class _PrivateClass:
    """私有类"""
    pass

# 当使用 from my_module import * 时，只会导入 __all__ 中定义的内容
```

## __import__ (函数)

`__import__` 是一个内置函数，用于动态导入模块。

```python
# dynamic_import.py
def dynamic_import_module(module_name):
    """动态导入模块"""
    try:
        module = __import__(module_name)
        print(f"成功导入模块: {module_name}")
        return module
    except ImportError as e:
        print(f"导入模块失败: {module_name}, 错误: {e}")
        return None

# 使用示例
if __name__ == "__main__":
    # 导入标准库模块
    math_module = dynamic_import_module('math')
    if math_module:
        print(f"π 的值: {math_module.pi}")
    
    # 尝试导入不存在的模块
    dynamic_import_module('nonexistent_module')
```

## __builtins__

`__builtins__` 变量包含所有内置函数和异常。

```python
# builtins_demo.py
import builtins

def show_builtins_info():
    """显示内置函数信息"""
    print("部分内置函数:")
    builtin_functions = [name for name in dir(builtins) 
                        if not name.startswith('_') and callable(getattr(builtins, name))]
    
    for func in sorted(builtin_functions)[:10]:  # 显示前10个
        print(f"- {func}")
    
    print(f"\n总共有 {len(builtin_functions)} 个内置函数")

# 自定义 print 函数
original_print = builtins.print

def custom_print(*args, **kwargs):
    """自定义打印函数，添加前缀"""
    original_print("[自定义]", *args, **kwargs)

if __name__ == "__main__":
    show_builtins_info()
    
    # 临时替换内置 print 函数
    builtins.print = custom_print
    print("这是使用自定义 print 函数")
    
    # 恢复原始 print 函数
    builtins.print = original_print
    print("这是使用原始 print 函数")
```

## __path__

`__path__` 变量用于包的搜索路径。

```python
# my_package/__init__.py
print(f"包的搜索路径: {__path__}")
```

## __annotations__

`__annotations__` 变量包含函数参数和返回值的类型注解。

```python
# annotations_demo.py
def greet(name: str, age: int = 25) -> str:
    """问候函数"""
    return f"Hello, {name}! You are {age} years old."

def calculate(a: float, b: float) -> float:
    """计算函数"""
    return a + b

if __name__ == "__main__":
    print("greet 函数的注解:")
    print(greet.__annotations__)
    
    print("\ncalculate 函数的注解:")
    print(calculate.__annotations__)
```

## __debug__

`__debug__` 变量指示 Python 是否在调试模式下运行。

```python
# debug_demo.py
def debug_function():
    """调试函数"""
    if __debug__:
        print("调试模式：执行额外的检查")
        # 执行一些调试相关的操作
    else:
        print("非调试模式：跳过调试操作")

def optimize_function():
    """优化函数"""
    if __debug__:
        # 调试模式下的代码
        print("执行完整的验证逻辑")
        # 复杂的验证代码
    else:
        # 优化后的代码
        print("执行优化后的逻辑")

if __name__ == "__main__":
    print(f"当前调试模式: {__debug__}")
    debug_function()
    optimize_function()
    
    print("\n使用 -O 选项运行时，__debug__ 将为 False")
```

## __loader__

`__loader__` 变量指示用于加载模块的加载器。

```python
# loader_demo.py
import sys

def show_loader_info():
    """显示加载器信息"""
    if hasattr(__loader__, 'name'):
        print(f"加载器名称: {__loader__.name}")
    else:
        print(f"加载器类型: {type(__loader__)}")
        print(f"加载器: {__loader__}")

if __name__ == "__main__":
    show_loader_info()
```

## __spec__

`__spec__` 变量包含模块的导入系统规范。

```python
# spec_demo.py
def show_module_spec():
    """显示模块规范信息"""
    if __spec__ is not None:
        print(f"模块名称: {__spec__.name}")
        print(f"模块文件: {__spec__.origin}")
        print(f"是否有子模块: {__spec__.submodule_search_locations}")
        print(f"加载器: {__spec__.loader}")
    else:
        print("没有模块规范信息")

if __name__ == "__main__":
    show_module_spec()
```

## 实际应用示例

### 1. 命令行工具模板

```python
# cli_tool.py
import argparse
import sys
from pathlib import Path

__version__ = "1.0.0"
__author__ = "开发者"
__description__ = "一个简单的命令行工具"

def create_parser():
    """创建命令行参数解析器"""
    parser = argparse.ArgumentParser(
        description=__description__,
        prog=Path(__file__).stem
    )
    
    parser.add_argument(
        '--version',
        action='version',
        version=f'%(prog)s {__version__}'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='详细输出'
    )
    
    parser.add_argument(
        'input_file',
        help='输入文件路径'
    )
    
    return parser

def main():
    """主函数"""
    parser = create_parser()
    args = parser.parse_args()
    
    if args.verbose:
        print(f"当前文件: {__file__}")
        print(f"模块名称: {__name__}")
        print(f"版本: {__version__}")
    
    print(f"处理文件: {args.input_file}")

if __name__ == "__main__":
    main()
else:
    print(f"模块 {__name__} 已导入，版本 {__version__}")
```

### 2. 配置管理模块

```python
# config.py
import os
import json
from pathlib import Path

__config__ = {}

def load_config(config_file=None):
    """加载配置文件"""
    if config_file is None:
        # 使用当前目录下的 config.json
        current_dir = Path(__file__).parent
        config_file = current_dir / 'config.json'
    
    if config_file.exists():
        with open(config_file, 'r', encoding='utf-8') as f:
            __config__.update(json.load(f))
        print(f"配置已加载: {config_file}")
    else:
        print(f"配置文件不存在: {config_file}")
        __config__ = get_default_config()

def get_default_config():
    """获取默认配置"""
    return {
        'debug': False,
        'timeout': 30,
        'max_retries': 3,
        'database': {
            'host': 'localhost',
            'port': 5432
        }
    }

def get_config(key=None, default=None):
    """获取配置值"""
    if key is None:
        return __config__
    return __config__.get(key, default)

# 模块加载时自动加载配置
if __name__ == "__main__":
    # 作为主程序运行时
    load_config()
    print("当前配置:", get_config())
else:
    # 作为模块导入时
    print(f"配置模块已加载 (从 {__name__})")
```

### 3. 日志配置模块

```python
# logger.py
import logging
import sys
from pathlib import Path

__loggers__ = {}

def setup_logger(name=None, level=logging.INFO, log_file=None):
    """设置日志器"""
    if name is None:
        name = Path(__file__).stem
    
    if name in __loggers__:
        return __loggers__[name]
    
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # 控制台处理器
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    
    # 文件处理器
    if log_file:
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(level)
        logger.addHandler(file_handler)
    
    # 格式化器
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(formatter)
    if log_file:
        file_handler.setFormatter(formatter)
    
    logger.addHandler(console_handler)
    __loggers__[name] = logger
    
    return logger

def get_logger(name=None):
    """获取日志器"""
    if name is None:
        name = Path(__file__).stem
    return __loggers__.get(name, setup_logger(name))

# 模块级别的日志器
logger = get_logger()

if __name__ == "__main__":
    # 测试日志功能
    logger.info(f"日志模块测试 (文件: {__file__})")
    logger.debug("调试信息")
    logger.warning("警告信息")
    logger.error("错误信息")
```

## 最佳实践

### 1. 模块结构

```python
# module_template.py
"""
模块文档字符串

这个模块提供了...功能。
"""

# 模块元信息
__version__ = "1.0.0"
__author__ = "作者名"
__email__ = "author@example.com"
__license__ = "MIT"
__description__ = "模块描述"

# 公共接口
__all__ = ['public_function', 'PublicClass']

# 导入依赖
import os
import sys
from typing import Any, List

# 私有变量
_private_var = "这是一个私有变量"

# 公共函数
def public_function():
    """公共函数"""
    return "Hello, World!"

def _private_function():
    """私有函数"""
    return "This is private"

# 类定义
class PublicClass:
    """公共类"""
    pass

class _PrivateClass:
    """私有类"""
    pass

# 模块初始化代码
if __name__ == "__main__":
    # 模块测试代码
    print(f"模块 {__name__} 版本 {__version__}")
    print("模块测试:")
    print(public_function())
else:
    # 模块被导入时的初始化
    logger = get_logger(__name__)
    logger.info(f"模块 {__name__} 已加载")
```

### 2. 版本检查

```python
# version_check.py
def check_python_version(min_version=(3, 8)):
    """检查 Python 版本"""
    current_version = sys.version_info[:2]
    if current_version < min_version:
        raise RuntimeError(
            f"需要 Python {min_version[0]}.{min_version[1]} 或更高版本，"
            f"当前版本: {current_version[0]}.{current_version[1]}"
        )
    print(f"Python 版本检查通过: {current_version[0]}.{current_version[1]}")

if __name__ == "__main__":
    check_python_version()
```

