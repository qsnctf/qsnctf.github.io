# Python 文件操作详解

## 1. 文件操作概述

### 什么是文件操作

文件操作是编程中最基础且重要的功能之一，Python提供了丰富的内置函数和方法来处理文件。文件操作主要包括文件的创建、读取、写入、追加、删除等操作。

### 文件操作的重要性

- **数据持久化**：将程序运行结果保存到文件中
- **配置管理**：读取和写入配置文件
- **数据处理**：处理文本、CSV、JSON等格式的数据文件
- **日志记录**：记录程序运行状态和错误信息

## 2. open() 方法

### 基本语法

`open()` 函数是Python中用于打开文件的核心函数，其基本语法如下：

```python
file_object = open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)
```

### 参数说明

- **file**：文件路径（字符串或字节对象）
- **mode**：文件打开模式（默认为 'r'）
- **buffering**：缓冲策略
- **encoding**：文件编码（如 'utf-8', 'gbk' 等）
- **errors**：编码错误处理策略
- **newline**：换行符处理
- **closefd**：是否关闭底层文件描述符
- **opener**：自定义开启器

### 基本使用示例

```python
# 基本文件打开
file = open('example.txt', 'r')
content = file.read()
file.close()

# 使用with语句（推荐）
with open('example.txt', 'r') as file:
    content = file.read()
    # 文件会自动关闭
```

## 3. mode 参数详解

### 基本模式

| 模式 | 描述 | 文件存在 | 文件不存在 |
|------|------|----------|------------|
| 'r'  | 只读模式 | 打开文件 | 抛出错误 |
| 'w'  | 写入模式 | 清空内容 | 创建文件 |
| 'a'  | 追加模式 | 追加内容 | 创建文件 |
| 'x'  | 独占创建 | 抛出错误 | 创建文件 |

### 组合模式

| 模式 | 描述 |
|------|------|
| 'r+' | 读写模式（文件必须存在） |
| 'w+' | 读写模式（清空文件） |
| 'a+' | 读写模式（追加内容） |

### 二进制模式

在基本模式后添加 'b' 表示二进制模式：

```python
# 二进制读取
with open('image.jpg', 'rb') as file:
    binary_data = file.read()

# 二进制写入
with open('data.bin', 'wb') as file:
    file.write(b'\x00\x01\x02\x03')
```

### 文本模式 vs 二进制模式

```python
# 文本模式（默认）
with open('text_file.txt', 'r') as file:  # 等同于 'rt'
    text = file.read()

# 二进制模式
with open('binary_file.bin', 'rb') as file:
    binary = file.read()
```

## 4. file 对象的方法

### 读取方法

#### read() 方法

```python
# 读取整个文件
with open('example.txt', 'r') as file:
    content = file.read()
    print(content)

# 读取指定字节数
with open('example.txt', 'r') as file:
    first_100_bytes = file.read(100)
    next_50_bytes = file.read(50)
```

#### readline() 方法

```python
# 逐行读取
with open('example.txt', 'r') as file:
    line1 = file.readline()
    line2 = file.readline()
    line3 = file.readline()

# 读取所有行（列表形式）
with open('example.txt', 'r') as file:
    lines = file.readlines()
    for line in lines:
        print(line.strip())  # 去除换行符
```

#### 迭代文件对象

```python
# 推荐的方式：直接迭代文件对象
with open('example.txt', 'r') as file:
    for line_number, line in enumerate(file, 1):
        print(f"第{line_number}行: {line.strip()}")
```

### 写入方法

#### write() 方法

```python
# 写入字符串
with open('output.txt', 'w') as file:
    file.write("Hello, World!\n")
    file.write("这是第二行\n")

# 写入多行内容
lines = ["第一行\n", "第二行\n", "第三行\n"]
with open('output.txt', 'w') as file:
    file.writelines(lines)
```

#### 格式化写入

```python
# 使用格式化字符串
name = "张三"
age = 25
score = 95.5

with open('student.txt', 'w') as file:
    file.write(f"姓名: {name}\n")
    file.write(f"年龄: {age}\n")
    file.write(f"成绩: {score:.1f}\n")
```

### 文件位置方法

#### tell() 方法

```python
# 获取当前文件位置
with open('example.txt', 'r') as file:
    print(f"初始位置: {file.tell()}")
    file.read(10)
    print(f"读取10字节后位置: {file.tell()}")
```

#### seek() 方法

```python
# 移动文件指针
with open('example.txt', 'r') as file:
    # 移动到文件开头
    file.seek(0)
    
    # 移动到第10个字节
    file.seek(10)
    
    # 从当前位置向后移动5个字节
    file.seek(5, 1)  # 1表示从当前位置
    
    # 从文件末尾向前移动10个字节
    file.seek(-10, 2)  # 2表示从文件末尾
```

### 其他方法

#### flush() 方法

```python
# 强制刷新缓冲区
with open('log.txt', 'a') as file:
    file.write("重要日志信息\n")
    file.flush()  # 立即写入磁盘
    # 继续其他操作
```

#### truncate() 方法

```python
# 截断文件
with open('example.txt', 'r+') as file:
    file.seek(50)  # 移动到第50个字节
    file.truncate()  # 截断文件，保留前50字节
```

## 5. 文件编码处理

### 常见编码格式

```python
# 指定编码打开文件
with open('chinese.txt', 'r', encoding='utf-8') as file:
    content = file.read()

# 处理编码错误
with open('problematic.txt', 'r', encoding='utf-8', errors='ignore') as file:
    content = file.read()  # 忽略编码错误

with open('problematic.txt', 'r', encoding='utf-8', errors='replace') as file:
    content = file.read()  # 用?替换无法解码的字符
```

### 编码检测

```python
import chardet

def detect_encoding(file_path):
    with open(file_path, 'rb') as file:
        raw_data = file.read()
        result = chardet.detect(raw_data)
        return result['encoding']

encoding = detect_encoding('unknown.txt')
print(f"检测到的编码: {encoding}")

with open('unknown.txt', 'r', encoding=encoding) as file:
    content = file.read()
```

## 6. 文件路径处理

### os.path 模块

```python
import os

# 路径操作
file_path = "/path/to/example.txt"

# 获取文件名
filename = os.path.basename(file_path)
print(f"文件名: {filename}")

# 获取目录名
dirname = os.path.dirname(file_path)
print(f"目录名: {dirname}")

# 路径拼接
new_path = os.path.join(dirname, "new_file.txt")
print(f"新路径: {new_path}")

# 检查路径是否存在
if os.path.exists(file_path):
    print("文件存在")
else:
    print("文件不存在")
```

### pathlib 模块（Python 3.4+）

```python
from pathlib import Path

# 创建Path对象
file_path = Path("example.txt")

# 路径操作
print(f"文件名: {file_path.name}")
print(f"后缀名: {file_path.suffix}")
print(f"父目录: {file_path.parent}")

# 文件操作
with file_path.open('r') as file:
    content = file.read()

# 创建新文件
new_file = Path("new_folder") / "new_file.txt"
new_file.parent.mkdir(parents=True, exist_ok=True)  # 创建父目录
new_file.write_text("Hello, World!")
```

## 7. 文件异常处理

### 基本异常处理

```python
try:
    with open('nonexistent.txt', 'r') as file:
        content = file.read()
except FileNotFoundError:
    print("文件不存在！")
except PermissionError:
    print("没有文件访问权限！")
except UnicodeDecodeError:
    print("文件编码错误！")
except Exception as e:
    print(f"发生错误: {e}")
```

### 上下文管理器的高级使用

```python
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        if exc_type:
            print(f"文件操作发生错误: {exc_val}")
        return True  # 抑制异常

# 使用自定义上下文管理器
with FileManager('example.txt', 'r') as file:
    content = file.read()
```

## 8. 常见文件格式处理

### 文本文件处理

```python
# 读取配置文件的示例
def read_config(file_path):
    config = {}
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            for line in file:
                line = line.strip()
                if line and not line.startswith('#'):  # 忽略空行和注释
                    if '=' in line:
                        key, value = line.split('=', 1)
                        config[key.strip()] = value.strip()
    except FileNotFoundError:
        print("配置文件不存在")
    return config

# 使用示例
config = read_config('config.txt')
print(config)
```

### CSV文件处理

```python
import csv

# 读取CSV文件
with open('data.csv', 'r', encoding='utf-8') as file:
    reader = csv.reader(file)
    headers = next(reader)  # 读取标题行
    for row in reader:
        print(f"{row[0]}: {row[1]}")

# 写入CSV文件
with open('output.csv', 'w', encoding='utf-8', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['姓名', '年龄', '城市'])  # 写入标题
    writer.writerow(['张三', '25', '北京'])
    writer.writerow(['李四', '30', '上海'])
```

### JSON文件处理

```python
import json

# 读取JSON文件
with open('data.json', 'r', encoding='utf-8') as file:
    data = json.load(file)
    print(data)

# 写入JSON文件
data = {
    "name": "张三",
    "age": 25,
    "hobbies": ["读书", "编程", "运动"]
}

with open('output.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=2)
```

## 9. 文件操作最佳实践

### 使用with语句

```python
# 推荐：使用with语句确保文件正确关闭
with open('file.txt', 'r') as file:
    data = file.read()

# 不推荐：手动管理文件关闭
file = open('file.txt', 'r')
try:
    data = file.read()
finally:
    file.close()
```

### 处理大文件

```python
# 逐行处理大文件
with open('large_file.txt', 'r', encoding='utf-8') as file:
    for line in file:
        process_line(line)  # 处理每一行

# 分块读取大文件
def read_in_chunks(file_path, chunk_size=1024):
    with open(file_path, 'rb') as file:
        while True:
            chunk = file.read(chunk_size)
            if not chunk:
                break
            yield chunk

# 使用生成器处理大文件
for chunk in read_in_chunks('large_file.bin'):
    process_chunk(chunk)
```

### 文件备份和版本控制

```python
import shutil
from datetime import datetime

def backup_file(file_path):
    """创建文件备份"""
    if not os.path.exists(file_path):
        return False
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f"{file_path}.backup_{timestamp}"
    
    shutil.copy2(file_path, backup_path)
    print(f"文件已备份到: {backup_path}")
    return True

# 使用示例
backup_file('important_data.txt')
```

## 10. 实际应用示例

### 日志记录系统

```python
import logging
from datetime import datetime

class FileLogger:
    def __init__(self, log_file='app.log'):
        self.log_file = log_file
    
    def log(self, level, message):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] [{level.upper()}] {message}\n"
        
        with open(self.log_file, 'a', encoding='utf-8') as file:
            file.write(log_entry)
    
    def info(self, message):
        self.log('info', message)
    
    def error(self, message):
        self.log('error', message)
    
    def warning(self, message):
        self.log('warning', message)

# 使用示例
logger = FileLogger('my_app.log')
logger.info("应用程序启动")
logger.warning("磁盘空间不足")
logger.error("数据库连接失败")
```

### 配置文件管理器

```python
import json
from pathlib import Path

class ConfigManager:
    def __init__(self, config_file='config.json'):
        self.config_file = Path(config_file)
        self.config = self.load_config()
    
    def load_config(self):
        """加载配置文件"""
        if self.config_file.exists():
            with open(self.config_file, 'r', encoding='utf-8') as file:
                return json.load(file)
        else:
            return {}
    
    def save_config(self):
        """保存配置文件"""
        with open(self.config_file, 'w', encoding='utf-8') as file:
            json.dump(self.config, file, ensure_ascii=False, indent=2)
    
    def get(self, key, default=None):
        """获取配置值"""
        return self.config.get(key, default)
    
    def set(self, key, value):
        """设置配置值"""
        self.config[key] = value
        self.save_config()

# 使用示例
config = ConfigManager('my_app_config.json')

# 设置配置
config.set('database.host', 'localhost')
config.set('database.port', 5432)
config.set('app.debug', True)

# 获取配置
db_host = config.get('database.host')
debug_mode = config.get('app.debug', False)
print(f"数据库主机: {db_host}")
print(f"调试模式: {debug_mode}")
```

### 文件搜索工具

```python
import os
from pathlib import Path

def search_files(directory, pattern, file_type=None):
    """搜索文件"""
    directory_path = Path(directory)
    results = []
    
    # 递归搜索目录
    for file_path in directory_path.rglob('*'):
        if file_path.is_file():
            # 检查文件类型
            if file_type and file_path.suffix != f".{file_type}":
                continue
            
            # 检查文件名模式
            if pattern.lower() in file_path.name.lower():
                results.append(file_path)
    
    return results

# 使用示例
files = search_files('.', 'python', 'py')
for file_path in files:
    print(f"找到文件: {file_path}")
```

## 11. 性能优化技巧

### 使用缓冲区

```python
# 调整缓冲区大小
with open('large_file.txt', 'r', buffering=8192) as file:  # 8KB缓冲区
    for line in file:
        process_line(line)
```

### 避免重复打开文件

```python
# 不推荐：重复打开文件
for i in range(10):
    with open('data.txt', 'r') as file:
        content = file.read()
    process_data(content)

# 推荐：一次性读取
with open('data.txt', 'r') as file:
    content = file.read()

for i in range(10):
    process_data(content)
```

### 使用内存映射文件

```python
import mmap

# 处理大文件的更高效方式
with open('large_file.bin', 'r+b') as file:
    with mmap.mmap(file.fileno(), 0) as mm:
        # 像操作内存一样操作文件
        data = mm[:100]  # 读取前100字节
        mm[100:200] = b'\x00' * 100  # 写入数据
```

## 12. 常见问题与解决方案

### 问题1：文件被占用无法删除

```python
import os
import time

def safe_delete(file_path, max_retries=3, delay=1):
    """安全删除文件，处理文件被占用的情况"""
    for attempt in range(max_retries):
        try:
            os.remove(file_path)
            print(f"文件 {file_path} 已删除")
            return True
        except PermissionError:
            if attempt < max_retries - 1:
                print(f"文件被占用，等待 {delay} 秒后重试...")
                time.sleep(delay)
            else:
                print(f"无法删除文件 {file_path}，可能被其他程序占用")
                return False
    return False
```

### 问题2：处理不同操作系统的路径差异

```python
import os

def get_cross_platform_path(*path_parts):
    """获取跨平台兼容的路径"""
    return os.path.join(*path_parts)

# 使用示例
file_path = get_cross_platform_path('data', 'files', 'example.txt')
print(f"路径: {file_path}")
```

