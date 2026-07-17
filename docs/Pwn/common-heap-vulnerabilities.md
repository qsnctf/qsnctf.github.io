# 常见堆漏洞与利用思路

堆漏洞的核心是动态对象的边界、所有权或生命周期被破坏。本文面向 CTF Pwn 初学者，按漏洞根因讲解常见问题、无害验证方式、影响原语和现代缓解。

!!! warning "仅限授权学习"
    本文只讨论本地示例、课程靶场和授权 CTF 中的分析方法。不提供真实目标、可直接复用的利用链、shellcode 或绕过步骤。堆利用技巧高度依赖 glibc 版本、编译选项和运行环境。

学习前建议先阅读[堆的概念](heap-concepts.md)。

## 从根因到影响

堆漏洞分析应分四步：

| 步骤 | 问题 | 产物 |
| --- | --- | --- |
| 根因 | 哪条语句违反边界或生命周期？ | 第一条错误访问 |
| 对象状态 | 被影响对象处于已分配、已释放还是未初始化？ | 状态图 |
| 影响原语 | 能否形成越界读、越界写、悬空引用、重复释放？ | 可验证能力 |
| 缓解条件 | glibc、ASLR、NX、RELRO、Safe-Linking 等如何影响？ | 版本化结论 |

不要从“程序崩溃”直接跳到“可以利用”。崩溃只是症状。

## Heap Overflow

Heap overflow 是写入超过堆对象用户区边界。

错误示例：

```c
#include <stdlib.h>
#include <string.h>

struct item {
    char name[16];
    int level;
};

int main(void) {
    struct item *a = malloc(sizeof *a);
    char input[64] = "AAAAAAAAAAAAAAAAAAAA";
    strcpy(a->name, input); /* intentional bug */
    free(a);
    return 0;
}
```

根因：`strcpy` 不知道目标容量。影响可能是：

- 覆盖同一对象后续字段。
- 覆盖相邻堆对象的用户数据。
- 覆盖分配器元数据并在后续 `free/malloc` 中触发检查。

无害验证：

```bash
gcc -O0 -g -fsanitize=address demo.c -o demo
./demo
```

GDB 中可观察对象边界：

```gdb
break strcpy
run
info registers rdi rsi
x/32bx $rdi
```

CTF 中的高层影响原语可能是“相邻对象字段改写”或“受限堆写”。是否能进一步影响控制流取决于对象布局、保护机制和版本细节。

## Off-by-one 与 Off-by-null

off-by-one 指恰好多写 1 字节。off-by-null 是多写的那个字节是 `\0`。

常见根因：

```c
for (size_t i = 0; i <= len; ++i) {
    dst[i] = src[i];
}
```

如果 `dst` 容量为 `len`，最后一次访问越界。

影响：

- 改变相邻对象的第一个字节。
- 破坏字符串终止边界。
- 在特定旧版分配器布局中影响 chunk size 的低字节。

现代 glibc 对元数据一致性有更多检查。旧教程中基于单字节 size 改写的技巧通常有严格版本条件，不能当作通用能力。

修复原则：

- 明确容量单位是字节还是元素。
- 为终止符单独预留空间。
- 用 `< capacity` 而不是 `<= capacity`。
- 复制后检查实际长度和返回值。

## Use After Free

UAF 指对象释放后仍被使用。

错误示例：

```c
#include <stdio.h>
#include <stdlib.h>

struct user {
    int id;
    char name[16];
};

int main(void) {
    struct user *u = malloc(sizeof *u);
    u->id = 7;
    free(u);
    printf("id=%d\n", u->id); /* intentional bug */
    return 0;
}
```

根因不是 `printf`，而是释放后仍保留并解引用旧指针。释放后地址可能：

- 尚未被复用，看似还能读到旧数据。
- 被同大小对象复用，读到新对象内容。
- 被分配器写入空闲链表信息。
- 被保护机制检测并终止。

无害验证：

```bash
gcc -O0 -g -fsanitize=address uaf.c -o uaf
./uaf
```

CTF 中常见高层影响：

- 信息泄露：读取已释放 chunk 中的新内容或分配器信息。
- 类型混淆：旧指针按旧结构解释新对象。
- 受限写：通过旧指针修改被复用对象字段。

修复：释放后使拥有者进入不可用状态，并清理所有拥有者引用。仅把一个局部指针设为 `NULL` 不能修复其他别名。

## Double Free

double free 指同一动态对象被释放两次。

错误示例：

```c
char *p = malloc(32);
free(p);
free(p); /* intentional bug */
```

现代 glibc 通常会检测许多简单重复释放并终止，例如 tcache double free 检查。但不要依赖崩溃作为安全策略：根因仍是所有权状态错误。

常见来源：

- 两条错误路径都执行清理。
- 所有权转移后原所有者仍释放。
- 容器保存重复指针。
- `realloc` 失败处理混乱。

高层影响在旧版或特定布局中可能表现为空闲链表重复项，进而影响后续分配返回位置。现代 glibc 的 tcache key、Safe-Linking 和一致性检查会改变可行性。

修复：明确唯一所有权，释放后更新状态，错误路径使用统一清理出口。

## Invalid Free

invalid free 指传给 `free` 的不是当前分配器返回且仍有效的用户区指针。

示例：

```c
char stack_buf[32];
free(stack_buf); /* intentional bug */
```

其他形式：

- 释放栈地址。
- 释放全局区地址。
- 释放 chunk 中间地址。
- 释放已经移动或失效的旧指针。
- 用 `delete` 释放 `malloc` 得到的内存，或反过来。

glibc 通常会检测并终止，但检测点可能晚于根因。分析时应找到指针来源，而不是只看 `free` 崩溃。

## 整数溢出导致小分配

分配大小常由乘法生成：

```c
size_t bytes = count * sizeof(struct item);
struct item *items = malloc(bytes);
```

若乘法回绕，实际分配可能小于后续写入需求。

安全检查：

```c
if (count > SIZE_MAX / sizeof(struct item)) {
    return -1;
}
```

还要检查加法：

```c
if (len > SIZE_MAX - 1) {
    return -1;
}
char *s = malloc(len + 1);
```

CTF 中这类问题常把“看似安全的边界检查”转化为“小分配 + 大写入”。防御分析应核对分配大小和循环边界是否使用同一语义。

## 越界读与信息泄露

堆越界读不会直接写内存，但可能泄露：

- 相邻对象内容。
- 指针值。
- libc 或 heap 地址。
- 未初始化数据。

示例：

```c
char *buf = malloc(16);
read(0, buf, 16);
printf("%s\n", buf); /* may read past object if no NUL */
```

根因：把二进制数据当 C 字符串输出，且没有保证终止符。

ASLR 和 PIE 依赖地址不可预测。信息泄露可能削弱它们，但是否足够还要看泄露内容、解析宽度和远程环境一致性。

## 未初始化堆数据

`malloc` 不清零。如果程序读取未初始化字段，可能使用旧数据或分配器残留内容。

```c
struct item {
    int enabled;
    char name[16];
};

struct item *it = malloc(sizeof *it);
if (it->enabled) { /* intentional bug */
    puts("enabled");
}
```

修复：

- 使用 `calloc` 或显式初始化所有字段。
- 构造函数建立完整不变量。
- 不让部分初始化对象进入通用容器。

## 类型混淆

类型混淆常出现在程序用同一指针或索引访问不同结构，却没有可靠记录真实类型。

```c
struct user { int kind; char name[16]; };
struct note { int kind; void (*show)(void *); };
```

如果释放一个 `user` 后同地址复用为 `note`，旧指针仍按 `user` 解释新对象，就可能造成错误读写。反过来也可能影响函数指针、长度字段或索引。

修复：

- 使用明确的对象类型标签并验证。
- 避免释放后旧句柄继续可用。
- C++ 中用 RAII 和类型安全容器管理对象。
- 对跨类型复用保持最小权限和清晰状态机。

## 常见“利用思路”的高层分类

在授权 CTF 中，堆漏洞常被转化为以下高层能力：

| 原语 | 含义 | 常见来源 |
| --- | --- | --- |
| 信息泄露 | 读出地址或敏感数据 | UAF 读、越界读、未初始化读 |
| 重叠对象 | 两个逻辑对象引用同一内存 | UAF、double free、分配器状态错误 |
| 受限写 | 能写某个对象字段或有限地址范围 | heap overflow、UAF 写 |
| 任意大小分配影响 | 控制后续 `malloc` 返回位置的高层目标 | 特定版本分配器技巧 |
| 控制数据破坏 | 影响函数指针、虚表、回调或索引 | 对象字段覆盖、类型混淆 |

文档和题解应写清“能力从何而来”，而不是只写最终效果。

## 历史技巧与版本相关性

以下术语常见于 CTF，但都强依赖版本和条件：

| 术语 | 高层含义 | 版本与条件提示 |
| --- | --- | --- |
| tcache poisoning | 影响 tcache 链表，使后续分配指向目标附近 | 受 tcache key、Safe-Linking、对齐和地址泄露影响 |
| fastbin dup | 通过重复释放影响 fastbin 返回顺序 | 受 double free 检查和大小类约束影响 |
| unsafe unlink | 旧版双向链表解除链接造成写原语 | 现代 glibc 有严格 unlink 检查 |
| House 系列 | 利用分配器边界条件的题型家族 | 多为特定版本、特定布局、特定保护组合 |
| hook 改写 | 改写 malloc/free 相关 hook | 新版 glibc 已移除常见 malloc hooks |

学习这些术语时，应把它们当作“历史和题型分类”，而不是跨版本通用步骤。真正分析时先确认 glibc 版本、保护机制、分配路径和可控输入。

## 现代缓解

常见缓解包括：

- ASLR：随机化 heap、libc、栈等地址。
- PIE：主程序基址随机化。
- NX：堆页通常不可执行。
- RELRO：限制 GOT 等重定位结构被运行期改写。
- Safe-Linking：保护 tcache/fastbin 等单链表指针表示。
- tcache key：检测部分重复释放。
- 分配器一致性检查：检测链表、大小和边界异常。
- Sanitizer：开发测试阶段更早发现错误。

缓解降低错误后果，不消除根因。修复仍应回到边界、所有权和生命周期。

## 分析流程

1. 确认二进制架构、保护和 libc 版本。
2. 记录所有 `malloc/calloc/realloc/free` 调用点。
3. 给每类对象画状态机和所有者关系。
4. 找到第一条越界访问或生命周期错误。
5. 用 ASan 或 GDB 在本地做无害复现。
6. 判断影响的是用户数据、分配器元数据还是控制数据。
7. 识别是否需要地址泄露，以及泄露是否真实可靠。
8. 检查 tcache、Safe-Linking 和版本相关检查。
9. 写出修复方案和回归测试。

## 修复原则

- 分配前检查所有加法、乘法和类型转换。
- 使用真实对象容量限制复制和读取。
- 释放后让拥有者进入不可用状态。
- 避免多个拥有者同时释放同一对象。
- 初始化所有字段后再暴露对象。
- 将类型标签、长度字段和指针状态一起校验。
- C++ 优先 RAII、容器和智能指针。
- 在测试中启用 ASan、UBSan、模糊测试和编译器警告。

## 练习建议

1. 编写只分配和释放两个对象的程序，观察 tcache 复用。
2. 用 ASan 验证 UAF、double free 和 heap overflow 的诊断信息。
3. 修改同一程序的 glibc 版本或容器镜像，比较错误表现。
4. 在 Pwndbg 中观察 `heap`、`bins`、`tcachebins` 输出与原始内存。
5. 对每个崩溃写出“根因、对象状态、影响范围、修复方式”。

## 小结

堆漏洞的核心不是记忆某个 bin 的技巧，而是精确描述对象生命周期和分配器状态。先证明根因，再讨论影响原语和版本条件，最后回到修复和回归测试。
