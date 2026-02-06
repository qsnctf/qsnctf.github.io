## 一、ZIP压缩包爆破

### 1.1 ZIP加密原理

ZIP文件支持两种加密方式：

- **传统PKZIP加密（ZipCrypto）**：较弱的加密方式，基于流密码
- **AES加密**：AES-128/192/256，安全性更高

### 1.2 常见攻击方式

#### 1.2.1 暴力破解（Brute Force）

使用工具遍历所有可能的密码组合

**常用工具：**

```bash
# fcrackzip - 快速的ZIP密码破解工具
fcrackzip -b -c 'aA1!' -l 1-6 -u target.zip
# -b: 暴力破解模式
# -c: 字符集(a小写,A大写,1数字,!特殊字符)
# -l: 密码长度范围
# -u: 只显示正确密码

# John the Ripper
zip2john target.zip > hash.txt
john hash.txt

# Hashcat
hashcat -m 17200 hash.txt wordlist.txt
# -m 17200: PKZIP模式
```

#### 1.2.2 字典攻击（Dictionary Attack）

```bash
# fcrackzip字典攻击
fcrackzip -D -p rockyou.txt -u target.zip

# ARCHPR (Windows图形化工具)
# 支持字典、暴力、掩码攻击
```

#### 1.2.3 掩码攻击（Mask Attack）

已知密码格式时使用

```bash
# 例如密码格式：flag{数字6位}
hashcat -m 17200 -a 3 hash.txt 'flag{?d?d?d?d?d?d}'
# ?d: 数字
# ?l: 小写字母
# ?u: 大写字母
# ?s: 特殊字符
```

#### 1.2.4 明文攻击（Known Plaintext Attack）

当知道ZIP包内某个文件的明文内容时：

**工具：PKCrack**

```bash
# 需要至少12字节的已知明文
pkcrack -C encrypted.zip -c "file.txt" -P plaintext.zip -p "file.txt" -d decrypted.zip
# -C: 加密的ZIP
# -c: 加密ZIP中的文件名
# -P: 包含明文的ZIP
# -p: 明文ZIP中的文件名
```

**工具：bkcrack**

```bash
# 从已知明文恢复密钥
bkcrack -C encrypted.zip -c file.txt -p plaintext.txt

# 使用恢复的密钥解密其他文件
bkcrack -C encrypted.zip -k 12345678 87654321 abcdefab -d output.zip
```

#### 1.2.5 伪加密检测与修复

ZIP伪加密是通过修改文件头标志位实现的

**检测方法：**

```python
# 查看ZIP文件头
# 全局方式位标记：0x0009表示加密
# 如果加密位被设置但实际未加密，即为伪加密

import zipfile
zf = zipfile.ZipFile('target.zip')
for info in zf.infolist():
    print(f"{info.filename}: flag_bits = {info.flag_bits}")
    # 如果flag_bits & 0x1 但文件可直接读取，则为伪加密
```

**修复方法：**

```bash
# 使用十六进制编辑器修改
# 将加密标志位从09 00改为00 00
# 位置：局部文件头偏移0x06-0x07

# 或使用Python脚本
python
import zipfile
zf = zipfile.ZipFile('target.zip', 'r')
zf.extractall(pwd=b'')  # 伪加密可用空密码解压
```

### 1.3 CTF中的常见套路

```yaml
常见密码来源:
  - 题目描述中的提示
  - 图片EXIF信息
  - 其他文件中的隐藏信息
  - 常见弱口令: 123456, password, admin, flag
  - 题目相关: ctf, misc, flag, 出题人ID
  
常见考点:
  - ZIP伪加密
  - 明文攻击（提供部分文件）
  - 密码在其他附件中
  - CRC32碰撞（小文件）
  - 嵌套压缩包
```


## 二、RAR压缩包爆破

### 2.1 RAR加密原理

RAR使用AES-128加密，安全性较高，基于PBKDF2密钥派生

### 2.2 常见攻击方式

#### 2.2.1 暴力/字典攻击

```bash
# John the Ripper
rar2john target.rar > hash.txt
john --wordlist=rockyou.txt hash.txt

# Hashcat
hashcat -m 13000 hash.txt wordlist.txt
# -m 13000: RAR5
# -m 12500: RAR3

# rarcrack（较慢）
rarcrack target.rar --threads 4 --type rar
```

#### 2.2.2 ARCHPR（Windows）
```
高级RAR密码恢复工具
支持：
- 暴力攻击
- 字典攻击
- 掩码攻击
- GPU加速
```

### 2.3 RAR特殊知识点

#### 2.3.1 RAR注释

```bash
# RAR文件可包含注释，可能隐藏密码提示
unrar l -v target.rar  # 查看详细信息包括注释
```

#### 2.3.2 固实压缩

RAR的固实压缩会影响明文攻击的可行性

#### 2.3.3 RAR版本差异

- **RAR3**: 较旧，加密较弱
- **RAR5**: 当前版本，AES-256，更安全

```bash
# 识别RAR版本
xxd target.rar | head
# RAR3: 52 61 72 21 1A 07 00
# RAR5: 52 61 72 21 1A 07 01 00
```


## 三、通用技巧与工具

### 3.1 CRC32爆破（适用于小文件）

当ZIP内文件很小时，可通过CRC32反推内容

```python
import zipfile
import binascii

def crc32_crack(crc32_value, max_length=6):
    """爆破CRC32，适用于短文件"""
    import itertools
    import string
    
    chars = string.printable
    for length in range(1, max_length + 1):
        for attempt in itertools.product(chars, repeat=length):
            text = ''.join(attempt).encode()
            if binascii.crc32(text) & 0xffffffff == crc32_value:
                return text
    return None

# 从ZIP获取CRC32
zf = zipfile.ZipFile('target.zip')
for info in zf.infolist():
    print(f"CRC32: {hex(info.CRC)}")
    result = crc32_crack(info.CRC)
    if result:
        print(f"Content: {result}")
```

### 3.2 密码字典生成

```bash
# Crunch - 生成自定义字典
crunch 6 6 0123456789 -o numbers.txt  # 6位数字

# Cewl - 从网站提取关键词生成字典
cewl http://example.com -w wordlist.txt

# Cupp - 社工字典生成器
cupp -i  # 交互式生成

# 常用字典资源
# - rockyou.txt
# - SecLists
# - weakpass.com
```

### 3.3 综合工具推荐

```yaml
命令行工具:
  - fcrackzip: ZIP快速爆破
  - John the Ripper: 万能密码破解
  - Hashcat: GPU加速爆破
  - bkcrack: ZIP明文攻击
  
图形化工具:
  - ARCHPR: Windows下强大的压缩包破解
  - Ziperello: ZIP专用
  - RAR Password Unlocker: RAR专用
  
在线工具:
  - passwordrecovery.io: 在线爆破
  - 注意：不要上传敏感文件
```

## 四、CTF实战技巧

### 4.1 解题思路流程图
```
1. 获得压缩包
   ↓
2. 判断加密类型
   ├─ 真加密 → 寻找密码线索
   └─ 伪加密 → 修复文件头
   ↓
3. 密码线索来源
   ├─ 题目描述
   ├─ 图片隐写（EXIF/LSB/盲水印）
   ├─ 其他文件内容
   ├─ CRC32爆破（小文件）
   └─ 明文攻击（已知部分文件）
   ↓
4. 爆破/解密
   ↓
5. 获得Flag或下一层文件
```

### 4.2 常见出题模式

```python
# 模式1：多层嵌套
flag.zip → (password: hint1)
  └─ flag2.zip → (password: hint2)
      └─ flag.txt

# 模式2：密码在图片中
image.png (EXIF/LSB隐写密码) + encrypted.zip

# 模式3：已知明文攻击
encrypted.zip (包含readme.txt)
readme.txt (明文提供)

# 模式4：CRC32小文件
data.zip 内多个1-4字节的文件，CRC32爆破拼接

# 模式5：伪加密
看似加密实则未加密，修改标志位即可
```

### 4.3 快速检测脚本

```python
#!/usr/bin/env python3
import zipfile
import sys

def check_zip(filename):
    """快速检测ZIP特征"""
    try:
        zf = zipfile.ZipFile(filename)
        print(f"[+] 分析文件: {filename}\n")
        
        for info in zf.infolist():
            print(f"文件名: {info.filename}")
            print(f"  压缩前: {info.file_size} bytes")
            print(f"  压缩后: {info.compress_size} bytes")
            print(f"  CRC32: {hex(info.CRC)}")
            print(f"  加密: {'是' if info.flag_bits & 0x1 else '否'}")
            
            # 检测伪加密
            if info.flag_bits & 0x1 and info.file_size < 1000:
                print(f"  [!] 可能是伪加密或可CRC32爆破")
            print()
            
    except zipfile.BadZipFile:
        print("[-] 无效的ZIP文件")
    except Exception as e:
        print(f"[-] 错误: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"用法: {sys.argv[0]} <zipfile>")
    else:
        check_zip(sys.argv[1])
```

