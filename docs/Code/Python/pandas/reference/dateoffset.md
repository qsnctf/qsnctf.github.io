# Pandas DateOffset 对象

## 概念与用途

`DateOffset` 表示遵循日历规则的日期偏移，与固定秒数的 `Timedelta` 不同。它可表达月末、工作日、季度、财年和自定义营业日。

## 核心 API

`pd.DateOffset` 及 `pd.offsets` 中的 `Day`、`BusinessDay`、`MonthEnd`、`MonthBegin`、`QuarterEnd`、`YearEnd`、`CustomBusinessDay`；配合 `date_range(freq=...)` 和时间戳算术使用。

## 可运行示例

```python
import pandas as pd
from pandas.tseries.offsets import BusinessDay, MonthEnd

date = pd.Timestamp("2026-07-17")
print(date + BusinessDay(1))
print(date + MonthEnd(0))
print(pd.date_range("2026-01-01", periods=4, freq=MonthEnd()))
```

## 示例二：自定义工作日

```python
import pandas as pd
from pandas.tseries.offsets import CustomBusinessDay

calendar = CustomBusinessDay(weekmask="Mon Tue Wed Thu Fri", holidays=["2026-01-01"])
days = pd.date_range("2025-12-31", periods=4, freq=calendar)
print(days)
```

`CustomBusinessDay` 返回可复用的偏移规则。节假日列表必须由可靠日历维护，示例中的单个日期不构成完整市场日历。

## 示例三：rollforward 与 rollback

```python
import pandas as pd
from pandas.tseries.offsets import MonthEnd

offset = MonthEnd()
date = pd.Timestamp("2026-02-10")
print(offset.rollforward(date))
print(offset.rollback(date))
```

`rollforward`/`rollback` 移到最近的有效偏移日期；直接 `date + offset` 则按偏移次数前进，语义不同。

## 返回、对齐与性能

Timestamp 加偏移返回新 Timestamp，DatetimeIndex 加偏移返回新索引。对 Series 使用偏移时结果按原索引位置计算，不涉及两个对象的标签对齐。部分非向量化偏移对大数组可能触发性能警告，应优先规则频率或预生成日历后连接。

## 注意事项

`MonthEnd(0)` 表示滚动到当前或下一个月末，若日期已在月末则保持不变；测试边界日期。普通 `BusinessDay` 只处理周末，不了解地区法定节假日，真实交易或结算日历需 `CustomBusinessDay` 或专业日历。带时区日期跨夏令时时要验证结果。
