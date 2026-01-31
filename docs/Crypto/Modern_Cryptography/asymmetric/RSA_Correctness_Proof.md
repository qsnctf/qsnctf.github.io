## 正确性证明

> RSA 的正确性源于数论：当 $ed\equiv1\pmod{\lambda(n)}$ 时，对任意整数 $m$ 都有 $(m^{e})^{d}\equiv m \pmod n$。该结论既可用费马小定理逐模证明，也可用欧拉定理或其卡迈克尔推广整体证明。

RSA 的正确性是指：
 对于任意整数 $m$，当公钥指数 $e$ 与私钥指数 $d$ 满足
$$
ed \equiv 1 \pmod{\lambda(n)}
$$
且 $n = pq$ 为两个不同素数的乘积时，始终有：
$$
(m^{e})^{d} \equiv m \pmod{n}.
$$
也就是说：**先加密再解密一定能还原原文（模 $n$ 意义下）**。

以下给出两种常见证明方式。

------

### **一、基于费马小定理的证明（接近原始 RSA 论文）**

#### **数学基础**

**费马小定理：**
 若 $p$ 为素数且 $p\nmid a$，则：
$$
a^{p-1} \equiv 1 \pmod{p}.
$$
在 RSA 中：
$$
n = pq,\qquad 
\lambda(n)=\operatorname{lcm}(p-1,q-1).
$$
由条件 $ed \equiv 1 \pmod{\lambda(n)}$，可写成：
$$
ed - 1 = h(p-1) = k(q-1)
$$
其中 $h,k$ 为非负整数。

------

#### **关键思路：逐模证明 + 中国剩余定理思想**

要证明：
$$
m^{ed} \equiv m \pmod{pq},
$$
只需分别证明：
$$
m^{ed} \equiv m \pmod{p}
\quad \text{且} \quad
m^{ed} \equiv m \pmod{q},
$$
因为对 $p$ 与 $q$ 都成立的同余式，必然对 $pq$ 成立（中国剩余定理的基本思想）。

------

#### **对模 $p$ 的证明**

分两种情况讨论：

##### **情况 1：$m \equiv 0 \pmod{p}$**

则 $m$ 是 $p$ 的倍数，因而 $m^{ed}$ 也是 $p$ 的倍数：
$$
m^{ed} \equiv 0 \equiv m \pmod{p}.
$$
结论成立。

------

##### **情况 2：$m \not\equiv 0 \pmod{p}$**

利用 $ed-1 = h(p-1)$，有：
$$
\begin{aligned}
m^{ed}
&= m^{ed-1}\, m \\
&= m^{h(p-1)}\, m \\
&= (m^{p-1})^{h} m \\
&\equiv 1^{h} m \pmod{p} \quad (\text{由费马小定理})\\
&\equiv m \pmod{p}.
\end{aligned}
$$
因此对所有 $m$：
$$
m^{ed} \equiv m \pmod{p}.
$$

------

#### **对模 $q$ 的证明**

同样分两种情况：

- 若 $m \equiv 0 \pmod{q}$，显然有 $m^{ed} \equiv m \pmod{q}$；
- 若 $m \not\equiv 0 \pmod{q}$，利用 $ed-1 = k(q-1)$ 与费马小定理，可得：

$$
m^{ed} \equiv m \pmod{q}.
$$

------

#### **综合结论**

因为：
$$
m^{ed} \equiv m \pmod{p}
\quad \text{且} \quad
m^{ed} \equiv m \pmod{q},
$$
由中国剩余定理可得：
$$
(m^{e})^{d} = m^{ed} \equiv m \pmod{pq}.
$$
这完成了 RSA 正确性的证明。

------

#### **重要注记**

1. **不能直接对模 $pq$ 应用费马小定理。**
   因为 $pq$ 不是素数，费马小定理只适用于素数模。

2. **为何现代实现可用更弱条件？**
   只要满足
   $$
   ed \equiv 1 \pmod{\lambda(pq)},
   $$
   上述证明仍然成立；并不需要更强的
   $$
   ed \equiv 1 \pmod{(p-1)(q-1)}.
   $$

3. **与中国剩余定理的关系。**
   上述“分别对 $p$ 与 $q$ 证明，再合并结论”的方法，本质上是中国剩余定理思想的一部分。

------

### **二、基于欧拉定理的证明（现代标准版本）**

#### **数学基础：欧拉定理**

若 $\gcd(m,n)=1$，则：
$$
m^{\varphi(n)} \equiv 1 \pmod{n},
$$
其中：
$$
\varphi(n) = (p-1)(q-1).
$$

------

#### **证明过程**

设：
$$
ed = 1 + h\varphi(n)
$$
则当 $\gcd(m,n)=1$ 时：
$$
\begin{aligned}
m^{ed}
&= m^{1 + h\varphi(n)} \\
&= m\,(m^{\varphi(n)})^{h} \\
&\equiv m\cdot 1^{h} \pmod{n} \\
&\equiv m \pmod{n}.
\end{aligned}
$$
这就证明了：
$$
m^{ed} \equiv m \pmod{n}.
$$

------

#### **更一般的情形：使用卡迈克尔函数**

若仅满足：
$$
ed \equiv 1 \pmod{\lambda(n)},
$$
则可使用 Carmichael 定理（欧拉定理的推广）：
$$
m^{\lambda(n)} \equiv 1 \pmod{n}
\quad (\gcd(m,n)=1),
$$
同样可推出：
$$
m^{ed} \equiv m \pmod{n}.
$$

------

#### **当 $m$ 与 $n$ 不互质时怎么办？**

这种情况极少发生（概率约为 $1/p + 1/q - 1/(pq)$），但即使发生，仍然有：

- 若 $m \equiv 0 \pmod{p}$，则 $m^{ed} \equiv m \pmod{p}$；
- 若 $m \equiv 0 \pmod{q}$，则 $m^{ed} \equiv m \pmod{q}$；

因此**回退到第一种费马小定理证明**即可覆盖这些边界情况。

