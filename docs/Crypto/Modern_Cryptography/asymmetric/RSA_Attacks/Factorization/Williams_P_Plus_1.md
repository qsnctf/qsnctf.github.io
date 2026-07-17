# Williams p+1 分解

Williams $p+1$ 方法与 Pollard $p-1$ 类似，但它使用 Lucas 序列，针对的是某个素因子 $p$ 的 $p+1$ 较光滑的情况。

设 Lucas 序列满足：

$$
V_0=2,\qquad V_1=P,\qquad V_k=PV_{k-1}-V_{k-2}
$$

选择由小素数幂构成的指数 $M$。在参数适合且 $p+1\mid M$ 时，通常有：

$$
V_M\equiv 2\pmod p
$$

因此可以尝试：

$$
g=\gcd(V_M-2,n)
$$

## 识别条件

- 已知模数 $n$；
- 至少一个素因子的 $p+1$ 是 $B$-光滑数；
- Pollard $p-1$ 失败，但题目暗示 $p+1$ 具有特殊结构；
- 算法是否成功还与 Lucas 序列参数 $P$ 有关，可能需要更换参数。

## 教学实现

下面用矩阵快速幂计算 $V_k(P,1)$，并实现 Williams 方法的第一阶段：

```python
from math import gcd


def mat_mul(a, b, n):
    return (
        (a[0] * b[0] + a[1] * b[2]) % n,
        (a[0] * b[1] + a[1] * b[3]) % n,
        (a[2] * b[0] + a[3] * b[2]) % n,
        (a[2] * b[1] + a[3] * b[3]) % n,
    )


def lucas_v(index, p_value, n):
    if index == 0:
        return 2 % n
    result = (1, 0, 0, 1)
    matrix = (p_value % n, -1 % n, 1, 0)
    exponent = index - 1
    while exponent:
        if exponent & 1:
            result = mat_mul(result, matrix, n)
        matrix = mat_mul(matrix, matrix, n)
        exponent >>= 1
    return (result[0] * p_value + 2 * result[1]) % n


def primes_up_to(bound):
    sieve = bytearray(b"\x01") * (bound + 1)
    sieve[:2] = b"\x00\x00"
    for i in range(2, int(bound**0.5) + 1):
        if sieve[i]:
            sieve[i * i:bound + 1:i] = b"\x00" * (((bound - i * i) // i) + 1)
    return [i for i in range(2, bound + 1) if sieve[i]]


def williams_p_plus_1(n, bound=10_000, parameter=3):
    value = parameter % n
    for prime in primes_up_to(bound):
        power = prime
        while power * prime <= bound:
            power *= prime
        value = lucas_v(power, value, n)

    factor = gcd(value - 2, n)
    if 1 < factor < n:
        return factor, n // factor
    return None
```

该代码用于展示原理，不包含第二阶段和完整的参数筛选。实战应优先使用成熟工具，并尝试不同的 $P$ 与界限 $B$。

## 与 Pollard p-1 的区别

| 方法 | 主要弱点 | 核心结构 |
|---|---|---|
| Pollard $p-1$ | $p-1$ 光滑 | 乘法群与费马小定理 |
| Williams $p+1$ | $p+1$ 光滑 | Lucas 序列 |

## 防护

使用经过审查的 RSA 密钥生成实现，随机选择足够大的素数，并避免 $p\pm1$ 呈现异常光滑结构。
