# Python3 命名空间/作用域

## 概念与用途

命名空间是名称到对象的映射，作用域决定当前代码可直接访问哪些名称。Python 按 LEGB 顺序查找：Local、Enclosing、Global、Built-in。

## 核心语法

赋值默认创建局部名称；`global` 修改模块级名称，`nonlocal` 修改最近的闭包名称。闭包能让内部函数记住外层函数调用中的状态。

```python
def make_counter():
    count = 0

    def increment() -> int:
        nonlocal count
        count += 1
        return count

    return increment

counter = make_counter()
print(counter(), counter())
```

## 常见错误与工程注意

- 在函数内给名称赋值会使其成为局部变量，赋值前读取可能触发 `UnboundLocalError`。
- 少用 `global` 共享可变状态，优先参数、返回值或对象封装。
- 闭包循环变量存在晚绑定问题，可通过默认参数或辅助函数捕获当前值。
