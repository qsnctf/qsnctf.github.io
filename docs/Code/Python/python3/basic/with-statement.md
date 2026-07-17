# Python3 with

## 概念与用途

`with` 通过上下文管理器在进入和离开代码块时执行配套操作，即使发生异常也能清理资源。文件、锁、数据库事务和临时目录都适合这一模式。

## 核心语法与 API

上下文管理器实现 `__enter__` 与 `__exit__`，也可用 `contextlib.contextmanager` 和 `yield` 创建。多个资源可以写在同一条 `with` 中。

```python
from contextlib import contextmanager

@contextmanager
def managed_message(name: str):
    print("打开", name)
    try:
        yield name.upper()
    finally:
        print("关闭", name)

with managed_message("demo") as value:
    print(value)
```

## 协议与工具

| 方式 | 适用对象 | 特点 |
| --- | --- | --- |
| `__enter__/__exit__` | 类管理器 | 可复用复杂状态 |
| `@contextmanager` | 单次进入/清理流程 | 简洁生成器写法 |
| `ExitStack` | 动态数量资源 | 统一逆序释放 |
| `nullcontext` | 可选管理器 | 消除分支重复 |

## 示例：动态打开多个资源

```python
from contextlib import ExitStack
from io import StringIO

sources = ["first", "second", "third"]
with ExitStack() as stack:
    streams = [stack.enter_context(StringIO(text)) for text in sources]
    print([stream.read() for stream in streams])
```

`ExitStack` 按注册的反方向清理，适合资源数量运行时才确定的场景。进入过程中某个资源失败时，已经成功进入的资源仍会被释放。

## 常见错误与工程注意

- 不要依赖垃圾回收及时关闭文件、连接或锁。
- `__exit__` 返回真值会压制异常，除非明确需要，否则应让异常传播。
- 不要在离开 `with open(...)` 后继续使用已关闭的文件对象。
