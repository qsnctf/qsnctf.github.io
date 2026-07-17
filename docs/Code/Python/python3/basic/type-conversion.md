# Python3 数据类型转换

## 概念与用途

类型转换把输入数据变成计算所需形式。Python 通常不隐式混合字符串和数字，因此命令行、文件或网络输入需要显式校验后转换。

## 核心 API

常用构造器有 `int(x, base)`、`float()`、`str()`、`bool()`、`list()`、`tuple()`、`set()` 和 `dict()`。`bytes.decode()` 与 `str.encode()` 在字节和文本间转换。

```python
raw = ["42", "0xff", "3.5"]
count = int(raw[0])
color = int(raw[1], 16)
ratio = float(raw[2])
payload = "你好".encode("utf-8")
print(count, color, ratio, payload.decode("utf-8"))
```

## 转换规则

| 来源 | 目标 | 推荐处理 |
| --- | --- | --- |
| 用户文本 | 数字 | 捕获 `ValueError` 并检查范围 |
| 文本 | 字节 | 明确 `encode("utf-8")` |
| 字节 | 文本 | 协议指定编码后 `decode()` |
| 可迭代对象 | list/set | 注意是否消耗生成器 |

## 示例：带校验的布尔转换

```python
def parse_bool(text: str) -> bool:
    normalized = text.strip().casefold()
    if normalized in {"1", "true", "yes"}:
        return True
    if normalized in {"0", "false", "no"}:
        return False
    raise ValueError(f"无效布尔值: {text!r}")

print(parse_bool("YES"), parse_bool("0"))
```

不要用 `bool(user_text)` 解析配置，因为除空字符串外都为真。转换函数应把格式验证和业务范围验证分开，使错误消息能够指出具体问题。

## 常见错误与工程注意

- `int("3.5")` 会抛出 `ValueError`，是否允许小数应由业务规则决定。
- 解码时应明确编码；随意使用 `errors="ignore"` 会静默丢失数据。
- 转换外部输入应捕获具体异常并给出可操作的错误信息。
