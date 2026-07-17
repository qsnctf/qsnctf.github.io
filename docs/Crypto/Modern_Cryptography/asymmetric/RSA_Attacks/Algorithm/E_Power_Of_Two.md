# e 为 2 的幂

某些 CTF 题会令：

$$
e=2^t,\qquad c\equiv m^{2^t}\pmod n
$$

这不是标准 RSA 的合法参数选择。对普通 RSA 模数 $n=pq$，$\varphi(n)$ 为偶数，因此：

$$
\gcd(e,\varphi(n))\ne1
$$

$e$ 不存在模 $\varphi(n)$ 的逆元，不能按标准 RSA 计算唯一私钥指数。解密实质上变成连续求模平方根，并且会产生多个候选明文。

## 识别条件

- $e$ 满足 $e\mathbin{\&}(e-1)=0$，即 $e$ 是 2 的幂；
- 已知或能够分解 $n=pq$；
- 题目允许从多个根中依据明文格式筛选正确结果；
- 若另外满足 $m^e<n$，应优先尝试整数直接开 $e$ 次方根。

## 候选数量

每执行一次平方，通常会在模 $p$ 和模 $q$ 下产生多个根。连续开方后候选集合可能快速增长，实际数量取决于 $p-1$、$q-1$ 中 2 的幂因子以及密文是否属于相应剩余类。

## SageMath 实现

SageMath 的 `nth_root(..., all=True)` 可以枚举素数模数下的所有 $2^t$ 次根，再用 CRT 组合：

```python
from sage.all import CRT, Integers


def decrypt_power_of_two(p, q, e, c):
    if e <= 0 or e & (e - 1):
        raise ValueError("e 必须是 2 的幂")

    roots_p = Integers(p)(c).nth_root(e, all=True)
    roots_q = Integers(q)(c).nth_root(e, all=True)
    return sorted({
        int(CRT(int(root_p), int(root_q), p, q))
        for root_p in roots_p
        for root_q in roots_q
    })


candidates = decrypt_power_of_two(p, q, e, c)
for value in candidates:
    data = int(value).to_bytes((int(value).bit_length() + 7) // 8, "big")
    if b"flag{" in data:
        print(data)
```

## 不能简单使用私钥指数

由于 $e$ 与 $\varphi(n)$ 不互素，映射 $m\mapsto m^e\bmod n$ 通常不是一一映射。多个明文会映射到同一密文，所以即使已知 $p,q$，也需要枚举根并利用编码、前缀、校验信息或题目上下文筛选。

## 防护

标准 RSA 应选择满足 $\gcd(e,\lambda(n))=1$ 的指数，通常使用 $e=65537$。加密必须使用 RSA-OAEP，不应自定义指数或构造非标准 RSA 变体。
