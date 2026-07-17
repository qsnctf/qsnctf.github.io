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

## 注意事项

`MonthEnd(0)` 表示滚动到当前或下一个月末，若日期已在月末则保持不变；测试边界日期。普通 `BusinessDay` 只处理周末，不了解地区法定节假日，真实交易或结算日历需 `CustomBusinessDay` 或专业日历。带时区日期跨夏令时时要验证结果。
