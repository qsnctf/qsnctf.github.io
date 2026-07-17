# NumPy 数据类型

NumPy 的 `dtype` 描述元素在内存中的二进制布局和运算语义。明确 dtype 可以控制精度、取值范围、内存占用以及与文件格式和本地代码的兼容性。

## 常用 dtype

| 类别 | 示例 | 说明 |
| --- | --- | --- |
| 布尔 | `np.bool_` | 真或假 |
| 有符号整数 | `np.int8`、`np.int32`、`np.int64` | 固定位宽整数 |
| 无符号整数 | `np.uint8`、`np.uint32` | 非负固定整数 |
| 浮点 | `np.float32`、`np.float64` | IEEE 浮点数 |
| 复数 | `np.complex64`、`np.complex128` | 实部和虚部 |
| 字符串 | `U10`、`S10` | 固定长度 Unicode 或字节串 |
| 日期时间 | `datetime64`、`timedelta64` | 时间点与时间差 |
| 结构化类型 | 字段列表 | 类似固定布局记录 |

## 创建、检查与转换

```python
import numpy as np

a = np.array([1, 2, 3], dtype=np.int16)
b = a.astype(np.float32)
print(a.dtype, a.itemsize)
print(b, b.dtype)

print(np.iinfo(np.int16))
print(np.finfo(np.float32).eps)

dt = np.dtype([("id", "<i4"), ("score", "<f8")])
records = np.array([(1, 91.5), (2, 87.0)], dtype=dt)
print(records["score"])
```

`astype` 默认创建新数组。若只需接受并检查输入，可使用 `np.asarray(value, dtype=...)`；是否复制取决于输入是否已经满足要求。

## 类型提升与溢出

混合类型运算会根据 NumPy 的类型提升规则选择结果 dtype。固定宽度整数会溢出，且不会自动变成 Python 大整数：

```python
import numpy as np

x = np.array([127], dtype=np.int8)
print(x + np.int8(1))

values = np.array([1, 2, 3], dtype=np.int32)
print((values + 0.5).dtype)
```

## 常见错误与工程注意事项

- 金额等十进制定点数据不应盲目使用二进制浮点；根据精度要求使用整数最小单位、`decimal` 或专用类型。
- `float32` 可节省一半内存，但累计求和、优化算法和条件较差的问题可能需要 `float64`。
- `np.nan` 是浮点值，普通整数数组不能直接表示；可使用掩码、哨兵值或上层 nullable 类型。
- 固定长度字符串会截断超长赋值，创建时应选择足够长度，或在边界处保留 Python 字符串。
- 避免平台相关的裸 `int` 宽度假设；持久化和网络协议应明确写 `int32`、`int64` 与字节序。
- 转换前用范围检查防止静默截断；不能安全转换时可先用 `np.can_cast` 判断。
