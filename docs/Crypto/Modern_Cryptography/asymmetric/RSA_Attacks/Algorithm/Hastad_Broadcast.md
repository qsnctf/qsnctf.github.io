# Hastad 广播攻击

当同一明文 $m$ 使用相同的小指数 $e$，分别在多个两两互素的模数下进行无填充 RSA 加密时：

$$
c_i\equiv m^e\pmod{n_i}
$$

若至少收集到 $e$ 组密文，可使用中国剩余定理构造唯一的 $C$：

$$
C\equiv c_i\pmod{n_i},\qquad 0\le C<\prod n_i
$$

由于 $m<n_i$，通常有：

$$
m^e<\prod_{i=1}^{e}n_i
$$

所以 CRT 得到的 $C$ 就是整数 $m^e$，再开 $e$ 次方根即可恢复明文。

## 识别条件

- 多个不同的 RSA 模数 $n_i$；
- 使用相同的小指数 $e$，通常为 $3$；
- 加密的是完全相同的明文；
- 模数通常应两两互素；
- 未使用随机填充，且至少有 $e$ 组数据。

如果模数不互素，应先计算两两 GCD；共享素因子往往会导致更直接的分解。

## Python 实现

```python
from math import prod


def crt(remainders, moduli):
    modulus_product = prod(moduli)
    result = 0
    for remainder, modulus in zip(remainders, moduli):
        partial = modulus_product // modulus
        result += remainder * partial * pow(partial, -1, modulus)
    return result % modulus_product


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
moduli = [101 * 113, 107 * 127, 109 * 131]
message = 1234
ciphertexts = [pow(message, e, n) for n in moduli]

combined = crt(ciphertexts, moduli)
recovered, exact = integer_nth_root(combined, e)
assert exact
print(recovered)
```

## 常见失败原因

- 数据不足，密文组数少于 $e$；
- 各组明文并不完全相同；
- 使用了 OAEP 等随机填充，每次实际参与运算的编码块不同；
- CRT 合并后的值不是完全 $e$ 次幂；
- 模数之间存在公因数，应改用 GCD 分解。

## 防护

始终使用 RSA-OAEP。随机填充会使相同原始消息在每次加密时得到不同的编码结果，从根本上破坏广播攻击所需的“相同明文”条件。
