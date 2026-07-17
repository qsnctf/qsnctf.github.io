# Python 量化

## 概念与用途

Python 量化流程通常包括行情获取、清洗、因子计算、回测、风险评估和执行。Pandas/NumPy 适合数据计算，专业框架可处理撮合和组合，但策略有效性取决于数据与假设。

## 核心 API

收益率可通过 `pct_change()` 计算，滚动指标使用 `rolling()`，仓位与下一期收益需按时间对齐以避免未来函数。示例需要 `python -m pip install pandas`。

```python
import pandas as pd

prices = pd.Series([100, 102, 101, 105, 107], name="close")
returns = prices.pct_change()
signal = (prices > prices.rolling(3).mean()).shift(1).fillna(False)
strategy = returns.where(signal, 0.0)
print(pd.DataFrame({"price": prices, "signal": signal, "return": strategy}))
```

## 常见错误与工程注意

- 必须防止未来数据、幸存者偏差、重复调参和时区错位。
- 回测应计入手续费、滑点、停牌、流动性和成交容量。
- 示例不构成投资建议，实盘需独立风控、审计和合规评估。
