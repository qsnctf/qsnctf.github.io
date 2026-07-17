# Python3 条件控制

## 概念与用途

条件控制根据布尔表达式选择执行路径。`if` 处理首个条件，`elif` 添加互斥分支，`else` 处理其余情况；条件表达式适合简单的二选一赋值。

## 核心语法

空容器、零、空字符串和 `None` 为假值。比较可链式书写；Python 3.10 起可用 `match/case` 匹配结构，但普通范围判断仍更适合 `if`。

```python
score = 82
if not 0 <= score <= 100:
    grade = "无效"
elif score >= 90:
    grade = "A"
elif score >= 60:
    grade = "P"
else:
    grade = "F"
print(grade)
```

## 条件规则

| 写法 | 用途 | 注意 |
| --- | --- | --- |
| `if value:` | 真值判断 | 可能合并 0、空值与 None |
| `if value is None:` | 缺失判断 | 不与 0 混淆 |
| `a <= x < b` | 范围判断 | 可读且只求值一次 x |
| `match/case` | 结构匹配 | Python 3.10+ |

## 示例：结构模式匹配

```python
command = {"action": "move", "x": 3, "y": 4}

match command:
    case {"action": "move", "x": int(x), "y": int(y)}:
        print("移动到", x, y)
    case {"action": "quit"}:
        print("退出")
    case _:
        print("未知命令")
```

模式匹配不会自动验证未声明字段，也不是权限校验器。外部结构仍需 schema、长度和允许操作检查，避免只匹配到部分字段便执行敏感动作。

## 常见错误与工程注意

- `if x == "a" or "b"` 永远为真，应写 `x in {"a", "b"}`。
- 浮点、日期和权限边界要明确包含关系，避免大于与大于等于混淆。
- 复杂嵌套可通过提前返回或拆分函数降低圈复杂度。
