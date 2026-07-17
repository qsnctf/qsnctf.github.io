# NumPy 位运算

位运算直接处理整数或布尔值的二进制位，常用于协议字段、权限标志、图像通道、掩码和紧凑数据编码。NumPy 的位运算 ufunc 能逐元素处理数组并支持广播。

## 核心 API

| 函数/运算符 | 含义 |
| --- | --- |
| `np.bitwise_and` / `&` | 按位与 |
| `np.bitwise_or` / `\|` | 按位或 |
| `np.bitwise_xor` / `^` | 按位异或 |
| `np.invert` / `~` | 按位取反 |
| `np.left_shift` / `<<` | 左移 |
| `np.right_shift` / `>>` | 右移 |
| `np.bitwise_count` | 统计非负等价表示中的 1 位数量（NumPy 2.x） |
| `np.packbits` / `np.unpackbits` | 布尔/位数组与字节互转 |

## 可运行示例

```python
import numpy as np

flags = np.array([0b0011, 0b0101, 0b1000], dtype=np.uint8)
read_mask = np.uint8(0b0001)
can_read = (flags & read_mask) != 0
print(can_read)

enabled = flags | np.uint8(0b0010)
print(enabled)
print(flags << 1)
print(np.unpackbits(flags[:, None], axis=1))
```

压缩布尔状态：

```python
import numpy as np

states = np.array([True, False, True, True, False, False, True, False])
packed = np.packbits(states)
restored = np.unpackbits(packed, count=states.size).astype(bool)
print(packed, restored)
```

## 常见错误与工程注意事项

- 位运算适用于整数和布尔 dtype，不适用于普通浮点数组。处理浮点位模式需要明确 `view` 为等宽无符号整数，并理解平台字节序。
- Python 比较运算与 `&`、`|` 的优先级容易造成错误，条件组合应写 `(a > 0) & (a < 8)`。
- `~` 对有符号整数采用补码语义，例如 `~1 == -2`；协议字段通常更适合无符号 dtype。
- 左移可能溢出固定宽度 dtype，右移有符号负数还涉及符号扩展；必须根据协议明确类型。
- `packbits` 默认每字节按高位优先，交换系统数据时明确 `bitorder`、有效位数和填充规则。
- 不要将位运算的常数掩码散落在业务代码中，应使用命名常量并测试每一位的含义。
