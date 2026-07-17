# Python3 标准库概览

## 概念与用途

标准库随 Python 发布，覆盖文件、数据格式、日期、并发、网络、测试和系统接口。先评估标准库可以减少依赖供应链风险，但仍要理解模块的适用边界。

## 核心模块

常用模块包括 `pathlib` 路径、`json/csv` 数据、`datetime` 时间、`re` 正则、`collections` 容器、`subprocess` 进程、`logging` 日志、`unittest` 测试和 `hashlib` 摘要。

```python
import json
from collections import Counter
from datetime import datetime, timezone

record = {
    "time": datetime.now(timezone.utc).isoformat(),
    "counts": Counter("banana"),
}
print(json.dumps(record, ensure_ascii=False))
```

## 常见错误与工程注意

- 标准库不代表所有 API 都安全适合不可信输入，例如 `pickle` 可执行任意代码。
- 不要用本地文件名遮蔽标准库模块。
- 跨 Python 版本的行为和可用 API 可能变化，部署前固定并测试目标版本。
