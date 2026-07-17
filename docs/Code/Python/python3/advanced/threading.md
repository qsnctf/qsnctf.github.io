# Python threading 模块

> 本页聚焦 `threading` 的底层同步原语；任务级并发和线程池选型见 [Python3 多线程](multithreading.md)。

## 概念与用途

`threading` 提供线程创建、同步和线程本地状态。它适合需要细粒度生命周期控制的 I/O 并发；简单任务池优先使用 `ThreadPoolExecutor`。

## 核心 API

`Thread` 创建线程，`Lock/RLock` 保护临界区，`Event` 广播状态，`Condition` 协调条件。线程应显式 `start()`，并由所有者 `join()` 等待结束。

| 原语 | 适用问题 | 关键约束 |
| --- | --- | --- |
| `Lock` | 互斥访问共享状态 | 临界区应短小 |
| `RLock` | 同线程可重入锁 | 可能掩盖复杂设计 |
| `Event` | 停止或就绪通知 | 不是任务队列 |
| `Condition` | 等待状态满足条件 | 总在循环中重新检查条件 |

```python
from threading import Lock, Thread

lock = Lock()
counter = 0

def increment() -> None:
    global counter
    for _ in range(1000):
        with lock:
            counter += 1

threads = [Thread(target=increment) for _ in range(4)]
for thread in threads:
    thread.start()
for thread in threads:
    thread.join()
print(counter)
```

## 示例：使用 Event 协作停止

```python
from threading import Event, Thread
from time import sleep

stop = Event()

def poll() -> None:
    while not stop.wait(0.05):
        print("轮询一次")
    print("线程退出")

thread = Thread(target=poll)
thread.start()
sleep(0.12)
stop.set()
thread.join(timeout=1)
```

`Event.wait(timeout)` 同时承担可中断等待和超时，优于循环里固定 `sleep()`。Python 没有安全的通用“杀线程”操作，工作线程必须定期检查停止信号并释放资源。

## 常见错误与工程注意

- GIL 不保证多步读改写操作的业务原子性，共享状态仍需同步。
- 获取多个锁时必须统一顺序，避免死锁。
- daemon 线程会在主程序退出时被突然终止，不适合必须完成的写入任务。
