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

## 示例二：格式解析和失败审计

```python
import pandas as pd

raw = pd.Series(["17/07/2026", "bad", None], dtype="string")
parsed = pd.to_datetime(raw, format="%d/%m/%Y", errors="coerce")
failed = raw[raw.notna() & parsed.isna()]
print(parsed)
print("failed:", failed.tolist())
```

`to_datetime` 对 Series 返回 Series 并保留索引；`errors="coerce"` 把失败项变为 `NaT`，必须审计新增空值。

## 示例三：时区本地化与转换

```python
import pandas as pd

local = pd.DatetimeIndex(["2026-01-01 09:00", "2026-01-02 09:00"])
aware = local.tz_localize("Asia/Shanghai")
print(aware.tz_convert("UTC"))
```

`tz_localize` 给无时区时间赋予时区，`tz_convert` 转换已有时区的时间。两者混用是常见错误。

## 性能与工程边界

明确 `format` 通常更可预测；大量重复日期可受益于解析缓存。跨系统交换优先 UTC ISO 8601，并单独保存原始时区业务语义。日期列赋值仍按索引对齐，过滤后不要只重置一侧索引。

## 注意事项

歧义格式应显式传 `format`，不要依赖地区猜测。时间戳进入系统时尽量统一为 UTC，展示时再转换；不要用 `tz_localize` 代替 `tz_convert`。夏令时会出现不存在或重复的本地时间，需设置 `ambiguous`/`nonexistent` 策略。日期超出支持范围可能退化为对象。
