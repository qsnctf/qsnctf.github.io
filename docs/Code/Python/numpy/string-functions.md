# NumPy 字符串函数

`np.strings`（NumPy 2.x）和兼容接口 `np.char` 为字符串数组提供逐元素操作。它们适合固定形状的小型文本清洗和与数值数组对齐的标签处理，但不是完整的自然语言或表格文本引擎。

## 核心 API

常见操作包括 `lower`、`upper`、`strip`、`replace`、`find`、`count`、`startswith`、`endswith`、`equal`、`add` 和 `multiply`。输入通常是固定长度 Unicode (`U`) 或字节串 (`S`) 数组。

## 可运行示例

```python
import numpy as np

names = np.array([" Alice ", "BOB", "Carol "])
clean = np.char.lower(np.char.strip(names))
print(clean)
print(np.char.startswith(clean, "a"))
print(np.char.replace(clean, "o", "0"))

first = np.array(["Ada", "Grace"])
last = np.array(["Lovelace", "Hopper"])
full = np.char.add(np.char.add(first, " "), last)
print(full)
```

固定长度字符串 dtype 会影响赋值：

```python
import numpy as np

codes = np.array(["A", "BB"], dtype="U2")
codes[0] = "LONG"
print(codes)  # 被截断为两个字符
```

## 字节串与 Unicode

`S` dtype 保存原始字节，`U` dtype 保存 Unicode 文本。网络和文件读取时应在明确编码的边界完成 `bytes` 与 `str` 转换，不要把两者混在同一个数组中。

## 常见错误与性能注意事项

- NumPy 字符串函数主要提供批量调用便利，不保证像数值 ufunc 那样获得显著底层加速。
- 固定长度 dtype 在赋值时可能静默截断。长度不可控的数据更适合 Python 列表、Pandas 字符串类型或专用文本库。
- `object` 字符串数组可容纳不同长度，但增加对象开销，并可能混入非字符串值。
- 大小写转换和比较受 Unicode 规则影响，但不等同于区域感知排序、规范化或完整 case folding。
- 缺失文本没有统一的原生字符串哨兵；不要假设字符串 `"nan"` 与浮点 `np.nan` 等价。
- NumPy 版本间字符串 API 正在发展。库代码应声明最低版本，并优先使用目标版本文档中的公开命名空间。
