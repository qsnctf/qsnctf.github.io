# Pwntools 使用指南

## 工具简介

Pwntools 是一个面向 CTF 和二进制安全研究的 Python 第三方库。它把本地进程、TCP 连接、SSH 会话和 GDB 调试统一为相近的 I/O 接口，并提供 ELF 解析、整数与字节转换、循环模式、汇编和 ROP 辅助等功能。

Pwntools 最适合解决以下工程问题：

- 使用同一份脚本切换本地进程和远程题目服务。
- 稳定地接收提示、发送二进制数据并处理超时。
- 从 ELF 中读取符号、节区、GOT 和 PLT 等元数据。
- 按目标架构和字节序打包、解包整数。
- 生成循环模式并定位崩溃偏移。
- 将重复的 GDB 断点和运行参数写入调试脚本。
- 记录关键地址、输入输出和运行阶段，缩短调试循环。

Pwntools 不会代替漏洞分析。脚本能够发送数据，不代表数据结构正确；能够读取符号，也不代表地址在 PIE、ASLR 或远程环境中保持不变。

!!! warning "使用范围"
    本文仅面向 CTF、课程实验、本地靶场和经过明确授权的安全测试。不要将脚本连接到未经授权的系统。远程地址、凭据和比赛令牌不应硬编码后提交到公开仓库。

## 安装 Pwntools

Pwntools 主要面向 Linux。Windows 用户学习 Linux Pwn 时，建议在 Linux 虚拟机或 WSL 2 中安装；涉及特定内核、glibc、32 位程序或容器环境时，Linux 虚拟机通常更容易复现题目环境。

### 安装系统依赖

Debian、Ubuntu 和 Kali 可以先安装常用依赖：

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv python3-dev \
    build-essential git libssl-dev libffi-dev
```

如果需要使用 `gdb.debug()`，还应安装：

```bash
sudo apt install gdb gdbserver
```

不同发行版的软件包名称可能不同，应以当前 Pwntools 官方安装说明和发行版仓库为准。

### 使用虚拟环境

推荐为 CTF 工具创建独立虚拟环境：

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install pwntools
```

退出虚拟环境：

```bash
deactivate
```

虚拟环境可以减少系统 Python、其他项目依赖和 Pwntools 版本之间的冲突。

### 验证安装

```bash
python -c "import pwnlib; print(pwnlib.__version__)"
pwn version
```

简单测试：

```python
from pwn import context, p64, u64

context.arch = "amd64"
value = 0x12345678
assert u64(p64(value)) == value
print("pwntools is ready")
```

### 记录依赖版本

为了复现比赛环境，可以记录当前版本：

```bash
python --version
python -m pip show pwntools
python -m pip freeze > requirements.txt
```

不要盲目在所有项目中复用完整的 `pip freeze`。更长期的项目应只记录实际依赖，并测试升级后的行为。

## 导入方式与脚本结构

Pwntools 教程中常见：

```python
from pwn import *
```

这种方式适合短小的比赛脚本，但会向当前命名空间导入大量名称。规模较大的脚本可以显式导入：

```python
from pwn import ELF, args, context, log, process, remote
```

一个推荐的基础结构如下：

```python
#!/usr/bin/env python3
from pwn import *

context.binary = elf = ELF("./chall", checksec=False)
context.log_level = "info"

HOST = args.HOST or "127.0.0.1"
PORT = int(args.PORT or 31337)


def start():
    if args.REMOTE:
        return remote(HOST, PORT, timeout=5)
    return process([elf.path])


def main():
    io = start()
    try:
        io.sendlineafter(b"> ", b"1")
        reply = io.recvline(timeout=3)
        log.info("reply: %r", reply)
    finally:
        io.close()


if __name__ == "__main__":
    main()
```

本地运行：

```bash
python3 solve.py
```

连接明确授权的题目服务：

```bash
python3 solve.py REMOTE HOST=challenge.example.test PORT=31337
```

`example.test` 是保留域名，仅用于文档示例。

## Context：统一目标环境

`context` 保存架构、位数、字节序、操作系统、日志级别和终端配置等全局信息。

### 从 ELF 自动设置

```python
from pwn import *

context.binary = elf = ELF("./chall", checksec=False)
print(context.arch)
print(context.bits)
print(context.endian)
```

将 `context.binary` 设置为 ELF 对象，可以让打包、汇编和部分辅助功能自动采用目标属性。

### 手动指定

没有 ELF 文件时可以手动设置：

```python
from pwn import context

context.update(
    arch="amd64",
    bits=64,
    endian="little",
    os="linux",
)
```

常见架构名称包括 `i386`、`amd64`、`arm`、`aarch64`、`mips` 和 `riscv64`。具体支持情况取决于当前 Pwntools 和外部工具链。

### 临时 Context

需要短暂切换架构时，使用局部上下文，避免污染整个脚本：

```python
from pwn import context, p32

with context.local(arch="i386", bits=32, endian="little"):
    raw = p32(0x12345678)
```

### 日志级别

```python
context.log_level = "debug"
```

常见级别包括 `debug`、`info`、`warning` 和 `error`。`debug` 会显示大量收发数据，适合排查协议不同步；日志可能包含 flag、地址、令牌或输入内容，分享前必须检查。

## Bytes：Pwn 脚本的基础

Pwntools 的 Tube 和打包函数主要处理 `bytes`。Python 3 的 `str` 是 Unicode 文本，两者不能随意混用。

```python
prompt = b"> "
choice = b"1"
name = "测试".encode("utf-8")
```

接收数据通常也是 `bytes`：

```python
line = io.recvline()
print(repr(line))
print(line.hex())
```

只有确认编码后再解码：

```python
text = line.decode("utf-8", errors="strict")
```

!!! caution
    不要为了消除警告而对所有值使用 `str()` 或 `.decode(errors="ignore")`。这可能丢失空字节、非 UTF-8 字节和协议边界，掩盖真正的问题。

## Tube：统一的 I/O 接口

Pwntools 将本地进程、TCP 连接、SSH 通道等抽象为 Tube。它们共享大部分 `send`、`recv` 和 `interactive` 方法。

### 启动本地进程

```python
from pwn import process

io = process(["./chall", "arg1"])
io.sendline(b"hello")
print(io.recvline(timeout=2))
io.close()
```

需要指定工作目录或环境变量时：

```python
io = process(
    ["./chall"],
    cwd="./runtime",
    env={"LANG": "C", "MODE": "test"},
)
```

传入 `env` 时要确认是否需要保留原环境。环境变量会改变动态链接、区域设置、缓冲和程序逻辑，调试记录中应注明差异。

### 连接远程服务

```python
from pwn import remote

io = remote("challenge.example.test", 31337, timeout=5)
io.sendline(b"hello")
reply = io.recvline(timeout=3)
io.close()
```

远程连接必须设置合理超时，并只连接比赛或测试明确授权的地址。

### 常用接收方法

```python
data = io.recv(4096, timeout=2)
line = io.recvline(timeout=2)
block = io.recvn(16, timeout=2)
menu = io.recvuntil(b"> ", timeout=2)
rest = io.recvall(timeout=2)
```

| 方法 | 行为 |
| --- | --- |
| `recv(n)` | 最多接收 `n` 字节，有数据即可返回 |
| `recvn(n)` | 等待恰好 `n` 字节 |
| `recvline()` | 接收到换行符为止 |
| `recvuntil(marker)` | 接收到指定标记为止 |
| `recvall()` | 接收到 EOF，并关闭 Tube |

TCP 是字节流。一次 `recv()` 不保证得到完整消息；需要固定长度时使用 `recvn()`，需要分隔符时使用 `recvuntil()` 或 `recvline()`。

### 常用发送方法

```python
io.send(b"ABC")
io.sendline(b"ABC")
io.sendafter(b"name: ", b"guest")
io.sendlineafter(b"choice: ", b"1")
```

- `sendline()` 会自动追加 Tube 当前的换行符，默认是 `b"\n"`。
- `sendafter()` 等待标记后发送，不追加换行。
- `sendlineafter()` 等待标记后发送，并追加换行。

服务需要固定长度或允许空字节时，应明确使用 `send()`，不要无意添加换行。

### 超时与 EOF

超时和连接关闭是两种不同情况：

- 接收超时通常返回空字节串，并将已有数据保留在缓冲区，具体行为取决于方法。
- 对端关闭且缓冲区无可返回数据时，通常抛出 `EOFError`。

```python
try:
    line = io.recvline(timeout=2)
    if not line:
        log.warning("no complete line before timeout")
except EOFError:
    log.failure("connection closed")
```

不要使用无限等待掩盖协议不同步。调试阶段可以打开 `context.log_level = "debug"`，检查脚本究竟收到了哪些字节。

### 交互模式

```python
io.interactive()
```

`interactive()` 将当前终端与 Tube 连接，适合在自动化步骤完成后手工交互。进入交互模式前，应确认脚本已经消费了预期提示，否则残留数据可能让终端显示混乱。

### 使用上下文管理器

```python
from pwn import process

with process(["./chall"]) as io:
    io.sendline(b"test")
    print(io.recvline(timeout=2))
```

离开 `with` 块时 Tube 会被关闭，适合短小、确定会结束的测试。

## 菜单交互的可靠写法

为重复操作封装小函数：

```python
def choose(io, number: int) -> None:
    io.sendlineafter(b"> ", str(number).encode("ascii"))


def add_record(io, name: bytes) -> None:
    if len(name) > 64:
        raise ValueError("name is too long for this client")
    choose(io, 1)
    io.sendlineafter(b"name: ", name)
```

这种写法可以：

- 把协议标记集中管理。
- 在发送前验证长度和类型。
- 减少主逻辑中的重复代码。
- 更容易定位脚本在哪一步与服务失去同步。

如果服务提示会变化，不要随意使用过短标记，例如只等待 `b":"`。选择足够稳定且唯一的字节序列。

## 整数打包与解包

二进制程序通常需要固定宽度、明确字节序的整数。

### 常用函数

```python
from pwn import p16, p32, p64, u16, u32, u64

raw32 = p32(0x12345678)
raw64 = p64(0x123456789ABCDEF0)

assert u32(raw32) == 0x12345678
assert u64(raw64) == 0x123456789ABCDEF0
```

默认宽度与字节序受 `context` 影响。为了让代码意图清晰，常见地址仍可以显式使用 `p64` 或 `p32`。

### 不足宽度的数据

`u64()` 需要恰好 8 字节。读取到较短泄漏时，应先确认截断规则，再进行填充：

```python
from pwn import u64

leak = b"\x10\x32\x54\x76\x7f\x00"
value = u64(leak.ljust(8, b"\x00"))
```

这段代码假定小端序并且缺失的是高位零字节。该假设必须来自目标架构和输出格式，不能机械套用。

### 通用函数

```python
from pwn import pack, unpack

raw = pack(0x1234, word_size=16, endianness="little")
value = unpack(raw, word_size=16, endianness="little")
```

处理非标准宽度或需要显式参数时，可以使用 `pack()` 和 `unpack()`。

## 构造结构化数据

### 使用 `flat`

`flat()` 会根据 Context 将整数打包，并拼接字节串：

```python
from pwn import flat

payload = flat(
    b"HEAD",
    0x1122334455667788,
    b"TAIL",
)
```

与手工连续 `+` 相比，`flat()` 更适合混合整数和字节数据，但仍应确认目标位数和字节序。

### 按偏移布局

```python
from pwn import flat

payload = flat(
    {
        0: b"MAGIC",
        16: b"DATA",
        32: 0x401000,
    },
    length=40,
    filler=b"A",
)
```

按偏移构造适合协议字段、文件结构和本地练习中的栈布局。字段重叠、总长度和默认填充都应显式检查：

```python
assert len(payload) == 40
```

## 循环模式与偏移定位

重复的 `b"A" * 200` 无法说明覆盖发生在第几个字节。Pwntools 的循环模式可以生成位置唯一的片段。

```python
from pwn import cyclic, cyclic_find

pattern = cyclic(300)
offset = cyclic_find(b"kaaa")
print(offset)
```

命令行也可以使用：

```bash
pwn cyclic 300 > pattern.bin
pwn cyclic -l kaaa
```

在 64 位程序中，崩溃后应根据 GDB 或 Corefile 中实际覆盖的字节计算偏移。不要假设 `$rip` 一定完整包含 8 字节循环模式；`ret` 失败时，相关数据可能仍位于 `$rsp` 指向的内存。

有关崩溃现场的检查顺序，参见 [GDB 在 Pwn 中的使用](GDB.md)。

## ELF：读取二进制元数据

`ELF` 类可以解析目标文件的架构、符号、节区、GOT 和 PLT 等信息。

```python
from pwn import ELF

elf = ELF("./chall", checksec=False)

print(elf.arch)
print(elf.bits)
print(elf.endian)
print(hex(elf.entry))
```

### 符号、GOT 和 PLT

```python
main_addr = elf.symbols.get("main")
puts_got = elf.got.get("puts")
puts_plt = elf.plt.get("puts")

print(main_addr, puts_got, puts_plt)
```

使用 `.get()` 可以在符号不存在时得到 `None`，便于给出明确错误：

```python
main_addr = elf.symbols.get("main")
if main_addr is None:
    raise RuntimeError("main symbol is unavailable")
```

被 strip 的文件可能没有 `main` 等普通符号，但动态导入相关信息仍可能存在。

### 搜索字节序列

```python
matches = list(elf.search(b"/bin/sh\x00"))
for address in matches:
    print(hex(address))
```

搜索结果只是文件映射中的候选地址。应确认所在节区、运行时权限和 PIE 基址，不能把第一个结果无条件当作有效运行时地址。

### 读取和写入 ELF 对象

```python
data = elf.read(elf.entry, 16)
print(data.hex())
```

`ELF.write()` 和 `elf.save()` 可以修改副本，但初学阶段应保留原文件并明确记录补丁。动态调试结论不要与已经修改过的文件混淆。

### PIE 与 `elf.address`

对于 PIE 文件，`elf.symbols` 中的值通常应理解为相对映像基址的地址。取得当前运行基址后，可以设置：

```python
elf.address = runtime_base
print(hex(elf.symbols["main"]))
```

`runtime_base` 必须来自当前进程的映射或有效信息泄漏。不要使用上一次运行的随机基址。

## 本地与远程切换

把启动逻辑集中在一个函数中：

```python
#!/usr/bin/env python3
from pwn import *

context.binary = elf = ELF("./chall", checksec=False)

HOST = args.HOST or "challenge.example.test"
PORT = int(args.PORT or 31337)


def start():
    if args.GDB:
        return gdb.debug(
            [elf.path],
            gdbscript="""
            break main
            continue
            """,
        )
    if args.REMOTE:
        return remote(HOST, PORT, timeout=5)
    return process([elf.path])


io = start()
```

使用方式：

```bash
python3 solve.py
python3 solve.py GDB
python3 solve.py REMOTE HOST=challenge.example.test PORT=31337
python3 solve.py DEBUG
```

Pwntools 会将没有值的命令行词作为布尔参数，例如 `args.GDB`；`HOST=...` 这样的形式则可以读取值。

!!! important
    本地、GDB 和远程三种模式应使用同一套协议函数，但不应假定它们具有相同地址、libc、动态链接器、环境变量、工作目录或 I/O 缓冲行为。

## 日志与阶段标记

Pwntools 提供统一日志：

```python
log.info("starting local process")
log.success("base = %#x", base)
log.warning("response was shorter than expected")
log.failure("failed to parse address")
```

地址适合使用 `%#x`，原始字节适合 `%r`：

```python
log.info("line: %r", line)
log.info("address: %#x", address)
```

耗时操作可以使用进度对象：

```python
with log.progress("waiting for local service") as progress:
    progress.status("connecting")
    # 执行有界、授权的操作
    progress.success("ready")
```

不要在日志中打印私钥、比赛令牌或不应共享的完整响应。

## Corefile：崩溃后自动检查

本地进程崩溃后，Pwntools 可以在系统允许生成 Core Dump 时读取现场：

```python
from pwn import *

context.binary = elf = ELF("./chall", checksec=False)
io = process([elf.path])
io.sendline(cyclic(300))
io.wait()

core = io.corefile
log.info("pc = %#x", core.pc)
log.info("sp = %#x", core.sp)
```

Core Dump 是否可用取决于 `ulimit`、systemd-coredump、容器配置和系统策略。脚本不应把“找不到 Core 文件”误判为程序没有崩溃。

在 x86-64 上，偏移数据可能位于栈顶：

```python
word = core.read(core.sp, 4)
offset = cyclic_find(word)
log.success("offset = %d", offset)
```

读取宽度和地址必须根据实际崩溃指令确定，不应机械使用固定模板。

## 与 GDB 联调

### 启动时调试

```python
from pwn import *

context.binary = elf = ELF("./chall", checksec=False)
context.terminal = ["tmux", "split-window", "-h"]

io = gdb.debug(
    [elf.path],
    gdbscript="""
    set disassembly-flavor intel
    break main
    continue
    """,
)
```

`gdb.debug()` 通常要求安装 `gdbserver`，并且 Pwntools 必须知道如何打开新终端。

### 附加到已有进程

```python
io = process([elf.path])

gdb.attach(
    io,
    gdbscript="""
    break main
    continue
    """,
)
```

开发完成后，可通过以下方式跳过附加：

```bash
python3 solve.py NOPTRACE
```

更完整的断点、PIE 和插件说明参见 [GDB 在 Pwn 中的使用](GDB.md)。

## 汇编与反汇编辅助

Pwntools 可以调用汇编器和反汇编器，适合检查少量本地实验指令：

```python
from pwn import asm, context, disasm

context.arch = "amd64"
machine_code = asm("xor eax, eax; ret")
print(machine_code.hex())
print(disasm(machine_code))
```

这些函数依赖匹配架构的 GNU Binutils。跨架构使用时，可能需要额外安装对应工具链。

`shellcraft` 可以生成架构相关的汇编模板，但生成结果仍需阅读、反汇编并在隔离的本地练习中验证。不要把自动生成代码当作无需审查的黑盒。

## ROP 辅助的正确定位

Pwntools 的 `ROP` 类可以从 ELF 中搜索 gadget、构造调用序列和序列化链。它是辅助工具，不会证明链满足真实程序状态、栈对齐、寄存器约束或远程库版本。

在本地 CTF 练习文件中，可以先查看可用接口：

```python
from pwn import ELF, ROP

elf = ELF("./chall", checksec=False)
rop = ROP(elf)

print(rop.dump())
```

构造前应确认：

- 使用的是题目对应的 ELF 和共享库。
- PIE 和共享库运行时基址已经正确设置。
- 偏移来自实际崩溃验证。
- 调用约定、参数寄存器和栈对齐正确。
- 每个 gadget 的副作用都已检查。
- 输入函数允许 payload 中出现的所有字节。

最终链应回到 GDB 中逐步验证，而不是只因为 `ROP` 对象成功生成就认为可以工作。

## 加载题目提供的 libc

如果题目提供了 libc，可以单独解析：

```python
from pwn import ELF

libc = ELF("./libc.so.6", checksec=False)
puts_offset = libc.symbols["puts"]
print(hex(puts_offset))
```

获得当前运行中某个 libc 符号的真实地址后，通常可以计算该次运行的基址：

```python
libc.address = leaked_puts - libc.symbols["puts"]
```

这个计算只有在以下条件同时成立时才有效：

- 泄漏确实对应当前加载 libc 的 `puts`。
- 本地解析的 libc 与目标使用的文件一致。
- 泄漏值被按正确宽度和字节序解析。
- 没有把 PLT、GOT 项地址或其他同名符号误作 libc 函数地址。

调试时还应核对动态链接器、符号版本和实际内存映射。

## SSH Tube

部分 CTF 提供专用 SSH 环境。Pwntools 可以在已授权的账户下启动远程进程：

```python
import os
from pwn import ssh

shell = ssh(
    host="shell.example.test",
    user="ctf-user",
    keyfile=os.environ.get("CTF_SSH_KEY"),
)

try:
    io = shell.process(["./chall"])
    io.sendline(b"test")
    print(io.recvline(timeout=3))
finally:
    shell.close()
```

不要把密码或私钥直接写入脚本。优先使用受权限保护的密钥文件、SSH Agent 或环境配置，并避免将环境文件提交到 Git。

## 一个可扩展的脚本模板

```python
#!/usr/bin/env python3
from pwn import *

context.binary = elf = ELF("./chall", checksec=False)
context.log_level = args.LOG_LEVEL or "info"

HOST = args.HOST or "challenge.example.test"
PORT = int(args.PORT or 31337)


def start():
    argv = [elf.path]

    if args.GDB:
        return gdb.debug(
            argv,
            gdbscript="""
            set disassembly-flavor intel
            break main
            continue
            """,
        )

    if args.REMOTE:
        return remote(HOST, PORT, timeout=5)

    return process(argv)


def choose(io, number: int) -> None:
    io.sendlineafter(b"> ", str(number).encode("ascii"))


def solve(io) -> None:
    choose(io, 1)
    banner = io.recvline(timeout=3)
    if not banner:
        raise TimeoutError("service did not return a banner")
    log.info("banner: %r", banner)


def main():
    io = start()
    try:
        solve(io)
        if args.INTERACTIVE:
            io.interactive()
    except EOFError:
        log.failure("target closed the connection")
        raise
    finally:
        io.close()


if __name__ == "__main__":
    main()
```

常用运行方式：

```bash
python3 solve.py
python3 solve.py GDB
python3 solve.py REMOTE HOST=challenge.example.test PORT=31337
python3 solve.py DEBUG
python3 solve.py REMOTE INTERACTIVE
```

## 常见问题

### `ModuleNotFoundError: No module named 'pwn'`

确认安装与运行使用同一个 Python：

```bash
which python
python -m pip show pwntools
python -c "import pwn; print(pwn.__file__)"
```

如果使用虚拟环境，先执行 `source .venv/bin/activate`。

### 安装时编译失败

检查：

- Python 开发头文件和编译工具是否安装。
- `pip`、`setuptools` 和 `wheel` 是否过旧。
- 当前 Python 版本是否被所安装的 Pwntools 版本支持。
- 是否混用了系统 Python、用户级安装和虚拟环境。

不要用 `sudo pip install` 覆盖发行版管理的系统 Python。

### 出现 `BytesWarning`

说明脚本把 `str` 传给了主要处理 `bytes` 的接口。将协议常量写成 `b"..."`，并在明确编码边界处使用 `.encode()` 或 `.decode()`。

### `recvuntil()` 一直等待

常见原因：

- 等待的标记与实际输出不完全一致。
- 前一步已经消费了部分标记。
- 程序等待输入，但脚本仍在等待输出。
- 本地使用 PTY，远程使用 Socket，缓冲行为不同。
- 程序崩溃或提前退出。

设置短超时并打开 `DEBUG` 日志，检查真实收发字节。

### 本地成功，远程失败

逐项核对：

- ELF、libc 和动态链接器版本。
- PIE、ASLR 和运行时基址。
- 架构、位数与字节序。
- 换行、菜单提示和输入长度。
- 启动参数、环境变量和工作目录。
- 网络延迟与超时。
- 本地是否在 GDB 下改变了地址随机化或信号行为。

### `gdb.debug()` 无法启动

检查 `gdbserver`、终端配置和调试权限：

```python
context.terminal = ["tmux", "split-window", "-h"]
```

没有图形终端或 tmux 时，可以先把输入保存到文件，再使用独立 GDB 会话调试。

### Corefile 不存在

检查：

```bash
ulimit -c
coredumpctl list
```

容器、安全策略和 systemd-coredump 都可能改变 Core 文件位置。参见 [GDB 在 Pwn 中的使用](GDB.md)。

## 使用习惯

- 从第一行开始明确 `context.binary`。
- 协议数据默认使用 `bytes`。
- 为所有网络交互设置超时。
- 将本地、GDB、远程启动逻辑集中在 `start()`。
- 将菜单动作封装为短函数，不复制粘贴收发代码。
- 使用 `%r` 记录原始字节，使用 `%#x` 记录地址。
- 对泄漏长度、地址范围和计算结果进行检查。
- 保存导致崩溃的原始输入，不只保留最终脚本。
- 记录 ELF、libc、动态链接器和依赖版本。
- 不在仓库中提交真实主机、密码、私钥或比赛令牌。
- 自动生成的 ROP、汇编和地址计算必须在 GDB 中验证。

## 常用功能速查

| 任务 | Pwntools 接口 |
| --- | --- |
| 启动本地进程 | `process(["./chall"])` |
| 连接远程服务 | `remote(host, port, timeout=5)` |
| 启动 GDB 调试 | `gdb.debug([...], gdbscript=...)` |
| 附加 GDB | `gdb.attach(io, gdbscript=...)` |
| 发送原始数据 | `io.send(data)` |
| 发送一行 | `io.sendline(data)` |
| 等提示后发送 | `io.sendlineafter(marker, data)` |
| 接收一行 | `io.recvline(timeout=...)` |
| 接收到标记 | `io.recvuntil(marker, timeout=...)` |
| 接收固定长度 | `io.recvn(size, timeout=...)` |
| 进入交互模式 | `io.interactive()` |
| 打包 64 位整数 | `p64(value)` |
| 解包 64 位整数 | `u64(data)` |
| 拼接结构化数据 | `flat(...)` |
| 生成循环模式 | `cyclic(length)` |
| 查找模式偏移 | `cyclic_find(fragment)` |
| 解析 ELF | `ELF(path)` |
| 搜索 ELF 字节 | `elf.search(data)` |
| 读取 Core | `io.corefile` |
| 汇编/反汇编 | `asm(...)` / `disasm(...)` |
| ROP 辅助 | `ROP(elf)` |
| 打开调试日志 | `python3 solve.py DEBUG` |

## 官方资源

- [Pwntools 官方文档](https://docs.pwntools.com/en/stable/){ target="_blank" rel="noopener" }
- [Pwntools GitHub 仓库](https://github.com/Gallopsled/pwntools){ target="_blank" rel="noopener" }
- [Tube 文档](https://docs.pwntools.com/en/stable/tubes.html){ target="_blank" rel="noopener" }
- [ELF 文档](https://docs.pwntools.com/en/stable/elf.html){ target="_blank" rel="noopener" }
- [GDB 集成文档](https://docs.pwntools.com/en/stable/gdb.html){ target="_blank" rel="noopener" }

Pwntools 更新后，参数和行为可能变化。遇到差异时，应优先查看当前环境中的 `help()`、安装版本对应的官方文档和实际调试日志。
