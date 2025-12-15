# 培根密码详解

## 概述

培根密码（Bacon’s Cipher）是一种由 弗朗西斯·培根在 17 世纪提出的二进制编码式密码/隐写方法。它把每个字母表示为一组固定长度的 A/B 序列，再把这串 A/B“藏”进普通文本里，从而实现看起来是正常文字，但实际携带密文的效果。它的特点是实现简单、隐蔽性强，但安全性主要依赖于对方是否知道哪两种形式代表 A/B以及采用的字母表规则

## 历史故事

培根密码背后的历史故事大致是这样：17世纪初，英国哲学家弗朗西斯·培根在讨论“如何把秘密信息藏进普通文字里”的背景下，提出了后来被称为培根密码/双字母密码的方法——用两种可区分的文字形式分别代表 A/B，再把每个字母编码成 5 位的 A/B 序列，从而把“真信息”悄悄埋进一段看似正常的假信息里；相关思想在他 1605 年的著作中就已出现，并在后来的《De Augmentis Scientiarum》里以更系统的方式呈现，被认为是早期把“二元表示”用于编码的典型例子之一。  

## 加密原理

培根密码使用两种不同的字体，代表 A 和 B，结合加密表进行加解密。

对照表

| 字母 | 编码  | 字母 | 编码  | 字母 | 编码  | 字母 | 编码  |
| ---- | ----- | ---- | ----- | ---- | ----- | ---- | ----- |
| a    | AAAAA | g    | AABBA | n    | ABBAA | t    | BAABA |
| b    | AAAAB | h    | AABBB | o    | ABBAB | u/v  | BAABB |
| c    | AAABA | i/j  | ABAAA | p    | ABBBA | w    | BABAA |
| d    | AAABB | k    | ABAAB | q    | ABBBB | x    | BABAB |
| e    | AABAA | l    | ABABA | r    | BAAAA | y    | BABBA |
| f    | AABAB | m    | ABABB | s    | BAAAB | z    | BABBB |

这个是常用的加密表，还有另外一种加密表，可以把那个加密表当成把字母从0-25排序，然后二进制表示，“A”表示0，“B”表示1,下面就是另一种加密对照表

| 字母 | 编码  | 字母 | 编码  | 字母 | 编码  |
| ---- | ----- | ---- | ----- | ---- | ----- |
| A    | AAAAA | B    | AAAAB | C    | AAABA |
| D    | AAABB | E    | AABAA | F    | AABAB |
| G    | AABBA | H    | AABBB | I    | ABAAA |
| J    | ABAAB | K    | ABABA | L    | ABABB |
| M    | ABBAA | N    | ABBAB | O    | ABBBA |
| P    | ABBBB | Q    | BAAAA | R    | BAAAB |
| S    | BAABA | T    | BAABB | U    | BABAA |
| V    | BABAB | W    | BABBA | X    | BABBB |
| Y    | BBAAA | Z    | BBAAB |      |       |

培根密码的核心思路是：**先把字母编码成一串 A/B（相当于 0/1），再把这串 A/B 隐藏到“表面正常”的文本里**。

### 把字母变成 5 位 A/B 编码

先约定一张**对照表**：每个字母对应 **5 个符号**，每个符号只能是 **A 或 B**

例如：

​	A → AAAAA

​	B → AAAAB

​	C → AAABA

​	……

**为什么是 5 位？**

因为 **2^5 = 32**，足够表示 26 个字母。

### 把明文逐字编码并拼接

加密时流程很机械：

1. 明文去掉非字母，统一大小写
2. 每个字母查表变成 5 位 A/B
3. 把所有字母的编码**按顺序拼起来**，形成一条很长的 A/B 序列

例子：

明文：BAD

​	编码：

​		B = AAAAB

​		A = AAAAA

​		D = AAABB

​	拼接：AAAAB AAAAA AAABB

## 加密示例

以`QSNCTFWELCOMESYOU`为示例我们对其进行加密

| 字母 | 编码  | 字母 | 编码  | 字母 | 编码  | 字母 | 编码  |
| ---- | ----- | ---- | ----- | ---- | ----- | ---- | ----- |
| Q    | ABBBB | S    | BAAAB | N    | ABBAA | C    | AAABA |
| T    | BAABA | F    | AABAB | W    | BABAA | E    | AABAA |
| L    | ABABA | C    | AAABA | O    | ABBAB | M    | ABABB |
| E    | AABAA | S    | BAAAB | Y    | BABBA | O    | ABBAB |
| U    | BAABB |      |       |      |       |      |       |

ABBBBBAAABABBAAAAABABAABAAABABBABAAAABAAABABAAAABAABBABABABBAABAABAAABBABBAABBABBAABB

这个就是我们加密以后得到的，上面的示例是第一种`I=J`和`U=V`的加密方式

然后我们看一下第二种的加密方式，用二进制表示的

| 字母 | 编码  | 字母 | 编码  | 字母 | 编码  | 字母 | 编码  |
| ---- | ----- | ---- | ----- | ---- | ----- | ---- | ----- |
| Q    | BAAAA | S    | BAABA | N    | ABBAB | C    | AAABA |
| T    | BAABB | F    | AABAB | W    | BABBA | E    | AABAA |
| L    | ABABB | C    | AAABA | O    | ABBBA | M    | ABBAA |
| E    | AABAA | S    | BAABA | Y    | BBAAA | O    | ABBBA |
| U    | BABAA |      |       |      |       |      |       |

BAAAABAABAABBABAAABABAABBAABABBABBAAABAAABABBAAABAABBBAABBAAAABAABAABABBAAAABBBABABAA

这个就是我们使用第二种加密对照表，加密后的密文

## 代码实现

#### 第二种加密对照表的代码实现

```python
bacon_dict = {'A': 'AAAAA', 'B': 'AAAAB', 'C': 'AAABA', 'D': 'AAABB', 'E': 'AABAA',
              'F': 'AABAB', 'G': 'AABBA', 'H': 'AABBB', 'I': 'ABAAA', 'J': 'ABAAB',
              'K': 'ABABA', 'L': 'ABABB', 'M': 'ABBAA', 'N': 'ABBAB', 'O': 'ABBBA',
              'P': 'ABBBB', 'Q': 'BAAAA', 'R': 'BAAAB', 'S': 'BAABA', 'T': 'BAABB',
              'U': 'BABAA', 'V': 'BABAB', 'W': 'BABBA', 'X': 'BABBB', 'Y': 'BBAAA',
              'Z': 'BBAAB'}
def encrypt_bacon(text):
    text = text.upper()  # 将输入文本转换为大写
    result = ''
    for char in text:
        if char.isalpha():  # 判断字符是否是字母
            result += bacon_dict[char] + ' '  # 将每个字母转换为对应的培根密码编码
        else:
            result += ' '  # 非字母字符直接输出空格
    return result
# 加密示例
plain_text = 'QSNCTFWELCOMSYOU'
encrypted_text = encrypt_bacon(plain_text)
print(f'明文：{plain_text}')
print(f'密文：{encrypted_text}')
```

如果我们需要第一种`I=J和U=V`的话我们把对照表改一下就可以了

```python
bacon_dict_24 = {
    'A': 'AAAAA', 'B': 'AAAAB', 'C': 'AAABA', 'D': 'AAABB', 'E': 'AABAA',
    'F': 'AABAB', 'G': 'AABBA', 'H': 'AABBB',
    'I': 'ABAAA',              # I=J
    'K': 'ABAAB', 'L': 'ABABA', 'M': 'ABABB', 'N': 'ABBAA', 'O': 'ABBAB',
    'P': 'ABBBA', 'Q': 'ABBBB', 'R': 'BAAAA', 'S': 'BAAAB', 'T': 'BAABA',
    'U': 'BAABB',              # U=V
    'W': 'BABAA', 'X': 'BABAB', 'Y': 'BABBA', 'Z': 'BABBB'
}

def encrypt_bacon_24(text):
    text = text.upper()
    result = []
    for ch in text:
        if ch.isalpha():
            # 合并规则：J->I, V->U
            if ch == 'J':
                ch = 'I'
            elif ch == 'V':
                ch = 'U'
            result.append(bacon_dict_24[ch])
        else:
            result.append('')  # 非字母：输出空(你也可以改成保留原字符)
    return ' '.join([x for x in result if x != ''])

# 加密示例
plain_text = 'QSNCTFWELCOMSYOU'
encrypted_text = encrypt_bacon_24(plain_text)
print(f'明文：{plain_text}')
print(f'密文：{encrypted_text}')
```

## 安全性分析

### 优点

**隐蔽性强（像隐写）**：密文可以“藏”在一段看起来正常的文本里，不容易被一眼看出是在传递秘密信息

**规则简单易实现**：只需要 A/B 两种状态，编码解码操作直观

**抗简单频率分析**：表面文本不直接呈现明文的字母频率特征，传统替换密码那种直接统计不太适用

### 缺点

**安全性依赖**：一旦别人知道你用培根隐写（以及 A/B 对应哪两种形式），就能直接读出编码，密码本身几乎不提供强加密

**容错性差**：复制、改字体、格式化、转码、OCR、重新排版等操作可能破坏大小写/字体差异，导致信息丢失或解密错误

**可检测性**：如果同一篇文本里大小写/字体/字形变化出现异常规律，容易被统计或工具检测出“存在隐藏信道”

**明文空间小、易被枚举**：编码固定、无复杂密钥扩展；对短信息很容易做穷举或通过上下文猜测

**不适合现代安全通信**：缺少现代密码所需的随机性、认证与抗攻击设计，更适合教学、竞赛和隐写示例

## 在线工具

[在线培根密码工具](https://tools.qsnctf.com/#//crypto/bacon){ .md-button .md-button--primary target="_blank" rel="noopener"}