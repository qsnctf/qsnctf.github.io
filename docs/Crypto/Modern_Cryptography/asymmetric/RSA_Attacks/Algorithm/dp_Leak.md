# dp 泄露攻击

RSA 的 CRT 私钥参数定义为：

$$
d_p=d\bmod(p-1)
$$

因为 $ed\equiv1\pmod{p-1}$，所以：

$$
ed_p\equiv1\pmod{p-1}
$$

存在整数 $k$ 使：

$$
ed_p-1=k(p-1)
$$

因此：

$$
p=\frac{ed_p-1}{k}+1
$$

又因为 $0<d_p<p-1$，通常有 $1\le k<e$。当 $e=65537$ 时，枚举 $k$ 的成本很低。

## 识别条件

- 已知 $n,e,c$ 和 $d_p$；
- $d_p$ 是 $d\bmod(p-1)$，不是完整私钥 $d$；
- 公钥指数 $e$ 较小或为常见值 $65537$，可枚举 $1\le k<e$。

## 方法一：枚举 k

```python
def factor_from_dp(n, e, dp):
    value = e * dp - 1
    for k in range(1, e):
        if value % k != 0:
            continue
        p = value // k + 1
        if p > 1 and n % p == 0:
            return p, n // p
    return None


result = factor_from_dp(n, e, dp)
if result:
    p, q = result
    phi = (p - 1) * (q - 1)
    d = pow(e, -1, phi)
    m = pow(c, d, n)
```

## 方法二：随机底数 GCD

由 $ed_p-1$ 是 $p-1$ 的倍数可知，对多数不被 $p$ 整除的 $a$：

$$
a^{ed_p-1}\equiv1\pmod p
$$

因此可以计算：

$$
\gcd(a^{ed_p-1}-1,n)
$$

```python
from math import gcd


def factor_from_dp_gcd(n, e, dp):
    exponent = e * dp - 1
    for base in range(2, 100):
        factor = gcd(pow(base, exponent, n) - 1, n)
        if 1 < factor < n:
            return factor, n // factor
    return None
```

这种方法避免枚举全部 $k$，但个别底数可能得到 $1$ 或 $n$，需要更换底数。

## 防护

- 将 $d_p,d_q,q^{-1}\bmod p$ 视为与完整私钥同等级的秘密；
- 防止调试日志、故障注入、旁信道和内存泄露暴露 CRT 参数；
- 使用具备 RSA blinding、常数时间实现和故障检测的密码库。
