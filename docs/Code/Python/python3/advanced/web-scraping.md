# Python 爬虫

## 概念与用途

爬虫获取网页、解析结构、去重链接并持久化数据。适合公开数据采集和授权监测；动态页面可能需要浏览器或直接调用公开 API。

## 核心 API

常见组合是 Requests 获取内容、Beautiful Soup 解析 HTML。请求需设置 User-Agent、超时和限速，链接应使用 `urljoin()` 解析。

```python
from bs4 import BeautifulSoup

html = "<ul><li><a href='/a'>Python</a></li><li><a href='/b'>安全</a></li></ul>"
soup = BeautifulSoup(html, "html.parser")
for link in soup.select("li > a[href]"):
    print(link.get_text(strip=True), link["href"])
```

## 常见错误与安全注意

- 采集前检查授权、服务条款、robots 和适用法律，并实现礼貌限速。
- 不要信任下载内容、文件名或跳转地址，需防 SSRF、路径穿越和恶意文件。
- 页面结构会变化，解析器应有测试、监控、重试上限和失败样本。
