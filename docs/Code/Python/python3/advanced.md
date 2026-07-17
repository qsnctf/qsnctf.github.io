# Python3 高级教程

本章整理 Python3 工程与常用库主题，适合作为基础语法之后的扩展学习路线。

## Python3 正则表达式

`re` 用于文本匹配、提取和替换。常用函数有 `match`、`search`、`findall`、`sub`。

```python
import re
print(re.findall(r"\d+", "id=123"))
```

## Python3 CGI编程

CGI 是早期 Web 程序接口。现代项目通常使用 Flask、Django、FastAPI 等框架。学习 CGI 可帮助理解环境变量、标准输入和 HTTP 响应格式。

## Python3 MySQL(mysql-connector)

`mysql-connector-python` 是 MySQL 官方连接器。使用时应参数化查询，避免拼接 SQL。

## Python3 MySQL(PyMySQL)

PyMySQL 是纯 Python MySQL 客户端，常用于脚本和 Web 项目。

```python
import pymysql

conn = pymysql.connect(host="localhost", user="root", password="pwd", database="demo")
```

## Python3 网络编程

`socket` 提供底层 TCP/UDP 编程能力。应用开发通常优先使用更高层 HTTP 客户端或框架。

## Python3 SMTP发送邮件

`smtplib` 可发送邮件，`email` 包用于构造 MIME 消息。真实环境应使用 TLS 和认证。

## Python3 多线程

`threading` 适合 I/O 密集任务。CPU 密集任务受 GIL 影响，通常考虑多进程或 native 扩展。

## Python3 XML 解析

可使用 `xml.etree.ElementTree` 解析 XML。不可信 XML 要注意实体扩展和外部实体风险。

## Python3 JSON

`json.dumps` 序列化，`json.loads` 反序列化。

```python
import json
data = json.loads('{"ok": true}')
```

## Python3 日期和时间

`datetime` 处理日期时间。跨时区业务应使用带时区对象。

## Python3 内置函数

常用内置函数包括 `len`、`sum`、`min`、`max`、`sorted`、`enumerate`、`zip`、`map`、`filter`、`any`、`all`。

## Python3 MongoDB

常用 `pymongo` 连接 MongoDB。注意索引设计、查询过滤和权限配置。

## Python3 urllib

`urllib.request` 是标准库 HTTP 客户端。复杂请求更常用 `requests` 或 `httpx`。

## Python uWSGI 安装配置

uWSGI 常用于部署 WSGI Web 应用。配置重点包括进程数、线程数、socket、日志、权限和 graceful reload。

## Python3 pip

`pip` 是 Python 包安装工具：

```bash
python -m pip install requests
python -m pip freeze > requirements.txt
```

推荐使用 `python -m pip`，避免 pip 与解释器不一致。

## Python3 operator

`operator` 提供函数形式的运算符，常用于排序 key、函数式处理和性能敏感场景。

## Python math

`math` 提供数学函数，如 `sqrt`、`sin`、`log`、`ceil`、`floor`。

## Python requests

`requests` 是常用 HTTP 客户端：

```python
import requests
r = requests.get("https://example.com", timeout=5)
print(r.status_code)
```

## Python random

`random` 用于伪随机数，不适合密码学用途。安全随机使用 `secrets`。

## Python OpenAI

调用模型 API 时应把密钥放在环境变量或密钥管理系统中，不要写入源码仓库。

## Python 有用的资源

常用资源包括官方文档、PEP 8、Python Package Index、Real Python、标准库文档和项目源码。

## Python AI 绘画

AI 绘画通常涉及模型推理、图像处理、GPU 环境、提示词和结果后处理。Python 常用于编排推理流程。

## Python statistics

`statistics` 提供均值、中位数、方差等基础统计函数。

## Python hashlib

`hashlib` 提供哈希算法：

```python
import hashlib
print(hashlib.sha256(b"data").hexdigest())
```

## Python 量化

量化分析常结合 NumPy、Pandas、Matplotlib、TA-Lib、backtrader 等库，重点是数据质量、回测偏差和风险控制。

## Python pyecharts

pyecharts 用于生成 ECharts 图表，适合交互式数据展示。

## Python selenium 库

Selenium 控制浏览器执行自动化测试和页面交互。爬虫场景要遵守站点规则和授权边界。

## Python 爬虫

爬虫通常涉及请求、解析、去重、限速、存储和错误重试。应遵守 robots、服务条款和法律边界。

## Python Scrapy 库

Scrapy 是爬虫框架，提供请求调度、解析、管道、下载中间件和并发控制。

## Python Markdown

Python-Markdown 可把 Markdown 转 HTML。MkDocs 就依赖 Python Markdown 生态处理文档。

## Python sys 模块

`sys` 提供解释器相关能力，如 `argv`、`path`、`exit`、`stdin`、`stdout`。

## Python Pickle 模块

`pickle` 可序列化 Python 对象。不要反序列化不可信 pickle，可能导致任意代码执行。

## Python subprocess 模块

`subprocess` 用于启动外部进程。处理用户输入时避免 `shell=True`，并使用参数列表。

## Python queue 模块

`queue.Queue` 常用于线程间安全队列。

## Python StringIO 模块

`io.StringIO` 在内存中模拟文本文件，适合测试和临时拼接。

## Python logging 模块

`logging` 用于结构化记录日志。生产代码不应长期依赖 `print` 调试。

## Python datetime 模块

`datetime` 处理日期、时间、时间差和格式化。注意时区和夏令时。

## Python re 模块

`re` 支持正则匹配。不可信正则或输入可能造成 ReDoS，应控制复杂度。

## Python csv 模块

`csv` 读写 CSV 文件，能正确处理引号、逗号和换行。

## Python threading 模块

`threading.Thread` 启动线程，`Lock`、`Event`、`Condition` 用于同步。

## Python asyncio 模块

`asyncio` 支持异步 I/O。适合大量并发网络请求，不适合直接加速 CPU 密集计算。

## Python PyQt

PyQt 用于构建桌面 GUI 应用。核心是信号槽、控件、布局和事件循环。

## Python for 循环

`for` 遍历可迭代对象。配合 `enumerate` 可同时获得下标和值。

## Python while 循环

`while` 在条件为真时重复执行。应确保循环条件最终能变化，避免死循环。
