# Numpy 数组操作

数组操作用于改变形状、轴顺序以及数组之间的组合方式。很多形状变换只修改元数据，但拼接、堆叠和部分展平操作需要分配新内存。

## 形状与轴

| API | 用途 |
| --- | --- |
| `reshape` | 在元素数不变时改变形状 |
| `ravel` | 尽可能返回一维视图 |
| `flatten` | 始终返回一维副本 |
| `transpose` / `moveaxis` / `swapaxes` | 重排轴 |
| `squeeze` | 删除长度为 1 的轴 |
| `expand_dims` | 插入长度为 1 的轴 |

```python
import numpy as np

a = np.arange(12).reshape(3, 4)
print(a.reshape(2, 6))
print(np.moveaxis(a[None, :, :], 0, -1).shape)
print(np.expand_dims(a, axis=0).shape)
print(np.squeeze(np.zeros((1, 3, 1))).shape)
```

## 组合与拆分

```python
import numpy as np

left = np.array([[1, 2], [3, 4]])
right = np.array([[5], [6]])
print(np.concatenate([left, right], axis=1))
print(np.stack([left, left + 10], axis=0).shape)

parts = np.array_split(np.arange(10), 3)
print(parts)
```

`concatenate` 沿已有轴连接，其他轴必须相等；`stack` 创建新轴，所有输入 shape 必须相同。`split` 要求整除，不能整除时使用 `array_split`。

## 重复与翻转

`np.repeat` 按元素重复，`np.tile` 重复整个模式，`np.flip` 沿轴反转，`np.roll` 循环移动元素。重复操作会迅速扩大内存，应先判断广播能否完成目标。

## 常见错误与性能注意事项

- `reshape` 中最多一个维度可写为 `-1`，由元素总数推导；总元素数不匹配会失败。
- `reshape` 是否返回视图取决于布局，不能依赖其总是零复制；需要判断时用 `np.shares_memory`。
- 循环中不断 `concatenate` 会反复分配和复制。先收集块后一次连接，或预分配目标数组。
- `resize` 函数、数组的 `resize` 方法和 `reshape` 语义不同；生产代码应避免含糊使用。
- `squeeze()` 不指定轴可能误删业务上重要的批次轴，接口代码宜显式传 `axis`。
- 转置后的数组通常非 C 连续，交给本地扩展前检查布局和复制成本。
