# Python selenium 库

## 概念与用途

Selenium 通过 WebDriver 控制真实浏览器，适合端到端测试和必须执行 JavaScript 的自动化。现代 Selenium Manager 可自动发现或下载兼容驱动。

## 核心 API

安装 `python -m pip install selenium`。使用 `webdriver.Chrome()` 创建浏览器，定位器放在 `By` 中，`WebDriverWait` 配合 expected conditions 做显式等待。

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

## 常见错误与安全注意

- 不要依赖固定 `sleep()`，使用显式等待以减少脆弱测试。
- 必须在 `finally` 中 `quit()`，否则会遗留浏览器进程。
- 自动化应遵守站点条款、授权和频率限制，不得绕过访问控制。
