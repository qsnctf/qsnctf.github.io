# Pandas 日期与时间

## 概念与用途

Pandas 用 `Timestamp`、`DatetimeIndex`、`Timedelta` 和 `Period` 处理时间。日期解析后可通过 `dt` 访问器提取年月、星期、时区等字段。

## 核心 API

`pd.to_datetime`、`pd.to_timedelta`、`pd.date_range`、`Series.dt`、`tz_localize`、`tz_convert`、`normalize`。

## 可运行示例

```python
import pandas as pd

df = pd.DataFrame({"created": ["2026-07-17 08:30:00+00:00", "2026-07-18 10:00:00+00:00"]})
df["created"] = pd.to_datetime(df["created"], utc=True)
df["beijing"] = df["created"].dt.tz_convert("Asia/Shanghai")
df["weekday"] = df["beijing"].dt.day_name()
print(df)
```

## 注意事项

歧义格式应显式传 `format`，不要依赖地区猜测。时间戳进入系统时尽量统一为 UTC，展示时再转换；不要用 `tz_localize` 代替 `tz_convert`。夏令时会出现不存在或重复的本地时间，需设置 `ambiguous`/`nonexistent` 策略。日期超出支持范围可能退化为对象。
