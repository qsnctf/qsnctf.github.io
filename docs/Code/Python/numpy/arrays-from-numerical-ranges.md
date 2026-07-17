# NumPy 从数值范围创建数组

范围构造函数用于生成规则序列、采样点、网格坐标和对数刻度。应根据“固定步长”还是“固定样本数”选择 API。

## 核心 API

| API | 规则 |
| --- | --- |
| `np.arange(start, stop, step)` | 使用固定步长，通常不包含 `stop` |
| `np.linspace(start, stop, num)` | 生成固定数量的等间距样本，默认包含终点 |
| `np.logspace(start, stop, num, base)` | 指数在给定范围内等间距 |
| `np.geomspace(start, stop, num)` | 直接指定首尾值的等比序列 |
| `np.meshgrid` | 从坐标向量生成坐标网格 |

## 可运行示例

```python
import numpy as np

integers = np.arange(0, 10, 2)
samples, step = np.linspace(0.0, 1.0, num=5, retstep=True)
frequencies = np.logspace(1, 3, num=3, base=10)
ratio = np.geomspace(1, 1000, num=4)

print(integers)
print(samples, step)
print(frequencies)
print(ratio)
```

生成二维坐标并计算函数值：

```python
import numpy as np

x = np.linspace(-1, 1, 5)
y = np.linspace(-1, 1, 3)
xx, yy = np.meshgrid(x, y, indexing="xy")
z = xx**2 + yy**2
print(z)
```

## 端点与精度

浮点步长不能精确表示时，`arange` 的元素数量和末端值可能与直觉不同。需要固定样本数或可靠端点时优先使用 `linspace`，并显式设置 `endpoint=False` 表达半开区间。

## 常见错误与性能注意事项

- 不要用 `np.arange` 的浮点结果做严格相等判断；使用 `np.isclose` 或基于整数索引构造。
- `linspace(..., num=n)` 的 `num` 是样本数，不是步长；样本间隔通常为 `(stop-start)/(n-1)`。
- `meshgrid` 会创建大坐标数组。只为广播计算时可用 `x[None, :]` 和 `y[:, None]`，或设置 `sparse=True`。
- 整数 `arange` 仍受 dtype 范围限制，大端点可能溢出；需要时显式选择 `int64` 并检查规模。
- `geomspace` 的区间跨过零时没有实数等比序列，会报错或需要复数 dtype。
- 外部参数控制范围时，应先计算预计元素数，防止极小步长造成内存耗尽。
