# Python3 高级教程

## 定位与学习路线

高级篇覆盖文本协议、数据库、网络、并发、自动化、桌面开发、数据分析和第三方服务。页面互相独立，可在掌握函数、异常、模块和虚拟环境后按项目需要选择学习。

## 环境检查示例

第三方库应安装在项目虚拟环境中，并使用 `python -m pip` 确保解释器一致。下面的代码可查看当前环境中已安装的分发包。

```python
from importlib.metadata import distributions

packages = sorted(
    (item.metadata["Name"], item.version)
    for item in distributions()
    if item.metadata["Name"]
)
print("已安装包数量:", len(packages))
print(packages[:10])
```

## 工程注意事项

- 阅读具体库页面前先建立虚拟环境，并固定直接依赖版本。
- 网络、数据库和浏览器示例依赖外部服务，生产代码必须配置超时、重试、日志与凭据管理。
- 不可信数据不能直接交给 `pickle`、Shell、SQL 或动态代码执行接口。

## 主题目录

1. [Python3 正则表达式](regular-expressions.md)
2. [Python3 CGI编程](cgi-programming.md)
3. [Python3 MySQL(mysql-connector)](mysql-connector.md)
4. [Python3 MySQL(PyMySQL)](pymysql.md)
5. [Python3 网络编程](network-programming.md)
6. [Python3 SMTP发送邮件](smtp-email.md)
7. [Python3 多线程](multithreading.md)
8. [Python3 XML 解析](xml-parsing.md)
9. [Python3 JSON](json.md)
10. [Python3 日期和时间](date-time.md)
11. [Python3 内置函数](built-in-functions.md)
12. [Python3 MongoDB](mongodb.md)
13. [Python3 urllib](urllib.md)
14. [Python uWSGI 安装配置](uwsgi.md)
15. [Python3 pip](pip.md)
16. [Python3 operator](operator.md)
17. [Python math](math.md)
18. [Python requests](requests.md)
19. [Python random](random.md)
20. [Python OpenAI](openai.md)
21. [Python 有用的资源](useful-resources.md)
22. [Python AI 绘画](ai-painting.md)
23. [Python statistics](statistics.md)
24. [Python hashlib](hashlib.md)
25. [Python 量化](quantitative-finance.md)
26. [Python pyecharts](pyecharts.md)
27. [Python selenium 库](selenium.md)
28. [Python 爬虫](web-scraping.md)
29. [Python Scrapy 库](scrapy.md)
30. [Python Markdown](markdown.md)
31. [Python sys 模块](sys.md)
32. [Python Pickle 模块](pickle.md)
33. [Python subprocess 模块](subprocess.md)
34. [Python queue 模块](queue.md)
35. [Python StringIO 模块](stringio.md)
36. [Python logging 模块](logging.md)
37. [Python datetime 模块](datetime.md)
38. [Python re 模块](re.md)
39. [Python csv 模块](csv.md)
40. [Python threading 模块](threading.md)
41. [Python asyncio 模块](asyncio.md)
42. [Python PyQt](pyqt.md)
43. [Python for 循环](for-loop.md)
44. [Python while 循环](while-loop.md)
