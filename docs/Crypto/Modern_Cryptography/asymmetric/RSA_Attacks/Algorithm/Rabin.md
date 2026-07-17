# Rabin 密码体制

Rabin 密码体制使用平方映射加密：

$$
c\equiv m^2\pmod n,\qquad n=pq
$$

它与“$e=2$ 的 RSA”形式相似，但并不是标准 RSA，因为 $2$ 与 $\varphi(n)$ 不互素，不存在唯一的私钥指数。知道 $p,q$ 后可以高效求模平方根，但通常会得到四个候选明文。

## Blum 素数情形

若：

$$
p\equiv q\equiv3\pmod4
$$

则模 $p$ 和模 $q$ 的平方根可直接计算：

$$
r_p\equiv c^{(p+1)/4}\pmod p,\qquad
r_q\equiv c^{(q+1)/4}\pmod q
$$

每个素数模数下都有正负两个根，使用 CRT 组合后得到四个根。

## Python 实现

```python
def rabin_decrypt(c, p, q):
    if p % 4 != 3 or q % 4 != 3:
        raise ValueError("该简化公式要求 p、q 均模 4 余 3")

    rp = pow(c, (p + 1) // 4, p)
    rq = pow(c, (q + 1) // 4, q)
    inv_q_mod_p = pow(q, -1, p)
    inv_p_mod_q = pow(p, -1, q)
    n = p * q

    roots = set()
    for root_p in (rp, -rp % p):
        for root_q in (rq, -rq % q):
            root = (
                root_p * q * inv_q_mod_p
                + root_q * p * inv_p_mod_q
            ) % n
            roots.add(root)
    return sorted(roots)


p, q = 7, 11
message = 20
n = p * q
c = pow(message, 2, n)
print(rabin_decrypt(c, p, q))
```

## 筛选正确明文

Rabin 解密的核心歧义是四个根都在数学上成立。题目通常通过以下信息确定正确结果：

- 固定前缀，例如 `flag{`；
- 冗余编码或校验位；
- 已知消息长度；
- 哈希值或结构化格式。

```python
for value in rabin_decrypt(c, p, q):
    data = value.to_bytes((value.bit_length() + 7) // 8, "big")
    if data.startswith(b"flag{"):
        print(data)
```

## 与 e 为 2 的幂的关系

Rabin 对应一次平方，即 $e=2$。当 $e=2^t$ 且 $t>1$ 时，需要求更高阶的 $2^t$ 次根或连续求平方根，候选数量通常更多。

## 安全说明

Rabin 的陷门问题与整数分解紧密相关，但朴素方案是确定性的、具有明文歧义，也缺少现代加密所需的完整安全性质。实际系统不应使用教科书式 Rabin 或无填充 RSA，应采用经过标准化和审查的公钥加密方案。
