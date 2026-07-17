# 类型、字符串、字节与容器
Python 的类型属于对象，而名称只是在运行时绑定对象。
理解引用、可变性以及 `str` / `bytes` 边界，是避免隐蔽错误的关键。
## 动态类型与强类型
同一名称可以重新绑定不同类型：
```python
value = 10
value = "ten"
```
但 Python 不会随意把不兼容类型隐式相加：
```python
# 1 + "2"  # TypeError
result = 1 + int("2")
```
可用 `type()` 查看精确类型，用 `isinstance()` 考虑继承关系：
```python
isinstance(True, int)  # True，因为 bool 是 int 的子类
type(True) is bool     # True
```
一般业务判断优先 `isinstance()`，不要依赖类型名字符串。
## 引用、相等与身份
```python
a = [1, 2]
b = a
c = [1, 2]
print(a == c)  # True，值相等
print(a is c)  # False，不是同一对象
print(a is b)  # True
```
不要用 `is` 比较普通数字或字符串；对象驻留是实现细节。
`None`、`True`、`False` 通常使用 `is`，其中布尔条件本身无需写 `is True`。
## 可变与不可变
修改可变对象不会创建同类新对象；不可变对象的“修改”会得到新对象：
```python
items = [1, 2]
items.append(3)
text = "py"
text += "thon"
```
函数接收的是对象引用的绑定。修改传入列表会影响调用者，重新绑定参数不会：
```python
def update(values: list[int]) -> None:
    values.append(3)
    values = [9]  # 只改变局部名称
data = [1, 2]
update(data)
print(data)  # [1, 2, 3]
```
## 复制
切片、`list.copy()`、`dict.copy()` 是浅复制，只复制外层容器：
```python
original = [[1], [2]]
shallow = original.copy()
shallow[0].append(9)
print(original)  # [[1, 9], [2]]
```
确有需要时使用 `copy.deepcopy()`，但应先判断数据模型是否能避免复杂共享。
深复制可能不适合文件句柄、网络连接或有特殊复制语义的对象。
## 数字
`int` 是任意精度整数，`float` 通常是 IEEE 754 双精度浮点数：
```python
large = 10**100
ratio = 3 / 2   # 1.5
floor = 3 // 2  # 1
remainder = 7 % 3
```
负数整除向负无穷取整：
```python
print(-3 // 2)  # -2
```
浮点近似比较使用：
```python
import math
math.isclose(0.1 + 0.2, 0.3)
```
十进制精确计算可使用 `decimal.Decimal`，分数可使用 `fractions.Fraction`。
## 真值
以下值通常为假：`None`、数值零、空字符串和空容器。
其他对象默认通常为真，类可通过 `__bool__()` 或 `__len__()` 定义行为。
```python
if not items:
    print("empty")
```
不要用真值判断混淆 `0` 与缺失值：
```python
if count is None:
    count = 0
```
## 字符串是 Unicode 文本
`str` 保存 Unicode 码点序列，而不是某种固定编码的原始字节。
```python
text = "Python 与安全"
print(len(text))
print(text[0], text[-1])
print(text[0:6])
```
字符串不可变，索引得到长度为 1 的字符串。
切片超出边界通常安全，直接索引超出边界会抛出 `IndexError`。
## 常用字符串操作
```python
raw = "  Alpha,Beta  "
clean = raw.strip()
parts = clean.split(",")
joined = " | ".join(parts)
name = "report.txt"
print(name.removeprefix("old-"))
print(name.removesuffix(".txt"))
```
`strip(".txt")` 不是删除后缀，而是移除两端属于字符集合 `.txt` 的字符。
删除固定前后缀应使用 `removeprefix()` / `removesuffix()`。
查找时根据语义选择：
```python
"py" in "python"          # 存在性
"python".startswith("py")
"a:b".partition(":")     # 始终返回三元组
```
## 字符串格式化
f-string 通常最清晰：
```python
name = "alice"
score = 93.456
message = f"{name=}, score={score:.2f}"
```
`!r` 使用 `repr()`，适合调试不可见字符：
```python
print(f"input={raw!r}")
```
不要把不可信字符串直接作为格式模板调用 `.format()`；模板应由程序控制。
## 编码与解码
编码规则必须由协议或文件格式确定，不能靠猜测：
```python
text = "你好"
payload = text.encode("utf-8")
restored = payload.decode("utf-8")
```
错误策略包括 `strict`、`replace`、`ignore` 等。
`ignore` 会静默丢数据，除非场景明确允许，否则不应作为通用修复。
```python
visible = b"abc\xff".decode("utf-8", errors="replace")
```
## bytes 与 bytearray
`bytes` 是不可变字节序列，索引返回整数：
```python
packet = b"ABC\x00"
print(packet[0])    # 65
print(packet[:3])   # b'ABC'
print(packet.hex()) # 41424300
```
十六进制文本与字节可互转：
```python
raw = bytes.fromhex("de ad be ef")
text = raw.hex()
```
`bytearray` 可原地修改：
```python
buffer = bytearray(b"ABC")
buffer[0] = 0x61
print(bytes(buffer))  # b'aBC'
```
处理敏感数据时，即使使用 `bytearray` 覆写，也不能保证运行时或系统不存在其他副本。
## 列表与元组
列表是可变有序序列，元组是不可变有序序列：
```python
items = ["a", "b"]
items.append("c")
items.extend(["d", "e"])
last = items.pop()
point = (10, 20)
x, y = point
single = (1,)
```
列表排序会原地修改并返回 `None`：
```python
numbers = [3, 1, 2]
numbers.sort()
ordered = sorted(numbers, reverse=True)
```
不要写 `numbers = numbers.sort()`。
## 字典
字典保存键值映射，Python 3.7+ 语言保证保留插入顺序，
但顺序语义不等于排序语义。
```python
user = {"name": "Alice", "score": 90}
user["active"] = True
score = user.get("score", 0)
for key, value in user.items():
    print(key, value)
```
键必须可哈希，通常要求其哈希值在生命周期内稳定。
列表不能作为键，元组只有在其所有成员都可哈希时才能作为键。
合并字典可用 3.9+ 的 `|`：
```python
defaults = {"timeout": 5, "retries": 2}
custom = {"timeout": 10}
config = defaults | custom
```
右侧同名键覆盖左侧。
## 集合
集合保存不重复、可哈希元素，不应依赖其迭代顺序：
```python
left = {1, 2, 3}
right = {3, 4}
print(left | right)  # 并集
print(left & right)  # 交集
print(left - right)  # 差集
print(left ^ right)  # 对称差
```
空集合写作 `set()`，`{}` 是空字典。
不可变集合 `frozenset` 可在满足条件时作为字典键或集合元素。
## 避免共享默认对象
重复引用会共享同一对象：
```python
rows = [[0] * 3 for _ in range(3)]  # 正确：三个独立列表
# rows = [[0] * 3] * 3              # 三行引用同一列表
```
函数默认参数的共享问题见函数专题，dataclass 的安全默认值见面向对象专题。
## 类型转换的失败方式
转换可能抛出异常：
```python
try:
    port = int("8080")
except ValueError:
    port = 80
```
`bool("False")` 是 `True`，因为非空字符串为真。
解析布尔文本应明确允许值：
```python
enabled = raw.strip().lower() in {"1", "true", "yes"}
```
## 选择容器
- 按位置保存、允许重复并需修改：`list`。
- 固定结构记录或不可变序列：`tuple`，复杂记录更适合 dataclass。
- 键到值的查找：`dict`。
- 去重、成员测试、集合运算：`set`。
- 两端高效入队出队：`collections.deque`。
- 不可变二进制：`bytes`；可变二进制缓冲区：`bytearray`。
下一篇将把这些对象放入运算符、控制流和推导式中使用。
