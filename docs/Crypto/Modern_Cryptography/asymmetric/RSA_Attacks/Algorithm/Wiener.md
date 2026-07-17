# Wiener 攻击

Wiener 攻击针对私钥指数 $d$ 过小的 RSA。由：

$$
ed-k\varphi(n)=1
$$

可知：

$$
\frac{k}{d}\approx\frac{e}{\varphi(n)}\approx\frac{e}{n}
$$

当 $p,q$ 大小接近且 $d$ 足够小时，$k/d$ 会出现在 $e/n$ 的连分数渐近分数中。逐个测试这些候选值即可恢复 $d$。

经典充分条件常写为：

$$
d<\frac{1}{3}n^{1/4}
$$

实际可攻击范围会随密钥结构变化。

## 识别条件

- 已知公钥 $(n,e)$；
- $e$ 看起来异常大，可能是为了配合很小的 $d$；
- $p$ 与 $q$ 大小接近；
- 题目暗示私钥指数较小或要求使用连分数。

## Python 实现

```python
from math import isqrt


def continued_fraction(numerator, denominator):
    while denominator:
        quotient, remainder = divmod(numerator, denominator)
        yield quotient
        numerator, denominator = denominator, remainder


def convergents(terms):
    p0, p1 = 0, 1
    q0, q1 = 1, 0
    for term in terms:
        p0, p1 = p1, term * p1 + p0
        q0, q1 = q1, term * q1 + q0
        yield p1, q1


def wiener_attack(n, e):
    for k, d in convergents(continued_fraction(e, n)):
        if k == 0 or (e * d - 1) % k != 0:
            continue

        phi = (e * d - 1) // k
        sum_pq = n - phi + 1
        discriminant = sum_pq * sum_pq - 4 * n
        if discriminant < 0:
            continue

        root = isqrt(discriminant)
        if root * root == discriminant and (sum_pq + root) % 2 == 0:
            p = (sum_pq + root) // 2
            q = (sum_pq - root) // 2
            if p * q == n:
                return d, p, q
    return None
```

恢复 $d$ 后可直接解密：

```python
result = wiener_attack(n, e)
if result:
    d, p, q = result
    m = pow(c, d, n)
```

## 验证候选值

不能仅凭某个连分数分母就认定它是 $d$。可靠实现会由候选 $\varphi(n)$ 构造方程：

$$
x^2-(n-\varphi(n)+1)x+n=0
$$

只有判别式是完全平方数且两根乘积为 $n$ 时，候选才正确。

## 防护

使用规范 RSA 密钥生成器，不要为了提高解密或签名速度而人为选择很小的 $d$。性能优化应使用 CRT，而不是削弱私钥指数。
