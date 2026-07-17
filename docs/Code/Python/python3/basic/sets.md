# Python3 集合

## 概念与用途

集合是无序、不重复的可哈希对象集合，擅长成员测试、去重和数学集合运算。`frozenset` 是不可变集合，可作为字典键。

## 核心 API

`add()`、`update()` 添加元素，`discard()` 安全删除，`remove()` 在不存在时抛异常。`| & - ^` 分别表示并集、交集、差集和对称差。

```python
backend = {"Alice", "Bob", "Carol"}
security = {"Bob", "Dave"}
print("共同成员:", backend & security)
print("全部成员:", backend | security)
print("仅后端:", backend - security)
```

## 集合关系

| 操作 | 运算符/API | 用途 |
| --- | --- | --- |
| 子集 | `a <= b` | 权限是否被允许集覆盖 |
| 真子集 | `a < b` | 严格包含 |
| 不相交 | `isdisjoint()` | 快速冲突检查 |
| 对称差 | `a ^ b` | 两侧独有元素 |

## 示例：权限校验

```python
allowed = {"read", "write", "delete"}
requested = {"read", "write"}
if requested <= allowed:
    print("权限请求有效")
print("未请求权限:", sorted(allowed - requested))
print("冲突:", requested.isdisjoint({"admin"}) is False)
```

对不可变权限常量可使用 `frozenset`，避免调用方意外修改。集合去重会丢失重复次数和原顺序；需要保序去重可利用字典键顺序。

## 常见错误与工程注意

- 空集合必须写 `set()`，`{}` 创建的是字典。
- 集合顺序不能作为稳定输出或业务顺序；需要稳定结果时先 `sorted()`。
- 列表、字典等不可哈希对象不能直接作为集合元素。
