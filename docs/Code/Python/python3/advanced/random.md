# Python random

## 概念与用途

`random` 实现确定性的伪随机生成器，适合模拟、抽样和测试数据。设置相同种子可复现实验结果，但输出可预测，不能用于密码、令牌或安全抽奖。

## 核心 API

`randint()` 生成含两端的整数，`randrange()` 类似 range，`choice()` 抽单项，`sample()` 无放回抽样，`shuffle()` 原地打乱，`Random(seed)` 创建独立生成器。

```python
import random

rng = random.Random(2026)
population = list(range(1, 11))
print(rng.sample(population, k=3))
rng.shuffle(population)
print(population)
```

## API 与分布

| API | 分布/行为 | 注意 |
| --- | --- | --- |
| `random()` | `[0, 1)` 均匀浮点 | 不含 1 |
| `randint(a,b)` | 闭区间整数 | 包含 b |
| `sample(pop,k)` | 无放回 | k 不得超出总体 |
| `choices(pop,k)` | 有放回 | 可指定权重 |

## 示例：安全令牌对比

```python
import random
import secrets

random.seed(7)
print("可复现模拟:", [random.randint(1, 6) for _ in range(3)])
print("安全令牌:", secrets.token_urlsafe(16))
```

`random` 和 `secrets` 都是标准库，无需安装。测试中固定 seed 应使用局部 `Random` 实例，避免修改全局状态导致其他测试顺序相关。

## 常见错误与安全注意

- 安全随机使用 `secrets.choice()`、`token_urlsafe()` 或系统 CSPRNG。
- `shuffle()` 返回 `None`，结果保存在原列表。
- 并行模拟应管理独立种子，避免不同工作器产生相关序列。
