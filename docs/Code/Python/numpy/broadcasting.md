# NumPy 广播(Broadcast)

广播让形状不同但兼容的数组参与逐元素运算，而无需真正复制较小数组。它是向量化表达批量偏移、缩放、归一化和网格计算的核心机制。

## 广播规则

从两个 shape 的最右侧维度向左比较：

1. 两个维度相等时兼容。
2. 任一维度为 1 时兼容，该维逻辑扩展到另一方大小。
3. 缺失的左侧维度按 1 处理。
4. 其他组合不兼容，会抛出 `ValueError`。

例如 `(2, 3, 4)` 与 `(3, 1)` 的结果 shape 为 `(2, 3, 4)`；`(2, 3)` 与 `(2,)` 不兼容。

## 可运行示例

```python
import numpy as np

scores = np.array([[80, 90, 70], [85, 88, 92]])
bonus = np.array([2, 0, 3])
print(scores + bonus)

# 每行减去自己的均值。
row_mean = scores.mean(axis=1, keepdims=True)
centered = scores - row_mean
print(centered)
print(centered.mean(axis=1))

print(np.broadcast_shapes(scores.shape, bonus.shape))
```

通过插入轴构造外积：

```python
import numpy as np

x = np.array([1, 2, 3])
y = np.array([10, 20])
outer = y[:, None] * x[None, :]
print(outer)
```

## 常见错误与性能注意事项

- 广播按尾部维度对齐。长度同为 `n` 的一维数组不会自动被理解为行向量或列向量，应使用 `None` 明确方向。
- `keepdims=True` 保留聚合轴，通常能让结果直接广播回原数组。
- 广播视图本身几乎不占额外数据内存，但后续运算的完整结果仍要分配；`m x n` 外积可能很大。
- 不要用 `np.tile` 模拟本可直接广播的操作，`tile` 会物化重复数据。
- `np.broadcast_to` 返回只读视图，多个逻辑位置可能指向同一内存，不应强行写入。
- shape 恰好兼容不代表业务语义正确。关键计算应断言维度含义，并优先使用清晰的轴命名约定。
