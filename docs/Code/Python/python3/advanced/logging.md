# Python logging 模块

## 概念与用途

`logging` 提供分级、可配置且线程安全的日志系统。应用代码通过命名 logger 记录事件，handler 决定输出位置，formatter 决定格式。

## 核心 API

使用 `logging.getLogger(__name__)` 获取 logger，调用 `debug/info/warning/error/exception`。应用入口可用 `basicConfig()`，库代码不应擅自配置根 logger。

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger(__name__)
logger.info("任务开始", extra={"task_id": "demo-1"})
try:
    1 / 0
except ZeroDivisionError:
    logger.exception("任务失败")
```

## 常见错误与安全注意

- 不要记录密码、令牌、完整 Cookie 或个人敏感数据。
- 参数化日志使用 `logger.info("count=%s", count)`，避免无必要格式化开销。
- 生产环境需配置轮换、保留期、集中采集和统一关联 ID。
