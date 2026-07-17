# Pollard p-1 分解

Pollard $p-1$ 方法利用了素因子 $p$ 的 $p-1$ 具有小素因子这一弱点。若存在一个可计算的整数 $M$，使得：

$$
p-1\mid M
$$

则由费马小定理可得：

$$
a^M\equiv 1\pmod p
$$

于是 $p$ 会整除 $a^M-1$，可通过下式找出：

$$
g=\gcd(a^M-1,n)
$$

当 $1<g<n$ 时，$g$ 就是 $n$ 的非平凡因子。

## 识别条件

- 已知模数 $n$；
- 至少一个素因子的 $p-1$ 是 $B$-光滑数，即其所有素因子都不大于界限 $B$；
- 调大 $B$ 后可能成功，但时间和内存消耗也会增加。

## Python 实现

下面是便于理解的第一阶段实现。循环执行 $a\leftarrow a^j\bmod n$，最终指数包含 $1$ 到 $B$ 中各整数的充分幂次。

```python
from math import gcd


def pollard_p_minus_1(n, bound=100_000, base=2):
    a = base % n
    for j in range(2, bound + 1):
        a = pow(a, j, n)

    factor = gcd(a - 1, n)
    if 1 < factor < n:
        return factor, n // factor
    return None


n = 257 * 1019
print(pollard_p_minus_1(n, bound=256))
```

## 结果判断

- $g=1$：界限过小、所选底数不合适，或不存在适合该方法的因子；
- $1<g<n$：分解成功；
- $g=n$：指数同时覆盖了两个因子的群阶，可尝试减小界限或更换底数。

实战中可使用 SageMath、PARI/GP、YAFU 等工具的优化实现以及第二阶段算法。

## 防护

生成 RSA 素数时，应避免 $p-1$ 或 $q-1$ 过度光滑。对于现代大密钥，仅满足这一要求并不足以保证安全，还必须使用足够大的随机素数和规范的密钥生成算法。
