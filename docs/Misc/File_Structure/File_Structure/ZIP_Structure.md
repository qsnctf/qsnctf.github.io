# ZIP 文件格式详解

ZIP 是一种 **容器格式** ：把多个文件/目录与元数据打包进一个文件中，并可对每个文件分别压缩（常见为 DEFLATE）。ZIP 的核心由三部分组成：

1. **本地文件头**（Local File Header, LFH）+ 文件数据（每个文件一份，顺序排列）
2. **中央目录**（（Central Directory, CD）汇总索引，记录每个文件的位置与属性）
3. **中央目录结束记录**（End of Central Directory, EOCD）（文件尾，指向中央目录）

```

[ Local File Header + File Data + (Data Descriptor) ] * N
[ Central Directory ]
[ EOCD ]  <-- 通常在文件末尾附近
(可选：ZIP64 结构用于超大 ZIP)

```

---

## 1. ZIP 的“块/记录”视角：关键结构一览

### 1.1 Local File Header（本地文件头，文件数据前面）
- 用来让解压器 **顺序读取** 并直接解出每个文件
- **紧跟着就是该文件的压缩数据**

### 1.2 Central Directory（中央目录）
- 位于 ZIP 末尾附近
- 记录每个文件的元信息（文件名、压缩方式、CRC、偏移等）
- 解压器通常先读它来“快速列出内容/定位文件”

### 1.3 EOCD（中央目录结束记录，文件尾）
- 作为“文件尾标记”
- 告诉你中央目录在哪里、多大、有多少项
- 也是很多程序从尾部反向定位 ZIP 的关键

---

## 2. 记录通用规则：小端序（Little-endian）

ZIP 规范中多数字段都是 **小端序**（Little-endian），与 PNG/JPEG 常见的大端不同。

---

## 3. Local File Header（LFH）结构（每个文件一个）

**签名（4B）**：`50 4B 03 04`（ASCII："PK\003\004"）

```

Offset  Size  Field
0       4     Local file header signature = 0x04034b50
4       2     Version needed to extract
6       2     General purpose bit flag
8       2     Compression method
10      2     File last mod time
12      2     File last mod date
14      4     CRC-32
18      4     Compressed size
22      4     Uncompressed size
26      2     File name length (n)
28      2     Extra field length (m)
30      n     File name
30+n    m     Extra field
30+n+m  ...   File data (compressed)
...           (optional) Data descriptor (若 flag 指示)

```

### 3.1 Compression method（压缩方法）常见值
- `0`：Store（不压缩）
- `8`：Deflate（最常见）
- `9`：Deflate64（较少见）
- `12`：BZIP2
- `14`：LZMA
- `93`：Zstandard（新一些的扩展，兼容性看实现）
- `99`：AES 加密（与 extra field 配合）

---

## 4. Data Descriptor（可选，紧跟在文件数据后）

当 **General purpose bit flag** 的某个位被设置时（常见是 bit 3），在写入 Local Header 时可能**不知道 CRC 与尺寸**，就会：
- Local Header 里 CRC/size 先填 0 或占位
- 文件数据后追加 **Data Descriptor** 给出真实值

其常见形态：

- 可带签名：`50 4B 07 08`
- 然后是：
  - CRC-32（4B）
  - Compressed size（4B 或 ZIP64 扩展）
  - Uncompressed size（4B 或 ZIP64 扩展）

---

## 5. Central Directory File Header（CDFH）结构（中央目录条目）

**签名（4B）**：`50 4B 01 02`

中央目录里每个文件也有一条记录，它包含更完整的元信息，最关键的是：

- 文件名
- 压缩方式、CRC、尺寸
- **Local File Header 的偏移（relative offset of local header）**

简化字段要点：

```

Signature                        4B  = 0x02014b50
...
CRC-32                           4B
Compressed size                  4B
Uncompressed size                4B
File name length (n)             2B
Extra field length (m)           2B
File comment length (k)          2B
...
Relative offset of local header  4B  <-- 关键：定位 LFH
File name                        nB
Extra field                      mB
File comment                     kB

```

---

## 6. EOCD（End of Central Directory）结构（文件尾）

**签名（4B）**：`50 4B 05 06`

EOCD 是“文件尾/索引终点”记录，解压器通常从文件末尾向前搜索这个签名定位 ZIP。

```

Signature                          4B = 0x06054b50
Number of this disk                2B
Disk where central directory starts2B
Number of central directory records on this disk 2B
Total number of central directory records        2B
Size of central directory          4B
Offset of start of central directory 4B
ZIP file comment length (n)        2B
ZIP file comment                   nB

```

> 因为 EOCD 后面只有“注释”，所以它通常在文件最末端附近。

---

## 7. ZIP64（超大 ZIP 的扩展）

当出现以下情况（经典 ZIP 的 32 位字段不够用）：
- 文件大小 > 4GB
- 压缩/未压缩尺寸 > 4GB
- 条目数 > 65535
- 偏移 > 4GB

就会使用 ZIP64：
- ZIP64 End of Central Directory Record
- ZIP64 End of Central Directory Locator
- 并在 extra field 里存放 64 位尺寸/偏移

（实现上常见：有 ZIP64 结构时，EOCD 的某些字段会置为最大值占位，如 `0xFFFF/0xFFFFFFFF`。）

---

## 8. 总结（快速记忆）

- **LFH（本地文件头）**：`PK 03 04`，后面直接跟文件数据
- **中央目录（CD）**：`PK 01 02` * N，像索引表
- **文件尾 EOCD**：`PK 05 06`，告诉你中央目录位置与大小
- ZIP 多数字段为 **小端序**
- 超大 ZIP 用 **ZIP64** 扩展
