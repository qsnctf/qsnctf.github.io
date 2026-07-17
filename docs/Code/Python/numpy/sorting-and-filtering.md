# NumPy 排序、条件筛选函数

排序函数负责重排值或返回排序位置，条件筛选函数根据布尔规则选择、替换或定位数据。它们常用于排名、Top-K、异常值处理和数据清洗。

## 排序 API

| API | 用途 |
| --- | --- |
| `np.sort` | 返回排序后的副本 |
| `a.sort` | 原地排序数组 |
| `np.argsort` | 返回排序索引 |
| `np.lexsort` | 按多个键间接排序 |
| `np.partition` | 按第 k 个位置进行部分排序 |
| `np.argpartition` | 返回部分排序索引，适合 Top-K |
| `np.searchsorted` | 在有序数组中寻找插入位置 |

```python
import numpy as np

scores = np.array([88, 72, 95, 88, 60])
order = np.argsort(scores, kind="stable")
print(scores[order])

k = 2
top_indices = np.argpartition(scores, -k)[-k:]
top_indices = top_indices[np.argsort(scores[top_indices])[::-1]]
print(top_indices, scores[top_indices])
```

## 条件筛选 API

`where` 在两个候选值之间选择，`nonzero` 返回满足条件的坐标，`extract` 提取元素，`select` 处理多分支，`clip` 限制范围。

```python
import numpy as np

x = np.array([-3, -1, 0, 4, 9])
mask = (x >= 0) & (x <= 5)
print(x[mask])
print(np.where(x < 0, 0, x))
print(np.nonzero(mask))
print(np.select([x < 0, x == 0, x > 0], [-1, 0, 1]))
print(np.clip(x, 0, 5))
```

## 常见错误与性能注意事项

- `np.sort` 默认沿最后一个轴排序；排序整个数组需先展平或指定清楚目标轴。
- `argsort` 后要用返回索引作用于原数据；多维按轴重排可使用 `take_along_axis`。
- 相同键的相对顺序有业务意义时显式选择稳定排序，不能依赖默认实现细节。
- Top-K 无需完整排序，`partition` 通常更快，但选中区域内部没有排序保证。
- `np.where(condition, x, y)` 的 `x` 和 `y` 通常都会先计算，不能用于避免无效除法；使用 ufunc 的 `where` 参数。
- 条件组合使用 `&`、`|`、`~` 和括号，不使用 `and`、`or`。大型链式条件会创建掩码临时数组，应关注峰值内存。
