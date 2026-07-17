# Python3 内置函数

## 概念与用途

内置函数无需导入即可使用，覆盖聚合、迭代、类型构造、反射和 I/O。熟悉 `enumerate`、`zip`、`sorted`、`any`、`all` 等函数能减少手写循环并清楚表达意图。

## 核心 API

`len/sum/min/max` 聚合，`range/enumerate/zip` 迭代，`sorted/reversed` 排序，`isinstance` 检查类型，`iter/next` 操作迭代器。`help()` 和 `dir()` 用于交互探索。

```python
names = ["Alice", "Bob", "Carol"]
scores = [91, 78, 88]
records = list(zip(names, scores, strict=True))
for index, record in enumerate(sorted(records, key=lambda x: x[1], reverse=True), 1):
    print(index, record)
print(all(score >= 60 for score in scores))
```

## 分类速查

| 类别 | 函数 | 边界 |
| --- | --- | --- |
| 聚合 | `sum/min/max` | 空输入行为不同 |
| 迭代 | `iter/next/enumerate/zip` | 多为惰性对象 |
| 排序 | `sorted` | 返回新列表 |
| 反射 | `getattr/hasattr` | 名称不应任意来自用户 |

## 示例：带默认值的聚合

```python
values: list[int] = []
print(sum(values, start=0))
print(max(values, default=None))

words = ["python", "api", "security"]
print(sorted(words, key=lambda word: (len(word), word)))
```

`min()`/`max()` 的 `default` 只用于空迭代对象，不能与多个位置参数混用。对生成器执行聚合会消费它，后续如需复用应重新创建或显式保存数据。

## 常见错误与安全注意

- `eval()` 和 `exec()` 不可用于不可信文本，通常应改用解析器或映射表。
- `zip()` 默认静默截断较短输入，Python 3.10+ 可用 `strict=True` 检查长度。
- 不要用变量名覆盖 `id`、`input`、`open` 等内置函数。
