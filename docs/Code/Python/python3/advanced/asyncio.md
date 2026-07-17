# Python asyncio 模块

## 概念与用途

`asyncio` 以单线程事件循环调度协程，适合大量并发网络 I/O。协程在 `await` 处主动让出控制权；CPU 密集或阻塞函数会卡住整个事件循环。

## 核心 API

用 `async def` 定义协程，`await` 等待，`asyncio.run()` 启动入口，`create_task()` 并发调度。本教程以 Python 3.10 为最低基线，因此主要使用 `asyncio.gather()`；Python 3.11+ 才提供 `TaskGroup` 和 `ExceptionGroup`。

| API | 最低版本/用途 | 边界 |
| --- | --- | --- |
| `asyncio.run()` | 3.7，管理顶层事件循环 | 一个线程中不能嵌套调用 |
| `asyncio.gather()` | 并发等待多个 awaitable | 需明确异常和取消策略 |
| `asyncio.wait_for()` | 为单项操作设置超时 | 超时会取消内部任务 |
| `asyncio.to_thread()` | 3.9，把阻塞函数移到线程 | 不加速 CPU 密集 Python 代码 |
| `asyncio.TaskGroup` | 仅 Python 3.11+ | 结构化并发，3.10 不可用 |

```python
import asyncio

async def work(number: int) -> int:
    await asyncio.sleep(0.05)
    return number * number

async def main() -> None:
    results = await asyncio.gather(*(work(i) for i in range(5)))
    print(results)

asyncio.run(main())
```

## 示例：超时与资源清理

异步超时是工程边界，不只是性能选项。清理应放入 `finally`，因为超时和调用者取消都会注入 `CancelledError`。

```python
import asyncio

async def slow_operation() -> str:
    try:
        await asyncio.sleep(1)
        return "完成"
    finally:
        print("释放异步资源")

async def main() -> None:
    try:
        result = await asyncio.wait_for(slow_operation(), timeout=0.05)
        print(result)
    except asyncio.TimeoutError:
        print("操作超时")

asyncio.run(main())
```

在 Python 3.11+ 可把第一例改为 `async with asyncio.TaskGroup()`；若项目必须兼容 3.10，不应在可导入模块顶层引用 `TaskGroup`。

## 常见错误与工程注意

- 忘记 `await` 只会创建协程对象而不执行。
- 阻塞库应改用异步版本或 `asyncio.to_thread()`，并设置超时和取消处理。
- 不要在已有事件循环内再次调用 `asyncio.run()`。
- 保留 `create_task()` 返回的强引用，并在作用域结束前等待或取消任务，避免“后台任务”静默丢失异常。
