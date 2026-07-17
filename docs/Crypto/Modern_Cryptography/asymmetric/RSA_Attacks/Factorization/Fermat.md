# 费马分解

费马分解适合处理两个素因子非常接近的 RSA 模数。它利用奇数可以表示为两个平方数之差这一事实：

$$
n=pq=a^2-b^2=(a-b)(a+b)
$$

因此，只要找到满足 $a^2-n=b^2$ 的整数 $a,b$，就能得到：

$$
p=a-b,\qquad q=a+b
$$

## 识别条件

- 已知 RSA 模数 $n$；
- $n$ 是奇数；
- $p$ 与 $q$ 很接近，即 $|p-q|$ 较小；
- 从 $\lceil\sqrt n\rceil$ 开始尝试时，很快遇到完全平方数。

若 $p$、$q$ 位数相近但数值相距很远，费马分解仍可能需要不可接受的时间。

## Python 实现

```python
from math import isqrt


def fermat_factor(n):
    if n % 2 == 0:
        return 2, n // 2

    a = isqrt(n)
    if a * a < n:
        a += 1

    while True:
        b2 = a * a - n
        b = isqrt(b2)
        if b * b == b2:
            return a - b, a + b
        a += 1


n = 100160063  # 10007 * 10009
p, q = fermat_factor(n)
print(p, q)
```

分解出 $p,q$ 后即可恢复私钥：

```python
phi = (p - 1) * (q - 1)
d = pow(e, -1, phi)
m = pow(c, d, n)
```

## 复杂度与防护

费马法大约需要从 $\sqrt n$ 搜索到 $(p+q)/2$。生成 RSA 密钥时应使用独立、安全的随机源选择素数，并确保两个素因子不存在异常接近的情况。实际系统还必须使用足够大的密钥和标准填充方案。
