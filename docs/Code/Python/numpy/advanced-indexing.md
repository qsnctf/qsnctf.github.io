# NumPy 高级索引

高级索引使用整数数组或布尔数组一次选择任意位置。它适合重排、采样、掩码过滤和稀疏更新，结果通常是副本，而不是基本切片那样的视图。

## 整数数组索引

多个整数索引数组会先广播，然后按对应坐标选择元素：

```python
import numpy as np

a = np.arange(12).reshape(3, 4)
rows = np.array([0, 2, 2])
cols = np.array([1, 0, 3])
print(a[rows, cols])

# 选择第 0、2 行与第 1、3 列组成的笛卡尔积。
print(a[np.ix_([0, 2], [1, 3])])
```

`a[[0, 2], [1, 3]]` 只选择两个配对坐标，不会得到 2x2 子矩阵；笛卡尔积应使用 `np.ix_`。

## 布尔索引

布尔掩码应与被筛选轴或数组形状兼容：

```python
import numpy as np

a = np.array([[3, -1, 7], [0, 5, -2]])
positive = a > 0
print(a[positive])

a[a < 0] = 0
print(a)

row_mask = a.sum(axis=1) >= 5
print(a[row_mask])
```

## 相关 API

- `np.take`：沿指定轴按整数位置选取。
- `np.take_along_axis`：每个切片使用不同位置，常与 `argsort` 配合。
- `np.put_along_axis`：按对应位置写入。
- `np.nonzero` / `np.flatnonzero`：返回非零位置。
- `np.where(condition)`：单参数形式返回坐标，多参数形式选择值。

## 常见错误与性能注意事项

- 高级索引读取结果通常是副本；修改结果不会回写原数组，但 `a[index] = value` 这种直接赋值会修改原数组。
- 重复索引的增强赋值可能只更新一次，因为读取、计算、写回经过临时数组；累加重复位置使用 `np.add.at`。
- 组合条件必须写 `(a > 0) & (a < 10)`，不能使用 Python 的 `and`，且每个比较要加括号。
- 大型布尔掩码每个元素至少占一个字节，可能产生显著临时内存；稀疏选择可考虑整数位置。
- 高级索引的结果轴顺序在混合基本索引时不总直观，复杂代码可分步骤并断言 shape。
- 来源于外部的索引应检查范围和 dtype，负索引会合法地从尾部选择，可能掩盖无效输入。
