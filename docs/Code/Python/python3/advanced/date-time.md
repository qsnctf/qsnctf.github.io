# Python3 日期和时间

> 本页定位为日期时间建模、时区和系统设计概览；具体解析、格式化与 `timedelta` API 请阅读 [Python datetime 模块](datetime.md)。

## 概念与用途

日期时间处理涉及日历日期、时刻、时间差、时区和格式化。跨系统记录时间应使用带时区的 `datetime`，通常以 UTC 存储，在展示边界转换到用户时区。

## 核心 API

`date` 表示日期，`datetime` 表示日期时刻，`timedelta` 表示时长，`zoneinfo.ZoneInfo` 使用 IANA 时区。`isoformat()` 和 `fromisoformat()` 适合机器交换。

| 业务概念 | 推荐表示 | 不推荐 |
| --- | --- | --- |
| 全球唯一时刻 | 带时区 `datetime`/UTC 时间戳 | 无时区 datetime |
| 日历生日 | `date` | 午夜时间戳 |
| 持续时长 | `timedelta` | 格式化时间字符串 |
| 地区规则 | `ZoneInfo("区域/城市")` | 手写固定小时偏移 |

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

now_utc = datetime.now(timezone.utc)
shanghai = now_utc.astimezone(ZoneInfo("Asia/Shanghai"))
print(now_utc.isoformat())
print(shanghai.isoformat())
```

## 示例：以 UTC 存储、在边界展示

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

stored = datetime(2026, 7, 17, 1, 30, tzinfo=timezone.utc)
for zone in ("Asia/Shanghai", "Europe/London", "America/New_York"):
    local = stored.astimezone(ZoneInfo(zone))
    print(zone, local.strftime("%Y-%m-%d %H:%M %Z"))
```

数据库和消息协议应明确存储格式、精度和时区。仅保存本地墙上时间会丢失它对应的真实时刻；仅保存 UTC 又可能不足以重建“每月当地 09:00”这类日历规则，因此调度配置还需保存时区名称。

## 常见错误与工程注意

- 不要混合无时区和有时区的 datetime，它们无法可靠比较。
- 时间戳应明确单位是秒还是毫秒。
- 夏令时会产生不存在或重复的本地时间，调度系统不能简单加固定 24 小时。
