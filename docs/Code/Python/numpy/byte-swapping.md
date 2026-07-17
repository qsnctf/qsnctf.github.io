# NumPy 字节交换

多字节数值在内存中可采用小端或大端顺序。字节交换用于解析来自不同体系结构、网络协议或二进制文件的数组，目标是区分“改变字节内容”和“改变 dtype 对字节序的解释”。

## 字节序标记

dtype 字节序前缀包括：`<` 小端、`>` 大端、`=` 本机端、`|` 不适用（如单字节类型）。`dtype.byteorder` 可读取标记，`dtype.newbyteorder()` 可生成改变解释方式的新 dtype。

## 可运行示例

```python
import numpy as np

native = np.array([1, 256, 513], dtype=np.uint16)
swapped_values = native.byteswap()
print(native)
print(swapped_values)

# 同时交换底层字节并更新 dtype 解释，数值保持不变。
opposite_endian = native.byteswap().view(native.dtype.newbyteorder())
print(opposite_endian)
print(opposite_endian.dtype)
print(np.array_equal(native, opposite_endian))
```

解析明确为大端的协议数据：

```python
import numpy as np

payload = bytes.fromhex("0001 0100 0201")
values = np.frombuffer(payload, dtype=">u2")
print(values)

# 转成独立的本机字节序数组，便于后续交给本地代码。
native_values = values.astype(np.uint16)
print(native_values, native_values.dtype)
```

## `byteswap` 与 `newbyteorder`

只调用 `byteswap` 会改字节却保留原 dtype 解释，因此显示数值通常变化。只改变 dtype 字节序解释也会改变数值。若目标是保留逻辑数值并得到相反端序表示，需要同时处理数据和 dtype。

## 常见错误与工程注意事项

- 单字节 dtype 没有端序差异，对其交换没有意义。
- 不要根据当前机器是小端就省略文件格式中的端序声明；持久格式必须自描述或由协议固定。
- `frombuffer` 可能共享只读输入，不能原地交换；需要修改时先复制。
- 结构化 dtype 的每个字段可能有不同端序，应整体检查 dtype，而非只看外层标记。
- 与 C/C++ 库交互时，除了端序还要确认对齐、填充、整数宽度和连续性。
- 新代码优先用明确 dtype 读取并通过 `astype` 转本机类型，通常比手动组合交换操作更清晰。
