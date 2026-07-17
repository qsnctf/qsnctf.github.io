# NumPy 教程

NumPy 是 Python 科学计算生态的基础库。它以同构多维数组 `ndarray` 为核心，通过向量化、广播和底层连续内存提供高效数值计算，并为 SciPy、Pandas、Matplotlib 和多数机器学习框架提供数据接口。

## 学习路线

建议先掌握数组的创建、类型、形状和索引，再学习广播、通用函数、聚合与线性代数，最后处理文件读写和可视化。示例统一使用：

```python
import numpy as np
```

## 教程目录

1. [NumPy 安装](installation.md)
2. [NumPy Ndarray 对象](ndarray-object.md)
3. [NumPy 数据类型](data-types.md)
4. [NumPy 数组属性](array-attributes.md)
5. [NumPy 创建数组](creating-arrays.md)
6. [NumPy 从已有的数组创建数组](arrays-from-existing-data.md)
7. [NumPy 从数值范围创建数组](arrays-from-numerical-ranges.md)
8. [NumPy 切片和索引](slicing-and-indexing.md)
9. [NumPy 高级索引](advanced-indexing.md)
10. [NumPy 广播(Broadcast)](broadcasting.md)
11. [NumPy 迭代数组](iterating-arrays.md)
12. [Numpy 数组操作](array-operations.md)
13. [NumPy 位运算](bitwise-operations.md)
14. [NumPy 字符串函数](string-functions.md)
15. [NumPy 数学函数](mathematical-functions.md)
16. [NumPy 算术函数](arithmetic-functions.md)
17. [NumPy 统计函数](statistical-functions.md)
18. [NumPy 排序、条件筛选函数](sorting-and-filtering.md)
19. [NumPy 字节交换](byte-swapping.md)
20. [NumPy 副本和视图](copies-and-views.md)
21. [NumPy 矩阵库(Matrix)](matrix-library.md)
22. [NumPy 线性代数](linear-algebra.md)
23. [NumPy IO](io.md)
24. [NumPy Matplotlib](matplotlib.md)
25. [Numpy 测验](quiz.md)

## 使用约定

- `axis=0` 表示沿第 0 维聚合，即二维数组中逐列计算；`axis=1` 表示逐行计算。
- NumPy 数组通常是定长、同类型数据。混合 Python 对象会产生 `object` dtype，并失去多数性能优势。
- 示例以 NumPy 2.x 为基准，只依赖公开 API；涉及随机数时优先使用 `np.random.default_rng()`。
- 大数组操作要关注 dtype、临时数组、内存布局以及结果是副本还是视图。

## 最小示例

```python
import numpy as np

scores = np.array([[82, 91, 76], [95, 88, 90]], dtype=np.float64)
subject_mean = scores.mean(axis=0)
adjusted = np.clip(scores + np.array([2, 0, 3]), 0, 100)

print(subject_mean)
print(adjusted)
```

这段代码同时展示了二维数组、指定 dtype、按轴聚合、广播和向量化。实际工程中应固定依赖版本并为形状、dtype、缺失值和边界条件编写测试。
