# JPG / JPEG 文件格式详解

JPEG（常见扩展名：`.jpg` / `.jpeg`）是一种 **有损压缩** 的图像格式，主要面向照片等连续色调图像。JPEG 文件不是“像 PNG 那样的块链”，而是由一系列 **标记段** （Marker） 顺序组成：`0xFF + 标记码`，其中很多段还会带长度与数据。

---

## 1. JPEG 文件整体结构（从文件头到文件尾）

一个典型 JPEG（JFIF/Exif）文件大致结构：

```

SOI
APP0(JFIF) 或 APP1(Exif/XMP) 等应用段（可有多个）
DQT（量化表）
SOF0/SOF2（图像帧头：尺寸、采样、分量等）
DHT（哈夫曼表）
SOS（扫描开始：后面跟压缩图像数据）
...（熵编码数据，直到遇到 EOI）
EOI

```

> JPEG 可以包含多个 APP 段、多个 DQT/DHT 段；也可能是渐进式（SOF2）或基线（SOF0）。

---

## 2. 文件头：SOI（Start Of Image）

**SOI** 是 JPEG 的开头标记，固定 2 字节：

- 十六进制：`FF D8`

它表示：**这是一个 JPEG 图像的开始**。

---

## 3. 段（Segment）与 Marker 通用格式

JPEG 的很多段遵循这样的结构：

```

┌───────────┬──────────────┬───────────────┐
│ Marker(2) │ Length(2)     │ Payload(...)  │
└───────────┴──────────────┴───────────────┘

```

- **Marker**：2 字节，形如 `FF E1`（APP1）或 `FF DB`（DQT）
- **Length**：2 字节，大端序，表示 **Payload + Length字段本身** 的总长度（也就是从 Length 开始计数）
- **Payload**：该段数据内容

### 3.1 例外（没有 Length 的标记）
有些 Marker 不带长度字段：
- **SOI**：`FF D8`
- **EOI**：`FF D9`
- **RSTn**（重启标记）：`FF D0` ~ `FF D7`（出现在压缩数据中）
- 还有少数其它控制标记

---

## 4. 常见关键段详解（你会经常遇到）

### 4.1 APP0（JFIF）与 APP1（Exif）

#### APP0（JFIF）
- Marker：`FF E0`
- 用于 JFIF 头信息（像素密度、缩略信息等）
- Payload 往往以 ASCII `"JFIF\0"` 开头

#### APP1（Exif）
- Marker：`FF E1`
- 最常见的 Exif 元数据段（相机信息、时间、GPS 等）
- Payload 往往以 ASCII `"Exif\0\0"` 开头
- Exif 内部通常是 TIFF 结构（包含 IFD 表）

> 现实里：手机/相机会放 APP1(Exif)，也可能放 APP1(XMP)，还可能有 APP2(ICC profile) 等。

---

### 4.2 DQT（Define Quantization Table，量化表）

- Marker：`FF DB`
- JPEG 压缩的关键：把频域系数按量化表做除法并取整（有损来源之一）
- 可能有多张表（例如亮度/色度不同表）

---

### 4.3 SOF（Start Of Frame，帧头：尺寸与采样）

常见两类：
- **SOF0**（Baseline DCT）：`FF C0`
- **SOF2**（Progressive DCT）：`FF C2`

SOF 段会给出：
- 精度（通常 8 位）
- 图像高度、宽度
- 分量数量（通常 3：Y/Cb/Cr）
- 每个分量的采样因子（例如 4:2:0 / 4:2:2）与量化表选择

---

### 4.4 DHT（Define Huffman Table，哈夫曼表）

- Marker：`FF C4`
- 熵编码阶段使用的哈夫曼码表（压缩与解码关键）
- 可能有多张表（DC/AC、亮度/色度分别）

---

### 4.5 SOS（Start Of Scan，扫描开始）

- Marker：`FF DA`
- SOS 之后紧跟的是**压缩图像数据（熵编码数据）**
- 直到遇到 **EOI** 或者在数据中穿插的 RSTn 标记

#### 数据中的“字节填充（Byte Stuffing）”
由于 Marker 以 `0xFF` 开头，而压缩数据里也可能出现 `0xFF` 字节：
- 规定：在熵编码数据中，若出现 `0xFF`，后面会插入一个 `0x00`
- 解码时遇到 `FF 00` 表示“这是数据里的 0xFF，不是 marker”

---

## 5. 文件尾：EOI（End Of Image）

**EOI** 是 JPEG 的结束标记，固定 2 字节：

- 十六进制：`FF D9`

表示图像结束（文件尾）。

---

## 6. JPEG 压缩原理（理解文件为何这样组织）

JPEG（典型 YCbCr）压缩流程概览：
1. RGB → YCbCr（可做色度抽样 4:2:0 等）
2. 分块（通常 8x8）
3. DCT 变换到频域
4. **量化（DQT）**：有损关键
5. Zigzag 扫描 + RLE
6. **哈夫曼编码（DHT）**：无损压缩部分
7. 写入 SOS 后的熵编码数据流，EOI 结束

---

## 7. 常见 JPEG 类型

- **Baseline JPEG（SOF0）**：最常见，兼容性最好
- **Progressive JPEG（SOF2）**：渐进显示，网络加载体验更好（先糊后清）
- **带 Exif 的 JPEG**：相机/手机图常见
- **带 ICC profile 的 JPEG（APP2）**：色彩管理更严谨的工作流常见

---

## 8. 快速记忆小抄

- 文件头：`FF D8`（SOI）
- 文件尾：`FF D9`（EOI）
- 段结构：`FF xx` + `Length(2)` + `Payload`（大多数段）
- 关键段：
  - APP0/APP1：JFIF/Exif 元数据
  - DQT：量化表（决定损失/质量）
  - SOF0/SOF2：宽高、采样、分量信息
  - DHT：哈夫曼表
  - SOS：后面就是压缩图像数据（字节填充 FF 00）
