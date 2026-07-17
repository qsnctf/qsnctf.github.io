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

## 组件职责

| 组件 | 职责 | 工程建议 |
| --- | --- | --- |
| Logger | 产生分级事件 | 使用模块名 |
| Handler | 写控制台/文件/网络 | 处理轮换与失败 |
| Formatter | 输出字段 | 时间、级别、关联 ID |
| Filter | 筛选或补充上下文 | 不做昂贵 I/O |

## 示例：避免重复 Handler

```python
import logging

logger = logging.getLogger("demo.worker")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
    logger.addHandler(handler)
logger.propagate = False
logger.info("只输出一次")
```

`logging` 是标准库，无需安装。网络 Handler 可能阻塞业务线程，生产系统可使用 `QueueHandler` 把格式化和发送移到专用消费者，并为日志后端配置容量与降级策略。

## 常见错误与安全注意

- 不要记录密码、令牌、完整 Cookie 或个人敏感数据。
- 参数化日志使用 `logger.info("count=%s", count)`，避免无必要格式化开销。
- 生产环境需配置轮换、保留期、集中采集和统一关联 ID。
