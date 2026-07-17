# Python Scrapy 库

## 概念与用途

Scrapy 是事件驱动爬虫框架，内置调度器、下载器、Spider、Item Pipeline、中间件和去重。它适合多页面、并发和可恢复的数据采集任务。

## 核心 API

本教程建议 `python -m pip install "Scrapy>=2.11"`，需要网络和目标站授权。使用 `scrapy startproject` 创建项目；Spider 的解析回调通过 CSS/XPath 提取并 `yield` 项目或请求。

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

## 核心组件

| 组件 | 职责 | 资源边界 |
| --- | --- | --- |
| Spider | 生成请求和解析响应 | 不做阻塞 I/O |
| Scheduler | 排队与去重 | 控制队列规模 |
| Downloader | 网络获取 | 超时、并发、重试 |
| Pipeline | 清洗和存储 | 关闭文件/数据库 |

## 示例：从本地 HTML 提取

```python
from scrapy.http import HtmlResponse

response = HtmlResponse(
    url="https://example.com/",
    body=b"<ul><li>Python</li><li>Scrapy</li></ul>",
    encoding="utf-8",
)
print(response.css("li::text").getall())
```

配置 `DOWNLOAD_TIMEOUT`、`CONCURRENT_REQUESTS_PER_DOMAIN` 和重试次数，并让 Pipeline 在 `close_spider` 清理资源。不要重试永久 4xx 或非幂等写请求。

## 常见错误与安全注意

- 下载延迟、并发和自动限速要匹配目标站承载能力。
- Pipeline 中阻塞 I/O 会拖慢 reactor，应使用异步接口或线程池。
- 日志与导出中避免保存 Cookie、令牌和个人敏感信息。
