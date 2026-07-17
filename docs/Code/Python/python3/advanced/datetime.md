# Python datetime 模块

> 本页聚焦 `datetime` 标准库的解析、格式化和算术 API；时间建模与时区架构见 [Python3 日期和时间](date-time.md)。

## 概念与用途

`datetime` 模块提供 `date`、`time`、`datetime`、`timedelta` 和 `timezone` 类型。它用于时间算术、格式化和解析，是日志、账期、过期时间等业务的基础。

## 核心 API

`strptime()` 按格式解析，`strftime()` 格式化，`timedelta` 做时长计算。新代码优先使用带时区对象和 ISO 8601 交换格式。

| API | 用途 | 典型陷阱 |
| --- | --- | --- |
| `datetime.now(tz)` | 获取当前时刻 | 应传入时区 |
| `fromisoformat()` | 解析 ISO 格式 | 不等于任意日期解析器 |
| `strptime()` | 严格按模板解析 | `%m` 与 `%M` 不同 |
| `timestamp()` | 转 Unix 时间戳 | 单位为秒且是浮点数 |

```python
from datetime import datetime, timedelta, timezone

started = datetime(2026, 7, 17, 9, 30, tzinfo=timezone.utc)
finished = started + timedelta(hours=2, minutes=15)
encoded = finished.isoformat()
decoded = datetime.fromisoformat(encoded)
print(encoded, decoded - started)
```

## 示例：严格解析并报告错误

```python
from datetime import datetime, timezone

def parse_utc_date(text: str) -> datetime:
    value = datetime.strptime(text, "%Y-%m-%d")
    return value.replace(tzinfo=timezone.utc)

for raw in ("2026-07-17", "17/07/2026"):
    try:
        print(parse_utc_date(raw).isoformat())
    except ValueError as error:
        print(raw, "格式错误:", error)
```

解析属于输入边界，应拒绝含糊格式而不是猜测日月顺序。展示格式可以本地化，但机器接口应选择稳定、带时区且有版本约定的表示。

## 常见错误与工程注意

- `timedelta.seconds` 只是一天内余数，总秒数使用 `total_seconds()`。
- 解析外部时间必须明确格式、时区和歧义策略。
- 固定偏移 `timezone` 不能完整表示有夏令时规则的地区，应使用 `zoneinfo`。
