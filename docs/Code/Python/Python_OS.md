# Python3 OS 文件/目录方法

os 模块是 Python 标准库中的一个重要模块，它提供了与操作系统交互的功能。

通过 os 模块，你可以执行文件操作、目录操作、环境变量管理、进程管理等任务。

os 模块是跨平台的，这意味着你可以在不同的操作系统（如 Windows、Linux、macOS）上使用相同的代码。

在使用 os 模块之前，你需要先导入它。导入 os 模块的代码如下：

```python
import os
```

## os 模块的常用功能

### 1. 获取当前工作目录

`os.getcwd()` 函数用于获取当前工作目录的路径。当前工作目录是 Python 脚本执行时所在的目录。

```python
# 实例
current_directory = os.getcwd()
print("当前工作目录:", current_directory)
```

### 2. 改变当前工作目录

`os.chdir(path)` 函数用于改变当前工作目录。path 是你想要切换到的目录路径。

```python
# 实例
os.chdir("/path/to/new/directory")
print("新的工作目录:", os.getcwd())
```

### 3. 列出目录内容

`os.listdir(path)` 函数用于列出指定目录中的所有文件和子目录。如果不提供 path 参数，则默认列出当前工作目录的内容。

```python
# 实例
files_and_dirs = os.listdir()
print("目录内容:", files_and_dirs)

# 列出指定目录
path_contents = os.listdir("/path/to/directory")
print("指定目录内容:", path_contents)
```

### 4. 创建目录

`os.mkdir(path)` 函数用于创建一个新的目录。如果目录已经存在，会抛出 `FileExistsError` 异常。

```python
# 实例
os.mkdir("new_directory")

# 创建带权限的目录
os.mkdir("new_directory", mode=0o755)  # Unix/Linux
```

### 5. 删除目录

`os.rmdir(path)` 函数用于删除一个空目录。如果目录不为空，会抛出 `OSError` 异常。

```python
# 实例
os.rmdir("new_directory")
```

### 6. 删除文件

`os.remove(path)` 函数用于删除一个文件。如果文件不存在，会抛出 `FileNotFoundError` 异常。

```python
# 实例
os.remove("file_to_delete.txt")
```

### 7. 重命名文件或目录

`os.rename(src, dst)` 函数用于重命名文件或目录。src 是原始路径，dst 是新的路径。

```python
# 实例
os.rename("old_name.txt", "new_name.txt")

# 移动文件
os.rename("/path/to/old/file.txt", "/path/to/new/file.txt")
```

### 8. 获取环境变量

`os.getenv(key)` 函数用于获取指定环境变量的值。如果环境变量不存在，返回 None。

```python
# 实例
home_directory = os.getenv("HOME")
print("HOME 目录:", home_directory)

# 带默认值
path_variable = os.getenv("PATH", "未找到PATH环境变量")
print("PATH:", path_variable)
```

### 9. 执行系统命令

`os.system(command)` 函数用于在操作系统的 shell 中执行命令。命令执行后，返回命令的退出状态。

```python
# 实例
os.system("ls -l")  # Linux/macOS
os.system("dir")    # Windows

# 获取命令执行结果（推荐使用 subprocess）
result = os.system("echo Hello World")
print(f"命令退出状态: {result}")
```

## 文件和目录操作详解

### 文件操作

#### 文件信息获取

```python
import os
import stat

file_path = "example.txt"

# 检查文件是否存在
if os.path.exists(file_path):
    print(f"文件 {file_path} 存在")
else:
    print(f"文件 {file_path} 不存在")

# 获取文件状态信息
if os.path.exists(file_path):
    file_stat = os.stat(file_path)
    print(f"文件大小: {file_stat.st_size} 字节")
    print(f"最后修改时间: {file_stat.st_mtime}")
    print(f"文件权限: {oct(file_stat.st_mode)}")
    
    # 检查文件类型
    if stat.S_ISREG(file_stat.st_mode):
        print("这是一个普通文件")
    elif stat.S_ISDIR(file_stat.st_mode):
        print("这是一个目录")
```

#### 文件权限操作

```python
# 检查文件权限
file_path = "test.txt"

# 检查可读权限
readable = os.access(file_path, os.R_OK)
print(f"文件可读: {readable}")

# 检查可写权限
writable = os.access(file_path, os.W_OK)
print(f"文件可写: {writable}")

# 检查可执行权限
executable = os.access(file_path, os.X_OK)
print(f"文件可执行: {executable}")

# 修改文件权限 (Unix/Linux)
os.chmod(file_path, 0o644)  # rw-r--r--
```

### 目录操作

#### 创建多级目录

```python
# 创建单个目录
os.mkdir("single_dir")

# 递归创建多级目录
os.makedirs("parent/child/grandchild", exist_ok=True)
```

#### 遍历目录树

```python
def walk_directory(path):
    """遍历目录树"""
    print(f"\n遍历目录: {path}")
    
    for root, dirs, files in os.walk(path):
        print(f"\n当前目录: {root}")
        print(f"子目录: {dirs}")
        print(f"文件: {files}")
        
        # 只遍历当前目录
        for file in files:
            file_path = os.path.join(root, file)
            file_size = os.path.getsize(file_path)
            print(f"  文件: {file} ({file_size} 字节)")

# 使用示例
walk_directory(".")
```

#### 目录操作示例

```python
# 获取当前目录的父目录
parent_dir = os.path.dirname(os.getcwd())
print(f"父目录: {parent_dir}")

# 获取文件名
file_path = "/path/to/file.txt"
filename = os.path.basename(file_path)
print(f"文件名: {filename}")

# 获取目录路径
directory = os.path.dirname(file_path)
print(f"目录路径: {directory}")

# 构建路径
new_path = os.path.join(directory, "new_file.txt")
print(f"新路径: {new_path}")
```

## os 常用方法详解

### 1. os.access(path, mode)

检验权限模式。

```python
# 参数 mode 可以是:
# os.F_OK: 检查文件是否存在
# os.R_OK: 检查可读权限
# os.W_OK: 检查可写权限
# os.X_OK: 检查可执行权限

file_path = "test.txt"
if os.access(file_path, os.F_OK):
    print("文件存在")
if os.access(file_path, os.R_OK):
    print("文件可读")
```

### 2. os.chdir(path)

改变当前工作目录。

```python
original_dir = os.getcwd()
print(f"原始目录: {original_dir}")

# 切换到父目录
os.chdir("..")
print(f"切换后目录: {os.getcwd()}")

# 切换回原始目录
os.chdir(original_dir)
print(f"回到原始目录: {os.getcwd()}")
```

### 3. os.chmod(path, mode)

更改文件权限（Unix/Linux）。

```python
# 权限模式:
# 0o400: 只读
# 0o600: 读写（所有者）
# 0o644: 读写（所有者），只读（其他用户）
# 0o755: 读写执行（所有者），读执行（其他用户）

os.chmod("script.py", 0o755)
```

### 4. os.chown(path, uid, gid)

更改文件所有者（Unix/Linux）。

```python
import pwd
import grp

# 获取用户和组信息
try:
    user_info = pwd.getpwnam("username")
    group_info = grp.getgrnam("groupname")
    
    os.chown("file.txt", user_info.pw_uid, group_info.gr_gid)
    print("文件所有者已更改")
except KeyError:
    print("用户或组不存在")
```

### 5. os.makedirs(path[, mode])

递归文件夹创建函数。

```python
# 创建多级目录
os.makedirs("data/logs/2023", mode=0o755)

# exist_ok=True 避免目录已存在时报错
os.makedirs("existing/path", exist_ok=True)
```

### 6. os.path 模块

获取文件的属性信息。

#### 路径操作

```python
file_path = "/home/user/documents/file.txt"

# 路径分割
print(f"目录: {os.path.dirname(file_path)}")
print(f"文件名: {os.path.basename(file_path)}")

# 路径扩展名
print(f"不带扩展名的文件名: {os.path.splitext(file_path)[0]}")
print(f"扩展名: {os.path.splitext(file_path)[1]}")

# 绝对路径
abs_path = os.path.abspath("relative/path.txt")
print(f"绝对路径: {abs_path}")

# 规范化路径
norm_path = os.path.normpath("/home/user//documents/../user/file.txt")
print(f"规范化路径: {norm_path}")
```

#### 文件检查

```python
file_path = "example.txt"

# 文件存在性检查
print(f"文件存在: {os.path.exists(file_path)}")

# 文件类型检查
print(f"是文件: {os.path.isfile(file_path)}")
print(f"是目录: {os.path.isdir(file_path)}")

# 是否为符号链接
print(f"是符号链接: {os.path.islink(file_path)}")

# 文件大小
if os.path.exists(file_path):
    size = os.path.getsize(file_path)
    print(f"文件大小: {size} 字节")

# 文件时间
if os.path.exists(file_path):
    mtime = os.path.getmtime(file_path)
    atime = os.path.getatime(file_path)
    ctime = os.path.getctime(file_path)
    
    import time
    print(f"最后修改时间: {time.ctime(mtime)}")
    print(f"最后访问时间: {time.ctime(atime)}")
    print(f"创建时间: {time.ctime(ctime)}")
```

## 高级操作示例

### 批量文件处理

```python
import os
import shutil

def organize_files(source_dir, target_dir):
    """按文件扩展名组织文件"""
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
    
    for filename in os.listdir(source_dir):
        source_path = os.path.join(source_dir, filename)
        
        if os.path.isfile(source_path):
            # 获取文件扩展名
            ext = os.path.splitext(filename)[1].lower()
            if not ext:
                continue
                
            # 创建目标子目录
            ext_dir = os.path.join(target_dir, ext[1:])  # 去掉点
            os.makedirs(ext_dir, exist_ok=True)
            
            # 移动文件
            target_path = os.path.join(ext_dir, filename)
            shutil.move(source_path, target_path)
            print(f"移动 {filename} 到 {target_path}")

# 使用示例
organize_files("/path/to/source", "/path/to/organized")
```

### 文件监控

```python
import os
import time

def monitor_directory(directory, interval=1):
    """监控目录变化"""
    print(f"开始监控目录: {directory}")
    
    # 获取初始状态
    initial_files = set(os.listdir(directory))
    
    try:
        while True:
            current_files = set(os.listdir(directory))
            
            # 检查新增文件
            new_files = current_files - initial_files
            for file in new_files:
                print(f"新文件: {file}")
            
            # 检查删除文件
            deleted_files = initial_files - current_files
            for file in deleted_files:
                print(f"删除文件: {file}")
            
            initial_files = current_files
            time.sleep(interval)
            
    except KeyboardInterrupt:
        print("监控停止")

# 使用示例
# monitor_directory("/path/to/watch")
```

### 环境变量管理

```python
# 获取所有环境变量
all_env = os.environ
print("所有环境变量:")
for key, value in sorted(all_env.items()):
    print(f"{key} = {value}")

# 设置环境变量
os.environ["MY_VAR"] = "my_value"
print(f"MY_VAR = {os.getenv('MY_VAR')}")

# 删除环境变量
if "MY_VAR" in os.environ:
    del os.environ["MY_VAR"]
    print("MY_VAR 已删除")

# 获取特定路径
home_dir = os.path.expanduser("~")
print(f"用户主目录: {home_dir}")

# 展开环境变量
path_expanded = os.path.expandvars("$HOME/Documents")
print(f"展开的路径: {path_expanded}")
```

## 跨平台注意事项

### 路径分隔符

```python
# 使用 os.path.join 处理路径分隔符
file_path = os.path.join("folder", "subfolder", "file.txt")
print(f"跨平台路径: {file_path}")

# 在 Windows 上: folder\subfolder\file.txt
# 在 Unix/Linux 上: folder/subfolder/file.txt

# 获取平台特定的分隔符
print(f"路径分隔符: {os.sep}")
print(f"路径列表分隔符: {os.pathsep}")
```

### 平台特定操作

```python
import platform

system = platform.system()
print(f"操作系统: {system}")

if system == "Windows":
    print("执行 Windows 特定操作")
    os.system("dir")
elif system == "Linux":
    print("执行 Linux 特定操作")
    os.system("ls -la")
elif system == "Darwin":  # macOS
    print("执行 macOS 特定操作")
    os.system("ls -la")
```

## 错误处理

### 常见异常处理

```python
import os
import errno

def safe_file_operation():
    """安全的文件操作示例"""
    try:
        # 尝试创建目录
        os.makedirs("new_directory")
        print("目录创建成功")
    except FileExistsError:
        print("目录已存在")
    except PermissionError:
        print("没有权限创建目录")
    
    try:
        # 尝试删除文件
        os.remove("nonexistent_file.txt")
    except FileNotFoundError:
        print("文件不存在")
    except PermissionError:
        print("没有权限删除文件")
    
    try:
        # 尝试切换目录
        os.chdir("/nonexistent/directory")
    except FileNotFoundError:
        print("目录不存在")
    
    try:
        # 尝试读取不存在的文件信息
        os.stat("nonexistent_file.txt")
    except FileNotFoundError:
        print("文件不存在")

safe_file_operation()
```

## 性能优化建议

### 大文件处理

```python
import os

def process_large_file(file_path, chunk_size=8192):
    """高效处理大文件"""
    file_size = os.path.getsize(file_path)
    print(f"文件大小: {file_size} 字节")
    
    with open(file_path, 'rb') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            # 处理数据块
            process_chunk(chunk)

def process_chunk(chunk):
    """处理数据块"""
    pass  # 实现具体的处理逻辑
```

### 批量操作优化

```python
import os
from concurrent.futures import ThreadPoolExecutor
import time

def process_file(filename):
    """处理单个文件"""
    # 模拟文件处理
    time.sleep(0.1)
    return f"处理完成: {filename}"

def batch_process_files(directory, max_workers=4):
    """批量并行处理文件"""
    files = [f for f in os.listdir(directory) 
             if os.path.isfile(os.path.join(directory, f))]
    
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(process_file, files))
    
    end_time = time.time()
    
    print(f"处理了 {len(files)} 个文件")
    print(f"耗时: {end_time - start_time:.2f} 秒")
    for result in results[:5]:  # 只显示前5个结果
        print(result)
```

