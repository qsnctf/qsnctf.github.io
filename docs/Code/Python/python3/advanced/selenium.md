# Python selenium 库

## 概念与用途

Selenium 通过 WebDriver 控制真实浏览器，适合端到端测试和必须执行 JavaScript 的自动化。现代 Selenium Manager 可自动发现或下载兼容驱动。

## 核心 API

本教程建议 `python -m pip install "selenium>=4.15"`。还需要兼容浏览器；Selenium Manager 通常可管理驱动，但首次运行可能需要网络下载并受代理策略影响。

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
driver = webdriver.Chrome(options=options)
try:
    driver.get("data:text/html,<title>Demo</title><h1 id='msg'>Hello</h1>")
    print(driver.title, driver.find_element(By.ID, "msg").text)
finally:
    driver.quit()
```

## 等待与资源

| API | 用途 | 建议 |
| --- | --- | --- |
| `set_page_load_timeout` | 页面加载上限 | 创建后设置 |
| `WebDriverWait` | 等元素状态 | 替代固定 sleep |
| `implicitly_wait` | 全局隐式等待 | 不与显式等待复杂混用 |
| `quit()` | 关闭全部窗口和驱动 | 始终 finally 调用 |

## 示例：显式等待

```python
from selenium.webdriver.support.ui import WebDriverWait

# 假设 driver 已按上一例创建
# driver.set_page_load_timeout(20)
# element = WebDriverWait(driver, 5).until(
#     lambda current: current.find_element(By.ID, "msg")
# )
print("显式等待应绑定具体条件，而不是固定休眠")
```

浏览器自动化会执行站点脚本，应隔离下载目录和凭据，避免用高权限用户运行。并发实例数量受 CPU、内存和站点容量限制，必须有任务总超时和进程回收。

## 常见错误与安全注意

- 不要依赖固定 `sleep()`，使用显式等待以减少脆弱测试。
- 必须在 `finally` 中 `quit()`，否则会遗留浏览器进程。
- 自动化应遵守站点条款、授权和频率限制，不得绕过访问控制。
