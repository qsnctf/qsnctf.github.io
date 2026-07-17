# Python while 循环

> 本页在 [Python3 循环语句](../basic/loops.md) 基础上聚焦重试、轮询和状态机；已有可迭代输入时优先阅读 [Python for 循环](for-loop.md)。

## 概念与用途

`while` 在条件持续为真时重复执行，适合重试、状态机、交互菜单和未知次数读取。循环应具有明确终止条件、等待策略和外部取消机制。

## 核心语法

条件在每轮开始前检查，`break` 退出，`continue` 跳到下一轮，`else` 在自然结束时执行。赋值表达式 `:=` 可在读取循环中同时获取并判断值。

| 控制量 | 目的 | 工程要求 |
| --- | --- | --- |
| 次数上限 | 防无限重试 | 记录最终失败 |
| 截止时间 | 限制总延迟 | 使用单调时钟 |
| 退避 | 保护下游服务 | 通常加入随机抖动 |
| 停止信号 | 支持关闭 | 每轮及时检查 |

```python
attempt = 0
maximum = 3
while attempt < maximum:
    attempt += 1
    print(f"第 {attempt} 次尝试")
    if attempt == 2:
        print("成功")
        break
else:
    print("全部失败")
```

## 示例：使用单调时钟控制轮询

```python
from time import monotonic, sleep

deadline = monotonic() + 0.2
checks = 0
while monotonic() < deadline:
    checks += 1
    if checks >= 3:
        print("条件满足")
        break
    sleep(0.03)
else:
    print("等待超时")
```

计算超时应使用 `monotonic()`，它不受系统时钟校准影响。网络调用本身也必须设置单次超时，否则一次阻塞就可能超过整个循环截止时间。

## 常见错误与工程注意

- 忘记更新条件会造成死循环；服务循环还应响应停止信号。
- 网络重试应有最大次数、指数退避和随机抖动，不能无间隔无限请求。
- `while True` 本身并非错误，但退出路径必须清晰且可测试。
