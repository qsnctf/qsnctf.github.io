# 指令、寻址与控制流
x86-64 指令数量很多，但编译器输出主要由少数模式反复组合：传送数据、计算地址、运算、比较、跳转、调用和返回。阅读时应关注数据流和状态变化，而不是孤立背诵助记符。
## Intel 语法基础
多数双操作数指令写作：
```asm
指令 目的操作数, 源操作数
```
例如：
```asm
mov rax, rbx ; rax = rbx，rbx 不变
add rax, 8   ; rax = rax + 8
```
常见操作数类型：
- 寄存器：`rax`
- 立即数：`42`、`0x2a`
- 内存：`[rbp-8]`
- 隐式操作数：某些乘除法、字符串和栈指令固定使用特定寄存器
x86 通常不允许普通 `mov` 同时以两个内存位置作为操作数，需要先经过寄存器。
## mov 与扩展
`mov` 复制指定宽度的位：
```asm
mov eax, 7
mov rdx, rax
mov byte ptr [rdi], dl
```
处理窄数据时常见：
```asm
movzx eax, byte ptr [rdi] ; 零扩展
movsx eax, byte ptr [rdi] ; 符号扩展
movsxd rax, eax           ; 32 -> 64 位符号扩展
```
`mov` 不设置算术标志位。读取内存的宽度由目标寄存器或显式大小决定。
## lea：计算有效地址
`lea` 使用内存寻址表达式做算术，但不访问内存：
```asm
lea rax, [rdi+rdi*2] ; rax = rdi * 3
lea rdx, [rbp-32]    ; rdx = rbp - 32
```
它常用于：
- 取得局部变量或全局对象地址
- 计算数组元素地址
- 高效完成若干乘加运算
- 生成位置无关地址
不要把 `lea rax, [rbx]` 解释为读取 `[rbx]`，结果只是 `rax = rbx`。
## x86-64 寻址形式
一般有效地址形式为：
```text
base + index * scale + displacement
```
- `base`：基址寄存器
- `index`：索引寄存器
- `scale`：1、2、4 或 8
- `displacement`：常量偏移
```asm
mov eax, [rbx+rcx*4+8]
```
若 `rbx=0x1000`、`rcx=3`，有效地址是 `0x1000 + 3*4 + 8 = 0x1014`，随后读取 4 字节到 `eax`。
方括号表达式生成地址，实际读写宽度仍由指令决定。
## 算术指令
常见整数算术：
```asm
add rax, rbx
sub rsp, 32
inc ecx
dec edx
neg eax
```
`add/sub` 会更新主要状态标志。`inc/dec` 不修改 `CF`，因此与加减 1 并非在所有上下文完全等价。
`neg eax` 计算 `0 - eax`。操作数非零时通常设置 `CF`。
## 乘除法
常见双操作数 `imul`：
```asm
imul eax, ecx       ; eax = eax * ecx，保留低 32 位
imul eax, ecx, 10   ; eax = ecx * 10
```
单操作数 `mul/imul` 使用隐式累加器，生成 `rdx:rax` 双倍宽度结果。`div` 是无符号除法，`idiv` 是有符号除法，64 位形式以 `rdx:rax` 作为被除数：
```asm
xor edx, edx ; 无符号除法前把高半部分清零
div rcx      ; rax=商，rdx=余数
```
有符号除法前常用 `cqo` 把 `rax` 符号扩展到 `rdx:rax`。除数为零或商超出目标宽度会触发异常。
## 位运算与移位
```asm
and eax, 0xff
or eax, 1
xor edx, edx
not rax
shl eax, 3
shr eax, 1
sar eax, 1
```
- `shl` 左移，低位补 0。
- `shr` 逻辑右移，高位补 0。
- `sar` 算术右移，复制符号位。
- 可变移位计数通常放在 `cl`。
移位计数和 C 中负数除法的舍入语义需要谨慎对应，编译器可能增加修正指令。
## 标志寄存器
算术、逻辑和比较指令会修改 `rflags` 中部分位：
| 标志 | 含义 |
|---|---|
| `ZF` | 结果是否为 0 |
| `SF` | 结果最高位，即符号位 |
| `CF` | 无符号进位或借位 |
| `OF` | 有符号溢出 |
| `PF` | 低字节中 1 的数量是否为偶数 |
标志通常被紧随其后的条件跳转、`setcc` 或 `cmovcc` 消费。中间若出现会改标志的指令，前一次比较结果就可能失效。
## cmp 与 test
`cmp a, b` 计算 `a-b` 并只更新标志，不保存结果：
```asm
cmp edi, 10
je equal_to_ten
```
`test a, b` 计算按位与并只更新标志：
```asm
test rax, rax
jz is_zero
```
`test reg, reg` 常用于检查零值，不会改变寄存器。
## 条件跳转
相等判断主要看 `ZF`：
| 指令 | 条件 |
|---|---|
| `je` / `jz` | `ZF=1` |
| `jne` / `jnz` | `ZF=0` |
无符号比较主要使用 `CF` 和 `ZF`：
| 指令 | 含义（在 `cmp a,b` 后） |
|---|---|
| `ja` | `a > b` |
| `jae` | `a >= b` |
| `jb` | `a < b` |
| `jbe` | `a <= b` |
有符号比较结合 `SF` 与 `OF`：
| 指令 | 含义（在 `cmp a,b` 后） |
|---|---|
| `jg` | `a > b` |
| `jge` | `a >= b` |
| `jl` | `a < b` |
| `jle` | `a <= b` |
同一位模式在有符号和无符号解释下排序可能不同，因此必须从变量来源和扩展方式判断语义。
## 无条件跳转与间接跳转
```asm
jmp .loop       ; 直接跳转到已编码目标
jmp rax         ; 目标来自寄存器
jmp [rip+table] ; 目标来自内存
```
间接跳转常见于函数指针、虚函数、尾调用和 `switch` 跳转表，也是控制流分析的难点。目标必须结合数据流和运行状态确定。
## setcc 与 cmovcc
`setcc` 按条件把一个字节写为 0 或 1：
```asm
cmp edi, esi
setl al
movzx eax, al
```
这常对应：
```c
return a < b;
```
`cmovcc` 条件成立时复制值，避免短分支：
```asm
cmp edi, esi
mov eax, esi
cmovg eax, edi ; 有符号条件下取较大值
```
## 循环对照
```c
for (int i = 0; i < n; i++)
    sum += a[i];
```
可能抽象为：
```asm
xor ecx, ecx       ; i = 0
xor eax, eax       ; sum = 0
.loop:
cmp ecx, esi
jge .done
add eax, [rdi+rcx*4]
inc ecx
jmp .loop
.done:
```
识别循环时寻找回边、循环变量更新、边界比较和循环体内不变量。
## switch 与跳转表
连续 case 较多时，编译器可能：
1. 把输入减去最小 case 值。
2. 做无符号范围检查。
3. 用输入索引跳转表。
4. 间接跳转到对应代码块。
伪反汇编示意：
```asm
sub edi, 3
cmp edi, 5
ja .default
lea rax, [rip+.table]
movsxd rdx, dword ptr [rax+rdi*4]
add rax, rdx
jmp rax
```
表项可能是相对偏移而不是绝对地址，具体取决于编译器和位置无关代码。
## call、ret 与尾调用
```asm
call function ; 压入返回地址并转移
ret           ; 从栈取回返回地址
```
若函数完成自身工作后直接 `jmp other_function`，可能是尾调用优化。此时不会创建新的返回地址，调用栈在调试器中可能不同于源码直觉。
`nop` 常用于对齐，`int3` 用于软件断点，`lock` 可让部分读改写指令具有原子性。Linux `syscall` 的参数为 `rdi, rsi, rdx, r10, r8, r9`，与普通 C 函数 ABI 不同。
阅读复杂函数时，应按跳转目标与分支结尾切分基本块，再把它们组成控制流图，而不是只做逐行翻译。
## 分析检查表
分析指令序列时依次确认：
1. 每条指令读什么、写什么、宽度多大？
2. 是否访问内存，最终地址如何计算？
3. 哪条指令最后设置了当前条件使用的标志？
4. 比较语义是有符号还是无符号？
5. 跳转是直接还是间接，目标如何得到？
6. 是否可能是编译器优化后的 `cmov`、尾调用或跳转表？
7. 是否能用等价 C 伪代码概括，而不过度猜测类型？
下一篇进入跨函数的数据流：[函数与调用约定](functions-and-calling-conventions.md)。
