# Python3 多线程

> 本页定位为并发模型选型和线程池任务编排；锁、事件和线程生命周期等底层 API 见 [Python threading 模块](threading.md)。

## 概念与用途

线程共享进程内存，适合并发等待文件、网络等 I/O。CPython 的 GIL 限制纯 Python CPU 密集代码并行执行，此类任务通常使用多进程、原生扩展或任务系统。

## 核心 API

`concurrent.futures.ThreadPoolExecutor` 提供任务提交、结果和异常传播；较底层的 `threading` 提供 `Thread`、`Lock`、`Event` 等同步原语。

| 工作负载 | 优先模型 | 原因 |
| --- | --- | --- |
| 少量阻塞 I/O | 线程池 | 可复用同步库 |
| 大量异步网络 I/O | `asyncio` | 较低任务开销 |
| CPU 密集 Python | 多进程 | 绕开 GIL 限制 |
| 独立可靠任务 | 外部任务队列 | 跨进程持久化和重试 |

```python
from concurrent.futures import ThreadPoolExecutor
from time import sleep

def fetch(item: int) -> int:
    sleep(0.05)
    return item * item

with ThreadPoolExecutor(max_workers=4) as pool:
    print(list(pool.map(fetch, range(6))))
```

## 示例：观察任务异常

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def divide(value: int) -> float:
    return 100 / value

with ThreadPoolExecutor(max_workers=3) as pool:
    futures = {pool.submit(divide, value): value for value in (5, 0, 4)}
    for future in as_completed(futures):
        try:
            print(futures[future], future.result())
        except ZeroDivisionError:
            print(futures[future], "失败")
```

线程池上下文退出时会等待任务完成。需要整体截止时间时，应设计任务自身的网络超时和取消协作；取消 Future 不能强制终止已经运行的 Python 函数。

## 常见错误与工程注意

- 共享可变状态会产生竞态，使用锁、队列或避免共享。
- 线程异常不会自动在主线程打印，必须读取 Future 结果。
- 线程池大小不是越大越好，应依据下游容量、文件描述符和延迟测试设定。
