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

## 示例二：按月重采样 OHLC

```python
import pandas as pd

close = pd.Series(
    [100, 102, 101, 105, 108],
    index=pd.date_range("2026-01-29", periods=5, freq="B"),
    name="close",
)
monthly = close.resample("ME").agg(["first", "max", "min", "last"])
print(monthly)
```

`resample` 要求日期索引，并按时间桶返回新对象。`ME` 表示月末频率；旧频率别名在不同 2.x 版本可能产生弃用提示，应以锁定版本为准。

## 对齐与工程语义

多只证券计算前应使用证券代码和日期的复合键，避免滚动窗口跨标的串联。不同市场交易日不一致时，横向拼接会按日期对齐并产生空值；不能随意前向填充未交易日价格。重复时间戳会让 `.loc[date]` 返回多行，必须先确认成交粒度。

## 注意事项

要区分未复权与复权价格，处理拆股、分红、停牌、时区和交易日历。简单 `pct_change` 不是所有资产收益定义。回测必须避免前视偏差、幸存者偏差和未来数据泄漏，并计入手续费、滑点及成交限制；生产数据还需校验重复时间戳和价格异常。
