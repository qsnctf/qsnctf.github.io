# Pandas 性能优化

## 概念与适用边界

优化顺序应是测量、减少数据量、选择合适 dtype、消除 Python 循环、减少复制，最后才考虑更换引擎。微型示例的结果不能直接外推到生产数据。

Pandas 主要面向单机内存。数据显著大于可用内存、需要并行查询或事务时，应评估数据库、DuckDB、Polars、Dask 或 Spark，而不是无限增加 `chunksize`。

## 可复现基准方法

使用固定随机种子、相同输入和多次重复。`time.perf_counter()` 测量墙钟时间，`DataFrame.memory_usage(deep=True)` 统计列和深层字符串内存。基准前可先运行一次预热，结果应报告环境与 Pandas 版本。

## 示例一：向量化与逐行 apply 计时

```python
from time import perf_counter
import numpy as np
import pandas as pd

rng = np.random.default_rng(42)
df = pd.DataFrame({"price": rng.random(200_000) * 100, "qty": rng.integers(1, 10, 200_000)})

start = perf_counter()
slow = df.apply(lambda row: row["price"] * row["qty"], axis=1)
apply_seconds = perf_counter() - start

start = perf_counter()
fast = df["price"].mul(df["qty"])
vector_seconds = perf_counter() - start

pd.testing.assert_series_equal(slow, fast, check_names=False)
print({"apply": round(apply_seconds, 4), "vectorized": round(vector_seconds, 4)})
```

绝对时间依赖机器，但向量化通常显著减少 Python 函数调用。不要为了基准把数据规模调到导致内存交换。

## 示例二：dtype 的可复现内存对比

```python
import pandas as pd

n = 100_000
raw = pd.DataFrame({"city": ["Beijing", "Shanghai"] * (n // 2), "count": range(n)})
before = raw.memory_usage(index=True, deep=True).sum()

optimized = raw.astype({"city": "category", "count": "int32"})
after = optimized.memory_usage(index=True, deep=True).sum()
print({"before_bytes": before, "after_bytes": after, "ratio": round(after / before, 3)})
```

低基数文本适合 `category`；高基数接近唯一值时，类别表本身可能抵消收益。整数降位前必须检查范围，避免溢出。

## 示例三：读取阶段裁剪

```python
from io import StringIO
import pandas as pd

text = StringIO("id,city,amount,note\n1,A,10,x\n2,B,20,y\n")
df = pd.read_csv(text, usecols=["id", "amount"], dtype={"id": "int32", "amount": "float32"})
print(df.memory_usage(deep=True))
```

## 常见性能陷阱

- 循环中反复 `concat` 会产生近似二次复制；先收集到列表，再一次拼接。
- `iterrows` 会构造 Series 并可能改变标量 dtype；必须迭代时优先 `itertuples(index=False)`。
- `inplace=True` 不保证节省内存；赋值语义更清楚，也更适合 Copy-on-Write。
- 先全表读取再筛选会浪费 I/O；CSV 用 `usecols/chunksize`，Parquet 用列裁剪和过滤下推。
- `object` 字符串内存统计必须使用 `deep=True`，否则估计明显偏低。

## 工程注意事项

基准应覆盖读取、转换和写出，不只测单个表达式。记录 Python、Pandas、NumPy、引擎版本、数据规模和 dtype；在 CI 中只做宽松回归检测，避免硬编码脆弱的毫秒阈值。优化后用 `pd.testing` 验证结果等价，并监控峰值内存，而不只看最终 DataFrame 大小。
