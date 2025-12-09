# 维吉尼亚密码详解

## 概述

**维吉尼亚密码**是一种**多表移位加密（polyalphabetic substitution cipher）**，它的核心思想是：“使用一个**密钥（keyword）**控制每个字母的移位量，而不是像凯撒密码那样所有字母统一偏移。”因此它是对凯撒密码的扩展和加强版，避免了频率分析攻击的弱点。

在凯撒密码中，字母表中的每一字母都会作一定的偏移，例如偏移量为3时，A就转换为了D、B转换为了E……而维吉尼亚密码则是由一些偏移量不同的恺撒密码组成。

## 历史背景

维吉尼亚密码源于15—16世纪欧洲为对抗频率分析而发展的“多表代换”思想，核心是用关键词控制多套恺撒移位字母表轮换加密；1553年意大利密码学家贝拉索已提出与现代维吉尼亚体系非常接近的关键词多表加密方法，1586年法国的维吉尼亚又提出相关改进，但后来在19世纪被误归名而广泛称作“维吉尼亚密码”，并一度被誉为“不可破译的密码”；直到19世纪中期巴贝奇等人已能破解实例，1863年卡西斯基公开了通过推测密钥长度再做分组频率分析的系统方法，维吉尼亚密码的“不可破译”神话才被打破。

## 加密原理

维吉尼亚密码是一种简单的多表代换密码其实由`26个类似的Caesar密码的代换表组成`,由一些偏移量不同的凯撒密码组成，这些代换在一起组成了密钥。

![](attachment/image-20251209204024666.png)

假设一串长为n，明文为P，密文为C，密钥为K那么可以得到
$$
C = (P_1 + K_1,\; P_2 + K_2,\; \ldots,\; P_m + K_m)\bmod 26
$$

$$
P = (C_1 - K_1,\; C_2 - K_2,\; \ldots,\; C_m - K_m)\bmod 26
$$

### 加密示例

假设

明文：ATTACKATDAWN

密钥：LEMON

**步骤1 - 重复密钥以达到明文一致长度：**

| **明文** | A    | T    | T    | A    | C    | K    | A    | T    | D    | A    | W    | N    |
| -------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| **密钥** | L    | E    | M    | O    | N    | L    | E    | M    | O    | N    | L    | E    |

**步骤2 -按字母表位移：** 

| **明文字母** | **密钥字母** | **偏移值**    | **密文字母**                 |
| ------------ | ------------ | ------------- | ---------------------------- |
| A  (0)       | L  (11)      | 0+11=11       | L                            |
| T  (19)      | E  (4)       | 19+4=23       | X                            |
| T  (19)      | M  (12)      | 19+12=31  → 5 | F                            |
| A  (0)       | O  (14)      | 0+14=14       | O                            |
| C  (2)       | N  (13)      | 2+13=15       | P                            |
| K  (10)      | L  (11)      | 10+11=21      | V                            |
| ...          | ...          | ...           | **最终密文为：LXFOPVEFRNHR** |

## 解密原理

我们知道，移位密码、仿射密码和单表代换密码都没有破坏统计规律，所以我们可以直接根据字母的频率分析进行破解。

**解密是反向移位：**
$$
D_i = (C_i - K_i + 26)\ \%\ 26
$$
**步骤1 –与密文对照：**

| **密文** | L    | X    | F    | O    | P    | V    | E    | F    | R    | N    | H    | R    |
| -------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| **密钥** | L    | E    | M    | O    | N    | L    | E    | M    | O    | N    | L    | E    |

**步骤2 -按字母表位移：** 

| **密文字母** | **密钥字母** | **偏移值**                          | **明文字母**                 |
| ------------ | ------------ | ----------------------------------- | ---------------------------- |
| L  (11)      | L  (11)      | 11-11=0                             | A                            |
| X  (23)      | E  (4)       | 23-4=19                             | T                            |
| F  (5)       | M  (12)      | (因为5<12，所以应该是)26+5-12  = 19 | T                            |
| O  (14)      | O  (14)      | 14-14=0                             | A                            |
| P  (15)      | N  (13)      | 15-13=2                             | C                            |
| V  (21)      | L  (11)      | 21-11=10                            | K                            |
| ...          | ...          | ...                                 | **最终明文为：**ATTACKATDAWN |

## 代码实现

### 维吉尼亚密码

```python
def vigenere_encrypt(plaintext, key):
    plaintext = plaintext.upper()
    key = key.upper()

    ciphertext = ""
    key_index = 0

    for char in plaintext:
        if 'A' <= char <= 'Z':
            p = ord(char) - ord('A')
            k = ord(key[key_index % len(key)]) - ord('A')
            c = (p + k) % 26
            ciphertext += chr(c + ord('A'))
            key_index += 1
        else:
            ciphertext += char

    return ciphertext


def vigenere_decrypt(ciphertext, key):
    ciphertext = ciphertext.upper()
    key = key.upper()

    plaintext = ""
    key_index = 0

    for char in ciphertext:
        if 'A' <= char <= 'Z':
            c = ord(char) - ord('A')
            k = ord(key[key_index % len(key)]) - ord('A')
            p = (c - k + 26) % 26
            plaintext += chr(p + ord('A'))
            key_index += 1
        else:
            plaintext += char

    return plaintext


if __name__ == '__main__':
    plaintext = input("请输入明文：")
    key = input("请输入密钥：")
    encrypted = vigenere_encrypt(plaintext, key)
    print("加密结果：", encrypted)

    ciphertext = input("请输入密文：")
    key = input("请输入密钥：")
    decrypted = vigenere_decrypt(ciphertext, key)
    print("解密结果：", decrypted)
```

### 维吉尼亚密码自动化

```python
import itertools
from string import ascii_uppercase


def vigenere_decrypt(ciphertext, key):
    ciphertext = ciphertext.upper()
    key = key.upper()
    plaintext = ""
    key_index = 0

    for char in ciphertext:
        if 'A' <= char <= 'Z':
            c = ord(char) - ord('A')
            k = ord(key[key_index % len(key)]) - ord('A')
            p = (c - k + 26) % 26
            plaintext += chr(p + ord('A'))
            key_index += 1
        else:
            plaintext += char

    return plaintext


def bruteforce_vigenere(ciphertext, max_key_len=4, keywords=None):
    if keywords is None:
        keywords = []

    print(f"开始爆破，最大密钥长度：{max_key_len}，关键词过滤：{keywords or '无'}\n")

    for key_len in range(1, max_key_len + 1):
        for key_tuple in itertools.product(ascii_uppercase, repeat=key_len):
            key = ''.join(key_tuple)
            plaintext = vigenere_decrypt(ciphertext, key)

            if all(kw.upper() in plaintext for kw in keywords):
                print(f"[可能密钥: {key}] 解密内容：{plaintext[:80]}")


if __name__ == '__main__':
    cipher = input("请输入密文（仅大写 A-Z）：").strip()
    maxlen_str = input("输入最大密钥长度（建议不超过6，默认4）：").strip()
    maxlen = int(maxlen_str) if maxlen_str else 4

    keywords = input("可选：输入关键词（英文，逗号分隔）：").strip()
    keyword_list = [k.strip() for k in keywords.split(',')] if keywords else []

    bruteforce_vigenere(cipher, max_key_len=maxlen, keywords=keyword_list)
```



## 安全性分析

### 优点

多表替换：用密钥控制不同移位表轮换，相比恺撒/单表替换更不容易被“单字母频率分析”直接破解

实现简单：加密解密只需做字母位移（模 26 加减），编码容易、手工也能操作

密钥可变：密钥不同会产生不同的加密效果，比固定映射的替换密码更灵活

### 缺点

密钥重复会泄露规律：经典维吉尼亚使用重复密钥，密钥长度一旦被推测出来，密文可被按周期拆分成多个“恺撒密码”分别破解

容易被 Kasiski /攻击：通过密文重复片段、重合指数等方法推测密钥长度，再做分组频率分析即可恢复密钥与明文

短密钥很脆弱：密钥越短，周期性越强，越容易被统计方法识别

## 补充

### Kasiski攻击

如果我们知道了密钥的长度m，破解难度就会降低。我们使用Kasiski测试，将相同字母组找出来，然后求距离差的最大公约数gcd()，由此猜测m。

因为若用给定的m个密钥表周期地对明文字母进行加密，则当明文中有两个相同的字母组（长度大于3）在明文序列中间隔得字母数为m的倍数时，这两个明文字母组对应的密文字母组必相同。但反过来，若密文中出现两个相同的字母组，它们所对应的明文字母组未必相同，但相同的可能性极大。所以我们可以在密文中寻找重复次数>=3的字母组。然后计算重复字母组的两两相邻的距离差

## 练习题

题目地址：[NO.0963 - 凯撒大帝的征讨之路](https://www.qsnctf.com/#/main/driving-range?page=1&keyword=NO.0963){ .md-button .md-button--primary target="_blank" rel="noopener"}

![image-20251209210224035](attachment/image-20251209210224035.png)

- 题目名称：凯撒大帝的征讨之路
- 题目难度：1
- 题目ID：NO.0963

## 在线工具

正在开发
