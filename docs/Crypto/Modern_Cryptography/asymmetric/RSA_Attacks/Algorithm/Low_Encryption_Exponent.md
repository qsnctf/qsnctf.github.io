# 低加密指数攻击

教科书式 RSA 的加密公式为：

$$
c\equiv m^e\pmod n
$$

当公钥指数 $e$ 很小，并且明文整数也足够小，使得 $m^e<n$ 时，模约简实际上没有发生：

$$
c=m^e
$$

攻击者只需计算密文的整数 $e$ 次根即可恢复 $m$。

## 识别条件

- $e$ 很小，CTF 中最常见的是 $e=3$；
- 未使用 OAEP 等随机填充；
- 明文较短，满足 $m^e<n$；
- 或存在较小的整数 $k$，使 $m^e=c+kn$，可枚举 $k$ 后开根。

## Python 实现

```python
def integer_nth_root(value, degree):
    low, high = 0, 1
    while high**degree <= value:
        high *= 2

    while low + 1 < high:
        middle = (low + high) // 2
        if middle**degree <= value:
            low = middle
        else:
            high = middle
    return low, low**degree == value


e = 3
m = int.from_bytes(b"flag", "big")
n = 2**256 - 189
c = pow(m, e, n)

recovered, exact = integer_nth_root(c, e)
if exact:
    print(recovered.to_bytes((recovered.bit_length() + 7) // 8, "big"))
```

若直接开根失败，可在题目允许的小范围内尝试：

```python
for k in range(1_000_000):
    m, exact = integer_nth_root(c + k * n, e)
    if exact:
        print(m)
        break
```

枚举 $k$ 不是通用解法，范围过大时不可行。

## 与 Hastad 攻击的区别

- 低加密指数攻击：一组 $(n,e,c)$，依赖 $m^e<n$ 或很小的 $k$；
- Hastad 广播攻击：同一明文在至少 $e$ 个互素模数下以同一小指数加密，再通过 CRT 消去模运算。

## 防护

小指数本身并不必然不安全，$e=65537$ 是现代 RSA 的常见选择。真正的问题是确定性、无填充的教科书式 RSA。加密应使用 RSA-OAEP，且不得自行设计填充格式。
