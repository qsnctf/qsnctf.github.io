## RSA 算法正确性证明

RSA 的正确性是指：对于任意整数 $m$（$0 \le m < n$），当公钥指数 $e$ 与私钥指数 $d$ 满足：

$$ed \equiv 1 \pmod{\lambda(n)}$$

且 $n = pq$ 为两个不同素数的乘积时，始终有：

$$(m^{e})^{d} \equiv m \pmod{n}$$

### 一、 基于费马小定理的证明（分步模运算）

这是最经典的证明方式，避开了 $\gcd(m, n) = 1$ 的限制，适用于所有 $m$。

#### **1. 数学基础**

- **费马小定理**：若 $p$ 为素数，则对任意整数 $a$，有 $a^p \equiv a \pmod p$。

- **推论**：若 $p \nmid a$，则 $a^{p-1} \equiv 1 \pmod p$。

- **条件**：$ed = 1 + h \cdot \text{lcm}(p-1, q-1)$，因此存在整数 $k_1, k_2$ 使得：

  $$ed - 1 = k_1(p-1) = k_2(q-1)$$

#### **2. 分别证明模 $p$ 和 模 $q$ 成立**

以模 $p$ 为例：

- **情况 1**：若 $m \equiv 0 \pmod p$，则 $m^{ed} \equiv 0 \equiv m \pmod p$。

- **情况 2**：若 $m \not\equiv 0 \pmod p$，根据费马小定理：

  $m^{ed} = m \cdot m^{ed-1} = m \cdot m^{k_1(p-1)} = m \cdot (m^{p-1})^{k_1} \equiv m \cdot 1^{k_1} \equiv m \pmod p$

同理可证，$m^{ed} \equiv m \pmod q$。

#### **3. 综合结论**

由于 $p$ 和 $q$ 是不同的素数（互质），根据**中国剩余定理 (CRT)** 的推论，若一个数同时模 $p$ 和模 $q$ 同余，则它也模 $pq$ 同余：

$$m^{ed} \equiv m \pmod{pq}$$

------

### 二、 基于欧拉定理的证明（整体模运算）

这种方法更为简洁，常用于教学，但需注意其前提条件。

#### **1. 数学基础**

- **欧拉定理**：若 $\gcd(m, n) = 1$，则 $m^{\varphi(n)} \equiv 1 \pmod n$。
- 其中 $\varphi(n) = (p-1)(q-1)$。

#### **2. 证明过程**

由 $ed \equiv 1 \pmod{\varphi(n)}$ 可知 $ed = 1 + h\varphi(n)$。

$$\begin{aligned} (m^e)^d = m^{ed} &= m^{1 + h\varphi(n)} \\ &= m \cdot (m^{\varphi(n)})^h \\ &\equiv m \cdot 1^h \pmod n \\ &\equiv m \pmod n \end{aligned}$$

#### **3. 边界情况：当 $\gcd(m, n) \neq 1$ 时**

在 RSA 中，由于 $n=pq$，$\gcd(m, n) > 1$ 意味着 $m$ 是 $p$ 或 $q$ 的倍数。在现代超大素数环境下，随机选到的 $m$ 恰好是 $p$ 或 $q$ 倍数的概率极低（约 $10^{-100}$ 量级）。即便发生，如前文“费马小定理”部分所述，结论依然成立。
