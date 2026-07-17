# Python StringIO 模块

## 概念与用途

`io.StringIO` 在内存中模拟文本文件，支持 `read`、`write`、`seek` 等文件 API。它适合测试接受文件对象的函数、临时文本生成和捕获输出。

## 核心 API

构造器可传初始文本，`getvalue()` 获取全部内容，`seek()` 移动位置，`close()` 释放缓冲。二进制数据应使用 `io.BytesIO`。

```python
from io import StringIO

buffer = StringIO()
buffer.write("name,score\n")
buffer.write("Alice,95\n")
print(buffer.getvalue())
buffer.seek(0)
print(buffer.readline().strip())
buffer.close()
```

## API 行为

| API | 作用 | 注意 |
| --- | --- | --- |
| `write()` | 从当前位置写入 | 返回字符数 |
| `read()` | 从当前位置读取 | 可能得到空字符串 |
| `seek()` | 修改当前位置 | 文本流复杂位置有限制 |
| `truncate()` | 截断内容 | 默认截到当前位置 |

## 示例：作为函数依赖注入

```python
from io import StringIO

def write_report(stream, values: list[int]) -> None:
    stream.write(f"count={len(values)}\n")
    stream.write(f"total={sum(values)}\n")

output = StringIO()
write_report(output, [2, 3, 5])
assert output.getvalue() == "count=3\ntotal=10\n"
print(output.getvalue(), end="")
```

`StringIO` 是标准库，无需安装，也不涉及外部资源。让函数接受文本流而不是固定文件路径，可在测试中使用内存流、生产中使用真实文件或标准输出。

## 常见错误与工程注意

- 写入后读取前要注意当前位置，通常需要 `seek(0)`。
- 关闭后不能再 `getvalue()`，需要内容时应在关闭前获取。
- 超大内容仍占用内存，流式输出应写真实文件或分块消费者。
