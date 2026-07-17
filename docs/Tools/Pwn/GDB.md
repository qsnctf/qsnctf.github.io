# GDB 在 Pwn 中的使用

## 工具简介

GDB（GNU Debugger）是 Linux Pwn 中最常用的动态调试器。它可以控制程序运行、设置断点、查看寄存器和内存、分析崩溃现场，并验证静态分析得到的结论。

在 Pwn 学习中，GDB 的主要任务不是“自动找出利用方法”，而是回答以下问题：

- 输入经过了哪些函数和内存区域？
- 函数调用前后，寄存器、栈和返回地址如何变化？
- 程序在哪条指令崩溃，访问了什么地址？
- PIE、ASLR、Canary、NX 和 RELRO 对运行状态有什么影响？
- 本地脚本发送的数据是否与预期完全一致？

!!! warning "仅用于授权环境"
    本文面向 CTF、课程实验和自己编写的程序。不要附加或调试未经授权的进程。分析未知二进制时应使用可恢复的虚拟机或容器，并避免使用真实凭据、管理员权限和不必要的网络连接。

## 安装与环境准备

GDB 主要用于 Linux ELF 程序。Windows 用户学习 Linux Pwn 时，建议使用 Linux 虚拟机或 WSL 2；需要与目标环境高度一致时，虚拟机通常比 WSL 更容易控制内核、glibc 和调试权限。

### Debian、Ubuntu 和 Kali

```bash
sudo apt update
sudo apt install gdb gdbserver binutils file python3 python3-pip
gdb --version
```

调试 32 位 x86 程序时，64 位系统还可能需要多架构运行库和编译环境：

```bash
sudo dpkg --add-architecture i386
sudo apt update
sudo apt install gcc-multilib libc6:i386 libc6-dbg:i386
```

软件包名称会随发行版变化。如果只分析 64 位程序，不需要为了“配置完整”而安装所有 32 位依赖。

### Arch Linux

```bash
sudo pacman -S gdb gdbserver binutils file python
gdb --version
```

### 准备调试符号

自己编写的练习程序建议使用：

```bash
gcc -O0 -g -Wall -Wextra demo.c -o demo
```

- `-g`：生成源码行、变量和类型等调试信息。
- `-O0`：减少优化，便于初学者对应源码与汇编。
- `-Wall -Wextra`：启用常见编译警告。

CTF 附件通常已经被 `strip`，没有源码符号。这不会阻止指令级调试，但函数名、局部变量和源码行信息可能缺失。

### 推荐的基础配置

将以下内容放入 `~/.gdbinit`，或者在每次会话中手动执行：

```gdb
set disassembly-flavor intel
set pagination off
set print pretty on
set confirm off
```

初学阶段不要加入会自动修改 ASLR、信号处理或程序内存的复杂脚本。先理解原生 GDB，再使用增强插件。

## 调试前先检查目标

不要拿到文件后立即运行。先使用静态工具确认基本属性：

```bash
file ./chall
readelf -h ./chall
readelf -l ./chall
readelf -s ./chall
```

如果安装了 Checksec，还可以检查常见保护：

```bash
checksec --file=./chall
```

需要记录：

| 项目 | 对调试的影响 |
| --- | --- |
| 架构和位数 | 决定寄存器、指针宽度和调用约定 |
| PIE | 主程序加载地址可能变化，静态地址不能直接作为运行时地址 |
| Canary | 函数返回前可能因栈保护检查失败而终止 |
| NX | 栈或堆通常不可执行 |
| RELRO | 影响 GOT 等重定位区域的可写性 |
| stripped | 函数名和源码信息减少，需要按地址分析 |

保护机制是分析条件，不应为了方便而默认关闭。CTF 调试应尽量复现题目给定二进制的真实运行条件。

## 启动和输入复现

### 常用启动方式

```bash
gdb -q ./chall
gdb -q --args ./chall arg1 arg2
gdb -q -x debug.gdb ./chall
```

进入 GDB 后：

```gdb
start
run
set args arg1 arg2
show args
```

- `start`：运行并临时停在 `main` 附近，适合有 `main` 符号的程序。
- `starti`：停在程序执行的第一条指令，适合无符号程序或加载过程分析。
- `run`：重新启动程序。

### 使用完全相同的输入

标准输入题目可以使用重定向：

```gdb
run < input.bin
```

生成二进制输入时不要使用会自动追加换行或破坏空字节的命令。可以使用 Python：

```bash
python3 -c "import sys; sys.stdout.buffer.write(b'A' * 64 + b'\n')" > input.bin
```

调试时应保存导致问题的原始输入文件。手工重新输入可能改变长度、换行、空字节和读取时机，导致无法复现崩溃。

### 附加到运行中的进程

```bash
gdb -q ./chall -p <PID>
```

也可以进入 GDB 后执行：

```gdb
attach <PID>
detach
```

附加失败时，应先检查进程所有者和 Linux `ptrace` 限制，不要直接以 root 身份反复运行未知程序。

## Pwn 常用 GDB 命令

### 断点

```gdb
break main
break vuln
break *0x4011a3
tbreak main
info breakpoints
disable 1
enable 1
delete 1
```

- `break` 创建普通断点。
- `tbreak` 创建命中一次后自动删除的临时断点。
- `break *地址` 在具体指令地址设置断点。

条件断点可以减少循环中的重复停止：

```gdb
break *0x4011a3 if $rax == 0
condition 1 $rdi > 0x100
ignore 1 9
```

`ignore 1 9` 表示前 9 次命中断点 1 时不停止。

### 执行控制

```gdb
continue
step
next
stepi
nexti
finish
until
```

| 命令 | 作用 |
| --- | --- |
| `step` | 源码级单步，进入函数 |
| `next` | 源码级单步，越过函数调用 |
| `stepi` / `si` | 执行一条机器指令，进入 `call` |
| `nexti` / `ni` | 执行一条机器指令，通常越过 `call` |
| `finish` | 运行到当前函数返回 |
| `continue` / `c` | 运行到下一个断点、信号或退出 |

没有源码或程序经过优化时，应以指令级调试为主。

### 寄存器

```gdb
info registers
info registers rax rdi rsi rdx rsp rbp rip
p/x $rax
p/d $eax
set $rax = 0
```

x86-64 System V ABI 中，前六个整数或指针参数通常依次使用：

```text
rdi, rsi, rdx, rcx, r8, r9
```

返回值通常位于 `rax`，栈指针是 `rsp`，指令指针是 `rip`。32 位 x86 的参数通常由栈传递，返回值通常位于 `eax`。

!!! note
    `set $rax = 0` 会修改真实执行状态，只适合验证假设。修改后的运行结果不能证明原程序在未修改时也会这样执行。

### 查看内存

GDB 的通用格式是 `x/NFU 地址`：

- `N`：显示数量。
- `F`：格式，如 `x` 十六进制、`d` 十进制、`s` 字符串、`i` 指令。
- `U`：单位，如 `b` 1 字节、`h` 2 字节、`w` 4 字节、`g` 8 字节。

```gdb
x/32bx $rsp
x/16gx $rsp
x/10i $rip
x/s $rdi
x/20wx 0x404000
```

常见组合：

| 命令 | 含义 |
| --- | --- |
| `x/32bx $rsp` | 从栈顶查看 32 个字节 |
| `x/16gx $rsp` | 从栈顶查看 16 个 8 字节整数 |
| `x/10i $rip` | 查看即将执行的 10 条指令 |
| `x/s $rdi` | 将 `rdi` 指向的内存解释为 C 字符串 |

同一内存应按字节和整数分别观察，以避免混淆小端序、字符串终止符和指针宽度。

### 反汇编和调用栈

```gdb
disassemble main
disassemble /r vuln
x/10i $rip
backtrace
frame 1
info frame
info args
info locals
```

`disassemble /r` 会同时显示机器码字节。栈已经损坏、程序缺少展开信息或经过高度优化时，`backtrace` 可能不完整，甚至给出误导结果；此时应直接检查 `rsp`、保存的返回地址和调用指令。

## PIE、ASLR 和运行时地址

### 两者的区别

- ASLR 是操作系统的地址随机化机制，会改变栈、共享库等区域的位置。
- PIE 是可执行文件的构建属性，使主程序也能被加载到变化的基址。

GDB 在部分 Linux 环境中默认会在启动被调试程序时禁用地址随机化。可以检查：

```gdb
show disable-randomization
```

需要更接近普通运行环境时：

```gdb
set disable-randomization off
```

不要假定本地 GDB、容器、远程服务和 Pwntools 启动出的进程具有相同地址布局。

### 查看内存映射

程序运行后执行：

```gdb
info proc mappings
info sharedlibrary
```

映射信息可以确认：

- 主程序、libc 和动态链接器的加载范围。
- 栈、堆和匿名映射的位置。
- 各区域是否可读、可写、可执行。

### 对 PIE 地址下断点

有符号的 PIE 程序可以直接使用：

```gdb
start
break main
break vuln
```

只有静态偏移时，先让程序开始运行并取得模块基址，再计算运行时地址：

```gdb
starti
info proc mappings
set $base = 0x555555554000
break *($base + 0x1234)
```

这里的基址和 `0x1234` 只是格式示例，必须以当前文件和当前运行的映射为准。记录地址时优先写成“模块名 + 偏移”，不要只记录一次运行中的绝对地址。

## 栈与函数调用分析

### 在函数入口观察参数

例如程序即将调用：

```c
read(0, buffer, 128);
```

在 x86-64 Linux 中，可以在 `read` 调用附近检查：

```gdb
info registers rdi rsi rdx
x/32bx $rsi
```

此时通常有：

- `rdi`：文件描述符。
- `rsi`：目标缓冲区地址。
- `rdx`：最大读取长度。

结合函数栈帧可以判断缓冲区位置、读取上限以及关键控制数据之间的距离，但必须以实际指令为证据，不能只根据反编译器生成的变量名猜测。

### 观察函数返回

```gdb
disassemble vuln
break *<ret 指令地址>
run < input.bin
x/8gx $rsp
x/i $rip
```

执行 `ret` 前，`rsp` 指向的值通常会被取作返回地址。若该位置已被输入覆盖，应继续追踪覆盖发生在哪次写入以及精确偏移，而不是只记录最终崩溃地址。

### 栈对齐

x86-64 System V ABI 对函数调用边界有栈对齐要求。分析异常崩溃时可以查看：

```gdb
p/x $rsp
p/d ((unsigned long)$rsp & 0xf)
```

栈对齐错误可能在使用 SIMD 指令或调用库函数时表现为崩溃。不要把所有库函数内部崩溃都归因于“libc 版本错误”。

## 定位崩溃和输入偏移

### 崩溃后的固定检查顺序

程序收到 `SIGSEGV`、`SIGABRT` 等信号时，先保存现场：

```gdb
info registers
x/10i $rip
x/24gx $rsp
backtrace
info proc mappings
```

依次判断：

1. 当前指令是在读取、写入还是跳转到无效地址？
2. 有效地址由哪些寄存器和偏移构成？
3. 目标地址是否已映射，权限是否满足操作？
4. 错误寄存器值最早在哪里产生？
5. 是否存在更早的越界写、释放后使用或栈破坏？

崩溃位置通常只是症状，不一定是缺陷发生的位置。

### 使用循环模式定位偏移

Pwntools 提供不会像重复 `A` 那样难以定位的循环模式：

```bash
pwn cyclic 300 > pattern.bin
```

在 GDB 中复现：

```gdb
run < pattern.bin
info registers
x/8gx $rsp
```

找到进入目标寄存器或栈槽的模式片段后，在终端计算偏移：

```bash
pwn cyclic -l <模式片段>
```

也可以使用 Python API：

```python
from pwn import cyclic, cyclic_find

data = cyclic(300)
offset = cyclic_find(b"<四字节模式>")
```

!!! caution
    计算时必须使用崩溃现场中真实出现的字节，并注意架构、字节序和模式宽度。x86-64 在 `ret` 读取非法地址时，错误模式可能仍位于 `$rsp` 指向的内存，而不一定完整出现在 `$rip`。

### 区分 Canary 终止与普通段错误

栈保护检查失败通常会调用 `__stack_chk_fail` 并触发 `SIGABRT`，终端可能出现 `stack smashing detected`。可以设置：

```gdb
break __stack_chk_fail
run < input.bin
backtrace
```

这只能帮助定位哪个函数检测到破坏。Canary 被破坏说明此前发生了越界写，根因仍需向前追踪。

## Core Dump 离线分析

Core Dump 保存崩溃时的寄存器、内存映射和部分进程内存，适合程序在 GDB 外崩溃后的复盘。

### 启用 Core Dump

在当前 Shell 会话中：

```bash
ulimit -c unlimited
./chall < input.bin
```

系统可能把 Core Dump 交给 systemd-coredump，而不是直接生成当前目录下的 `core` 文件。可以使用：

```bash
coredumpctl list
coredumpctl debug <PID或程序名>
```

如果已经得到 Core 文件：

```bash
gdb -q ./chall ./core
```

进入后执行：

```gdb
info registers
x/10i $rip
x/24gx $rsp
backtrace
info proc mappings
```

还可以在正在调试的进程中主动保存快照：

```gdb
generate-core-file snapshot.core
```

Core 文件可能包含输入、环境变量、密钥和其他进程内存，不应上传到公开仓库或无检查地分享。

## 观察动态链接和库函数

### 在导入函数处停止

常见断点示例：

```gdb
break read
break puts
break malloc
break free
```

动态库尚未加载时，GDB 可能询问是否创建 pending breakpoint。可以设置：

```gdb
set breakpoint pending on
```

库函数名称可能同时对应 PLT 跳板、动态链接器内部实现或 libc 实现。命中后应通过当前指令地址和内存映射确认实际所在模块。

### 捕获系统调用

```gdb
catch syscall read
catch syscall write
catch syscall mmap
info breakpoints
```

系统调用捕获点适合验证文件描述符、缓冲区和长度，也能在没有库符号或程序直接执行 `syscall` 时使用。捕获全部系统调用会产生大量停止，应优先指定名称。

### 多进程程序

网络服务或题目包装器可能调用 `fork`。默认情况下 GDB 通常继续跟踪父进程。需要跟踪子进程时：

```gdb
set follow-fork-mode child
set detach-on-fork off
catch fork
info inferiors
inferior 2
```

保留多个 inferior 会增加调试复杂度。先确认真正处理输入的是父进程还是子进程，再选择跟踪策略。

## 使用 Pwntools 联调

手工调试确认关键位置后，可以把断点写入脚本，以缩短“修改输入 → 运行 → 检查”的循环。

### 启动并调试新进程

```python
from pwn import *

context.binary = elf = ELF("./chall", checksec=False)
context.terminal = ["tmux", "split-window", "-h"]

gdbscript = """
set disassembly-flavor intel
break main
continue
"""

io = gdb.debug([elf.path], gdbscript=gdbscript)
io.sendline(b"test")
io.interactive()
```

`gdb.debug()` 通常需要本机已安装 `gdbserver`，并需要一个 Pwntools 能打开的新终端。没有 tmux 时，应按自己的终端环境配置 `context.terminal`。

### 附加到现有进程

```python
from pwn import *

context.binary = elf = ELF("./chall", checksec=False)
io = process(elf.path)

gdb.attach(io, gdbscript="""
break main
continue
""")

io.interactive()
```

开发完成后可以使用 Pwntools 的 `NOPTRACE` 参数跳过调试附加：

```bash
python3 exploit.py NOPTRACE
```

### 保持本地和远程环境一致

调试远程题目时，应尽量使用题目提供的：

- ELF 主程序。
- libc 和动态链接器。
- 架构、位数和操作系统环境。
- 启动参数、环境变量和标准输入输出方式。

本地成功只说明当前环境中的假设成立。地址偏移、符号版本、堆分配器行为和输入缓冲方式都可能因环境不同而变化。

## GDB 增强插件

Pwndbg、GEF 和 PEDA 都是在 GDB 基础上增加上下文显示、内存映射、循环模式和堆分析等功能的扩展。新环境优先考虑仍在积极维护的 Pwndbg 或 GEF。

!!! important
    同一个 GDB 配置中不要同时自动加载多个大型增强插件。它们可能注册同名命令、事件钩子和提示符，造成冲突。需要比较时，应使用独立配置文件或独立启动命令。

### Pwndbg

Pwndbg 面向漏洞研究和二进制调试，常见功能包括上下文、内存映射、指针解引用、循环模式、保护检查和 glibc 堆结构查看。

官方当前提供便携版本、软件包和源码安装等方式。安装命令会随版本变化，应优先参考 [Pwndbg 安装文档](https://pwndbg.re/stable/setup/){ target="_blank" rel="noopener" }，并在执行网络安装脚本前检查脚本来源和内容。

安装完成后通常使用：

```bash
pwndbg ./chall
```

进入后可以查看帮助和版本：

```gdb
pwndbg
version
help
```

常用 Pwndbg 命令包括：

| 命令 | 作用 |
| --- | --- |
| `context` | 显示寄存器、反汇编、栈等上下文 |
| `checksec` | 显示当前 ELF 的常见保护 |
| `vmmap` | 显示内存映射和权限 |
| `telescope $rsp` | 递归解引用栈上的指针 |
| `cyclic` | 生成或查找循环模式 |
| `xinfo <地址>` | 查询地址所属区域和相关信息 |
| `search <内容>` | 在进程内存中搜索数据 |

插件命令会随版本变化，遇到差异时应使用 `<命令> --help` 或官方命令文档，而不是依赖旧教程截图。

### GEF

GEF（GDB Enhanced Features）以单个主脚本为核心，提供上下文、地址信息、内存映射和堆分析等能力。安装前应确认 GDB 带有兼容的 Python 3 支持：

```bash
gdb -nx -ex 'python import sys; print(sys.version)' -ex quit
```

具体安装方式和版本要求应参考 [GEF 官方安装文档](https://hugsy.github.io/gef/install/){ target="_blank" rel="noopener" }。安装后启动 GDB，使用以下命令确认：

```gdb
gef help
gef config
```

常用 GEF 命令包括 `context`、`vmmap`、`xinfo`、`dereference`、`pattern` 和 `checksec`。这些不是原生 GDB 命令。

### 临时禁用插件

当插件启动失败、命令行为异常或需要验证原生 GDB 时，使用：

```bash
gdb -nx -q ./chall
```

`-nx` 会阻止 GDB 读取初始化文件。若此时能够正常启动，问题通常来自 `~/.gdbinit` 或其加载的扩展脚本。

## 常见问题

### `ptrace: Operation not permitted`

先检查：

- 是否正在附加其他用户的进程。
- 目标是否已经被另一个调试器跟踪。
- 容器是否缺少调试所需能力。
- Linux Yama 的 `ptrace_scope` 是否限制附加关系。

优先让 GDB 直接启动目标，或调整实验容器的调试配置。不要为了省事永久关闭整台日常主机的安全机制。

### 断点地址每次变化

通常是 PIE 或 ASLR 导致。使用符号断点，或者在进程启动后根据当前映射计算“模块基址 + 静态偏移”。不要把一次运行的绝对地址硬编码到所有调试脚本。

### 找不到 `main` 或函数名

目标可能已被 strip。可以使用：

```gdb
starti
info file
info functions
info proc mappings
```

再结合 `readelf`、`objdump`、Radare2、IDA 或 Ghidra 确定入口和函数偏移。

### 插件安装后没有加载

使用以下方式分层排查：

```bash
gdb -nx -q
gdb -q
```

然后检查 `~/.gdbinit` 中的 `source` 路径、GDB 内置 Python 版本、插件要求和安装日志。不要同时加载 Pwndbg、GEF 和 PEDA。

### Pwntools 没有打开 GDB 窗口

检查：

- `gdb` 和 `gdbserver` 是否已安装。
- `context.terminal` 是否适合当前桌面、tmux 或 WSL 环境。
- 脚本是否运行在无图形终端的容器中。
- 当前进程是否允许被附加。

无法打开新窗口时，可以先把输入保存为文件，再用 `gdb -x debug.gdb ./chall` 手工复现。

## 调试脚本模板

将重复命令保存为 `debug.gdb`：

```gdb
set disassembly-flavor intel
set pagination off
set breakpoint pending on

break main
commands
    silent
    printf "stopped at main\n"
    info registers rsp rbp rip
    x/8gx $rsp
end

run < input.bin
```

启动：

```bash
gdb -q -x debug.gdb ./chall
```

提交或分享脚本前，应删除本机绝对路径、敏感输入和仅适用于一次随机地址布局的硬编码地址。

## 常用命令速查

| 场景 | 原生 GDB 命令 |
| --- | --- |
| 从 `main` 开始 | `start` |
| 从第一条指令开始 | `starti` |
| 使用输入文件运行 | `run < input.bin` |
| 设置函数断点 | `break vuln` |
| 设置地址断点 | `break *0x401000` |
| 继续运行 | `continue` |
| 指令单步进入 | `stepi` |
| 指令单步越过 | `nexti` |
| 运行到函数返回 | `finish` |
| 查看寄存器 | `info registers` |
| 查看栈内存 | `x/16gx $rsp` |
| 查看当前指令 | `x/10i $rip` |
| 查看字符串 | `x/s <地址>` |
| 查看调用栈 | `backtrace` |
| 查看映射 | `info proc mappings` |
| 查看共享库 | `info sharedlibrary` |
| 设置观察点 | `watch *<地址>` |
| 捕获系统调用 | `catch syscall read` |
| 保存 Core | `generate-core-file snapshot.core` |
| 不加载插件启动 | `gdb -nx -q ./chall` |
| 退出 | `quit` |

## 推荐工作流

1. 使用 `file`、`readelf` 和 Checksec 确认架构、格式与保护。
2. 保存一份能稳定复现行为的原始输入。
3. 从 `main`、输入函数或关键分支设置少量断点。
4. 根据 ABI 检查参数寄存器、缓冲区和长度。
5. 崩溃后记录寄存器、当前指令、栈和内存映射。
6. 使用循环模式计算偏移，并再次运行验证结果。
7. 将已确认的断点和输入迁移到 GDB 脚本或 Pwntools。
8. 在接近题目环境的 libc、动态链接器和 ASLR 条件下重新验证。
9. 记录工具版本、文件哈希、模块偏移和已证实结论。

## 官方资源

- [GDB 官方手册](https://sourceware.org/gdb/current/onlinedocs/gdb.html){ target="_blank" rel="noopener" }
- [Pwndbg 文档](https://pwndbg.re/stable/){ target="_blank" rel="noopener" }
- [GEF 文档](https://hugsy.github.io/gef/){ target="_blank" rel="noopener" }
- [Pwntools GDB 文档](https://docs.pwntools.com/en/stable/gdb.html){ target="_blank" rel="noopener" }

GDB 和增强插件都在持续更新。命令行为与旧教程不一致时，应优先查看当前版本的 `help`、插件命令帮助和官方文档。
