# ELF 文件

## 简介

ELF（Executable and Linkable Format）是 Linux、Unix、Android 等系统中常见的目标文件格式。逆向题里拿到的 Linux 可执行文件、共享库 `.so`、目标文件 `.o`、core dump 很多都是 ELF 格式。

ELF 文件既要能被加载器加载到内存中执行，也要能被链接器、调试器、反汇编器分析。因此它同时包含两套重要视角：

- **执行视角**：Program Header Table 描述如何把文件映射到进程内存。
- **链接/分析视角**：Section Header Table 描述 `.text`、`.data`、`.rodata`、`.symtab` 等节区。

常用识别命令：

```bash
file ./chall
readelf -h ./chall
readelf -l ./chall
readelf -S ./chall
```

## 文件格式

一个典型 ELF 文件大致由以下部分组成：

```text
+-----------------------------+
| ELF Header                  |
+-----------------------------+
| Program Header Table        |
+-----------------------------+
| Sections / Segments Data    |
+-----------------------------+
| Section Header Table        |
+-----------------------------+
```

其中：

- `ELF Header` 位于文件开头，描述 ELF 的基本属性。
- `Program Header Table` 面向加载器，说明哪些内容要映射进内存。
- `Section Header Table` 面向链接器和分析工具，说明文件中有哪些节。
- 节和段不是同一个概念：多个 Section 可以落在同一个 Segment 中。

## 数据形式

ELF 支持不同架构和不同字节序。解析 ELF 时不能直接假设字段大小和字节序，要先看 `e_ident`。

| 数据形式 | 含义 |
| -------- | ---- |
| ELF32 | 32 位 ELF，地址和偏移多为 4 字节 |
| ELF64 | 64 位 ELF，地址和偏移多为 8 字节 |
| Little Endian | 小端序，低字节在前，x86/x86_64 常见 |
| Big Endian | 大端序，高字节在前，部分网络和嵌入式架构常见 |

例如十六进制字节：

```text
34 12 00 00
```

如果按小端解释是 `0x1234`，按大端解释是 `0x34120000`。

## 字符表示

ELF 文件开头有固定魔数：

```text
7f 45 4c 46
```

其中 `45 4c 46` 对应 ASCII 字符：

```text
E L F
```

所以在十六进制编辑器里经常能看到：

```text
7F 45 4C 46  ->  .ELF
```

这也是 `file` 命令识别 ELF 文件的关键特征之一。

## ELF Header

ELF Header 是 ELF 文件的总入口，位于文件最开始。它告诉系统这个文件是什么类型、属于什么架构、入口地址在哪里、程序头表和节头表在文件中的偏移等。

ELF32 头结构可简化理解为：

```c
typedef struct {
    unsigned char e_ident[16];
    uint16_t e_type;
    uint16_t e_machine;
    uint32_t e_version;
    uint32_t e_entry;
    uint32_t e_phoff;
    uint32_t e_shoff;
    uint32_t e_flags;
    uint16_t e_ehsize;
    uint16_t e_phentsize;
    uint16_t e_phnum;
    uint16_t e_shentsize;
    uint16_t e_shnum;
    uint16_t e_shstrndx;
} Elf32_Ehdr;
```

ELF64 中部分字段会扩展为 64 位，但含义基本一致。

### e_ident

`e_ident` 长度为 16 字节，用于标识 ELF 文件的基础信息。

| 字段 | 常见值 | 含义 |
| ---- | ------ | ---- |
| `EI_MAG0` | `0x7f` | ELF 魔数第 1 字节 |
| `EI_MAG1` | `E` | ELF 魔数第 2 字节 |
| `EI_MAG2` | `L` | ELF 魔数第 3 字节 |
| `EI_MAG3` | `F` | ELF 魔数第 4 字节 |
| `EI_CLASS` | `1` / `2` | `1` 表示 ELF32，`2` 表示 ELF64 |
| `EI_DATA` | `1` / `2` | `1` 小端，`2` 大端 |
| `EI_VERSION` | `1` | ELF 版本 |
| `EI_OSABI` | 依系统而定 | ABI 类型 |

示例：

```text
7f 45 4c 46 02 01 01 00 ...
```

含义是：ELF 文件、64 位、小端、当前版本。

### e_type

`e_type` 表示 ELF 文件类型。

| 值 | 名称 | 含义 |
| -- | ---- | ---- |
| `ET_REL` | `1` | 可重定位文件，常见于 `.o` |
| `ET_EXEC` | `2` | 可执行文件 |
| `ET_DYN` | `3` | 共享对象，`.so` 或 PIE 可执行文件 |
| `ET_CORE` | `4` | Core dump 文件 |

逆向中如果可执行文件是 `ET_DYN`，通常说明它启用了 PIE，加载基址运行时会随机化。

### e_machine

`e_machine` 表示目标 CPU 架构。

| 值 | 架构 |
| -- | ---- |
| `EM_386` | Intel 80386，32 位 x86 |
| `EM_X86_64` | AMD x86-64 |
| `EM_ARM` | ARM |
| `EM_AARCH64` | ARM64 |
| `EM_MIPS` | MIPS |

分析 ELF 前要先确认架构，因为不同架构的指令集、调用约定和寄存器都不同。

### e_version

`e_version` 表示 ELF 文件版本。当前标准通常为：

```text
EV_CURRENT = 1
```

逆向中这个字段一般不需要重点关注，除非文件头被破坏或题目要求修复 ELF。

### e_entry

`e_entry` 表示程序入口虚拟地址，也就是加载器准备开始执行的位置。

注意：入口点不一定是 `main` 函数。Linux ELF 通常从 `_start` 开始执行，随后由运行库初始化环境，再调用 `main`。

常见分析流程：

```text
e_entry -> _start -> __libc_start_main -> main
```

### e_phoff

`e_phoff` 表示 Program Header Table 在文件中的偏移。

如果该值为 `0`，说明文件可能没有程序头表。可重定位文件 `.o` 通常不需要被直接加载执行，因此可能没有 Program Header Table。

### e_shoff

`e_shoff` 表示 Section Header Table 在文件中的偏移。

逆向中节头表可能被去除或破坏。即使没有 Section Header Table，程序仍然可能正常运行，因为加载器主要依赖 Program Header Table。

### e_flags

`e_flags` 保存与处理器相关的标志。不同架构含义不同，例如 ARM、MIPS 可能会在这里记录 ABI、指令集模式等信息。

x86/x86_64 上该字段通常不太重要，很多情况下为 `0`。

### e_ehsize

`e_ehsize` 表示 ELF Header 自身大小。

常见值：

| 类型 | 大小 |
| ---- | ---- |
| ELF32 | `52` 字节 |
| ELF64 | `64` 字节 |

如果该字段异常，可能是文件头损坏或被刻意修改。

### e_phentsize

`e_phentsize` 表示 Program Header Table 中每个表项的大小。

常见值：

| 类型 | 大小 |
| ---- | ---- |
| ELF32 | `32` 字节 |
| ELF64 | `56` 字节 |

### e_phnum

`e_phnum` 表示 Program Header Table 的表项数量。

加载器会结合 `e_phoff`、`e_phentsize`、`e_phnum` 遍历所有程序头。

计算方式：

```text
Program Header Table 范围 = e_phoff 到 e_phoff + e_phentsize * e_phnum
```

### e_shentsize

`e_shentsize` 表示 Section Header Table 中每个节头表项的大小。

常见值：

| 类型 | 大小 |
| ---- | ---- |
| ELF32 | `40` 字节 |
| ELF64 | `64` 字节 |

### e_shnum

`e_shnum` 表示 Section Header Table 的表项数量。

如果节头表被 strip 或破坏，这个字段可能为 `0` 或不可信。

### e_shstrndx

`e_shstrndx` 表示节名字符串表 `.shstrtab` 在 Section Header Table 中的下标。

节头中的 `sh_name` 并不直接保存字符串，而是保存 `.shstrtab` 中的偏移。工具通过 `e_shstrndx` 找到 `.shstrtab`，再根据 `sh_name` 解析出 `.text`、`.data` 等节名。

## Program Header Table

### 概述

Program Header Table 由多个 Program Header 组成，每个 Program Header 描述一个 Segment。Segment 是加载器视角下的概念，重点是“哪些文件内容要映射到内存，以及以什么权限映射”。

ELF32 Program Header 可简化理解为：

```c
typedef struct {
    uint32_t p_type;
    uint32_t p_offset;
    uint32_t p_vaddr;
    uint32_t p_paddr;
    uint32_t p_filesz;
    uint32_t p_memsz;
    uint32_t p_flags;
    uint32_t p_align;
} Elf32_Phdr;
```

常用命令：

```bash
readelf -l ./chall
```

### 段类型

`p_type` 表示段类型。

| 类型 | 含义 |
| ---- | ---- |
| `PT_NULL` | 未使用表项 |
| `PT_LOAD` | 需要加载到内存的段 |
| `PT_DYNAMIC` | 动态链接信息 |
| `PT_INTERP` | 动态链接器路径，如 `/lib64/ld-linux-x86-64.so.2` |
| `PT_NOTE` | 注释和辅助信息 |
| `PT_PHDR` | Program Header Table 自身的位置 |
| `PT_TLS` | 线程局部存储信息 |
| `PT_GNU_STACK` | 栈权限配置，常用于判断 NX |
| `PT_GNU_RELRO` | RELRO 保护相关区域 |

逆向和 Pwn 中最常关注的是 `PT_LOAD`、`PT_DYNAMIC`、`PT_INTERP`、`PT_GNU_STACK`、`PT_GNU_RELRO`。

### 基地址 - Base Address

基地址是 ELF 被映射到进程内存后的起始参考地址。对于非 PIE 的 `ET_EXEC`，基地址通常固定；对于 PIE 或共享库 `ET_DYN`，基地址通常由加载器运行时决定。

常见关系：

```text
运行时地址 = 加载基地址 + 文件内相对偏移或虚拟地址偏移
```

分析 PIE 程序时，IDA/Ghidra 中看到的静态地址和调试时的运行时地址可能不同，需要通过泄露地址或 `/proc/<pid>/maps` 计算基址。

### 段权限 - p_flags

`p_flags` 表示段权限，常见组合包括读、写、执行。

| 标志 | 含义 |
| ---- | ---- |
| `PF_R` | 可读 |
| `PF_W` | 可写 |
| `PF_X` | 可执行 |

典型段权限：

| 权限 | 常见内容 |
| ---- | -------- |
| `R E` | 代码段，包含 `.text` |
| `R` | 只读数据，包含 `.rodata` |
| `RW` | 可写数据，包含 `.data`、`.bss` |

如果某个段同时 `W` 和 `X`，说明它既可写又可执行，安全风险较高。

### 段内容

一个 `PT_LOAD` 段通常会包含多个 Section。例如：

| Segment 权限 | 可能包含的 Section |
| ------------ | ------------------- |
| `R E` | `.init`、`.plt`、`.text`、`.fini` |
| `R` | `.rodata`、`.eh_frame_hdr`、`.eh_frame` |
| `RW` | `.init_array`、`.dynamic`、`.got`、`.data`、`.bss` |

需要注意：

- Program Header Table 决定运行时加载。
- Section Header Table 主要服务链接和分析。
- 被 strip 的 ELF 可能没有符号表或节名，但只要 Program Header 正常，仍可运行。

## Section Header Table

Section Header Table 由多个 Section Header 组成，每个 Section Header 描述一个节。Section 是链接和分析视角下的概念，用于组织代码、数据、符号、重定位信息等。

常用命令：

```bash
readelf -S ./chall
```

### ELF32_Shdr

ELF32 节头结构可简化理解为：

```c
typedef struct {
    uint32_t sh_name;
    uint32_t sh_type;
    uint32_t sh_flags;
    uint32_t sh_addr;
    uint32_t sh_offset;
    uint32_t sh_size;
    uint32_t sh_link;
    uint32_t sh_info;
    uint32_t sh_addralign;
    uint32_t sh_entsize;
} Elf32_Shdr;
```

常见字段：

| 字段 | 含义 |
| ---- | ---- |
| `sh_name` | 节名在 `.shstrtab` 中的偏移 |
| `sh_type` | 节类型 |
| `sh_flags` | 节属性标志 |
| `sh_addr` | 节加载到内存后的虚拟地址 |
| `sh_offset` | 节在文件中的偏移 |
| `sh_size` | 节大小 |
| `sh_link` | 关联节下标，含义依 `sh_type` 而定 |
| `sh_info` | 附加信息，含义依 `sh_type` 而定 |
| `sh_addralign` | 对齐要求 |
| `sh_entsize` | 如果节中保存固定大小表项，则表示每项大小 |

### 特殊下标

Section Header Table 中有一些特殊下标。

| 下标 | 名称 | 含义 |
| ---- | ---- | ---- |
| `0` | `SHN_UNDEF` | 未定义节，下标 0 通常是空节头 |
| `0xff00` | `SHN_LORESERVE` | 保留区间起点 |
| `0xfff1` | `SHN_ABS` | 绝对符号，不随重定位改变 |
| `0xfff2` | `SHN_COMMON` | 公共符号，常见于未初始化全局变量 |
| `0xffff` | `SHN_HIRESERVE` | 保留区间终点 |

符号表中的 `st_shndx` 会使用这些下标来说明符号归属。

### 部分节头字段

#### sh_type

`sh_type` 表示节的类型。

| 类型 | 含义 |
| ---- | ---- |
| `SHT_NULL` | 空节 |
| `SHT_PROGBITS` | 程序数据，如 `.text`、`.rodata`、`.data` |
| `SHT_SYMTAB` | 静态符号表 |
| `SHT_STRTAB` | 字符串表 |
| `SHT_RELA` | 带显式加数的重定位表 |
| `SHT_HASH` | 符号哈希表 |
| `SHT_DYNAMIC` | 动态链接信息 |
| `SHT_NOTE` | 注释信息 |
| `SHT_NOBITS` | 不占文件空间但占内存，如 `.bss` |
| `SHT_REL` | 不带显式加数的重定位表 |
| `SHT_DYNSYM` | 动态符号表 |

`SHT_NOBITS` 是逆向中容易忽略的一类。`.bss` 在文件中不保存实际内容，但加载到内存后会分配并清零。

#### sh_flags

`sh_flags` 表示节属性。

| 标志 | 含义 |
| ---- | ---- |
| `SHF_WRITE` | 运行时可写 |
| `SHF_ALLOC` | 运行时需要分配内存 |
| `SHF_EXECINSTR` | 包含可执行指令 |
| `SHF_MERGE` | 可合并数据 |
| `SHF_STRINGS` | 以 `\0` 结尾的字符串 |
| `SHF_TLS` | 线程局部存储 |

典型例子：

| 节 | 常见 flags |
| -- | ---------- |
| `.text` | `ALLOC + EXECINSTR` |
| `.rodata` | `ALLOC` |
| `.data` | `WRITE + ALLOC` |
| `.bss` | `WRITE + ALLOC` |

#### sh_link & sh_info

`sh_link` 和 `sh_info` 的含义依赖 `sh_type`，不能脱离节类型单独理解。

常见情况：

| 节类型 | `sh_link` | `sh_info` |
| ------ | --------- | --------- |
| `SHT_SYMTAB` / `SHT_DYNSYM` | 关联字符串表下标 | 第一个非局部符号的下标 |
| `SHT_REL` / `SHT_RELA` | 关联符号表下标 | 被重定位节的下标 |
| `SHT_DYNAMIC` | 关联字符串表下标 | 通常为 0 |
| `SHT_HASH` | 关联符号表下标 | 通常为 0 |

例如 `.dynsym` 的 `sh_link` 通常指向 `.dynstr`，因为动态符号表中的符号名需要从动态字符串表中取出。

## 逆向分析关注点

- 先用 `file`、`readelf -h` 判断架构、位数、端序、PIE。
- 用 `readelf -l` 看加载段、权限、解释器、RELRO、NX 相关信息。
- 用 `readelf -S` 看 `.text`、`.rodata`、`.data`、`.bss`、`.got`、`.plt` 等节。
- 程序入口 `e_entry` 通常不是 `main`，需要顺着 `_start` 或工具识别结果找主逻辑。
- 节头表缺失不代表程序不能运行，很多保护或混淆会故意去掉节名、符号表。
