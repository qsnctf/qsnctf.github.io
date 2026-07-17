# Common Modulus 共模攻击

若同一 RSA 模数 $n$ 被多个公钥指数复用，并使用不同指数加密同一明文：

$$
c_1\equiv m^{e_1}\pmod n,\qquad
c_2\equiv m^{e_2}\pmod n
$$

当 $\gcd(e_1,e_2)=1$ 时，根据贝祖定理可求得整数 $a,b$：

$$
ae_1+be_2=1
$$

于是：

$$
c_1^a c_2^b\equiv m^{ae_1+be_2}\equiv m\pmod n
$$

## 识别条件

- 两个公钥使用相同模数 $n$；
- 两个指数 $e_1,e_2$ 不同且互质；
- 两组密文对应同一个未经随机填充的明文；
- 通常要求 $\gcd(c_i,n)=1$，以便负指数对应的模逆存在。

## Python 实现

```python
def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    gcd_value, x1, y1 = extended_gcd(b, a % b)
    return gcd_value, y1, x1 - (a // b) * y1


def signed_mod_pow(base, exponent, modulus):
    if exponent < 0:
        base = pow(base, -1, modulus)
        exponent = -exponent
    return pow(base, exponent, modulus)


def common_modulus_attack(n, e1, c1, e2, c2):
    gcd_value, a, b = extended_gcd(e1, e2)
    if gcd_value != 1:
        raise ValueError("e1 与 e2 必须互质")
    return (
        signed_mod_pow(c1, a, n)
        * signed_mod_pow(c2, b, n)
    ) % n


p, q = 1009, 1013
n = p * q
m = 12345
e1, e2 = 17, 65537
c1, c2 = pow(m, e1, n), pow(m, e2, n)
print(common_modulus_attack(n, e1, c1, e2, c2))
```

## 特殊情况

若计算负指数时发现密文不存在模逆，即 $\gcd(c_i,n)>1$，这个 GCD 本身可能已经给出了 $n$ 的非平凡因子。

若 $g=\gcd(e_1,e_2)>1$，贝祖组合通常只能得到 $m^g\bmod n$，不能直接恢复 $m$；只有在额外满足整数开根等条件时才能继续。

## 防护

- 不要让不同用户共享同一个 RSA 模数；
- 每个密钥对都应独立生成 $p,q,n$；
- 使用 RSA-OAEP，使相同原始消息编码为不同的随机块。
