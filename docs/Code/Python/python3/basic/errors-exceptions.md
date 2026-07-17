# Python3 错误和异常

## 概念与用途

语法错误阻止程序解析，异常则在运行期间表示失败。异常沿调用栈传播，直到被匹配的 `except` 处理；合理的异常边界能保留诊断信息并提供恢复策略。

## 核心语法

`try/except/else/finally` 分别用于保护代码、处理异常、无异常后执行和始终清理。用 `raise` 主动抛出异常，用 `raise ... from error` 保留因果链。

| 子句 | 执行时机 | 典型用途 |
| --- | --- | --- |
| `try` | 可能失败的最小代码段 | 调用或转换 |
| `except T` | 匹配异常 `T` | 恢复、转换或增加上下文 |
| `else` | `try` 未抛异常 | 处理成功结果，避免误捕获 |
| `finally` | 无论成功、失败或返回 | 必须执行的清理 |

```python
def parse_port(text: str) -> int:
    try:
        port = int(text)
    except ValueError as error:
        raise ValueError("端口必须是整数") from error
    if not 1 <= port <= 65535:
        raise ValueError("端口超出范围")
    return port

print(parse_port("8080"))
```

## 示例：自定义异常与恢复边界

库层可把底层异常转换为领域异常，应用入口再决定提示、重试或退出。异常链保留根因，便于日志定位。

```python
class ConfigError(Exception):
    """配置无法解析或不满足约束。"""

def load_workers(text: str) -> int:
    try:
        workers = int(text)
    except ValueError as error:
        raise ConfigError("workers 必须是整数") from error
    if workers < 1:
        raise ConfigError("workers 必须大于 0")
    return workers

try:
    print(load_workers("four"))
except ConfigError as error:
    print(f"配置错误: {error}")
```

`finally` 不应包含 `return`，否则可能覆盖原返回值或正在传播的异常。资源对象支持上下文管理器时优先使用 `with`，比手工在 `finally` 关闭更不易遗漏。

## 异常设计规则

- 异常用于异常路径，不用于普通循环控制；迭代协议规定的 `StopIteration` 除外。
- 自定义异常通常继承 `Exception`，不要直接继承 `BaseException`。
- 错误消息应包含操作上下文，但不得泄漏密码、令牌和完整敏感载荷。
- 只在能够恢复、转换或补充有价值上下文的层级捕获异常。

## 常见错误与工程注意

- 避免裸 `except:` 或捕获后无处理，它会隐藏退出、拼写和程序缺陷。
- `try` 块应尽量小，只捕获能够恢复或转换的具体异常。
- 日志记录一次异常即可，重复记录会产生多份相同堆栈。
