# Python queue 模块

## 概念与用途

`queue` 提供线程安全的生产者消费者队列。`Queue` 先进先出，`LifoQueue` 后进先出，`PriorityQueue` 按优先级取出；有界队列还能提供背压。

## 核心 API

`put()` 添加任务，`get()` 获取任务，`task_done()` 标记完成，`join()` 等待全部任务。阻塞调用应配合超时或停止信号设计生命周期。

```python
from queue import Queue
from threading import Thread

tasks: Queue[int | None] = Queue()

def worker() -> None:
    while (item := tasks.get()) is not None:
        print(item * item)
        tasks.task_done()
    tasks.task_done()

thread = Thread(target=worker)
thread.start()
for value in range(3):
    tasks.put(value)
tasks.put(None)
tasks.join()
thread.join()
```

## 常见错误与工程注意

- 每次成功 `get()` 都必须对应一次 `task_done()`，否则 `join()` 永远阻塞。
- `qsize()` 只是瞬时近似值，不能用于无竞态业务判断。
- 多进程通信应使用 `multiprocessing.Queue`，异步代码使用 `asyncio.Queue`。
