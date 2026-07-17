# Python3 输入和输出

## 概念与用途

`input()` 从标准输入读取一行文本，`print()` 写入标准输出。命令行工具应区分正常输出与错误输出，并通过格式化确保结果可读、可被脚本消费。

## 核心 API

`print()` 支持 `sep`、`end`、`file` 和 `flush`；`sys.stdin`、`sys.stdout`、`sys.stderr` 提供流接口。f-string 支持对齐、精度和数字格式。

```python
import sys

name = "Alice"
balance = 1234.5
print(f"{name:<10} {balance:>12,.2f}")
print("这是一条诊断信息", file=sys.stderr)
```

## 流与格式

| 接口 | 用途 | 工程约定 |
| --- | --- | --- |
| stdin | 输入数据 | 明确编码和最大长度 |
| stdout | 正常结果 | 可被管道消费 |
| stderr | 诊断信息 | 不污染机器输出 |
| 退出码 | 成功/失败状态 | 0 成功，非 0 失败 |

## 示例：捕获输出进行测试

```python
from contextlib import redirect_stdout
from io import StringIO

buffer = StringIO()
with redirect_stdout(buffer):
    print("result", 42, sep="=")
assert buffer.getvalue() == "result=42\n"
print(buffer.getvalue(), end="")
```

长期运行程序的输出可能被缓冲，必要时使用 `flush=True`，但高频逐行刷新会影响性能。机器接口应避免本地化装饰文本与数据混在同一流中。

## 常见错误与工程注意

- `input()` 返回值包含用户可控文本，使用前必须转换和校验。
- 面向其他程序的输出应采用 JSON/CSV 等稳定格式，不要随意改变字段。
- 密码不能用普通 `input()` 回显，应使用 `getpass.getpass()`。
