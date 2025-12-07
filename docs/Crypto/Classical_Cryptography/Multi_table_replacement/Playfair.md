# PlayFair密码详解

## 概述

PlayFair密码(PlayFair Cipher)是一种经典的双字母替换密码，属于古典人工加密体系。它通过将明文按两个字母一组进行加密，并借助一个5x5的密钥方阵完成替换，相比单字母替换更不易被简单频率分析破解。其名称来源于英国政治家莱昂·普莱费尔（Lord Playfair），他推广了这一方法；该密码最早由查尔斯·惠斯通（Charles Wheatstone）在19世纪提出。

## 历史背景

查尔斯·惠斯通于 1854 年发明了这种密码，莱尔德·普莱费尔倡导使用这种密码，并以他的名字命名。与仅加密单个字母的传统替换密码不同，Playfair 密码方法对二元组或字母片段进行编码。英国和澳大利亚军队在第一次世界大战、第二次布尔战争和第二次世界大战期间战术性地使用了它。加密的主要目的是在实际战斗中保护非关键但重要的数据。当敌方密码分析员解密它时，这些信息已毫无用处。

## 加密原理

### 基本概念

Playfair 密码可以视为多表替换一种经典形式：它不是逐个字母替换，而是把明文按两个字母一组进行替换。加密的依据来自一个 5×5 密钥方阵，两字母在方阵中的相对位置（同一行/同一列/构成长方形）决定替换结果。

### 密钥方阵构造

选取一串英文字母，除去重复出现的字母，将剩下的字母逐个逐个加入 5 × 5 的矩阵内，剩下的空间由未加入的英文字母依 a-z 的顺序加入。注意，将 q 去除，或将 i 和 j 视作同一字。

### 替换规则

对每一组明文字母 A B，在 5×5 方阵中找到它们的位置：

**规则1:同一行**

A替换成其右侧字母

B同理

**规则2：同一列**

A替换成其下方字母

B同理

**规则3:长方形**

若A与B不在同一行也不在同一列，则它们构成长方形的对角

替换成长方形的另外两个角：保持各自行不变，交换列

A -> (row(A), col(B))

B -> (row(B), col(A))

**伪代码表示**

```python
def playfair_encrypt_pair(a, b, pos, square):
    
    ra, ca = pos[a]
    rb, cb = pos[b]

    if ra == rb: #同一行
        return square[ra][(ca + 1) % 5], square[rb][(cb + 1) % 5]
    elif ca == cb: #同一列
        return square[(ra + 1) % 5][ca], square[(rb + 1) % 5][cb]
    else: #长方形
        return square[ra][cb], square[rb][ca]
```

### 可逆性(解密原理)

Playfair **不是自反**（不像 Atbash 那样同一算法既加密又解密）。

但它是**可逆的对称加密**：解密使用同一方阵、规则相同但方向相反：

同一行：向**左**（(c-1) mod 5）

同一列：向**上**（(r-1) mod 5）

长方形：仍然是**交换列**（与加密相同）

## 加密示例

### 基础示例

以playfair example为密钥，得到

| P    | L    | A    | Y    | F    |
| ---- | ---- | ---- | ---- | ---- |
| I    | R    | E    | X    | M    |
| B    | C    | D    | G    | H    |
| K    | N    | O    | Q    | S    |
| T    | U    | V    | W    | Z    |

比如有重复的a还有e和l我们填写时候就不用再去填写第二次

比如我们需要加密的内容为：**Hide the gold in the tree stump**

两两分组`HI DE TH EG OL DI NT HE TR EX ES TU MP`

**如果有重复的我们就换成X**比如分组时候tree，TR后面是EE这时候我们就需要用EX。

加密后的密文`BM OD ZB XD NA BE KU DM UI XM MO UV IF`

### 详细加密过程

比如上面举的例子

```
需要加密的：HI DE TH EG OL DI NT HE TR EX ES TU MP
H和I我们看到上面的表格，既不在同一列也不在同一行，那么就是用长方形的原则
(A -> (row(A), col(B))B -> (row(B), col(A)))
然后可以得到H对应B，I对应M -->BM
D和E在同一列就是替换成下面的字母
D-->O  E-->D得到DE对应OD
以此类推
得到加密后的密文：
BM OD ZB XD NA BE KU DM UI XM MO UV IF
```

## 代码实现

#### python完整代码实现

```python
import string

class PlayfairCipher:
    def __init__(self, key: str, merge_ij: bool = True, filler: str = "X"):
        self.merge_ij = merge_ij
        self.filler = filler.upper()
        self.square = self._build_square_from_key(key)
        self.pos = {self.square[r][c]: (r, c) for r in range(5) for c in range(5)}

    def _norm_char(self, ch: str) -> str:
        ch = ch.upper()
        if not ch.isalpha():
            return ""
        if self.merge_ij and ch == "J":
            return "I"
        return ch

    def _build_square_from_key(self, key: str):
        seen = set()
        seq = []

        for ch in key:
            ch = self._norm_char(ch)
            if ch and ch not in seen:
                seen.add(ch)
                seq.append(ch)

        alpha = list(string.ascii_uppercase)
        if self.merge_ij:
            alpha.remove("J")

        for ch in alpha:
            ch = self._norm_char(ch)
            if ch and ch not in seen:
                seen.add(ch)
                seq.append(ch)

        return [seq[i*5:(i+1)*5] for i in range(5)]

    def _prepare_pairs(self, text: str):
        cleaned = [self._norm_char(ch) for ch in text if ch.isalpha()]
        cleaned = [ch for ch in cleaned if ch]

        pairs = []
        i = 0
        while i < len(cleaned):
            a = cleaned[i]
            b = cleaned[i + 1] if i + 1 < len(cleaned) else None

            if b is None:
                pairs.append((a, self.filler))
                i += 1
            elif a == b:
                pairs.append((a, self.filler))
                i += 1
            else:
                pairs.append((a, b))
                i += 2
        return pairs

    def _crypt_pair(self, a: str, b: str, decrypt: bool = False):
        ra, ca = self.pos[a]
        rb, cb = self.pos[b]

        if ra == rb:  # same row
            shift = -1 if decrypt else 1
            return (self.square[ra][(ca + shift) % 5],
                    self.square[rb][(cb + shift) % 5])

        if ca == cb:  # same column
            shift = -1 if decrypt else 1
            return (self.square[(ra + shift) % 5][ca],
                    self.square[(rb + shift) % 5][cb])

        # rectangle
        return (self.square[ra][cb], self.square[rb][ca])

    def encrypt(self, plaintext: str) -> str:
        pairs = self._prepare_pairs(plaintext)
        out = []
        for a, b in pairs:
            x, y = self._crypt_pair(a, b, decrypt=False)
            out.extend([x, y])
        return "".join(out)

    def decrypt(self, ciphertext: str) -> str:
        cleaned = [self._norm_char(ch) for ch in ciphertext if ch.isalpha()]
        cleaned = [ch for ch in cleaned if ch]
        if len(cleaned) % 2 != 0:
            raise ValueError("密文长度必须为偶数（两两一组）。")

        out = []
        for i in range(0, len(cleaned), 2):
            a, b = cleaned[i], cleaned[i+1]
            x, y = self._crypt_pair(a, b, decrypt=True)
            out.extend([x, y])
        return "".join(out)

    def pretty_square(self) -> str:
        return "\n".join(" ".join(row) for row in self.square)


if __name__ == "__main__":
    key = "PLAYFAIR EXAMPLE"
    pf = PlayfairCipher(key=key, merge_ij=True, filler="X")

    print("=== 密钥方阵 ===")
    print(pf.pretty_square())

    plaintext = "HIDE THE GOLD IN THE TREE STUMP"
    ciphertext = pf.encrypt(plaintext)

    print("\n=== 加密演示 ===")
    print("关键词：", key)
    print("明文：", plaintext)
    print("密文：", ciphertext)

    print("\n=== 解密演示 ===")
    print("解密结果：", pf.decrypt(ciphertext))
```

### 安全性分析

#### 优点

双字母加密：以二元组替换代替单字母替换，较不容易被简单的单字母频率分析直接破解

规则明确易实现：只需一个 5×5 密钥方阵，按“同行/同列/长方形”三条规则即可完成加解密

手工可操作：不依赖机器也能执行，适合教学与演示古典密码思想

#### 缺点

安全性不足：仍可通过二元组频率统计、约束推理等方法在足够密文长度下被破译

密钥空间有限且结构泄露：方阵结构固定（常见 I/J 合并、填充字母等约定），会暴露可利用的规律

填充字母引入特征：为处理重复字母与补齐长度常插入 X 等填充字母，可能形成可识别模式，辅助攻击者分析

## 攻击方法

### 频率分析

Playfair密码的密文中仍然保留了明文的结构特征，攻击者可以利用频率分析来破解。通过统计密文中双字母组合的出现频率，攻击者可以推测出明文中最常见的字母组合，从而进行破解。 
由于Playfair密码是基于双字母的替换，攻击者可以构建一个676个条目的频率统计表，分析密文中的双字母组合，寻找规律。

### 构造矩阵

攻击者可以尝试重建加密所用的5x5字母矩阵。通过分析密文中出现的字母频率，攻击者可以推测出密钥的某些部分，从而重建矩阵。

## 在线工具

[在线Playfair密码工具](https://tools.qsnctf.com/#//crypto/Playfair){ .md-button .md-button--primary target="_blank" rel="noopener"}