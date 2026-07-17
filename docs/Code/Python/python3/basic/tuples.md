# Python3 元组

## 概念与用途

元组是不可变、有序序列，适合表达坐标、数据库行和函数多返回值等固定结构。仅包含可哈希元素的元组可作为字典键或集合元素。

## 核心语法与 API

元组由逗号形成而不是括号；单元素元组必须写成 `(value,)`。支持索引、切片、解包、`count()` 和 `index()`。

```python
point = (12, 8)
x, y = point
rgb = (255, 128, 0)
r, g, b = rgb
print(f"point=({x}, {y}), color=#{r:02x}{g:02x}{b:02x}")
```

## 语义规则

| 写法 | 结果 | 说明 |
| --- | --- | --- |
| `1, 2` | 二元素元组 | 括号可省略 |
| `(1,)` | 单元素元组 | 逗号不可省略 |
| `tuple(iterable)` | 从迭代源构造 | 会消费生成器 |
| `a, b = pair` | 精确解包 | 数量不符抛异常 |

## 示例：具名元组

```python
from typing import NamedTuple

class Point(NamedTuple):
    x: int
    y: int

point = Point(3, 4)
print(point.x, point[1])
x, y = point
print(x + y)
```

`NamedTuple` 保留元组兼容性并增加字段名，但复杂校验和行为更适合 dataclass。公共 API 返回裸元组时应保持字段顺序稳定并写清契约。

## 常见错误与工程注意

- `(1)` 是整数而非元组，必须写 `(1,)`。
- 元组不可变不代表其内部对象不可变，例如 `([1],)` 中的列表仍能修改。
- 字段较多时优先使用 `dataclass` 或 `NamedTuple` 提升可读性。
