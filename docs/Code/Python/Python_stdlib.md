# Python3 标准库概览

Python 标准库非常庞大，所提供的组件涉及范围十分广泛，使用标准库我们可以轻松地完成各种任务。标准库是 Python 安装包的一部分，无需额外安装即可使用。

## 标准库的重要性

- **内置功能**：无需安装第三方库即可完成常见任务
- **跨平台兼容**：在 Windows、Linux、macOS 等系统上表现一致
- **性能优化**：经过长期优化，性能稳定可靠
- **官方维护**：由 Python 核心团队维护，质量有保障

## 核心模块介绍

### 1. os 模块

os 模块提供了许多与操作系统交互的函数。

**主要功能**：
- 文件和目录操作
- 进程管理
- 环境变量访问
- 路径操作

**示例代码**：
```python
import os

# 获取当前工作目录
current_dir = os.getcwd()
print(f"当前目录: {current_dir}")

# 列出目录内容
files = os.listdir('.')
print(f"目录内容: {files}")

# 创建目录
os.makedirs('new_folder', exist_ok=True)

# 获取环境变量
home_dir = os.environ.get('HOME', '未设置')
print(f"家目录: {home_dir}")

# 路径拼接
file_path = os.path.join('folder', 'subfolder', 'file.txt')
print(f"完整路径: {file_path}")
```

### 2. sys 模块

sys 模块提供了与 Python 解释器和系统相关的功能。

**主要功能**：
- 命令行参数处理
- 标准输入输出操作
- Python 解释器信息
- 退出程序

**示例代码**：
```python
import sys

# 获取命令行参数
print(f"脚本名称: {sys.argv[0]}")
print(f"参数列表: {sys.argv[1:]}")

# Python 版本信息
print(f"Python 版本: {sys.version}")
print(f"版本信息: {sys.version_info}")

# 模块搜索路径
print(f"模块路径: {sys.path}")

# 标准输入输出
sys.stdout.write("Hello from sys.stdout\n")
sys.stderr.write("Error message\n")

# 退出程序
if len(sys.argv) < 2:
    sys.exit("缺少必要参数")
```

### 3. time 模块

time 模块提供了处理时间的函数。

**主要功能**：
- 获取当前时间
- 时间格式化
- 延时操作
- 时间戳转换

**示例代码**：
```python
import time

# 获取当前时间戳
timestamp = time.time()
print(f"当前时间戳: {timestamp}")

# 时间格式化
local_time = time.localtime(timestamp)
formatted_time = time.strftime("%Y-%m-%d %H:%M:%S", local_time)
print(f"格式化时间: {formatted_time}")

# 延时
print("开始延时...")
time.sleep(2)  # 延时2秒
print("延时结束")

# 性能计时
start_time = time.perf_counter()
# 执行一些操作
for i in range(1000000):
    pass
end_time = time.perf_counter()
print(f"执行时间: {end_time - start_time:.6f} 秒")
```

### 4. datetime 模块

datetime 模块提供了更高级的日期和时间处理函数。

**主要功能**：
- 日期时间对象
- 时间差计算
- 时区处理
- 日期格式化

**示例代码**：
```python
from datetime import datetime, timedelta, timezone

# 当前时间
now = datetime.now()
print(f"当前时间: {now}")

# 特定时间
date_obj = datetime(2023, 12, 25, 10, 30, 0)
print(f"特定时间: {date_obj}")

# 时间差计算
tomorrow = now + timedelta(days=1)
print(f"明天: {tomorrow}")

# 时间格式化
formatted = now.strftime("%Y年%m月%d日 %H时%M分%S秒")
print(f"中文格式: {formatted}")

# 时区处理
utc_time = datetime.now(timezone.utc)
print(f"UTC时间: {utc_time}")

# 时间解析
date_str = "2023-12-25 10:30:00"
parsed_date = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
print(f"解析时间: {parsed_date}")
```

### 5. random 模块

random 模块提供了生成随机数的函数。

**主要功能**：
- 随机数生成
- 序列操作
- 概率分布
- 随机种子

**示例代码**：
```python
import random

# 基本随机数
print(f"随机整数: {random.randint(1, 100)}")
print(f"随机浮点数: {random.random()}")
print(f"范围内随机数: {random.uniform(1.5, 5.5)}")

# 序列操作
items = ['apple', 'banana', 'cherry', 'date']
print(f"随机选择: {random.choice(items)}")
print(f"随机样本: {random.sample(items, 2)}")

# 洗牌
random.shuffle(items)
print(f"洗牌后: {items}")

# 设置随机种子（可重现结果）
random.seed(42)
print(f"种子随机数: {random.randint(1, 100)}")

# 概率分布
normal_dist = [random.gauss(0, 1) for _ in range(5)]
print(f"正态分布: {normal_dist}")
```

### 6. math 模块

math 模块提供了数学函数。

**主要功能**：
- 基本数学运算
- 三角函数
- 对数指数
- 数学常数

**示例代码**：
```python
import math

# 基本运算
print(f"平方根: {math.sqrt(16)}")
print(f"幂运算: {math.pow(2, 8)}")
print(f"绝对值: {math.fabs(-5.5)}")

# 三角函数
angle = math.radians(45)  # 角度转弧度
print(f"正弦值: {math.sin(angle):.3f}")
print(f"余弦值: {math.cos(angle):.3f}")

# 对数指数
print(f"自然对数: {math.log(10)}")
print(f"常用对数: {math.log10(100)}")
print(f"指数: {math.exp(1)}")

# 数学常数
print(f"圆周率: {math.pi}")
print(f"自然常数: {math.e}")

# 其他函数
print(f"向上取整: {math.ceil(4.2)}")
print(f"向下取整: {math.floor(4.8)}")
print(f"阶乘: {math.factorial(5)}")
```

### 7. re 模块

re 模块提供了正则表达式处理函数。

**主要功能**：
- 模式匹配
- 文本搜索替换
- 字符串分割
- 分组提取

**示例代码**：
```python
import re

# 基本匹配
text = "我的电话是 123-456-7890，邮箱是 user@example.com"

# 查找电话号码
phone_pattern = r'\d{3}-\d{3}-\d{4}'
phones = re.findall(phone_pattern, text)
print(f"电话号码: {phones}")

# 查找邮箱
email_pattern = r'[\w\.-]+@[\w\.-]+\.\w+'
emails = re.findall(email_pattern, text)
print(f"邮箱地址: {emails}")

# 替换操作
new_text = re.sub(phone_pattern, '[电话号码]', text)
print(f"替换后: {new_text}")

# 分割字符串
words = re.split(r'\s+', "Hello   World    Python")
print(f"分割结果: {words}")

# 分组提取
pattern = r'(\d{3})-(\d{3})-(\d{4})'
match = re.search(pattern, text)
if match:
    print(f"完整匹配: {match.group(0)}")
    print(f"第一组: {match.group(1)}")
    print(f"第二组: {match.group(2)}")
    print(f"第三组: {match.group(3)}")
```

### 8. json 模块

json 模块提供了 JSON 编码和解码函数。

**主要功能**：
- Python 对象转 JSON
- JSON 转 Python 对象
- 文件读写
- 格式化输出

**示例代码**：
```python
import json

# Python 对象转 JSON
python_data = {
    "name": "张三",
    "age": 25,
    "hobbies": ["读书", "编程", "运动"],
    "married": False,
    "address": {
        "city": "北京",
        "street": "朝阳路"
    }
}

json_str = json.dumps(python_data, ensure_ascii=False, indent=2)
print("JSON 字符串:")
print(json_str)

# JSON 转 Python 对象
parsed_data = json.loads(json_str)
print(f"解析后姓名: {parsed_data['name']}")

# 文件操作
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(python_data, f, ensure_ascii=False, indent=2)

with open('data.json', 'r', encoding='utf-8') as f:
    loaded_data = json.load(f)
    print(f"从文件加载: {loaded_data['age']}")
```

### 9. urllib 模块

urllib 模块提供了访问网页和处理 URL 的功能。

**主要功能**：
- HTTP 请求
- URL 解析
- 文件下载
- 数据处理

**示例代码**：
```python
from urllib.request import urlopen, urlretrieve
from urllib.parse import urlparse, urlencode
import json

# 基本请求
try:
    with urlopen('https://httpbin.org/json') as response:
        data = response.read().decode('utf-8')
        json_data = json.loads(data)
        print("API 响应:")
        print(json.dumps(json_data, indent=2, ensure_ascii=False))
except Exception as e:
    print(f"请求错误: {e}")

# URL 解析
url = "https://www.example.com:8080/path/to/page?query=python#section"
parsed = urlparse(url)
print(f"协议: {parsed.scheme}")
print(f"域名: {parsed.netloc}")
print(f"路径: {parsed.path}")
print(f"查询参数: {parsed.query}")

# 参数编码
params = {
    'q': 'Python 编程',
    'page': 1,
    'limit': 10
}
encoded_params = urlencode(params)
print(f"编码参数: {encoded_params}")

# 文件下载（示例）
# urlretrieve('https://example.com/file.zip', 'downloaded_file.zip')
```

## 其他重要模块

### 10. collections 模块

提供额外的数据结构类型。

```python
from collections import Counter, defaultdict, deque, namedtuple

# 计数器
words = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple']
word_count = Counter(words)
print(f"词频统计: {word_count}")

# 默认字典
fruit_prices = defaultdict(lambda: '未知')
fruit_prices['apple'] = 5.0
print(f"苹果价格: {fruit_prices['apple']}")
print(f"香蕉价格: {fruit_prices['banana']}")

# 双端队列
dq = deque([1, 2, 3])
dq.appendleft(0)
dq.append(4)
print(f"双端队列: {dq}")

# 命名元组
Point = namedtuple('Point', ['x', 'y'])
p = Point(10, 20)
print(f"点坐标: ({p.x}, {p.y})")
```

### 11. itertools 模块

提供迭代器工具。

```python
import itertools

# 无限迭代器
counter = itertools.count(10, 2)
print("计数器:", [next(counter) for _ in range(5)])

# 排列组合
letters = ['A', 'B', 'C']
combinations = list(itertools.combinations(letters, 2))
print(f"组合: {combinations}")

permutations = list(itertools.permutations(letters, 2))
print(f"排列: {permutations}")

# 链式迭代
chain = itertools.chain([1, 2], [3, 4])
print(f"链式结果: {list(chain)}")
```

### 12. functools 模块

提供函数式编程工具。

```python
from functools import partial, reduce, lru_cache

# 偏函数
def multiply(x, y):
    return x * y

double = partial(multiply, 2)
print(f"偏函数结果: {double(5)}")

# 归约
numbers = [1, 2, 3, 4, 5]
product = reduce(lambda x, y: x * y, numbers)
print(f"归约乘积: {product}")

# 缓存装饰器
@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(f"斐波那契(10): {fibonacci(10)}")
```

## 标准库分类

### 文件系统操作
- `os`：操作系统接口
- `shutil`：高级文件操作
- `glob`：文件模式匹配
- `pathlib`：面向对象的路径操作

### 数据处理
- `csv`：CSV 文件读写
- `pickle`：Python 对象序列化
- `sqlite3`：SQLite 数据库接口
- `xml`：XML 处理

### 网络编程
- `socket`：底层网络接口
- `http.client`：HTTP 客户端
- `smtplib`：SMTP 协议客户端
- `ssl`：SSL/TLS 支持

### 并发编程
- `threading`：线程支持
- `multiprocessing`：进程支持
- `asyncio`：异步 I/O
- `queue`：队列同步

### 开发工具
- `unittest`：单元测试框架
- `doctest`：文档测试
- `pdb`：Python 调试器
- `logging`：日志记录

