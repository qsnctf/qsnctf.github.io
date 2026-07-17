# Python 测验

## 用途与规则

本页用于检查是否真正理解基础语义，而非只记住语法。先运行代码并写下预测结果，再查看答案；实践题可放在单独脚本中执行。

## 可运行实践题

```python
def unique_even(values: list[int]) -> list[int]:
    """返回升序且不重复的偶数。"""
    return sorted({value for value in values if value % 2 == 0})

assert unique_even([3, 2, 2, 4, 1, 6]) == [2, 4, 6]
print("实践题通过")
```

## API 辨析表

| 问题 | 应检查的概念 | 常见误区 |
| --- | --- | --- |
| 值还是身份 | `==` / `is` | 用 is 比较字符串 |
| 复制还是别名 | 可变对象引用 | 以为赋值会复制 |
| 惰性还是立即 | 生成器/list | 重复消费生成器 |
| 缺失还是假值 | `None` / 真值 | 把 0 当缺失 |

## 第二个实践题

```python
def parse_positive(text: str) -> int:
    value = int(text)
    if value <= 0:
        raise ValueError("必须为正数")
    return value

assert parse_positive("5") == 5
try:
    parse_positive("0")
except ValueError:
    print("边界检查通过")
```

实践题应同时覆盖成功与失败路径。只运行 happy path 容易漏掉异常类型、边界值和资源清理问题。

## 自测题

1. `==` 与 `is` 分别比较什么？
2. 为什么函数默认参数不应使用空列表？
3. 生成器相对列表的主要优势和限制是什么？
4. `with` 如何帮助异常路径释放资源？
5. `python -m pip` 为什么比直接调用 `pip` 更可靠？

## 答案与注意事项

答案依次是：值与身份；避免跨调用共享状态；惰性低内存但通常只能消费一次；上下文管理器保证退出清理；它把 pip 绑定到明确解释器。测验通过不等于具备工程能力，还应练习测试、日志、依赖锁定和错误处理。
