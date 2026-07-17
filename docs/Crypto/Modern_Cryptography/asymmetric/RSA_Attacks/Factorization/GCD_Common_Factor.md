# GCD 公因数分解

如果多个 RSA 模数错误地复用了同一个素数，例如：

$$
n_1=pq_1,\qquad n_2=pq_2
$$

那么计算最大公约数即可直接恢复公共素因子：

$$
\gcd(n_1,n_2)=p
$$

这种问题通常由密钥生成器随机数不足、设备启动时熵不足或错误复用素数造成。

## 识别条件

- 给出两个或更多 RSA 公钥模数；
- 某些模数可能共享素因子；
- 对任意两个不同模数，若 $1<\gcd(n_i,n_j)<n_i$，则二者均可被分解。

## Python 实现

```python
from math import gcd


def shared_prime_factors(moduli):
    results = []
    for i in range(len(moduli)):
        for j in range(i + 1, len(moduli)):
            p = gcd(moduli[i], moduli[j])
            if 1 < p < moduli[i] and 1 < p < moduli[j]:
                results.append({
                    "indexes": (i, j),
                    "p": p,
                    "q_i": moduli[i] // p,
                    "q_j": moduli[j] // p,
                })
    return results


ns = [101 * 113, 101 * 127, 131 * 137]
print(shared_prime_factors(ns))
```

对大量公钥逐对计算 GCD 的复杂度较高，实际审计通常使用乘积树和余数树进行批量 GCD 检测。

## 恢复明文

得到某个模数 $n=pq$ 的因子后：

```python
phi = (p - 1) * (q - 1)
d = pow(e, -1, phi)
m = pow(c, d, n)
```

## 防护

- 使用密码学安全随机数生成器；
- 确保系统启动后已积累足够熵再生成密钥；
- 不跨设备、证书或会话复用 RSA 素因子；
- 对批量生成的公钥执行 GCD 审计。
