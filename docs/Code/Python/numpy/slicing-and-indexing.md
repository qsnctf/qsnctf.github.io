# NumPy 切片和索引

基本索引用整数、切片对象、省略号和 `None` 选择数组区域。它通常返回共享原数据的视图，因此能高效处理子数组，也意味着写入可能影响原数组。

## 基本规则

- `a[i]` 选择第 0 轴的一个位置并减少一个维度。
- `a[start:stop:step]` 使用半开区间切片。
- 多维索引用逗号分隔，例如 `a[row, column]`。
- `...` 代表补齐所需的完整切片。
- `None` 或 `np.newaxis` 插入长度为 1 的轴。
- 负索引从末尾计数，负步长可逆序查看。

## 可运行示例

```python
import numpy as np

a = np.arange(20).reshape(4, 5)
print(a[1, 2])
print(a[1:3, ::2])
print(a[-1])
print(a[:, 1])       # shape: (4,)
print(a[:, 1:2])     # shape: (4, 1)

row = np.array([1, 2, 3])
print(row[:, None].shape)
```

切片写入会更新原数组：

```python
import numpy as np

a = np.arange(6)
part = a[1:4]
part[:] = -1
print(a)

# 需要独立数据时显式复制。
independent = a[::2].copy()
independent[0] = 99
print(a, independent)
```

## 赋值与广播

切片赋值的右侧必须与目标 shape 相同或可广播：

```python
import numpy as np

a = np.zeros((3, 4), dtype=int)
a[:, 1:3] = np.array([7, 8])
print(a)
```

## 常见错误与工程注意事项

- `a[i][j]` 先创建中间视图，语义不如 `a[i, j]` 清晰；后者通常也更高效。
- 切片越界会被截断而不报错，整数索引越界才会抛出 `IndexError`，需要严格边界时应自行验证。
- `a[:, 0]` 与 `a[:, 0:1]` 维度不同，模型和矩阵代码中应明确要求一维向量还是二维列向量。
- 步长切片可能产生非连续视图，传给要求连续内存的扩展前需转换。
- 链式索引与高级索引混合时，赋值目标可能是临时副本；复杂选择应一次完成并编写测试。
- 不要无意中长期保存很小的切片视图，因为它会让整个大型底层缓冲区无法释放；需要长期保存时复制小片段。
