# 面向对象编程
类适合把状态、约束和行为组织成明确接口，但不是所有数据都需要类。
简单转换可用函数，简单记录可用 dataclass，存在稳定行为边界时再设计普通类。
## 类与实例
```python
class Counter:
    unit = "items"
    def __init__(self, start: int = 0) -> None:
        self.value = start
    def increment(self, step: int = 1) -> int:
        self.value += step
        return self.value
```
`Counter` 是类，`Counter()` 创建实例。`self` 是实例方法的第一个参数，
名称虽非语法关键字，但应始终遵守该约定。
## 实例属性与类属性
`self.value` 属于每个实例；`Counter.unit` 属于类并由实例查找共享。
```python
first = Counter()
second = Counter(10)
first.unit = "events"  # 创建/修改 first 的同名实例属性
```
不要把可变容器作为类属性来保存每个实例自己的数据：
```python
class Queue:
    def __init__(self) -> None:
        self.items: list[str] = []
```
类属性适合常量、共享配置或有意共享且妥善同步的状态。
## 实例方法、类方法与静态方法
```python
class Temperature:
    def __init__(self, celsius: float) -> None:
        self.celsius = celsius
    @classmethod
    def from_fahrenheit(cls, value: float) -> "Temperature":
        return cls((value - 32) * 5 / 9)
    @staticmethod
    def is_valid(value: float) -> bool:
        return value >= -273.15
```
实例方法操作实例；类方法常用作可继承的替代构造器；
静态方法只是放在类命名空间中的函数。若逻辑与类关系不强，模块函数通常更自然。
## 封装与命名约定
单下划线 `_cache` 表示内部实现，调用者应避免依赖。
双前导下划线 `__token` 会名称改写为类似 `_ClassName__token`：
```python
class Base:
    def __init__(self) -> None:
        self.__state = "base"
```
名称改写主要防止子类意外覆盖，不是安全或权限边界，也不是真正不可访问。
需要保护秘密时依靠权限、进程隔离、密钥管理等机制。
## property
属性可在保持点号接口的同时执行验证：
```python
class Account:
    def __init__(self, balance: int = 0) -> None:
        self.balance = balance
    @property
    def balance(self) -> int:
        return self._balance
    @balance.setter
    def balance(self, value: int) -> None:
        if value < 0:
            raise ValueError("balance cannot be negative")
        self._balance = value
```
property 应像普通属性一样廉价且少副作用。昂贵 I/O 或动作应使用方法名表达。
## dataclass
`dataclasses.dataclass` 可为数据载体生成 `__init__`、`__repr__`、`__eq__` 等：
```python
from dataclasses import dataclass, field
@dataclass
class Finding:
    title: str
    severity: int = 0
    tags: list[str] = field(default_factory=list)
    def __post_init__(self) -> None:
        if not 0 <= self.severity <= 10:
            raise ValueError("severity must be between 0 and 10")
```
可变默认值使用 `default_factory`，确保每个实例获得独立列表。
dataclass 不会根据类型注解自动校验类型，必要时在边界显式验证。
## frozen 与 slots
```python
@dataclass(frozen=True, slots=True)
class Point:
    x: int
    y: int
```
`frozen=True` 阻止常规属性赋值，但不等于对象图深度不可变或安全防篡改。
`slots=True` 从 Python 3.10 起可用，可减少部分实例开销并限制随意新增属性；
它会影响继承、弱引用和反射行为，应该基于需求使用。
## 特殊方法
特殊方法让对象参与语言协议：
```python
from dataclasses import dataclass
@dataclass(frozen=True)
class Vector:
    x: int
    y: int
    def __add__(self, other: object) -> "Vector":
        if not isinstance(other, Vector):
            return NotImplemented
        return Vector(self.x + other.x, self.y + other.y)
    def __len__(self) -> int:
        return 2
```
比较或算术方法遇到不支持类型时应返回 `NotImplemented`，让 Python 尝试反向操作或正确报错。
`__str__` 面向用户，`__repr__` 面向调试，后者应尽量明确且避免泄密。
## 不依赖 __del__ 清理资源
`__del__` 的调用时机、解释器关闭状态和循环引用场景不适合可靠资源管理。
文件、锁和连接应使用上下文管理器：
```python
class Session:
    def __enter__(self) -> "Session":
        self.open()
        return self
    def __exit__(self, exc_type, exc, traceback) -> bool:
        self.close()
        return False
```
`__exit__` 返回真值会压制异常，通常应返回 `False` 或 `None`，除非明确处理了异常。
## 继承与 super
```python
class NamedCounter(Counter):
    def __init__(self, name: str, start: int = 0) -> None:
        super().__init__(start)
        self.name = name
```
`super()` 按方法解析顺序 MRO 委托，不只是“调用直接父类”。
可用 `ClassName.mro()` 查看顺序。多继承中的协作方法应使用兼容签名并持续调用 `super()`。
## 重写与多态
子类可重写方法，但应遵守基类契约：接受兼容输入、提供兼容输出、保持关键语义。
```python
class Renderer:
    def render(self, text: str) -> str:
        raise NotImplementedError
class HtmlRenderer(Renderer):
    def render(self, text: str) -> str:
        return f"<p>{text}</p>"
```
如果只需要接口，可使用 `abc.ABC` / `@abstractmethod`，
或在类型层使用 `Protocol` 实现结构化子类型。
## 组合优于继承
继承表达“是一个”且共享稳定契约；组合表达“拥有一个/使用一个”：
```python
class ReportService:
    def __init__(self, renderer: Renderer) -> None:
        self.renderer = renderer
    def build(self, text: str) -> str:
        return self.renderer.render(text)
```
组合更容易替换依赖、独立测试并避免深层继承结构。
## 相等、哈希与排序
如果定义 `__eq__`，应同时思考对象是否可哈希。
可变对象通常不应根据可变字段提供哈希，否则放入集合后可能无法正确查找。
`@dataclass(frozen=True)` 在字段可哈希时通常适合值对象。
排序可用 `@dataclass(order=True)`，但字段声明顺序必须确实代表业务排序语义。
## 属性访问与反射
`getattr()`、`setattr()`、`hasattr()` 支持动态属性访问：
```python
value = getattr(record, field_name, None)
```
不要把不可信字符串直接映射为可调用方法并执行。应建立允许列表：
```python
handlers = {"start": start_handler, "stop": stop_handler}
handler = handlers.get(action)
```
## 测试类
测试应关注公开行为而非内部字段：
```python
def test_counter_increments() -> None:
    counter = Counter(2)
    assert counter.increment() == 3
```
依赖通过构造器注入能减少全局状态和复杂替换。
纯数据类测试验证默认值、边界和序列化；行为类还应验证状态转换与异常。
## 何时不用类
- 无状态转换：使用函数。
- 少量固定字段：考虑 dataclass、NamedTuple 或 TypedDict。
- 只有一个方法且无状态：模块函数通常更直接。
- 只是为了模仿 Java 式“工具类”：改用模块命名空间。
好的类有明确职责、较小公开接口和可维护的不变量，而不是属性与方法的随意集合。
## 小结
Python OOP 依靠约定与协议，而非严格访问控制。
优先清晰数据模型、组合、上下文管理器和可测试接口，谨慎使用继承与元编程。
