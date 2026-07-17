# NumPy 创建数组

NumPy 提供按内容、形状和值模式创建数组的工厂函数。选择合适的构造函数可减少初始化成本，并清楚表达数组用途。

## 核心 API

| API | 用途 |
| --- | --- |
| `np.array` | 从 Python 对象创建数组，可指定 dtype 与复制策略 |
| `np.zeros` / `np.ones` | 创建全 0 / 全 1 数组 |
| `np.full` | 用指定值填充 |
| `np.empty` | 分配但不初始化数据 |
| `np.eye` / `np.identity` | 创建单位矩阵 |
| `np.zeros_like` 等 | 继承参考数组的形状和常用属性 |
| `Generator` 方法 | 创建随机样本数组 |

## 可运行示例

```python
import numpy as np

zeros = np.zeros((2, 3), dtype=np.float32)
ones = np.ones((2, 3), dtype=np.int8)
filled = np.full((2, 2), 7)
identity = np.eye(3)

rng = np.random.default_rng(42)
samples = rng.normal(loc=0.0, scale=1.0, size=(2, 3))

print(zeros)
print(ones)
print(filled)
print(identity)
print(samples)
```

依据模板创建数组：

```python
import numpy as np

template = np.array([[1, 2], [3, 4]], dtype=np.int16)
mask = np.zeros_like(template, dtype=bool)
output = np.full_like(template, fill_value=-1)
print(mask)
print(output)
```

## `empty` 的正确用途

`np.empty` 省略填零过程，内容是未定义的旧内存数据。只有后续代码保证覆盖每个元素时才应使用：

```python
import numpy as np

result = np.empty(4, dtype=np.float64)
result[:] = np.sqrt(np.arange(4))
print(result)
```

## 常见错误与性能注意事项

- 不要读取尚未完全写入的 `empty` 数组；其值不可预测，也可能使测试偶发失败。
- 从不规则嵌套序列创建二维数组会报错；应补齐、使用掩码，或明确创建 `dtype=object`（后者通常不适合数值计算）。
- 创建大数组时显式指定最小够用 dtype，可显著降低内存和缓存压力。
- 重复调用旧式全局随机函数不利于隔离和复现；将 `np.random.Generator` 作为依赖传递。
- `zeros_like` 默认继承 dtype，计算结果需要浮点时要显式传 `dtype=float`。
- 创建形状来自外部输入的大数组前，应验证维度与总元素数，避免失控的内存分配。
