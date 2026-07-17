# NumPy IO

NumPy I/O 包括原生二进制格式、文本格式、内存映射和原始二进制读写。格式选择应考虑类型保真、文件大小、安全性、跨语言需求和是否需要随机访问。

## 核心 API

| API | 用途 |
| --- | --- |
| `save` / `load` | 单个 `.npy` 数组 |
| `savez` / `savez_compressed` | 一个 `.npz` 文件保存多个命名数组 |
| `savetxt` / `loadtxt` | 规则文本表格 |
| `genfromtxt` | 容忍缺失值等更复杂文本 |
| `memmap` / `open_memmap` | 磁盘数组的分块访问 |
| `fromfile` / `tofile` | 无元数据原始二进制 |

## 可运行示例

```python
from pathlib import Path
from tempfile import TemporaryDirectory

import numpy as np

with TemporaryDirectory() as directory:
    root = Path(directory)
    a = np.arange(6, dtype=np.float32).reshape(2, 3)

    np.save(root / "array.npy", a)
    restored = np.load(root / "array.npy", allow_pickle=False)
    print(np.array_equal(a, restored), restored.dtype)

    np.savez_compressed(root / "bundle.npz", data=a, labels=np.array(["x", "y"]))
    with np.load(root / "bundle.npz", allow_pickle=False) as bundle:
        print(bundle.files, bundle["data"].shape)

    np.savetxt(root / "array.csv", a, delimiter=",", fmt="%.2f")
    print(np.loadtxt(root / "array.csv", delimiter=","))
```

## 格式选择

`.npy` 保留 shape、dtype 和端序，适合 NumPy 内部交换；`.npz` 是多个 `.npy` 的 ZIP 容器。CSV 易读且跨工具，但不完整保存 dtype、维度和缺失值语义。大型数组可用内存映射按需访问。

## 常见错误与工程注意事项

- 加载不可信文件时始终保持 `allow_pickle=False`；pickle 可执行任意代码。对象数组因此不适合作为不可信交换格式。
- `np.load` 打开的 `.npz` 应通过 `with` 关闭，避免文件句柄泄漏。
- `fromfile` 不保存 dtype、shape、端序和版本，必须由外部协议严格约定；长期存储更适合自描述格式。
- 文本浮点往返受 `fmt` 精度影响，CSV 还需明确编码、分隔符、表头和缺失值。
- 写关键文件时先写临时路径、校验后原子替换，避免进程中断留下半文件。
- 内存映射减少一次性内存占用，但随机访问可能导致大量缺页；优先按连续块和正确轴处理。
- 跨系统交换前固定 dtype 宽度与字节序，并为文件添加 schema/version，而不是只依赖扩展名。
