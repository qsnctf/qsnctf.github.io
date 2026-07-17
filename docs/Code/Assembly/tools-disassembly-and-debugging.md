# 工具、反汇编与调试
静态工具回答“程序可能如何执行”，动态调试回答“这次运行实际如何执行”。可靠的二进制分析应让两者互相验证，而不是只相信反编译伪代码或某一次运行结果。
只分析自己编写、明确授权或课程提供的程序。对未知二进制，使用隔离环境，避免管理员权限、真实凭据和不必要的网络访问。调试会改变程序时序、地址布局和信号行为。
## 准备一个最小程序
示例 C 源码：
```c
#include <stdio.h>

static int max_int(int a, int b) {
    return a > b ? a : b;
}

int main(void) {
    printf("%d\n", max_int(7, 4));
    return 0;
}
```
适合学习的编译方式：
```bash
gcc -O0 -g -Wall -Wextra demo.c -o demo
gcc -O2 -g -Wall -Wextra demo.c -o demo-o2
```
- `-O0` 便于观察直观数据流，`-O2` 展示真实优化，`-g` 加入调试信息但不阻止优化。
比较两个版本比只学习固定函数序言更有价值。
## file：快速识别文件
```bash
file demo
```
关注：
- ELF 32/64 位
- x86-64 或其他架构
- 动态链接还是静态链接
- 是否带调试信息
- 是否 stripped
位数、架构或格式判断错误，会导致后续反汇编和 ABI 分析全部偏离。
## readelf：检查 ELF 元数据
```bash
readelf -h demo       # ELF 头
readelf -l demo       # 程序头/加载段
readelf -S demo       # 节表
readelf -s demo       # 符号表
readelf -r demo       # 重定位
readelf -d demo       # 动态链接信息
```
重点关注入口、`LOAD` 段权限、`.dynsym` 动态符号、可能被 strip 删除的 `.symtab`，以及 `NEEDED` 共享库依赖。
## objdump：反汇编和节内容
使用 Intel 语法反汇编：
```bash
objdump -d -M intel demo
objdump -d -M intel --disassemble=max_int demo
```
混合源码与汇编（需要调试信息）：
```bash
objdump -S -M intel demo
```
查看节原始数据：
```bash
objdump -s -j .rodata demo
```
`objdump -d` 主要按可执行节和符号反汇编；`-D` 更激进地反汇编所有节，容易把数据误当代码，不能无条件使用其结果。
`nm -C` 可显示并解码 C++ 符号，`strings -a` 可扫描可打印字节；两者提供的是线索，不是完整行为证明。对不可信文件应优先用 `readelf -d` 静态查看依赖，而不是直接运行相关程序。
## GDB 基础启动
```bash
gdb -q ./demo
```
推荐先设置 Intel 语法：
```gdb
set disassembly-flavor intel
set pagination off
```
常用启动方式：
```gdb
start             # 在 main 附近停下
run               # 从头运行
run < input.txt   # 重定向标准输入
set args one two  # 设置参数
```
若二进制没有 `main` 符号，可在入口、已知地址或动态链接事件附近设置断点。
## 断点
```gdb
break main
break max_int
break *0x401150
info breakpoints
delete 2
disable 1
enable 1
```
地址断点在 PIE 和 ASLR 下可能随运行变化。优先使用符号或相对已加载模块基址的地址。
## 单步执行
源码级：
```gdb
step
next
```
指令级：
```gdb
stepi
nexti
```
- `stepi` 进入 `call` 的目标。
- `nexti` 通常把调用作为一条指令越过。
- `finish` 运行到当前函数返回。
- `continue` 运行到下一个断点或事件。
逆向中通常以指令级为准，因为源码行与优化指令并非一一对应。
## 查看寄存器和标志
```gdb
info registers
info registers rax rdi rsi rsp rbp rip
p/x $rax
p/d $eax
```
GDB 可通过 `$eflags` 或特定架构显示标志。更实用的方法是检查 `cmp/test` 操作数，并观察下一条条件跳转是否执行。
记录寄存器时应标明宽度：`eax` 的值不等于“只看 `rax` 低位就结束”，因为写入规则会影响高位。
## 查看内存
`x/NFU ADDRESS` 是 GDB 的通用内存查看命令：
- `N`：数量
- `F`：格式，如 `x` 十六进制、`d` 十进制、`i` 指令、`s` 字符串
- `U`：单位，如 `b` 字节、`h` 2 字节、`w` 4 字节、`g` 8 字节
```gdb
x/16bx $rsp
x/8gx $rsp
x/10i $rip
x/s $rdi
```
按字节和按整数查看同一地址，可帮助理解小端序。
## 反汇编与上下文
```gdb
disassemble main
disassemble /r main
x/8i $rip
display/i $pc
```
`/r` 显示指令原始字节，有助于确认指令边界。`display/i $pc` 会在每次停止时自动显示下一条指令。
分析条件分支时，先停在 `cmp/test` 前，单步一次，再验证跳转方向；不要只根据一次输入断言另一条路径不可达。
## 栈回溯与栈帧
```gdb
backtrace
frame 1
info frame
info args
info locals
```
回溯依赖帧指针或展开信息。以下情况可能导致结果不完整：
- 优化和尾调用
- stripped 或缺少展开信息
- 栈内存已经损坏
- 手写汇编没有正确描述展开规则
回溯是线索，应结合 `rsp`、返回地址所在映射和调用点验证。
## 观察点
`watch *(int *)address` 可在目标内存变化时停下，适合定位“谁修改了字段”或“何时首次越界写”。硬件观察点数量有限，宽度和对齐也受平台限制。
用 `info proc mappings` 和 `info sharedlibrary` 确认地址属于哪个模块、权限是什么。PIE 主程序和共享库通常会因 ASLR 在每次运行加载到不同基址。
## 崩溃分析
程序收到 `SIGSEGV` 等信号时，先保存现场：
```gdb
info registers
x/10i $rip
x/16gx $rsp
backtrace
```
然后判断：
1. 崩溃指令是在读、写还是取指？
2. 有效地址由哪些寄存器和偏移组成？
3. 地址是否为空、未映射、不可写或不可执行？
4. 寄存器错误值最早在哪里产生？
5. 是否存在更早的内存破坏，直到此处才表现？
崩溃点不一定是缺陷根因。
## IDA 基础工作流
IDA 擅长交互式反汇编和控制流浏览：
1. 确认处理器、位数和加载地址。
2. 查看 Imports、Exports、Strings 和 Functions。
3. 从入口或感兴趣的导入交叉引用开始。
4. 在 graph view 中识别分支和循环。
5. 重命名函数、参数和局部对象。
6. 给关键假设添加注释。
7. 使用反编译视图辅助理解，再回到汇编确认。
IDA 对函数边界和类型的识别可能出错。手工修正前应保留“这是推测”的意识。
## Ghidra 基础工作流
Ghidra 提供反汇编、反编译、符号和数据类型管理：
1. 创建项目并导入 ELF。
2. 运行 Auto Analyze，确认架构和分析选项。
3. 从 Symbol Tree、Defined Strings 和 Imports 导航。
4. 在 Listing 与 Decompiler 之间对照。
5. 使用交叉引用跟踪调用者和数据引用。
6. 重命名变量并逐步应用函数签名。
7. 对可疑类型回到具体加载、存储宽度验证。
反编译器可能把整数误判为指针、把数组误判为结构体，或错误合并变量。类型越精确，伪代码越好；错误类型也会传播得更远。
## 静态与动态证据
| 静态分析 | 动态分析 |
|---|---|
| 可覆盖未执行路径 | 只覆盖当前输入实际路径 |
| 不必运行目标 | 能看到真实寄存器和内存 |
| 易受间接跳转和混淆影响 | 易受反调试、环境和时序影响 |
| 适合建立全局结构 | 适合验证局部假设 |
推荐循环：静态提出假设，动态设计最小输入验证，再回到静态修正模型。
## 优化对反汇编的影响
优化器可能：
- 内联函数，使原函数不再有独立调用
- 删除未使用分支和变量
- 常量传播与折叠
- 用 `lea`、移位或乘法替代表达式
- 用 `cmov` 代替分支
- 合并共同尾部或执行尾调用优化
- 向量化循环
所以目标是恢复等价行为，而不是强迫汇编一行对应一行 C。
符号表可提供函数和全局对象名称；DWARF 还能描述源码行、类型和展开规则。stripped 文件可能删除这些信息，优化也会让变量因没有稳定存储位置而显示为 `<optimized out>`。
## Windows 工具差异
Windows x64 常见组合包括 PE/COFF、Visual Studio、WinDbg、IDA 和 Ghidra。分析时要切换到 Windows ABI：`rcx, rdx, r8, r9` 参数、32 字节 shadow space、不同的非易失寄存器和异常展开机制。`dumpbin`、WinDbg 和 PE 专用工具通常比 GNU 工具更贴合平台元数据。
## 可重复分析记录
记录文件哈希与来源、架构与格式、工具版本与命令、输入与断点，并把地址写成“模块 + 偏移”。明确区分已证实事实和待验证假设，避免 ASLR、重新编译或工具数据库变化导致结论无法复现。
## 工具检查表
开始分析前确认：
1. `file` 判断的架构和位数是什么？
2. ELF 是否 PIE、动态链接、strip？
3. 入口、段权限、符号、导入和字符串有哪些？
4. 反汇编显示的是 Intel 还是 AT&T 语法？
5. 当前地址是否因 ASLR 需要换算模块基址？
6. 反编译结论是否由具体指令和动态状态支持？
7. 实验是否在授权、隔离且可恢复的环境中？
下一篇把工具和汇编模式应用于安全分析：[面向 Reverse 与 Pwn 的汇编](assembly-for-reverse-and-pwn.md)。
