# HILL密码详解

## 概述

HILL密码(HILL Cipher)是一种经典的多字母替换密码，基于线性代数的矩阵乘法来对明文分组加密。它由Lester S.HILL在1929年提出：把字母映射为数字，将明文按固定长度组成向量，与一个nxn的密钥矩阵相乘并对26取模得到密文；解密则需要该密钥矩阵在模26下可逆，才能计算逆矩阵恢复明文

## 加密原理

1.对于每一个字母，我们将其转换成对应的数字，一般来说我们使用的是A对应0，B对应1，然后这样依次对应，也可以自己指定一个字母表，然后对应。

2.将明文转换成一个1维的向量，然后将这个1维向量和一个nxn的密钥矩阵相乘，得到一个1维向量，然后对这个矩阵模26，然后通过对照的表把这个矩阵转换成对应的字母

**注意用作加密的矩阵（即密匙）在mod26下必须是可逆的，否则就不可能解码。**

**只有矩阵的行列式和 26 互质，才是可逆的。**

下面的表就是A<->0然后B<->1以此类推

| A    | 0    | B    | 1    | C    | 2    | D    | 3    | E    | 4    | F    | 5    | G    | 6    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| H    | 7    | I    | 8    | J    | 9    | K    | 10   | L    | 11   | M    | 12   | N    | 13   |
| O    | 14   | P    | 15   | Q    | 16   | R    | 17   | S    | 18   | T    | 19   | U    | 20   |
| V    | 21   | W    | 22   | X    | 23   | Y    | 24   | Z    | 25   |      |      |      |      |

## 加密示例

比如说CTF这个字符串加密

首先这个字符串会被转换成矩阵，根据上面的对照表

$\begin{bmatrix} 2 &19&5\end{bmatrix}$

然后我们需要自己设置一个加密的密钥矩阵，密钥矩阵就是我们自己设置的，但是我们设置的时候需要记住一点，就是两个矩阵的列数要相同

比如下面就是我们设置的密钥矩阵

$\begin{bmatrix} 2 &4&5\\2&6&2\\4&3&7\end{bmatrix}$

然后我们将两个矩阵相乘

$\begin{bmatrix} 2 &19&5\end{bmatrix}$ x $\begin{bmatrix} 2 &4&5\\2&6&2\\4&3&7\end{bmatrix}$ = $\begin{bmatrix} 62 &137&83\end{bmatrix}$

我们算出来了结果但是我们发现，这些数都超出了0-25的范围，这时候我们就需要mod26了

$\begin{bmatrix} 2 &19&5\end{bmatrix}$ x $\begin{bmatrix} 2 &4&5\\2&6&2\\4&3&7\end{bmatrix}$ = $\begin{bmatrix} 62 &137&83\end{bmatrix} mod26 =  $ $\begin{bmatrix} 10 &7&5\end{bmatrix}$

然后根据对照表可以得到

10对应的是k

7对应的是h

5对应的是f



## 代码实现

### Python完整代码

```python
import numpy as np
import sys


# 判断矩阵是否存在逆矩阵
def judge_inverse_matrix(matrix):
    try:
        np.linalg.inv(matrix)
    except:
        return False
    return True


# 输入列表并转换为矩阵
def inputmatrix():
    row_num = int(input("请输入矩阵的行数："))
    all_list = []
    for i in range(1, row_num + 1):
        row = input(f"请输入加密矩阵第{i}行(以空格为分隔)：")
        if row[0] == ' ':
            print("输入有误，第一位不该为空格")
            sys.exit()
        else:
            row_list = row.split(' ')
        # 将列表中str转换为int
        if len(row_list) == row_num:
            for n in row_list:
                row_list[row_list.index(n)] = int(row_list[row_list.index(n)])
            all_list.append(row_list)
        else:
            print("前后输入的行数不一致,请重修输入")
            break
    encrypt_matrix = np.array(all_list)
    if not judge_inverse_matrix(encrypt_matrix):
        print("该矩阵不存在逆矩阵，请重修输入")
    return encrypt_matrix


# 生成矩阵的逆矩阵。如果逆矩阵含有小数，就四舍五入
def generate_inverse_matrix(matrix):
    inverse_matrix = np.linalg.inv(matrix)
    for row in inverse_matrix:
        for num in row:
            num = round(num)
    print("加密矩阵的逆矩阵为：")
    for array in inverse_matrix:
        print(array)
    return inverse_matrix


# 生成字母-数字对应的字典
def alphabet_number():
    alphabet_number_dict = {}
    for i in range(97, 123):
        alphabet_number_dict[chr(i)] = i % 97
    return alphabet_number_dict


def encrypt():
    # 明文字母转换成对应数字
    input_plaintext = input("请输入明文：")
    num_list = []
    dic = alphabet_number()
    for i in input_plaintext:
        num_list.append(dic[i])

    # 如果矩阵行数不能整除明文，则用'z'的数字25补全
    matrix = inputmatrix()
    row_num = len(matrix)
    supple_num = row_num - (len(num_list) % row_num)
    if len(num_list) % row_num != 0:
        for n in range(1, supple_num + 1):
            num_list.append(25)
    print(f"\n添加了{supple_num}个z补全明文")

    # 分组加密
    group_num = int(len(num_list) / row_num)
    whole_encrypt_num_list = []
    for g in range(0, group_num):
        plaintext_matrix = np.array(num_list[0 + g * row_num: (g + 1) * row_num])
        encrypt_num_list = np.matmul(plaintext_matrix, matrix)
        for num in encrypt_num_list:
            whole_encrypt_num_list.append(num)

    # 将加密后的数字转换为字母
    ciphertext = ""
    for ennum in whole_encrypt_num_list:
        # 对超出范围的数字取模
        if ennum > 25:
            ennum = ennum % 26
        for k in dic:
            if dic[k] == ennum:
                ciphertext = ciphertext + k
    print("加密后密文为：", ciphertext, '\n')


def decrypt():
    # 输入密文并转换为对应数字
    input_ciphertext = input("请输入密文：")
    num_list2 = []
    dic2 = alphabet_number()
    for i in input_ciphertext:
        num_list2.append(dic2[i])

    # 解密就不添加'z'来补全密文了
    matrix = inputmatrix()
    row_num2 = len(matrix)
    supple_num2 = row_num2 - (len(num_list2) % row_num2)

    # 用逆矩阵分组解密
    inserve_matrix = generate_inverse_matrix(matrix)
    group_num2 = int(len(num_list2) / row_num2)
    whole_decrypt_num_list = []
    for g in range(0, group_num2):
        plaintext_matrix = np.array(num_list2[0 + g * row_num2: (g + 1) * row_num2])
        decrypt_num_list = np.matmul(plaintext_matrix, inserve_matrix)
        for num in decrypt_num_list:
            whole_decrypt_num_list.append(num)

    # 将解密后的数字转换为对应字母
    plaintext = ""
    for denum in whole_decrypt_num_list:
        if denum > 25 or denum < -26:
            denum = denum % 26

        # 防止取模后是负数，字典中找不到对应的字母
        if denum < 0:
            denum = denum + 26
        # 字典中寻找与数字对应的字母
        for k in dic2:
            if dic2[k] == denum:
                plaintext = plaintext + k
    print("解密后明文为：", plaintext, '\n')


if __name__ == '__main__':
    while True:
        print("========Hill密码========\n")
        print("1.加密\n2.解密\n")
        print("注意：如果输入矩阵的逆矩阵中含有小数，采用四舍五入的方法\n")
        pattern = input("请选择模式：")
        if pattern == '1':
            encrypt()
        elif pattern == '2':
            decrypt()
        else:
            print("输入有误，请重修输入")
```

## 安全性分析

### **优点**

- **多字母替换**：按分组（n 个字母）一起加密，相比单字母替换更能打乱简单的字母频率特征
- **扩散性较好**：同一组内任意一个字母变化，通常会影响整组输出（矩阵乘法带来的联动）
- **实现清晰**：规则就是线性代数（矩阵乘法 + 模运算）

### **缺点**

- **线性结构导致可破**：Hill 本质是线性变换，容易被线性代数方法还原密钥矩阵
- **已知明文/选择明文攻击很弱**：只要收集到足够的“明文块—密文块”对，就能解出密钥矩阵
  - 对 $n\times n $Hill，理论上拿到 n 个线性无关的明文块（及对应密文块）就可能解出密钥
- **仍会泄露分组统计特征**：虽然不是单字母频率，但会保留“n 元组”的统计规律，密文足够长仍可做统计分析
- **密钥矩阵有可逆性限制**：必须满足$ \gcd(\det(K), 26)=1$ 才能解密，这会缩小可用密钥空间
- **安全性不符合现代标准**：在现代计算能力下，Hill 适合学习，不适合真实通信/数据保护

## HILL 密码的攻击方法

### (1) 仅密文攻击

- **n 元组频率分析**：Hill 是按 n 个字母分组加密的，所以攻击者会统计密文中的二元组/三元组的出现规律，结合语言特征推测明文结构。
- **尝试还原密钥（难度较高）**：纯密文下要直接解出矩阵通常不如已知明文有效，但在密文足够长、语言规律明显时仍可能被分析。

### (2) 已知明文攻击

核心利用：Hill 是线性的

$C \equiv K P \pmod{26}$

如果攻击者拿到足够多的明文块 P及对应密文块 C，就能解出密钥矩阵 K。

- 把多组明文块拼成矩阵 $P=[P_1\ P_2\ ...\ P_n]$

- 把对应密文块拼成矩阵$ C=[C_1\ C_2\ ...\ C_n]$

- 若 P 在模 26 下可逆，则：

  $K \equiv C P^{-1}\pmod{26}$

  **结论**：对 n\times n Hill，拿到 **n 个线性无关**的明文块及其密文块，往往就足以恢复密钥。

### (3) 选择明文攻击

如果攻击者能让你加密他指定的明文块:

- 例如构造单位向量块（思想上）：
  - 输入 $P_1=(1,0,0,\dots)^T $得到的密文就是 K 的第 1 列
  - 输入$ P_2=(0,1,0,\dots)^T $得到 K 的第 2 列
- 实际在字母系统里等价于精心挑选字母组合，使明文矩阵 P 可逆并便于求解

结果：在很少查询次数下就能直接还原整个 K。

## 在线工具

[在线HILL密码工具](https://tools.qsnctf.com/#//crypto/hill){ .md-button .md-button--primary target="_blank" rel="noopener"}