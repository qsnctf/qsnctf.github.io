# Python3 基础语法

## 概念与用途

Python 使用换行结束普通语句、使用冒号和缩进组成代码块。名称区分大小写，变量通过赋值绑定对象。良好的语法风格遵循 PEP 8，通常使用 4 个空格缩进。

## 核心语法

赋值可解包多个值；`if`、`for`、`while`、`def`、`class`、`with` 和 `try` 后都需要冒号及缩进块。括号内表达式可以自然跨行。

```python
name, score = "Alice", 92
level = (
    "优秀" if score >= 90
    else "合格" if score >= 60
    else "需改进"
)
print(f"{name}: {level}")
```

## 语句规则

| 语法 | 作用 | 建议 |
| --- | --- | --- |
| `=` | 名称绑定 | 不等于数学等式 |
| `:` | 开始缩进块 | 后续至少一条语句 |
| `pass` | 空操作占位 | 避免长期留空实现 |
| `;` | 同行分隔语句 | 风格上通常不用 |

## 示例：解包与交换

```python
first, second = 10, 20
first, second = second, first
head, *middle, tail = range(6)
print(first, second)
print(head, middle, tail)
```

扩展解包只能出现一个星号目标。生产代码应让每条语句承担清晰职责；过度压缩的条件表达式、链式赋值和解包会增加审查成本。

## 常见错误与工程注意

- Tab 与空格混用会触发 `TabError` 或产生难以发现的层级错误。
- 不建议用分号把多个语句挤在一行，也不要用反斜杠做复杂续行。
- 变量名不要覆盖 `list`、`str`、`sum` 等内置名称。
