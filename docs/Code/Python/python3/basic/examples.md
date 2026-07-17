# Python3 实例

## 概念与用途

综合实例能把输入处理、数据结构、函数和异常串联起来。下面实现一个无需外部文件的词频统计器，适合进一步改造成命令行工具或文件分析程序。

## 核心实现

使用 `re.findall()` 提取单词，`casefold()` 统一大小写，`Counter` 统计频次。函数接收文本并返回结果，便于单元测试。

```python
import re
from collections import Counter

def word_frequency(text: str, limit: int = 5) -> list[tuple[str, int]]:
    if limit <= 0:
        raise ValueError("limit 必须为正")
    words = re.findall(r"[\w']+", text.casefold())
    return Counter(words).most_common(limit)

sample = "Python is clear. Python is productive; clear code matters."
for word, count in word_frequency(sample):
    print(f"{word}: {count}")
```

## 常见错误与工程注意

- `\w` 的 Unicode 规则未必等同于业务中的“单词”，国际化分词应使用专业库。
- 大文件不应一次性全部读入内存，可逐行更新同一个 `Counter`。
- 输出排序规则和并列处理应写入接口约定，避免结果随实现变化。
