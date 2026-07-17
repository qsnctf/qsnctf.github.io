# Python 爬虫

## 概念与用途

爬虫获取网页、解析结构、去重链接并持久化数据。适合公开数据采集和授权监测；动态页面可能需要浏览器或直接调用公开 API。

本页示例建议 `python -m pip install "beautifulsoup4>=4.12" "requests>=2.31"`。真实采集需要网络、明确授权和可识别 User-Agent；解析本地 HTML 不依赖外部服务。

## 核心 API

常见组合是 Requests 获取内容、Beautiful Soup 解析 HTML。请求需设置 User-Agent、超时和限速，链接应使用 `urljoin()` 解析。

```python
from bs4 import BeautifulSoup

html = "<ul><li><a href='/a'>Python</a></li><li><a href='/b'>安全</a></li></ul>"
soup = BeautifulSoup(html, "html.parser")
for link in soup.select("li > a[href]"):
    print(link.get_text(strip=True), link["href"])
```

## 流程与边界

| 阶段 | 工具 | 工程要求 |
| --- | --- | --- |
| 获取 | Requests/httpx | 超时、限速、重试上限 |
| 解析 | Beautiful Soup/lxml | 输入大小和编码 |
| 去重 | set/数据库 | URL 规范化 |
| 存储 | 文件/数据库 | schema、事务、清理 |

## 示例：规范化相对链接

```python
from urllib.parse import urljoin, urlparse

base = "https://example.com/docs/index.html"
for href in ("../about", "/help", "https://other.example/x"):
    absolute = urljoin(base, href)
    parsed = urlparse(absolute)
    print(parsed.netloc, absolute)
```

HTTP Session 和响应应关闭，数据库事务应提交或回滚。遵循 robots 并不自动构成法律授权；涉及个人数据、登录态或访问控制时必须先取得明确许可。

## 常见错误与安全注意

- 采集前检查授权、服务条款、robots 和适用法律，并实现礼貌限速。
- 不要信任下载内容、文件名或跳转地址，需防 SSRF、路径穿越和恶意文件。
- 页面结构会变化，解析器应有测试、监控、重试上限和失败样本。
