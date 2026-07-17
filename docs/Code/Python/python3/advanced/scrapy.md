# Python Scrapy 库

## 概念与用途

Scrapy 是事件驱动爬虫框架，内置调度器、下载器、Spider、Item Pipeline、中间件和去重。它适合多页面、并发和可恢复的数据采集任务。

## 核心 API

安装 `python -m pip install scrapy`，使用 `scrapy startproject` 创建项目。Spider 定义 `start_urls` 或 `start_requests()`，`parse()` 通过 CSS/XPath 提取并 `yield` 项目或请求。

```python
import scrapy

class QuoteSpider(scrapy.Spider):
    name = "quote-demo"

    def start_requests(self):
        yield scrapy.Request("data:text/html,<h1>Python</h1>")

    def parse(self, response):
        yield {"title": response.css("h1::text").get()}
```

运行文件可用 `scrapy runspider spider.py -O output.json`。

## 常见错误与安全注意

- 下载延迟、并发和自动限速要匹配目标站承载能力。
- Pipeline 中阻塞 I/O 会拖慢 reactor，应使用异步接口或线程池。
- 日志与导出中避免保存 Cookie、令牌和个人敏感信息。
