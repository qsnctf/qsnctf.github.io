# Python3 File

## 概念与用途

文件对象提供持久化文本和二进制数据的顺序访问。文本模式负责编码解码，二进制模式返回 `bytes`；`with` 能确保句柄在成功或异常时都被关闭。

## 核心 API

`open(path, mode, encoding)` 的常见模式有 `r`、`w`、`a`、`x`、`b`。文件对象支持 `read()`、逐行迭代、`write()`、`seek()` 和 `tell()`。

| 模式 | 行为 | 风险或用途 |
| --- | --- | --- |
| `r` / `rb` | 读取文本/字节 | 文件不存在会失败 |
| `w` / `wb` | 截断后写入 | 会破坏已有内容 |
| `a` | 从末尾追加 | 适合简单日志，不保证多进程记录完整 |
| `x` | 仅新建 | 防止意外覆盖 |
| `r+` | 读写且不截断 | 位置管理较复杂 |

```python
from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory() as directory:
    path = Path(directory) / "data.txt"
    path.write_text("第一行\n第二行\n", encoding="utf-8")
    with path.open(encoding="utf-8") as file:
        for number, line in enumerate(file, 1):
            print(number, line.rstrip())
```

## 示例：安全替换配置文件

关键文件可先写到同目录临时文件，刷新到磁盘后用 `os.replace()` 原子替换目标。这样读者不会观察到半写入内容。

```python
import json
import os
from pathlib import Path
from tempfile import NamedTemporaryFile, TemporaryDirectory

with TemporaryDirectory() as directory:
    target = Path(directory) / "config.json"
    with NamedTemporaryFile("w", encoding="utf-8", dir=directory, delete=False) as temp:
        json.dump({"workers": 4}, temp)
        temp.flush()
        os.fsync(temp.fileno())
        temporary = temp.name
    os.replace(temporary, target)
    print(json.loads(target.read_text(encoding="utf-8")))
```

## 文本、二进制与规模边界

文本文件必须经过编码，图片、压缩包和协议帧应以二进制模式处理。`read()` 不带大小会把全部内容载入内存；未知或超大文件应逐行或固定块读取。外部文件路径必须解析并限制在允许目录内，不能只检查字符串是否含 `..`。

## 常见错误与工程注意

- `w` 会立即截断现有文件；不允许覆盖时使用 `x`。
- 显式指定编码和换行规则，避免跨平台乱码。
- 写关键配置可先写临时文件，再原子替换，降低中途崩溃导致的损坏。
- 跨进程并发写文件需要锁、单写者队列或数据库，单个 `with` 不能提供并发一致性。
