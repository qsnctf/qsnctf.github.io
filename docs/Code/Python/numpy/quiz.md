# Numpy 测验

本测验覆盖数组结构、dtype、索引、广播、计算、线性代数和 I/O。建议先独立运行题目并解释 shape、dtype 与内存共享，再查看参考答案。

## 选择与判断

1. `np.arange(6).reshape(2, 3).T` 的 shape 是什么？转置通常是副本还是视图？
2. shape `(4, 1, 3)` 与 `(2, 3)` 能否广播？结果 shape 是什么？
3. `a[:, 0]` 和 `a[:, 0:1]` 的 shape 有何不同？
4. 为什么 `np.array([127], dtype=np.int8) + np.int8(1)` 不会得到整数 128？
5. `np.vectorize` 是否通常能把 Python 函数变成本地高速循环？
6. 为什么解方程时优先使用 `np.linalg.solve(a, b)` 而不是 `np.linalg.inv(a) @ b`？
7. 加载不可信 `.npy`/`.npz` 时为什么应设置 `allow_pickle=False`？

## 编程题

### 题目一：按列标准化

将每一列转换为均值 0、标准差 1，保留二维 shape，并处理标准差为 0 的列。

```python
import numpy as np

x = np.array([[1.0, 10.0, 5.0], [2.0, 10.0, 7.0], [3.0, 10.0, 9.0]])
# 在这里编写代码
```

### 题目二：每行 Top-2

返回每一行最大的两个值，且每行结果按降序排列。尝试使用 `argpartition`，避免完整排序所有元素。

```python
import numpy as np

x = np.array([[3, 9, 1, 7], [8, 2, 6, 5]])
# 期望结果：[[9, 7], [8, 6]]
```

### 题目三：副本还是视图

预测并验证以下代码最终输出，同时用 `np.shares_memory` 检查关系：

```python
import numpy as np

a = np.arange(8)
b = a[2:6]
c = a[[2, 3, 4, 5]]
b[0] = 99
c[1] = 88
print(a, b, c)
```

## 参考答案

1. shape 为 `(3, 2)`；普通转置通常是视图。
2. 可以。尾部维度依次为 `3/3`、`1/2`、`4/1`，结果为 `(4, 2, 3)`。
3. 前者为 `(n,)`，后者为 `(n, 1)`；后者保留列轴。
4. `int8` 最大值是 127，固定宽度整数发生溢出。
5. 不是。`np.vectorize` 主要封装广播式调用，通常仍执行 Python 函数。
6. `solve` 避免显式构造逆矩阵，通常更快、更稳定且临时内存更少。
7. 对象数组的 pickle 反序列化可能执行任意代码，不适合不可信输入。

题目一：

```python
mean = x.mean(axis=0, keepdims=True)
std = x.std(axis=0, keepdims=True)
safe_std = np.where(std == 0, 1.0, std)
normalized = (x - mean) / safe_std
print(normalized)
```

题目二：

```python
indices = np.argpartition(x, -2, axis=1)[:, -2:]
top = np.take_along_axis(x, indices, axis=1)
top = np.sort(top, axis=1)[:, ::-1]
print(top)
```

题目三中 `b` 是视图，`c` 是副本，所以只有通过 `b` 的修改会反映到 `a`。

## 自检与工程注意事项

- 只得到正确数值还不够，应同时检查结果的 `shape`、`dtype`、有限性和内存共享。
- 浮点答案使用 `np.allclose`，不要使用逐元素严格相等。
- 性能题应先验证正确性，再用代表性规模基准测试；不要从一个微型示例推断生产性能。
- 随机测试使用 `np.random.default_rng(seed)` 固定种子，并覆盖空数组、单元素轴、极值、NaN 和不兼容 shape。
