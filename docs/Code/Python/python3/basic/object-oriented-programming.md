# Python3 面向对象

## 概念与用途

类把状态与行为封装在对象中，适合表达具有不变量和生命周期的领域实体。Python 支持继承、多态、组合、属性与特殊方法；通常优先组合，只有明确“是一个”的关系才继承。

## 核心语法

实例方法首参数为 `self`，构造初始化使用 `__init__`。`@property` 暴露受控属性，`dataclasses.dataclass` 可减少数据类样板代码。

| 机制 | 用途 | 边界 |
| --- | --- | --- |
| 实例属性 | 每个对象独立状态 | 通常在 `__init__` 中建立 |
| 类属性 | 全类共享配置或常量 | 可变值会被实例共享 |
| `@classmethod` | 替代构造器、操作类级状态 | 首参数是 `cls` |
| `@staticmethod` | 放在类命名空间中的无状态函数 | 不访问 `self` 或 `cls` |
| `@property` | 保持属性语法并校验读写 | 不应隐藏昂贵 I/O |

```python
from dataclasses import dataclass

@dataclass
class Account:
    owner: str
    balance: float = 0.0

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("金额必须为正")
        self.balance += amount

account = Account("Alice")
account.deposit(100)
print(account)
```

## 示例：属性维护不变量

下例用私有约定属性保存摄氏温度，并让所有写入都经过范围校验。`_celsius` 不是安全隔离，只表示调用者不应直接依赖它。

```python
class Temperature:
    def __init__(self, celsius: float) -> None:
        self.celsius = celsius

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float) -> None:
        if value < -273.15:
            raise ValueError("低于绝对零度")
        self._celsius = float(value)

temperature = Temperature(20)
temperature.celsius = 25
print(temperature.celsius)
```

## 继承与组合边界

继承适合稳定的“是一个”关系和可替换接口，例如不同存储实现都实现 `save()`。仅为复用几行代码而继承容易形成脆弱层级；把协作者作为字段注入通常更容易替换和测试。特殊方法如 `__repr__`、`__eq__` 应保持低副作用，并返回协议要求的类型。

## 常见错误与工程注意

- 类属性中的可变对象会被所有实例共享，实例状态应在初始化时创建。
- 不要仅为“使用面向对象”建立没有状态和不变量的空壳类。
- 金额示例为简化展示，生产财务代码应使用 `Decimal` 而非 `float`。
- 子类覆盖方法时应维持父类契约，不能加强输入条件或改变返回语义。
- 对象若只保存数据，可优先使用 `@dataclass(frozen=True)` 表达不可变值对象。
