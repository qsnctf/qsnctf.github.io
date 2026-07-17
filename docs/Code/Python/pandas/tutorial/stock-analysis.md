# Pandas 股票数据分析

## 概念与用途

行情分析常以交易日期为索引，计算收益率、移动均线、波动率和回撤。本页只演示数据处理方法，不构成投资建议。

## 核心 API

`pd.to_datetime`、`set_index`、`sort_index`、`pct_change`、`rolling`、`cumprod`、`cummax` 和 `resample`。

## 可运行示例

```python
import pandas as pd

prices = pd.DataFrame({
    "date": pd.date_range("2026-01-05", periods=6, freq="B"),
    "close": [100, 102, 101, 105, 104, 108],
}).set_index("date")
prices["return"] = prices["close"].pct_change()
prices["ma3"] = prices["close"].rolling(3, min_periods=3).mean()
wealth = (1 + prices["return"].fillna(0)).cumprod()
prices["drawdown"] = wealth.div(wealth.cummax()).sub(1)
print(prices.round(4))
```

## 注意事项

要区分未复权与复权价格，处理拆股、分红、停牌、时区和交易日历。简单 `pct_change` 不是所有资产收益定义。回测必须避免前视偏差、幸存者偏差和未来数据泄漏，并计入手续费、滑点及成交限制；生产数据还需校验重复时间戳和价格异常。
