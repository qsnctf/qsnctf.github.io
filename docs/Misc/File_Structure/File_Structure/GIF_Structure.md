# GIF 文件格式详解

GIF（Graphics Interchange Format）是一种 **索引色位图格式** （调色板），以体积小、兼容性强著称，支持**透明色**与**动画（多帧）**。GIF 的核心特点是：像素保存的是“调色板索引”，并使用 **LZW** 压缩。

---

## 1. GIF 文件整体结构（从文件头到文件尾）

GIF 文件由以下部分组成（顺序固定）：

```

Header (6B) + Logical Screen Descriptor (7B)
[ Global Color Table (可选) ]
(若干个 Block：扩展块 / 图像块 / 控制块，交替出现)
Trailer (1B, 0x3B)

```

更直观一点：

```

┌──────────────────────────────┐
│ Header: "GIF87a"/"GIF89a"     │
├──────────────────────────────┤
│ Logical Screen Descriptor     │
├──────────────────────────────┤
│ Global Color Table (可选)     │
├──────────────────────────────┤
│ Blocks...                     │
│   - Extension Blocks (可选)   │
│   - Image Descriptor + Data   │
│   - ... (多帧重复)            │
├──────────────────────────────┤
│ Trailer: 0x3B                 │
└──────────────────────────────┘

```

---

## 2. 文件头（Header，6 字节）

GIF 文件头固定 6 字节 ASCII：

- `"GIF87a"`：早期版本
- `"GIF89a"`：最常见版本（支持更多扩展，如透明、动画控制等）

> 现实中基本都是 GIF89a。

---

## 3. Logical Screen Descriptor（逻辑屏幕描述符，7 字节）

紧跟 Header 的 7 字节结构定义了“画布”的整体属性：

| 字段 | 大小 | 含义 |
|---|---:|---|
| Logical Screen Width  | 2B | 逻辑屏幕宽（像素） |
| Logical Screen Height | 2B | 逻辑屏幕高（像素） |
| Packed Fields         | 1B | 多个标志位（是否有全局调色板等） |
| Background Color Index| 1B | 背景色在全局调色板中的索引 |
| Pixel Aspect Ratio    | 1B | 像素宽高比（多为 0，表示未指定） |

### 3.1 Packed Fields（1 字节位域）要点
Packed Fields 的常见含义（从高位到低位）：

- bit 7：Global Color Table Flag（是否存在全局调色板 GCT）
- bit 6-4：Color Resolution（颜色分辨率信息）
- bit 3：Sort Flag（调色板是否按“重要性”排序）
- bit 2-0：Size of Global Color Table（GCT 大小的指数）

GCT 大小计算：
- `GCT_size = 2^(N+1)`，其中 `N = (Packed & 0b00000111)`

---

## 4. Global Color Table（全局调色板，GCT，可选）

如果 LSD 的标志位指示存在 GCT，则紧接着出现全局调色板：

- 每个颜色条目 3 字节：`R G B`
- 条目数由 LSD 中的 size 指定（例如 256 色就是 256 个条目）

> GIF 是索引色：像素本身只保存“索引”，真正颜色要去调色板查。

---

## 5. Block（块）体系：图像块与扩展块

GIF 的主体由一系列 Block 构成，常见两大类：

1. **Image Block（图像块）**：真正的像素数据（可多帧）
2. **Extension Block（扩展块）**：控制/注释/应用信息（透明、延时、循环等也在这里）

每个块都由“引导字节”区分。

---

## 6. Image Block（图像块）

### 6.1 Image Descriptor（图像描述符）
以分隔符 `0x2C` 开始：

| 字段 | 大小 | 含义 |
|---|---:|---|
| Image Separator | 1B | 固定 `0x2C` |
| Image Left      | 2B | 图像在逻辑屏幕中的左偏移 |
| Image Top       | 2B | 上偏移 |
| Image Width     | 2B | 图像宽 |
| Image Height    | 2B | 图像高 |
| Packed Fields   | 1B | 是否有局部调色板、是否隔行等 |

Packed Fields 常见位义：
- bit 7：Local Color Table Flag（是否有局部调色板 LCT）
- bit 6：Interlace Flag（是否隔行扫描）
- bit 5：Sort Flag
- bit 2-0：Size of Local Color Table（LCT 大小指数）

### 6.2 Local Color Table（局部调色板，LCT，可选）
若 Image Descriptor 指示存在 LCT，则此处出现：
- `2^(N+1)` 个 RGB 条目（每条目 3 字节）

### 6.3 Image Data（图像数据：LZW + 子块）
图像数据结构：

1. **LZW Minimum Code Size**（1B）
2. **Data Sub-blocks**（若干子块）
3. **Block Terminator**（1B，值为 `0x00`，表示子块结束）

> GIF 的数据采用“子块”组织：每个子块以长度字节开头（0~255），长度为 0 表示结束。

---

## 7. Extension Blocks（扩展块）

扩展块统一以引导字节 `0x21` 开始：

```

0x21 + Label + Data Sub-blocks... + 0x00

```

常见扩展类型：

### 7.1 Graphic Control Extension（图形控制扩展，透明/延时/处置方式）
- 作用：控制**下一帧图像**如何显示（延时、透明色索引、处置方式）
- 结构（固定形式）：

```

0x21 0xF9 0x04 [Packed] [Delay(2B)] [TransparentIndex] 0x00

```

Packed 字段常见含义：
- Disposal Method（处置方式：帧结束后怎么处理画面）
- Transparent Color Flag（是否启用透明索引）

> 动画 GIF 的“每帧延时”基本就靠它。

### 7.2 Application Extension（应用扩展，循环次数等）
- 常见用于动画循环控制：**NETSCAPE2.0**
- 结构大致：

```

0x21 0xFF [BlockSize] "NETSCAPE2.0" + sub-blocks ... 0x00

```

### 7.3 Comment Extension（注释扩展）
- Label：`0xFE`
- 数据是文本子块序列

### 7.4 Plain Text Extension（纯文本扩展）
- Label：`0x01`
- 较少用（早期规范遗留）

---

## 8. 文件尾（Trailer）

GIF 文件以 1 字节结尾：

- **Trailer**：`0x3B`

这就是 GIF 的“文件尾标记”。

---

## 9. GIF 的压缩与显示特性要点

- **索引色**：最多 256 色（受调色板大小限制）
- **透明**：通常是“透明色索引”（1 个索引透明），不是 alpha 透明
- **动画**：多帧图像块 + 控制扩展块组合实现
- **压缩**：像素索引用 **LZW** 压缩（不是 Deflate）

---

## 10. 快速记忆小抄

- Header：`GIF87a` 或 `GIF89a`
- 逻辑屏幕（LSD）后：可能有 **全局调色板 GCT**
- 图像块：`0x2C` 开始（Image Descriptor）
- 扩展块：`0x21` 开始（例如 `0xF9` 图形控制扩展）
- 数据用“子块”组织：`[len][bytes...]...[0x00结束]`
- 文件尾：`0x3B`
