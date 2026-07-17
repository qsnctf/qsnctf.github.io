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

## 按任务选择模块

| 任务 | 模块 | 安全边界 |
| --- | --- | --- |
| 参数解析 | `argparse` | 校验类型和范围 |
| 临时资源 | `tempfile` | 使用上下文管理器 |
| 子进程 | `subprocess` | 参数列表、超时 |
| 安全随机 | `secrets` | 不用 `random` 生成令牌 |
| 数据序列化 | `json` | 不等于 schema 校验 |

## 示例：创建安全临时目录

```python
from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory(prefix="python-demo-") as directory:
    path = Path(directory) / "result.txt"
    path.write_text("ok", encoding="utf-8")
    print(path.read_text(encoding="utf-8"))
print("临时目录已清理")
```

标准库模块也有弃用周期，例如旧接口会在新版本移除。升级 Python 前应阅读 What's New、弃用警告并在目标版本运行测试。

## 常见错误与工程注意

- 标准库不代表所有 API 都安全适合不可信输入，例如 `pickle` 可执行任意代码。
- 不要用本地文件名遮蔽标准库模块。
- 跨 Python 版本的行为和可用 API 可能变化，部署前固定并测试目标版本。
