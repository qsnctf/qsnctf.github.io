# BMP图像隐写技术

BMP（Bitmap）是一种未压缩的位图格式，由于其简单的文件结构和无损特性，在CTF隐写题中非常常见。BMP文件不进行压缩，所有像素数据都以原始形式存储，这使得隐写操作更加直接和可靠。

## BMP文件格式基础

### 文件结构

BMP文件由以下几部分组成：

```
┌─────────────────────────┐
│  BMP文件头 (14字节)      │ ← 文件类型、大小等基本信息
├─────────────────────────┤
│  位图信息头 (40字节)     │ ← 图像宽度、高度、位深度等
├─────────────────────────┤
│  调色板 (可选)          │ ← 仅用于8位及以下的图像
├─────────────────────────┤
│  像素数据               │ ← 实际的图像数据
└─────────────────────────┘
```

### BMP文件头（14字节）

```
偏移  大小  说明
0x00  2    文件类型，固定为 'BM' (0x42 0x4D)
0x02  4    文件大小（字节）
0x06  4    保留字段，通常为0
0x0A  4    像素数据偏移量
```

### 位图信息头（40字节）

```
偏移  大小  说明
0x0E  4    信息头大小，通常为40
0x12  4    图像宽度（像素）
0x16  4    图像高度（像素）
0x1A  2    颜色平面数，固定为1
0x1C  2    每像素位数（1, 4, 8, 24, 32）
0x1E  4    压缩方式（0=不压缩）
0x22  4    图像大小（字节，可为0）
0x26  4    水平分辨率（像素/米）
0x2A  4    垂直分辨率（像素/米）
0x2E  4    调色板颜色数
0x32  4    重要颜色数
```

### 十六进制特征

```
典型BMP文件头:
42 4D          // 'BM' 文件标识
XX XX XX XX    // 文件大小
00 00 00 00    // 保留
36 00 00 00    // 像素数据偏移（通常0x36=54字节）
28 00 00 00    // 信息头大小（40字节）
...
```

### 像素数据存储

BMP像素数据的特点：

+ **从下到上存储**：第一行像素是图像的最底部
+ **行对齐**：每行像素数据必须是4字节的倍数，不足部分用0填充
+ **BGR顺序**：24位BMP使用BGR而非RGB（蓝-绿-红）

```
24位BMP像素格式:
每个像素 3 字节: [B] [G] [R]

行对齐示例:
图像宽度: 3 像素
每行字节: 3 × 3 = 9 字节
对齐后: 12 字节（9字节数据 + 3字节填充）
```

## LSB隐写

**LSB（Least Significant Bit）隐写** 是BMP最常见的隐写方式，通过修改像素的最低有效位来嵌入信息。

### 原理

BMP中每个颜色分量占8位（0-255），修改最低位对视觉影响极小。例如：

```
原始像素: R=235, G=142, B=78
二进制:   R=11101011, G=10001110, B=01001110

嵌入3个bit: 1, 0, 1
修改后:   R=11101011, G=10001110, B=01001111
结果:     R=235, G=142, B=79

视觉差异: 几乎不可见
```

### 单通道LSB

只使用一个颜色通道（通常是蓝色通道）的LSB进行隐写。

出题脚本：

```python
from PIL import Image

def encode_lsb_single(image_path, message, output_path, channel=2):
    """
    单通道LSB隐写
    channel: 0=R, 1=G, 2=B
    """
    img = Image.open(image_path)
    pixels = list(img.getdata())
    
    # 将消息转换为二进制
    binary_message = ''.join(format(ord(c), '08b') for c in message)
    binary_message += '1111111111111110'  # 结束标志
    
    new_pixels = []
    msg_index = 0
    
    for pixel in pixels:
        pixel_list = list(pixel)
        
        if msg_index < len(binary_message):
            # 修改指定通道的LSB
            pixel_list[channel] = (pixel_list[channel] & 0xFE) | int(binary_message[msg_index])
            msg_index += 1
        
        new_pixels.append(tuple(pixel_list))
    
    new_img = Image.new(img.mode, img.size)
    new_img.putdata(new_pixels)
    new_img.save(output_path)
    print(f"已嵌入 {len(binary_message)} bits到 {channel} 通道")

# 使用示例
encode_lsb_single('cover.bmp', 'flag{hello_lsb}', 'stego.bmp', channel=2)
```

### 多通道LSB

使用RGB三个通道的LSB，容量是单通道的3倍。

出题脚本：

```python
def encode_lsb_rgb(image_path, message, output_path):
    """RGB三通道LSB隐写"""
    img = Image.open(image_path)
    pixels = list(img.getdata())
    
    binary_message = ''.join(format(ord(c), '08b') for c in message)
    binary_message += '1111111111111110'  # 结束标志
    
    new_pixels = []
    msg_index = 0
    
    for pixel in pixels:
        new_pixel = list(pixel)
        
        # 依次修改R、G、B三个通道
        for i in range(3):
            if msg_index < len(binary_message):
                new_pixel[i] = (new_pixel[i] & 0xFE) | int(binary_message[msg_index])
                msg_index += 1
        
        new_pixels.append(tuple(new_pixel))
    
    new_img = Image.new(img.mode, img.size)
    new_img.putdata(new_pixels)
    new_img.save(output_path)

encode_lsb_rgb('cover.bmp', 'flag{rgb_steganography}', 'stego.bmp')
```

### 多位LSB

不仅修改最低1位，而是修改最低2位、3位甚至4位，容量更大但更容易被检测。

```python
def encode_lsb_multibit(image_path, message, output_path, bits=2):
    """
    多位LSB隐写
    bits: 使用的LSB位数（1-4）
    """
    img = Image.open(image_path)
    pixels = list(img.getdata())
    
    binary_message = ''.join(format(ord(c), '08b') for c in message)
    binary_message += '1111111111111110'
    
    mask = (1 << bits) - 1  # 生成掩码，bits=2时为0b11
    clear_mask = ~mask & 0xFF  # 清除掩码
    
    new_pixels = []
    msg_index = 0
    
    for pixel in pixels:
        new_pixel = list(pixel)
        
        for i in range(3):
            if msg_index + bits - 1 < len(binary_message):
                # 提取bits个bit
                bits_to_embed = int(binary_message[msg_index:msg_index+bits], 2)
                # 清除低bits位，然后嵌入
                new_pixel[i] = (new_pixel[i] & clear_mask) | bits_to_embed
                msg_index += bits
        
        new_pixels.append(tuple(new_pixel))
    
    new_img = Image.new(img.mode, img.size)
    new_img.putdata(new_pixels)
    new_img.save(output_path)

# 使用2位LSB
encode_lsb_multibit('cover.bmp', 'More capacity!', 'stego.bmp', bits=2)
```

### 容量计算

```
单通道单位LSB容量:
图像尺寸: 800×600 像素
总像素: 480,000
容量: 480,000 bits = 60,000 bytes ≈ 58.6 KB

RGB三通道容量:
容量: 480,000 × 3 bits = 1,440,000 bits = 180,000 bytes ≈ 175.8 KB

2位LSB容量:
容量: 480,000 × 3 × 2 bits = 2,880,000 bits ≈ 351.6 KB
```

### 解题

#### 使用StegSolve

```
1. 打开StegSolve: java -jar Stegsolve.jar
2. File -> Open，选择BMP文件
3. 使用方向键查看各个位平面:
   - Red plane 0 (R通道最低位)
   - Green plane 0 (G通道最低位)
   - Blue plane 0 (B通道最低位)
4. 如果看到文字或图案，说明该位平面有隐写
5. Analyse -> Data Extract:
   - 勾选要提取的通道和位平面
   - 点击Preview查看
   - 点击Save Bin保存数据
```

#### 使用Python脚本提取

```python
def extract_lsb_rgb(image_path, output_path):
    """提取RGB三通道LSB数据"""
    img = Image.open(image_path)
    pixels = list(img.getdata())
    
    binary_data = ''
    
    for pixel in pixels:
        for i in range(3):  # R, G, B
            binary_data += str(pixel[i] & 1)
    
    # 查找结束标志
    end_marker = '1111111111111110'
    end_pos = binary_data.find(end_marker)
    
    if end_pos != -1:
        binary_data = binary_data[:end_pos]
    
    # 转换为字符
    message = ''
    for i in range(0, len(binary_data), 8):
        byte = binary_data[i:i+8]
        if len(byte) == 8:
            message += chr(int(byte, 2))
    
    with open(output_path, 'w') as f:
        f.write(message)
    
    print(f"提取的消息: {message}")

extract_lsb_rgb('stego.bmp', 'extracted.txt')
```

#### 使用zsteg

```bash
# 安装zsteg
gem install zsteg

# 自动检测所有LSB隐写
zsteg stego.bmp

# 输出示例:
# b1,r,lsb,xy         .. text: "flag{hidden_message}"
# b1,rgb,lsb,xy       .. file: PNG image data
# b2,b,lsb,xy         .. text: "secret"

# 提取特定通道
zsteg -E "b1,rgb,lsb,xy" stego.bmp > output.txt

# 参数说明:
# b1: 第1位（LSB）
# rgb: RGB三通道
# lsb: 最低有效位
# xy: 按行扫描顺序
```

## 文件头隐写

### 宽高修改

BMP的宽度和高度存储在固定位置，修改这些值可以隐藏部分图像。

#### 原理

```
正常图像: 800×600
修改高度为: 800×300

结果: 图片只显示上半部分，下半部分被隐藏
```

#### 检测方法

```bash
# 使用hexdump查看文件头
hexdump -C image.bmp | head -20

# 查看宽高信息
# 偏移0x12: 宽度（4字节，小端序）
# 偏移0x16: 高度（4字节，小端序）

# 计算实际高度
实际数据大小 = 文件大小 - 像素数据偏移量
每行字节数 = 宽度 × 3 (24位BMP)
实际高度 = 实际数据大小 / 每行字节数（考虑对齐）
```

#### 修复脚本

```python
import struct

def fix_bmp_height(input_path, output_path):
    """自动修复BMP高度"""
    with open(input_path, 'rb') as f:
        data = f.read()
    
    # 读取文件头信息
    file_size = struct.unpack('<I', data[0x02:0x06])[0]
    pixel_offset = struct.unpack('<I', data[0x0A:0x0E])[0]
    width = struct.unpack('<I', data[0x12:0x16])[0]
    height = struct.unpack('<I', data[0x16:0x1A])[0]
    
    print(f"当前宽度: {width}, 高度: {height}")
    
    # 计算实际高度
    pixel_data_size = file_size - pixel_offset
    row_size = ((width * 3 + 3) // 4) * 4  # 4字节对齐
    actual_height = pixel_data_size // row_size
    
    print(f"计算出的实际高度: {actual_height}")
    
    if actual_height != height:
        # 修改高度
        data = bytearray(data)
        data[0x16:0x1A] = struct.pack('<I', actual_height)
        
        with open(output_path, 'wb') as f:
            f.write(data)
        
        print(f"已修复高度为: {actual_height}")
    else:
        print("高度正确，无需修复")

fix_bmp_height('hidden.bmp', 'fixed.bmp')
```

#### 使用010 Editor手动修改

```
1. 用010 Editor打开BMP文件
2. 模板 -> BMP模板
3. 找到 bitmapInfoHeader -> biHeight
4. 修改为正确的高度值（小端序）
5. 保存文件
```

### 文件大小伪造

修改文件头中的文件大小字段，使其小于实际大小，隐藏尾部数据。

```python
def hide_in_filesize(cover_bmp, secret_data, output_bmp):
    """在BMP文件大小字段后隐藏数据"""
    with open(cover_bmp, 'rb') as f:
        bmp_data = bytearray(f.read())
    
    # 记录原始文件大小
    original_size = len(bmp_data)
    
    # 修改文件头中的大小为原始大小（不包括追加数据）
    bmp_data[0x02:0x06] = struct.pack('<I', original_size)
    
    # 追加秘密数据
    bmp_data.extend(secret_data.encode())
    
    with open(output_bmp, 'wb') as f:
        f.write(bmp_data)

# 提取
def extract_from_filesize(stego_bmp):
    with open(stego_bmp, 'rb') as f:
        data = f.read()
    
    declared_size = struct.unpack('<I', data[0x02:0x06])[0]
    actual_size = len(data)
    
    if actual_size > declared_size:
        hidden_data = data[declared_size:]
        print(f"找到隐藏数据: {hidden_data.decode()}")
        return hidden_data
```

## 调色板隐写

8位BMP使用调色板（256色），每个调色板条目占4字节（B、G、R、保留）。

### 原理

调色板中的"保留"字节通常为0，可以用来隐藏数据。由于调色板只用于索引颜色，修改保留字节不影响显示。

```
调色板结构:
每个条目4字节: [B] [G] [R] [保留]

隐写位置: 保留字节（第4字节）
容量: 256 × 1 = 256 字节
```

### 出题脚本

```python
def encode_palette(bmp_8bit, message, output_path):
    """8位BMP调色板隐写"""
    with open(bmp_8bit, 'rb') as f:
        data = bytearray(f.read())
    
    # 检查是否是8位BMP
    bits_per_pixel = struct.unpack('<H', data[0x1C:0x1E])[0]
    if bits_per_pixel != 8:
        print("必须是8位BMP!")
        return
    
    # 调色板从偏移0x36开始（54字节后）
    palette_offset = 0x36
    
    # 将消息嵌入调色板的保留字节
    for i, char in enumerate(message):
        if i >= 256:
            break
        # 每个调色板条目4字节，保留字节是第4个
        data[palette_offset + i * 4 + 3] = ord(char)
    
    with open(output_path, 'wb') as f:
        f.write(data)

# 提取
def extract_palette(stego_bmp):
    with open(stego_bmp, 'rb') as f:
        data = f.read()
    
    palette_offset = 0x36
    message = ''
    
    for i in range(256):
        byte = data[palette_offset + i * 4 + 3]
        if byte == 0:
            break
        message += chr(byte)
    
    print(f"提取的消息: {message}")
    return message
```

### 解题

```python
# 手动提取调色板数据
def extract_palette_manual(bmp_path):
    with open(bmp_path, 'rb') as f:
        data = f.read()
    
    # 调色板从0x36开始
    palette_offset = 0x36
    
    print("调色板保留字节:")
    reserved_bytes = []
    for i in range(256):
        reserved = data[palette_offset + i * 4 + 3]
        reserved_bytes.append(reserved)
        if reserved != 0:
            print(f"索引 {i}: {reserved} ({chr(reserved) if 32 <= reserved < 127 else '?'})")
    
    return bytes(reserved_bytes)
```

## 像素值差分隐写

### 原理

利用相邻像素之间的差值来嵌入信息。人眼对差值的变化不敏感。

```
原理:
像素A = 100, 像素B = 102
差值 = 2

嵌入bit 1:
修改差值为3（奇数表示1）
像素B = 103
```

### 出题脚本

```python
def encode_pvd(image_path, message, output_path):
    """像素值差分隐写 (Pixel Value Differencing)"""
    img = Image.open(image_path)
    pixels = list(img.getdata())
    width, height = img.size
    
    binary_message = ''.join(format(ord(c), '08b') for c in message)
    
    new_pixels = list(pixels)
    msg_index = 0
    
    # 按行处理，每次取相邻两个像素
    for y in range(height):
        for x in range(0, width - 1, 2):
            if msg_index >= len(binary_message):
                break
            
            idx1 = y * width + x
            idx2 = y * width + x + 1
            
            pixel1 = list(new_pixels[idx1])
            pixel2 = list(new_pixels[idx2])
            
            # 使用蓝色通道
            diff = abs(pixel1[2] - pixel2[2])
            bit = int(binary_message[msg_index])
            
            # 奇偶性嵌入: 奇数=1, 偶数=0
            if (diff % 2) != bit:
                # 调整差值
                if pixel2[2] < 255:
                    pixel2[2] += 1
                else:
                    pixel2[2] -= 1
            
            new_pixels[idx2] = tuple(pixel2)
            msg_index += 1
    
    new_img = Image.new(img.mode, img.size)
    new_img.putdata(new_pixels)
    new_img.save(output_path)
```

## 文件尾部追加

### 原理

BMP解析器读取到像素数据结束后就停止，可以在文件末尾追加任意数据。

```
BMP文件:
[文件头][信息头][像素数据][追加的隐藏数据]
                          ↑
                    BMP解析器停止读取
```

### 检测方法

```bash
# 使用binwalk扫描
binwalk image.bmp

# 输出示例:
# DECIMAL       HEXADECIMAL     DESCRIPTION
# 0             0x0             PC bitmap, Windows 3.x format
# 54            0x36            Zlib compressed data
# 123456        0x1E240         ZIP archive data

# 提取嵌入文件
binwalk -e image.bmp

# 或使用foremost
foremost image.bmp
```

### 出题脚本

```python
def append_to_bmp(cover_bmp, secret_file, output_bmp):
    """在BMP尾部追加文件"""
    with open(cover_bmp, 'rb') as f:
        bmp_data = f.read()
    
    with open(secret_file, 'rb') as f:
        secret_data = f.read()
    
    with open(output_bmp, 'wb') as f:
        f.write(bmp_data)
        f.write(secret_data)
    
    print(f"已追加 {len(secret_data)} 字节")

# 提取
def extract_from_tail(stego_bmp):
    with open(stego_bmp, 'rb') as f:
        data = f.read()
    
    # 计算BMP数据的实际结束位置
    pixel_offset = struct.unpack('<I', data[0x0A:0x0E])[0]
    width = struct.unpack('<I', data[0x12:0x16])[0]
    height = struct.unpack('<I', data[0x16:0x1A])[0]
    
    row_size = ((width * 3 + 3) // 4) * 4
    bmp_end = pixel_offset + row_size * height
    
    if len(data) > bmp_end:
        hidden_data = data[bmp_end:]
        print(f"找到尾部数据: {len(hidden_data)} 字节")
        
        # 尝试识别文件类型
        if hidden_data[:2] == b'PK':
            print("可能是ZIP文件")
        elif hidden_data[:4] == b'\x89PNG':
            print("可能是PNG文件")
        
        return hidden_data
```

## 位平面隐写

### 原理

将图像的每个颜色通道的8位分解为8个位平面，在特定位平面上绘制图案或文字。

```
像素值: 235 = 11101011

位平面分解:
Bit 7 (MSB): 1
Bit 6:       1
Bit 5:       1
Bit 4:       0
Bit 3:       1
Bit 2:       0
Bit 1:       1
Bit 0 (LSB): 1

在Bit 0平面上可以绘制黑白图案
```

### 出题脚本

```python
from PIL import Image, ImageDraw, ImageFont

def create_bitplane_stego(cover_bmp, text, output_bmp, plane=0, channel=2):
    """
    在位平面上绘制文字
    plane: 0-7，0是LSB
    channel: 0=R, 1=G, 2=B
    """
    img = Image.open(cover_bmp)
    pixels = list(img.getdata())
    width, height = img.size
    
    # 创建一个黑白图像，用于文字
    text_img = Image.new('1', (width, height), 0)
    draw = ImageDraw.Draw(text_img)
    
    # 绘制文字
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()
    
    draw.text((50, height//2), text, fill=1, font=font)
    
    # 提取文字图像的像素
    text_pixels = list(text_img.getdata())
    
    # 嵌入到指定位平面
    new_pixels = []
    mask = 1 << plane  # 创建位掩码
    clear_mask = ~mask & 0xFF
    
    for i, pixel in enumerate(pixels):
        pixel_list = list(pixel)
        text_bit = text_pixels[i]
        
        # 清除该位，然后设置新值
        pixel_list[channel] = (pixel_list[channel] & clear_mask) | (text_bit << plane)
        
        new_pixels.append(tuple(pixel_list))
    
    new_img = Image.new(img.mode, img.size)
    new_img.putdata(new_pixels)
    new_img.save(output_bmp)

create_bitplane_stego('cover.bmp', 'FLAG', 'stego.bmp', plane=0, channel=2)
```

### 解题

使用StegSolve查看各个位平面：

```
1. 打开StegSolve
2. File -> Open BMP文件
3. 按左右方向键切换视图:
   - Red plane 0 ~ 7
   - Green plane 0 ~ 7
   - Blue plane 0 ~ 7
4. 如果某个位平面显示清晰的图案/文字，即为隐写内容
5. 可以保存该位平面: Analyse -> Data Extract
```

## 区域隐写

### 原理

只修改图像的特定区域（如边角、纯色区域）的像素，减少被发现的概率。

```python
def encode_region(image_path, message, output_path, region='corner'):
    """区域隐写"""
    img = Image.open(image_path)
    pixels = list(img.getdata())
    width, height = img.size
    
    binary_message = ''.join(format(ord(c), '08b') for c in message)
    binary_message += '1111111111111110'
    
    # 定义嵌入区域
    if region == 'corner':
        # 左上角 100×100 区域
        region_pixels = []
        for y in range(min(100, height)):
            for x in range(min(100, width)):
                region_pixels.append(y * width + x)
    elif region == 'border':
        # 图像边框
        region_pixels = []
        # 上下边
        for y in [0, height-1]:
            for x in range(width):
                region_pixels.append(y * width + x)
        # 左右边
        for y in range(1, height-1):
            for x in [0, width-1]:
                region_pixels.append(y * width + x)
    
    # 嵌入数据
    new_pixels = list(pixels)
    msg_index = 0
    
    for idx in region_pixels:
        if msg_index >= len(binary_message):
            break
        
        pixel = list(new_pixels[idx])
        pixel[2] = (pixel[2] & 0xFE) | int(binary_message[msg_index])
        new_pixels[idx] = tuple(pixel)
        msg_index += 1
    
    new_img = Image.new(img.mode, img.size)
    new_img.putdata(new_pixels)
    new_img.save(output_path)
```

## 工具汇总

### StegSolve

最常用的BMP隐写分析工具。

```bash
# 下载
wget http://www.caesum.com/handbook/Stegsolve.jar

# 运行
java -jar Stegsolve.jar

# 功能:
# - 查看各个位平面（Red/Green/Blue plane 0-7）
# - 数据提取（Data Extract）
# - 图像对比（Image Combiner）
# - 帧浏览（Frame Browser）
```

### zsteg

自动检测和提取LSB隐写。

```bash
# 安装
gem install zsteg

# 基本使用
zsteg image.bmp

# 常用参数
zsteg -a image.bmp           # 显示所有可能的隐写
zsteg -E "b1,rgb,lsb,xy" image.bmp > output.bin  # 提取数据

# 参数说明:
# b1-b8: 位平面（b1=LSB）
# r,g,b,rgb: 颜色通道
# lsb,msb: 最低/最高有效位
# xy,yx: 扫描顺序
```

### binwalk

扫描和提取嵌入文件。

```bash
# 扫描
binwalk image.bmp

# 自动提取
binwalk -e image.bmp

# 输出会显示找到的文件签名和偏移量
```

### Python PIL/Pillow

编写自定义脚本。

```python
from PIL import Image
import struct

# 基本操作示例
img = Image.open('image.bmp')
width, height = img.size
pixels = list(img.getdata())

# 访问单个像素
pixel = pixels[0]  # (R, G, B)

# 修改像素
new_pixels = []
for pixel in pixels:
    r, g, b = pixel
    # 修改LSB
    b = (b & 0xFE) | 1
    new_pixels.append((r, g, b))

# 保存
new_img = Image.new('RGB', (width, height))
new_img.putdata(new_pixels)
new_img.save('modified.bmp')
```

### 010 Editor

十六进制编辑器，配合BMP模板使用。

```
1. 打开BMP文件
2. 模板 -> BMP_Template
3. 可以清晰看到文件结构
4. 手动修改宽高、像素数据等
```

## 综合解题思路

### 标准分析流程

```bash
# 第一步: 基本信息
file image.bmp
exiftool image.bmp

# 第二步: 查看文件头
hexdump -C image.bmp | head -20

# 第三步: 检查文件完整性
# 计算宽高是否正确
# 检查文件大小是否异常

# 第四步: LSB检测
zsteg -a image.bmp

# 第五步: 位平面分析
java -jar Stegsolve.jar
# 逐个查看Red/Green/Blue plane 0-7

# 第六步: 嵌入文件扫描
binwalk image.bmp
foremost image.bmp

# 第七步: 手动分析
# 使用Python脚本提取可疑数据
```

### 常见题型

#### 类型1: LSB隐写

**特征**: zsteg检测到可读文本或文件签名

**解法**:
```bash
zsteg image.bmp
# 输出: b1,rgb,lsb,xy .. text: "flag{...}"

# 提取
zsteg -E "b1,rgb,lsb,xy" image.bmp > flag.txt
```

#### 类型2: 宽高修改

**特征**: 
+ 图片显示不完整
+ 文件大小与显示尺寸不符

**解法**:
```python
# 使用上面的fix_bmp_height脚本
fix_bmp_height('image.bmp', 'fixed.bmp')
```

#### 类型3: 位平面图案

**特征**: StegSolve某个位平面显示清晰图案

**解法**:
```
1. StegSolve查看所有位平面
2. 找到有图案的平面
3. 截图或使用Data Extract提取
```

#### 类型4: 文件追加

**特征**: binwalk检测到多个文件

**解法**:
```bash
binwalk -e image.bmp
# 或
foremost image.bmp
```

#### 类型5: 调色板隐写

**特征**: 8位BMP文件

**解法**:
```python
# 使用extract_palette脚本
extract_palette('image.bmp')
```

## 实用脚本集合

### 自动化分析脚本

```python
import struct
from PIL import Image
import os

def analyze_bmp(filepath):
    """BMP文件全面分析"""
    print(f"=== 分析文件: {filepath} ===\n")
    
    with open(filepath, 'rb') as f:
        data = f.read()
    
    # 检查文件签名
    if data[:2] != b'BM':
        print("错误: 不是有效的BMP文件!")
        return
    
    # 解析文件头
    file_size = struct.unpack('<I', data[0x02:0x06])[0]
    pixel_offset = struct.unpack('<I', data[0x0A:0x0E])[0]
    width = struct.unpack('<I', data[0x12:0x16])[0]
    height = struct.unpack('<I', data[0x16:0x1A])[0]
    bits_per_pixel = struct.unpack('<H', data[0x1C:0x1E])[0]
    
    print(f"文件大小: {file_size} 字节")
    print(f"实际大小: {len(data)} 字节")
    print(f"像素偏移: {pixel_offset}")
    print(f"宽度: {width}, 高度: {height}")
    print(f"位深度: {bits_per_pixel} bits")
    
    # 检查尺寸异常
    row_size = ((width * 3 + 3) // 4) * 4
    expected_pixel_size = row_size * height
    actual_pixel_size = len(data) - pixel_offset
    
    print(f"\n期望像素数据: {expected_pixel_size} 字节")
    print(f"实际像素数据: {actual_pixel_size} 字节")
    
    if actual_pixel_size > expected_pixel_size:
        print(f"⚠️  检测到额外数据: {actual_pixel_size - expected_pixel_size} 字节")
        
    # 检查文