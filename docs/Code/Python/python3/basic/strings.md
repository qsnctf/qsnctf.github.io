# Python3 字符串

## 概念与用途

`str` 是不可变的 Unicode 文本序列，用于用户界面、协议字段和文本处理。索引返回单个字符，切片返回新字符串；编码后的 `bytes` 才是文件和网络上传输的字节。

## 核心 API

常用方法有 `strip()`、`split()`、`join()`、`replace()`、`find()`、`startswith()` 和 `casefold()`。格式化优先使用 f-string；原始字符串 `r"..."` 常用于正则和 Windows 路径。

```python
raw = "  Alice,Python,安全  "
name, *tags = [part.strip() for part in raw.strip().split(",")]
message = f"用户 {name} 的标签：{' / '.join(tags)}"
print(message)
print(message.encode("utf-8"))
```

## 常用操作

| 操作 | 返回 | 注意 |
| --- | --- | --- |
| `strip()` | 去除两端字符的新字符串 | 参数是字符集合，不是子串 |
| `split(sep)` | 字段列表 | 未指定 sep 时合并空白 |
| `join(parts)` | 拼接字符串 | 元素必须都是 str |
| `casefold()` | 激进大小写归一 | 适合无语言区分比较 |

## 示例：前缀删除的正确方式

```python
filename = "test_report.txt"
print(filename.removeprefix("test_"))
print(filename.rstrip(".txt"))       # 错误思路：按字符集合删除
print(filename.removesuffix(".txt")) # 正确删除固定后缀
```

Unicode 中“用户看到的字符”可能由多个码点构成，`len()` 不总等于字形数量。安全标识符、文件名和账户名应采用明确规范化与允许字符策略。

## 常见错误与工程注意

- 字符串不可变，`replace()` 等方法返回新值，必须接收返回结果。
- 不要用字符串拼接 SQL、Shell 命令或 HTML，应使用对应参数化或转义 API。
- 循环中大量 `+=` 拼接可改用列表收集后 `"".join()`。
