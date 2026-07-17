# 函数与调用约定
CPU 只知道转移控制流、读写寄存器和操作栈。所谓“函数参数”“返回值”和“局部变量”来自编译器与 ABI 的共同约定。理解调用约定，才能可靠地跨越 `call` 跟踪数据。
## 调用约定解决什么问题
调用者和被调函数必须对以下事项达成一致：
- 参数放在哪里
- 返回值放在哪里
- 哪些寄存器可被被调函数破坏
- 哪些寄存器必须恢复
- 栈如何对齐与清理
- 结构体、浮点数和可变参数如何传递
同一段机器指令若按错误 ABI 分析，参数含义和栈布局都会错位。
## call 与 ret
```asm
call target
```
`call` 把下一条指令地址压栈，再把控制流转到目标。函数通常以 `ret` 返回：
```asm
ret
```
`ret` 从 `[rsp]` 读取返回地址并增加 `rsp`。函数必须在返回前恢复约定要求的栈状态和非易失寄存器。
## System V 整数与指针参数
Linux、主流 BSD 和 macOS 的 x86-64 用户态通常基于 System V AMD64 ABI。前六个 INTEGER 类参数依次使用：
```text
rdi, rsi, rdx, rcx, r8, r9
```
后续参数通常通过栈传递。整数或指针返回值通常放在 `rax`，需要两个机器字时可能使用 `rax` 和 `rdx`。
例如：
```c
long add3(long a, long b, long c) {
    return a + b + c;
}
```
可能编译为：
```asm
add3:
    lea rax, [rdi+rsi]
    add rax, rdx
    ret
```
这个叶函数无需栈帧。
## 浮点与向量参数
`float`、`double` 和部分向量参数通常使用 `xmm0` 到 `xmm7`，返回值常在 `xmm0`。
```c
double add(double a, double b) {
    return a + b;
}
```
可能对应：
```asm
addsd xmm0, xmm1
ret
```
复杂结构体会按 ABI 的分类算法拆分或转为内存传递，不能只用“前六个寄存器”规则覆盖所有类型。
## caller-saved 与 callee-saved
System V 通用寄存器保存责任：
| 类别 | 寄存器 |
|---|---|
| caller-saved | `rax, rcx, rdx, rsi, rdi, r8-r11` |
| callee-saved | `rbx, rbp, r12-r15` |
| 特殊 | `rsp` 必须正确恢复 |
caller-saved 表示调用者若想在 `call` 后继续使用原值，必须自行保存。callee-saved 表示被调函数若修改它，必须先保存并在返回前恢复。
```asm
push rbx
mov rbx, rdi
call helper
mov rax, rbx
pop rbx
ret
```
这里函数通过栈履行对 `rbx` 的保存责任。
## 参数寄存器不是变量归属
进入函数时，`rdi` 可能是第一个参数；函数执行几条指令后，`rdi` 可以被覆盖。逆向时应记录值的流动，而不是给寄存器永久命名为 `arg1`。
优化编译器会：
- 把参数复制到 callee-saved 寄存器
- 直接把参数用于地址计算
- 让多个源码变量共享同一寄存器
- 消除完全不需要的变量
因此类型恢复必须结合所有使用点。
## 栈参数
第七个及更多 INTEGER 类参数通常位于栈上。函数入口时 `[rsp]` 是返回地址，因此第一个纯栈参数会位于更高地址。
若函数建立帧指针：
```asm
push rbp
mov rbp, rsp
```
那么返回地址通常在 `[rbp+8]`，较早的栈参数从 `[rbp+16]` 附近开始。实际布局还会受类型分类和对齐影响。
## 栈对齐规则
System V 要求调用者在执行 `call` 前正确安排 16 字节对齐。`call` 压入 8 字节返回地址，所以函数刚进入时 `rsp` 通常不是 16 的整数倍，而是差 8 字节。
示例：函数需要保存一个寄存器并调用其他函数时，可能额外调整栈：
```asm
push rbx        ; 改变 8 字节
sub rsp, 16     ; 局部空间并维持调用所需对齐
call helper
add rsp, 16
pop rbx
ret
```
具体数值必须从入口状态和所有 `push/sub` 共同计算，不能机械套模板。
## 帧指针与展开
`rbp` 传统上作为稳定帧指针：
```asm
push rbp
mov rbp, rsp
```
但 `-fomit-frame-pointer` 或优化构建会把 `rbp` 当普通 callee-saved 寄存器。现代 ELF 通常依靠 `.eh_frame` 等展开信息支持异常处理和栈回溯。
因此：
- 有 `push rbp; mov rbp,rsp` 常提示函数序言。
- 没有该模式不代表不是函数。
- 损坏的栈或缺失展开信息会降低 backtrace 可靠性。
## 局部变量与寄存器溢出
局部变量不一定在栈上。编译器优先把活跃值保存在寄存器；只有地址被取用、寄存器不足、需要跨调用保存或调试构建时，才更常出现栈槽。
“register spill” 是把暂时放不下的值写到栈中，之后再加载：
```asm
mov [rsp+8], rax
; 使用 rax 做别的工作
mov rax, [rsp+8]
```
不要把每个栈槽都当成源码中明确声明的局部变量。
## 结构体返回与隐藏参数
较小结构体可能拆分到 `rax/rdx` 或 XMM 寄存器返回。较大或分类不适合寄存器返回的结构体，调用者可能提供一块内存，并用隐藏指针参数告诉函数写到哪里。
反编译时看到一个“额外的第一个指针参数”，可能是：
- C++ 的 `this`
- 大对象返回缓冲区
- 闭包或上下文指针
- 真正的显式参数
需要根据写入行为和调用点综合判断。
## 可变参数函数
`printf` 等函数参数数量和类型由格式串决定。System V 调用可变参数函数时，`al` 用于指出使用了多少个向量参数寄存器。
常见代码：
```asm
lea rdi, [rip+.format]
mov esi, 42
xor eax, eax
call printf@PLT
```
`xor eax,eax` 不一定是在传递普通第三参数，而是满足可变参数 ABI 要求。格式串与实际参数类型不匹配会造成未定义行为和安全风险。
## PLT、GOT 与动态调用
位置无关 ELF 常通过 PLT/GOT 调用外部函数：
```asm
call puts@PLT
```
PLT 是过程链接跳板，GOT 保存运行时解析出的地址。首次调用可能进入动态链接器，后续调用通常更直接。
逆向时 `puts@plt` 仍可按 `puts` 的 ABI 分析参数；但要区分导入跳板、真实库实现和程序内部包装函数。
## 递归
递归调用与普通调用没有本质区别。每层调用拥有各自的返回地址和必要状态：
```c
long factorial(long n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```
反汇编中通常看到基线条件、参数递减、递归 `call` 和返回值乘法。过深递归会消耗线程栈。
## 尾调用
若函数最后只返回另一个函数的结果，编译器可能把 `call ...; ret` 优化为 `jmp ...`：
```asm
jmp target
```
目标函数直接复用当前调用者的返回地址。尾调用会使反汇编和回溯看起来像“少了一层”。
## Linux 系统调用不是 C ABI
Linux x86-64 `syscall` 约定：
```text
rax = 系统调用号
rdi, rsi, rdx, r10, r8, r9 = 最多六个参数
rax = 返回值或负错误码
```
`syscall` 会破坏 `rcx` 和 `r11`。普通函数第四参数在 `rcx`，系统调用第四参数在 `r10`，两者不可混淆。
## Windows x64 调用约定
Windows x64 的前四个整数或指针参数依次使用：
```text
rcx, rdx, r8, r9
```
前四个浮点参数根据位置使用 `xmm0-xmm3`。返回值通常位于 `rax` 或 `xmm0`。
调用者必须在栈上预留 32 字节 **shadow space**，即使被调函数不使用：
```asm
sub rsp, 40 ; 32 字节 shadow space + 8 字节对齐调整（常见情形）
call target
add rsp, 40
```
准确调整仍取决于当前 `rsp` 状态。
## Windows 非易失寄存器
Windows x64 常见非易失通用寄存器包括：
```text
rbx, rbp, rdi, rsi, rsp, r12-r15
```
与 System V 相比，Windows 把 `rdi`、`rsi` 也视为非易失；System V 则把它们作为参数和 caller-saved 寄存器。部分 XMM 寄存器的保存规则也不同。
Windows 没有 red zone，并依赖规范的函数序言、尾声及展开元数据支持结构化异常处理。
## C 与汇编对照方法
分析函数时建议：
1. 在入口记录 ABI 参数位置。
2. 标记对 callee-saved 寄存器的保存。
3. 计算局部栈空间和对齐。
4. 在每个 `call` 前重新解释参数寄存器。
5. 把 `rax/xmm0` 视为调用返回值候选。
6. 检查尾声是否恢复保存状态。
7. 到所有调用点验证推测出的函数原型。
## 常见误区
- 把 Linux System V 的 `rdi` 第一参数规则套到 Windows。
- 认为参数超过六个就一定是错误；它们可以合法地放在栈上。
- 认为 `rbp` 永远是帧指针。
- 忘记一次 `call` 可以破坏所有 caller-saved 寄存器。
- 把系统调用 ABI 与 C 函数 ABI 混用。
- 只看函数内部，不检查调用点传入的宽度和类型。
- 看到 `xor eax,eax` 就一律解释为普通清零，而忽略可变参数约定。
## 分析检查表
跨越一次调用时确认：
1. 当前平台和 ABI 是什么？
2. 每个参数属于整数、指针、浮点还是聚合类型？
3. 哪些寄存器在调用后仍可依赖？
4. 栈是否正确对齐，Windows 是否预留 shadow space？
5. 返回值位于哪里，宽度是多少？
6. 是否存在隐藏返回指针、`this` 或上下文参数？
7. 该调用是否经过 PLT、函数指针或尾调用？
下一篇用工具验证这些判断：[工具、反汇编与调试](tools-disassembly-and-debugging.md)。
