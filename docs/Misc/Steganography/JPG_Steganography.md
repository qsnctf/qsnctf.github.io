# JPEG 隐写术

对于JPEG图像来说，隐写术主要集中在DCT（离散余弦变换）系数上。由于JPEG压缩的特殊性，在DCT系数中嵌入信息既能保证较大的容量，又能保持良好的隐蔽性。

## JPEG压缩基础

### JPEG压缩流程

JPEG图像压缩是有损压缩，其核心步骤如下：

```
原始图像
    ↓
颜色空间转换 (RGB → YCbCr)
    ↓
分块处理 (8×8像素块)
    ↓
DCT变换 (离散余弦变换)
    ↓
量化 (使用量化表)
    ↓
熵编码 (霍夫曼编码/算术编码)
    ↓
JPEG文件
```

### DCT变换原理

**离散余弦变换(Discrete Cosine Transform)** 将空间域的图像数据转换到频率域。

对于8×8的图像块，DCT变换将像素值转换为频率系数：

```
空间域 (8×8像素块):          频率域 (DCT系数):
┌─────────────────┐          ┌─────────────────┐
│ 52 55 61 66 ... │          │1260  -1  -12  -5│ ← DC系数(左上角)
│ 56 57 64 65 ... │   DCT    │ -23  -17  -6  -3│
│ 62 59 68 64 ... │   →      │ -11  -9   -2   2│
│ 68 65 70 65 ... │          │  -7  -2    0   1│
│ ... ... ... ... │          │ ... ... ... ... │
└─────────────────┘          └─────────────────┘
     低频 ↖                       高频 ↘
```

**关键概念：**

+ **DC系数**：左上角第一个系数，表示整个8×8块的平均亮度
+ **AC系数**：其余63个系数，表示频率分量
+ **低频系数**：左上角区域，对视觉影响大
+ **高频系数**：右下角区域，对视觉影响小，适合隐写

### 量化过程

量化是JPEG压缩的有损步骤，将DCT系数除以量化表中的值并四舍五入：

```
量化后系数 = round(DCT系数 / 量化表值)
```

**重要性**：隐写通常在量化后的DCT系数中进行，因为这些是最终存储在JPEG文件中的数据。

### Zig-Zag扫描顺序

JPEG使用Zig-Zag顺序扫描DCT系数（从低频到高频）：

```
扫描顺序:
 0→ 1   5   6  14  15  27  28
    ↓ ↗ ↓ ↗ ↓ ↗ ↓
    2   4   7  13  16  26  29
      ↗   ↗   ↗   ↗   ↗
    3   8  12  17  25  30  39
    ↓ ↗ ↓ ↗ ↓ ↗ ↓
    9  11  18  24  31  38  40
   ...
```

## DCT系数隐写原理

### 为什么选择DCT系数隐写？

1. **不可见性好**：修改高频系数对视觉影响极小
2. **抗压缩**：DCT系数是JPEG的本质数据，重新保存不会破坏
3. **容量大**：每个8×8块有63个AC系数可用
4. **难检测**：与JPEG压缩噪声混合

### 基本隐写策略

#### LSB替换策略

```
原始DCT系数: 53
二进制: 110101
隐藏bit: 0
结果: 110100 = 52
```

#### 系数选择策略

```
可修改系数判断:
- DCT系数 ≠ 0  (避免引入新的非零系数)
- DCT系数 ≠ 1  (某些算法避免±1)
- 非DC系数      (DC系数修改影响太大)
```

## JSteg隐写

**JSteg** 是最早的JPEG隐写算法之一（1997年），采用简单的LSB替换。

### 原理

在量化后的非零AC DCT系数的最低有效位（LSB）中嵌入数据。图片中的DCT系数经过量化后，会产生大量的整数值，JSteg利用这些整数值的最低位来隐藏信息。

例如，DCT系数为35（二进制：100011），如果要嵌入bit 0，则将其改为34（二进制：100010）。由于只修改了最低位，对图像质量影响极小。

### 嵌入流程

```
1. 读取JPEG文件，获取量化后的DCT系数
2. 按Zig-Zag顺序遍历所有8×8块的AC系数
3. 对于每个非零系数：
   - 如果系数 = 0 或 ±1，跳过
   - 否则，将系数的LSB替换为消息bit
4. 重新编码JPEG文件
```

出题脚本示例：

```python
from jsteg import JSteg

# 嵌入
jsteg = JSteg()
jsteg.embed('cover.jpg', 'secret.txt', 'stego.jpg')

# 提取
jsteg.extract('stego.jpg', 'output.txt')
```

### 容量计算

```
理论容量 = (可用AC系数数量) × 1 bit

实际例子:
- 图像尺寸: 512×512像素
- 8×8块数量: (512/8) × (512/8) = 4096块
- 每块可用AC系数: 约30-40个（假设35个）
- 总容量: 4096 × 35 = 143,360 bits ≈ 17.5 KB
```

### 检测方法

#### 卡方（Chi-Square）攻击

JSteg的致命弱点：LSB替换会改变DCT系数的分布。在正常的JPEG图像中，相邻的DCT系数对（如2和3，4和5）出现的频率是不同的。但经过LSB替换后，这些系数对的频率会趋于相等，这就是统计异常。

```python
# 卡方检测原理
# 检测相邻系数对的频率分布异常

def chi_square_attack(dct_coeffs):
    # 统计 (2k, 2k+1) 系数对的出现频率
    # 如果有隐写，这些对的频率会趋于相等
    pairs = {}
    for coeff in dct_coeffs:
        if coeff % 2 == 0:
            key = (coeff, coeff+1)
            pairs[key] = pairs.get(key, 0) + 1
    
    # 计算卡方值
    chi_square = 0
    total = sum(pairs.values())
    expected = total / len(pairs)
    
    for observed in pairs.values():
        chi_square += (observed - expected)**2 / expected
    
    return chi_square > threshold  # 高值表示可能有隐写
```

### 优缺点

**优点：**

+ 实现简单
+ 嵌入速度快
+ 容量较大

**缺点：**

+ 容易被统计检测（卡方攻击）
+ 修改所有可用系数，留下明显痕迹
+ 没有加密保护

### 解题

```bash
# 使用StegDetect检测
stegdetect image.jpg
# 输出: image.jpg : jsteg(***)

# 使用JSteg提取
jsteg extract stego.jpg output.txt

# 或使用现代工具
jsteg-modern -x -i stego.jpg -o output.txt
```

## F5隐写

**F5算法**（2001年，Andreas Westfeld）是对JSteg的重大改进，解决了LSB替换的统计检测问题。

### 原理

F5算法通过三大创新技术实现了更安全的隐写：

1. **矩阵编码（Matrix Encoding）**：不是每个bit都修改一个系数，而是通过数学编码减少修改次数
2. **置换嵌入（Permutative Straddling）**：使用密钥对DCT系数进行伪随机置换
3. **收缩修正（Shrinkage）**：当系数被修改为0时，该系数被跳过

### 矩阵编码

F5使用（1,n,k）矩阵编码，其中n=AC系数数量，k=嵌入bit数。

工作原理：

```
不是每个bit都需要修改一个系数，而是：
- 读取n个系数
- 计算它们的LSB的XOR值
- 如果XOR结果不等于要嵌入的bit，只修改1个系数

示例(1,3,1):
系数: [5, 7, 12] → LSB: [1, 1, 0] → XOR: 1⊕1⊕0 = 0
要嵌入: 1
因为 0 ≠ 1，修改一个系数:
[5, 7, 11] → LSB: [1, 1, 1] → XOR: 1⊕1⊕1 = 1
```

**效率提升：**

+ 传统LSB：嵌入1 bit需要修改1个系数
+ F5矩阵编码：平均修改率 = 1/2

### 置换嵌入

为了抵抗顺序分析，F5在嵌入前对DCT系数进行伪随机置换。

```python
# 使用密钥生成伪随机序列
def permute_coefficients(coeffs, key):
    random.seed(key)
    indices = list(range(len(coeffs)))
    random.shuffle(indices)
    return [coeffs[i] for i in indices]
```

### 收缩修正

F5的独特之处：当系数通过减1变为0时，该系数被"收缩"掉，不再使用。

```
示例:
原始系数: 1
要设置LSB为0: 1 - 1 = 0
处理: 该系数变为0后被跳过，使用下一个系数
```

### 嵌入流程

```
1. 提取所有非零AC DCT系数
2. 使用密钥对系数进行伪随机置换
3. 将消息比特分组（根据矩阵编码参数）
4. 对每组:
   a. 计算当前系数组的LSB哈希值
   b. 如果哈希值 = 要嵌入的值，不修改
   c. 否则，递减一个系数的绝对值
   d. 如果系数变为0，收缩并跳过
5. 逆置换，重新编码JPEG
```

出题脚本示例：

```python
# 使用F5嵌入
import subprocess

# 嵌入数据
subprocess.run([
    'java', '-jar', 'f5.jar', 
    'e',                    # embed模式
    '-e', 'secret.txt',     # 要嵌入的文件
    '-p', 'password123',    # 密码
    'cover.jpg',            # 原始图片
    'stego.jpg'             # 输出图片
])

# 提取数据
subprocess.run([
    'java', '-jar', 'f5.jar',
    'x',                    # extract模式
    '-p', 'password123',    # 密码
    '-x', 'output.txt',     # 输出文件
    'stego.jpg'             # 隐写图片
])
```

### 容量与嵌入率

```
嵌入率 = 修改系数数 / 总可用系数数

F5的嵌入率:
- 理论: 1/2 (矩阵编码)
- 实际: 约0.3-0.4 (考虑收缩)

对比JSteg:
- JSteg: 1.0 (每个系数都可能被修改)
- F5: 0.3-0.4 (更隐蔽)
```

### 优缺点

**优点：**

+ 抗统计检测（卡方攻击无效）
+ 嵌入效率高
+ 安全性好（密钥保护）

**缺点：**

+ 算法复杂
+ 提取需要知道密钥
+ 容量相对较小（收缩导致）

### 检测方法

F5抗卡方攻击，但仍可通过以下方法检测：

#### 直方图攻击

分析DCT系数直方图的对称性，F5的矩阵编码会破坏某些统计规律。

#### 校准攻击（Calibration Attack）

```
1. 对怀疑图像进行轻微重压缩
2. 比较原始和重压缩的DCT系数分布
3. 统计差异可揭示隐写。
```

### 解题

```bash
# 下载F5.jar
wget https://code.google.com/archive/p/f5-steganography/downloads/f5.jar

# 检测F5隐写
stegdetect -s 10.0 image.jpg
# 输出: image.jpg : f5(***)

# 提取数据（需要密码）
java -jar f5.jar x -p password123 stego.jpg -x output.txt

# 如果不知道密码，可以尝试爆破
# 创建密码字典 passwords.txt
java -jar f5.jar x -p password1 stego.jpg -x test.txt
java -jar f5.jar x -p password2 stego.jpg -x test.txt
# ... 循环尝试
```

## OutGuess隐写

**OutGuess**（由Niels Provos开发）是一种统计保持型隐写算法，重点在于维持统计特性。

### 原理

OutGuess的核心思想是将DCT系数分为两组：一组用于嵌入数据，另一组用于统计补偿。这样即使嵌入了数据，整体的统计特性仍然接近原始图像。

传统的LSB替换会改变系数的分布，例如系数5的频率会增加，系数4的频率会减少。OutGuess通过调整未使用的系数来补偿这种变化，使得系数5和系数4的总体频率保持不变。

### 两阶段嵌入

OutGuess将DCT系数分为两组：

```
第一组: 用于嵌入数据（约50%的系数）
第二组: 用于统计校正（约50%的系数）
```

### 嵌入流程

```
1. 提取所有可用DCT系数
2. 使用伪随机数生成器（PRNG）选择系数子集A
3. 在子集A中嵌入数据（LSB替换）
4. 计算嵌入后的统计变化（直方图）
5. 使用剩余系数子集B来补偿统计变化
   - 调整B中的系数，使整体统计特性接近原始
6. 输出隐写图像
```

详细过程：

```python
def outguess_embed(dct_coeffs, message, key):
    # 1. PRNG选择嵌入位置
    random.seed(key)
    total_coeffs = len(dct_coeffs)
    embed_positions = random.sample(range(total_coeffs), len(message))
    
    # 2. 计算原始直方图
    original_hist = build_histogram(dct_coeffs)
    
    # 3. 在选定位置嵌入
    for i, bit in enumerate(message):
        pos = embed_positions[i]
        if bit == 1:
            dct_coeffs[pos] |= 1
        else:
            dct_coeffs[pos] &= ~1
    
    # 4. 计算嵌入后直方图
    embedded_hist = build_histogram(dct_coeffs)
    
    # 5. 统计校正
    correction_positions = [i for i in range(total_coeffs) 
                           if i not in embed_positions]
    
    for coeff_value in range(-256, 256):
        diff = original_hist[coeff_value] - embedded_hist[coeff_value]
        
        # 调整未使用的系数来补偿差异
        while diff != 0 and correction_positions:
            pos = correction_positions.pop()
            if diff > 0:
                # 需要增加此值的频率
                dct_coeffs[pos] = coeff_value
                diff -= 1
    
    return dct_coeffs
```

### 统计保持机制

示例：

```
假设某DCT系数值5的频率:
原始: 100次
嵌入后: 105次 (由于LSB替换)

OutGuess补偿:
- 在未使用的系数中，找5个系数
- 将它们从其他值改为5
- 结果: 系数5的总频率仍然是100
```

### 容量分析

```
OutGuess容量 = JSteg容量 × 嵌入率

嵌入率通常设为 50%:
- 50% 系数用于数据嵌入
- 50% 系数用于统计校正

实际容量:
- 512×512图像
- JSteg容量: ~17 KB
- OutGuess容量: ~8.5 KB (50%嵌入率)
```

### 优缺点

**优点：**

+ 统计隐蔽性好
+ 能抵抗卡方攻击
+ 直方图接近原始

**缺点：**

+ 容量减半（相比JSteg）
+ 仍可能被先进的随机性测试检测
+ 校正过程可能引入新的异常

### 检测方法

#### RS分析（Regular-Singular Analysis）

检测LSB嵌入引入的统计失真，即使经过统计补偿。

#### 二次样本对分析（SPA）

分析相邻系数对的关系，OutGuess的校正可能破坏这种关系。

### 解题

```bash
# 安装OutGuess
sudo apt-get install outguess

# 嵌入数据
outguess -k "password" -d secret.txt cover.jpg stego.jpg

# 提取数据
outguess -r -k "password" stego.jpg output.txt

# 不带密钥提取（如果没有使用密钥）
outguess -r stego.jpg output.txt

# 检测OutGuess隐写
stegdetect image.jpg
# 输出: image.jpg : outguess(***)
```

## Steghide隐写

**Steghide** 是一个通用的隐写工具，支持JPEG、BMP、WAV、AU等多种格式。对于JPEG，它使用了改进的图论匹配算法。

### 原理

Steghide不是简单的LSB替换，而是使用了一种基于图论的嵌入算法。它的核心思想是将嵌入问题转化为图匹配问题。

#### 图论匹配

Steghide将DCT系数看作图的顶点，将可以互换的系数对连接成边。然后通过寻找完美匹配来嵌入数据，使得修改次数最少。

例如，系数52和53可以通过修改LSB互相转换，它们就构成一条边。要嵌入bit 1，如果当前是52（LSB=0），就改为53；如果已经是53（LSB=1），就不修改。

### 加密与压缩

Steghide在嵌入前会对数据进行：

1. **压缩**：使用zlib压缩数据，减少嵌入大小
2. **加密**：使用密码对数据进行加密（默认使用Rijndael，即AES的前身）
3. **打乱**：使用伪随机序列确定嵌入位置

### 嵌入流程

```
1. 读取秘密数据
2. 压缩数据（zlib）
3. 使用密码加密数据
4. 提取JPEG的DCT系数
5. 使用图论算法确定最优嵌入位置
6. 嵌入加密后的数据
7. 保存隐写图像
```

### 特征

+ **需要密码**：没有密码无法提取数据
+ **自动压缩**：数据会被自动压缩
+ **自适应嵌入**：根据图像特性选择最佳嵌入位置
+ **校验和**：嵌入的数据包含校验和，确保提取正确性

### 优缺点

**优点：**

+ 安全性高（密码保护+加密）
+ 嵌入质量好（图论优化）
+ 自动压缩增加容量
+ 使用广泛，工具成熟

**缺点：**

+ 必须知道密码才能提取
+ 算法较复杂
+ 对于大文件，可能容量不足

### 解题

```bash
# 安装Steghide
sudo apt-get install steghide

# 查看隐写信息（不需要密码）
steghide info image.jpg
# 输出会显示是否包含嵌入数据

# 提取数据（需要密码）
steghide extract -sf image.jpg
# 会提示输入密码，然后提取数据

# 指定输出文件
steghide extract -sf image.jpg -xf output.txt

# 尝试空密码
steghide extract -sf image.jpg -p ""

# 爆破密码（使用stegcracker）
sudo apt-get install stegcracker
stegcracker image.jpg wordlist.txt
# 会自动尝试字典中的所有密码

# 常见密码尝试
steghide extract -sf image.jpg -p "123456"
steghide extract -sf image.jpg -p "password"
steghide extract -sf image.jpg -p "admin"
```

出题脚本示例：

```bash
# 嵌入文件
steghide embed -cf cover.jpg -ef secret.txt -p "mypassword" -sf stego.jpg

# 参数说明：
# -cf: cover file（载体图片）
# -ef: embed file（要嵌入的文件）
# -p: passphrase（密码）
# -sf: stego file（输出的隐写图片）
```

## 检测工具

### StegDetect

**StegDetect** 是一个自动检测JPEG隐写的工具，可以识别多种隐写算法。

#### 安装

```bash
# Kali Linux自带
stegdetect -V

# Ubuntu安装
sudo apt-get install stegdetect
```

#### 使用

```bash
# 基本检测
stegdetect image.jpg

# 输出示例：
# image.jpg : jsteg(***)      # 检测到JSteg
# image.jpg : f5(***)         # 检测到F5
# image.jpg : outguess(***)   # 检测到OutGuess
# image.jpg : negative        # 没有检测到隐写

# 敏感度调节（-s参数，范围0-10，默认1）
stegdetect -s 5.0 image.jpg
# 数值越大，越敏感，但误报也越多

# 批量检测
stegdetect *.jpg

# 详细输出
stegdetect -n -s 2.0 image.jpg
```

#### 检测原理

StegDetect使用统计分析方法：

+ **JSteg检测**：卡方检验
+ **F5检测**：字节对分析
+ **OutGuess检测**：RS分析
+ **JPHide检测**：特征匹配

### StegBreak

**StegBreak** 是StegDetect的配套工具，用于暴力破解密码。

```bash
# 暴力破解
stegbreak -t p -f wordlist.txt image.jpg

# 参数说明：
# -t p: 尝试所有检测到的算法
# -f: 密码字典文件
```

### 其他检测工具

#### JPHide检测器

专门检测JPHide/JPSeek算法。

```bash
# 使用StegDetect
stegdetect -tjopi image.jpg
# t: 检测类型
# j: jsteg
# o: outguess
# p: jphide
# i: invisible secrets
```

#### StegExpose

基于机器学习的隐写检测工具。

```bash
# 安装
git clone https://github.com/b3dk7/StegExpose.git

# 检测
java -jar StegExpose.jar image.jpg
```

## 总结

JPEG DCT系数隐写是CTF中常见的题型，主要算法包括：

| 算法 | 原理 | 特点 | 检测方法 | 提取工具 |
|------|------|------|---------|---------|
| **JSteg** | LSB替换 | 简单，容量大 | 卡方攻击 | jsteg |
| **F5** | 矩阵编码+收缩 | 抗统计检测 | 校准攻击 | f5.jar |
| **OutGuess** | 统计补偿 | 保持直方图 | RS分析 | outguess |
| **Steghide** | 图论匹配 | 密码保护 | 密码爆破 | steghide |

### 解题思路

```
1. 使用file和exiftool查看基本信息
2. 使用StegDetect检测隐写算法
   stegdetect -s 5.0 image.jpg
3. 根据检测结果选择对应工具：
   - jsteg: jsteg extract
   - f5: java -jar f5.jar x
   - outguess: outguess -r
   - 未知: steghide extract（尝试空密码）
4. 如果需要密码：
   - 查看题目提示
   - 尝试常见密码
   - 使用字典爆破
5. 提取后检查文件类型：
   file output.bin
6. 如果是压缩包，尝试解压
```

### 工具安装汇总

```bash
# Kali Linux（推荐）
sudo apt-get update
sudo apt-get install steghide outguess stegdetect

# JSteg
git clone https://github.com/lukechampine/jsteg.git
cd jsteg
go build

# F5
wget https://code.google.com/archive/p/f5-steganography/downloads/f5.jar

# StegCracker（密码爆破）
pip3 install stegcracker
```