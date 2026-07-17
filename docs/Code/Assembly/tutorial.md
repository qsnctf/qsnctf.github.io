# 汇编语言 - 教程

本教程以 x86-64、Intel 语法、Linux ELF 为主线，介绍汇编语言的基础概念和常见指令。已有的深入章节会继续保留，本页用于提供更接近“教程目录”的学习入口。

## 汇编语言 - 简介

汇编语言是机器指令的人类可读表示。它直接描述 CPU 如何移动数据、计算结果、访问内存和改变控制流。

示例：

```asm
mov eax, 1
add eax, 2
```

## 汇编语言 - 环境搭建

Linux 常用工具：

```bash
sudo apt install build-essential nasm gdb binutils
```

常用命令：

```bash
gcc -g demo.c -o demo
objdump -d -M intel demo
gdb -q ./demo
```

## 汇编语言 - 基础语法

Intel 语法通常是：

```asm
指令 目的操作数, 源操作数
```

例如：

```asm
mov rax, rbx
```

表示把 `rbx` 的值复制到 `rax`。

## 汇编语言 - 内存分段

现代 x86-64 Linux 中，传统分段机制大多弱化，分析时更常关注虚拟地址空间和 ELF 段：

- 代码段：通常可读可执行。
- 只读数据段：保存常量字符串等。
- 数据段：保存全局变量。
- 堆：动态分配内存。
- 栈：函数调用、局部变量和返回地址。

## 汇编语言 - 寄存器

常见通用寄存器：

| 寄存器 | 常见用途 |
| ------ | -------- |
| `rax` | 返回值、累加器 |
| `rbx` | 通用寄存器，callee-saved |
| `rcx` | 计数或第 4 参数 |
| `rdx` | 数据或第 3 参数 |
| `rsi` | 第 2 参数 |
| `rdi` | 第 1 参数 |
| `rsp` | 栈顶指针 |
| `rbp` | 栈帧基址 |
| `rip` | 指令指针 |

## 汇编语言 - 系统调用

Linux x86-64 使用 `syscall` 进入内核。常见约定：

| 寄存器 | 含义 |
| ------ | ---- |
| `rax` | 系统调用号 |
| `rdi` | 第 1 参数 |
| `rsi` | 第 2 参数 |
| `rdx` | 第 3 参数 |
| `r10` | 第 4 参数 |
| `r8` | 第 5 参数 |
| `r9` | 第 6 参数 |

## 汇编语言 - 寻址方式

常见内存寻址：

```asm
mov eax, [rbx]
mov eax, [rbx+8]
mov eax, [rbx+rcx*4+16]
```

格式可理解为：

```text
base + index * scale + displacement
```

## 汇编语言 - 变量

汇编中没有高级语言意义上的变量名。变量通常表现为寄存器、栈偏移或全局地址。

```asm
mov DWORD PTR [rbp-4], 1
```

可理解为把局部变量保存到栈帧中的某个位置。

## 汇编语言 - 常量

立即数就是写在指令中的常量。

```asm
mov eax, 0x1234
```

字符串常量通常存放在 `.rodata`。

## 汇编语言 - 算术指令

| 指令 | 含义 |
| ---- | ---- |
| `add` | 加法 |
| `sub` | 减法 |
| `inc` | 加 1 |
| `dec` | 减 1 |
| `imul` | 有符号乘法 |
| `idiv` | 有符号除法 |

## 汇编语言 - 逻辑指令

| 指令 | 含义 |
| ---- | ---- |
| `and` | 按位与 |
| `or` | 按位或 |
| `xor` | 按位异或 |
| `not` | 按位取反 |
| `shl` | 左移 |
| `shr` | 逻辑右移 |
| `sar` | 算术右移 |

## 汇编语言 - 条件判断

条件判断通常由 `cmp` 或 `test` 配合条件跳转完成。

```asm
cmp eax, 10
je equal_label
```

`cmp a, b` 本质上计算 `a - b` 并设置标志位，但不保存结果。

## 汇编语言 - 循环结构

循环通常由标签、比较和跳转组成。

```asm
xor ecx, ecx
loop_start:
    inc ecx
    cmp ecx, 10
    jl loop_start
```

## 汇编语言 - 数字处理

阅读数字时要关注：

- 位宽：8、16、32、64 位。
- 有符号还是无符号。
- 小端序存储。
- 是否发生截断或扩展。

## 汇编语言 - 字符串处理

字符串通常是连续字节，以 `0x00` 结尾的 C 字符串最常见。

常见指令或函数：

- `rep movsb`
- `rep stosb`
- `strlen`
- `strcmp`
- `memcpy`

## 汇编语言 - 数组

数组访问常体现为基址加索引乘元素大小：

```asm
mov eax, [rdi+rcx*4]
```

如果 `rdi` 是数组首地址，`rcx` 是下标，元素大小为 4 字节。

## 汇编语言 - 过程（子程序）

函数调用使用 `call`，返回使用 `ret`。

```asm
call puts
ret
```

Linux x86-64 前六个整数参数通常位于 `rdi`、`rsi`、`rdx`、`rcx`、`r8`、`r9`。

## 汇编语言 - 递归

递归函数会反复创建栈帧。分析时要关注：

- 终止条件。
- 参数如何变化。
- 返回值如何组合。
- 栈是否可能过深。

## 汇编语言 - 宏

汇编器通常支持宏，用于减少重复代码。不同汇编器宏语法不同，例如 NASM 和 GAS 不完全一致。

## 汇编语言 - 文件管理

文件操作最终会调用系统调用或 C 库函数，例如 `open`、`read`、`write`、`close`。

逆向时通常通过导入表、PLT 或 syscall 号识别文件行为。

## 汇编语言 - 内存管理

内存分配常见来源：

- 栈空间：调整 `rsp`。
- 堆空间：调用 `malloc`、`free`。
- 内存映射：调用 `mmap`、`munmap`。

理解内存权限和生命周期是分析漏洞和程序行为的基础。

## 继续学习

- [架构、数据与数值表示](architecture-data-and-number-representation.md)
- [寄存器、内存与栈](registers-memory-and-stack.md)
- [指令、寻址与控制流](instructions-addressing-and-control-flow.md)
- [函数与调用约定](functions-and-calling-conventions.md)
