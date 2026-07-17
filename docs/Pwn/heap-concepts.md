# 堆的概念

堆是 Pwn 中理解动态对象生命周期、glibc 分配器行为和许多内存错误的基础。本文以 **Linux x86-64、ELF、glibc malloc** 为主要背景，介绍概念模型和调试观察方法。

!!! warning "学习范围"
    本文只用于 CTF、课程实验和自己编写的本地程序。堆分配器细节随 glibc 版本变化很大，不要把某个版本的调试现象直接套到真实系统或其他版本。

## 先区分四个层次

“堆”这个词在不同语境中含义不同。分析时先分清层次：

| 层次 | 关注对象 | 典型问题 |
| --- | --- | --- |
| C/C++ 语言 | 对象生命周期、所有权、指针有效性 | 这个对象是否还活着？谁负责释放？ |
| 系统调用与虚拟内存 | `brk`、`mmap`、页权限、映射范围 | 这块内存来自哪个映射？ |
| 分配器 | arena、chunk、bin、tcache | `malloc` 为什么返回这个地址？ |
| 程序逻辑 | 结构体、菜单项、缓存、回调 | 指针是否被错误复用？ |

Pwn 中的堆问题通常不是“堆本身危险”，而是程序没有维护好动态对象的边界、所有权和生命周期。

## 堆与栈的差异

| 项目 | 栈 | 堆 |
| --- | --- | --- |
| 管理方式 | 调用约定和编译器自动管理为主 | 程序通过分配器显式申请和释放 |
| 生命周期 | 通常随函数调用进入和返回 | 由 `malloc/free` 或对象所有者决定 |
| 常见内容 | 返回地址、保存寄存器、部分局部变量 | 动态数组、结构体、缓存、长期对象 |
| 多线程 | 每个线程通常有自己的栈 | 线程通常共享进程堆，但分配器会分 arena |
| 典型错误 | 栈溢出、返回悬空栈地址 | UAF、double free、heap overflow |

两者都是进程虚拟地址空间中的内存区域。越界、悬空指针和错误生命周期都可能发生在任一区域。

## C 语言中的动态内存

常用接口：

```c
void *malloc(size_t size);
void *calloc(size_t nmemb, size_t size);
void *realloc(void *ptr, size_t size);
void free(void *ptr);
```

基本规则：

- `malloc` 返回未初始化内存。
- `calloc` 会尝试分配 `nmemb * size` 字节，并将字节清零。
- `realloc` 可能原地扩展，也可能移动对象。
- `free` 释放后，原指针值不会自动失效或清零。
- `free(NULL)` 是安全的空操作。
- 重复释放同一仍被分配器认为已释放的指针是错误。

安全申请数组时要检查乘法：

```c
#include <stdint.h>
#include <stdlib.h>

int *make_items(size_t count) {
    if (count > SIZE_MAX / sizeof(int)) {
        return NULL;
    }
    return malloc(count * sizeof(int));
}
```

## C++ 中的所有权

C++ 中应优先使用 RAII：

```cpp
#include <memory>
#include <vector>

std::vector<int> items(100);
auto value = std::make_unique<int>(42);
```

CTF 附件常用 C 或不安全 C++ 写法。逆向时应从对象所有权角度提问：

1. 谁创建对象？
2. 谁保存指针？
3. 谁负责释放？
4. 释放后还有哪些别名？
5. 是否有长度字段与真实分配大小不一致？

## 堆从哪里来

glibc malloc 通常从操作系统获得较大内存区域，再在用户态切分成小块返回给程序。常见来源包括：

- `brk` / `sbrk` 扩展传统 heap 区域。
- `mmap` 创建独立映射，常用于较大分配。

在 GDB 中查看映射：

```gdb
info proc mappings
```

在 Linux 中查看进程映射：

```bash
cat /proc/<pid>/maps
```

看到 `[heap]` 只说明一段传统堆映射存在。大块分配、线程 arena 或其他分配器可能使用匿名 `mmap`，不一定都落在 `[heap]` 标签内。

## Chunk：分配器管理的基本单位

glibc malloc 返回给程序的是“用户区”指针，但分配器内部通常在用户区前后维护元数据。一个简化 chunk 概念如下：

```text
低地址
+------------------+
| prev_size        |  某些状态下使用
+------------------+
| size + 标志位    |  当前 chunk 大小和状态
+------------------+
| user data ...    |  malloc 返回的指针指向这里
+------------------+
高地址
```

这只是概念图。实际布局、标志位含义、空闲 chunk 链接字段和安全检查随 glibc 版本变化。

重要区别：

- 程序知道的是用户区大小和指针。
- 分配器管理的是包含元数据的 chunk。
- 越界写可能破坏相邻用户数据，也可能破坏分配器元数据。

## 对齐与大小类

分配器通常会把用户请求大小向上取整，以满足对齐和元数据需求。例如请求 13 字节，实际可用 chunk 大小可能被归入某个更大的大小类。

影响：

- 两个相近的请求大小可能返回同一大小类。
- `malloc_usable_size()` 可能大于请求值，但不应依赖额外空间写入业务数据。
- Pwn 调试时要区分“请求大小”“可用用户区”“chunk 总大小”。

## Arena

arena 是 glibc malloc 管理堆状态的结构。多线程程序中，glibc 可能创建多个 arena 以降低锁竞争。

初学阶段只需理解：

- 主线程常见 main arena。
- 多线程下不同线程可能使用不同 arena。
- 同一程序在不同运行时条件下，分配布局可能不同。
- 调试结论应记录线程、glibc 版本和分配顺序。

## Bin 与缓存的高层职责

glibc malloc 为不同状态和大小的空闲 chunk 使用不同结构。下面是高层概念，不是所有版本的完整实现。

| 结构 | 高层作用 | 初学关注点 |
| --- | --- | --- |
| tcache | 线程本地小块缓存 | 释放后的小块可能很快被同线程复用 |
| fastbin | 小块快速链表 | 旧版技巧常与重复释放相关 |
| smallbin | 固定大小空闲块 | 双向链表与一致性检查 |
| largebin | 较大空闲块 | 按大小组织，规则更复杂 |
| unsorted bin | 刚释放或拆分后的中转区 | 常用于观察释放后状态和主分配区信息 |

现代 glibc 对这些结构加入了大量检查和保护，例如 tcache key、Safe-Linking、链表一致性检查等。旧教程中的“直接改指针即可”的结论常常只适用于特定版本和特定编译环境。

## Tcache 的直观模型

tcache 是线程本地缓存。小块释放后，常先进入 tcache；后续相近大小的 `malloc` 可能直接从 tcache 返回。

一个最小观察程序：

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    void *a = malloc(0x30);
    void *b = malloc(0x30);
    printf("a=%p b=%p\n", a, b);
    free(a);
    void *c = malloc(0x30);
    printf("c=%p\n", c);
    free(b);
    free(c);
    return 0;
}
```

在很多 glibc 版本中，`c` 可能复用 `a` 的地址。复用地址不等于漏洞；漏洞来自程序在释放后仍然使用旧指针，或错误维护对象状态。

## Realloc 的特殊风险

`realloc` 失败时返回 `NULL`，原指针仍然有效：

```c
char *tmp = realloc(buf, new_size);
if (tmp == NULL) {
    /* buf 仍需由原所有者释放 */
    return -1;
}
buf = tmp;
```

错误写法：

```c
buf = realloc(buf, new_size);
```

失败时会丢失原指针，造成泄漏；如果其他别名仍然使用旧对象，还可能引入生命周期混乱。

## 堆对象的状态机

分析堆漏洞时，把每个对象画成状态机：

```text
未分配 -> 已分配 -> 已初始化 -> 使用中 -> 已释放
                         ^             |
                         |             v
                      错误复用 <- 悬空指针
```

重点记录：

- 分配大小。
- 用户区地址。
- 保存该地址的变量和容器。
- 是否初始化。
- 是否释放。
- 释放后是否清空所有拥有者引用。
- 是否还有非拥有者别名。

## GDB 与 Pwndbg 观察

原生 GDB 可以观察指针和映射：

```gdb
break malloc
break free
run
info registers rdi rax
info proc mappings
x/16gx <address>
```

在 x86-64 System V ABI 中，`malloc(size)` 的 `size` 通常位于 `rdi`，返回值位于 `rax`。`free(ptr)` 的 `ptr` 通常位于 `rdi`。

Pwndbg 提供更适合堆观察的命令，具体以当前版本帮助为准：

```gdb
heap
bins
tcachebins
malloc_chunk <address>
vis_heap_chunks
```

插件输出是解释后的视图，仍需结合原始内存、glibc 版本和源码/反汇编验证。

## 版本识别

堆分析前应记录：

```bash
ldd --version
ldd ./chall
```

在 GDB 中：

```gdb
info sharedlibrary
```

如果题目提供了 libc，应使用题目 libc 进行本地复现。堆行为强依赖 glibc 版本，尤其是 tcache 引入、Safe-Linking、double free 检查和 hook 移除等变化。

## 常见误区

- “地址在堆上”不代表可以任意读写。
- “释放后程序没崩”不代表释放后使用合法。
- “两次 malloc 返回同一地址”不代表存在漏洞。
- “Pwndbg 显示某个 bin”不代表可以直接控制链表。
- “旧教程能跑”不代表当前 glibc 可复现。
- “堆漏洞”不等于“必须破坏分配器元数据”。很多漏洞只破坏业务对象。

## 分析检查清单

1. 程序使用哪个分配器和 libc 版本？
2. 目标对象请求大小、实际 chunk 大小和用户区范围是什么？
3. 哪些指针拥有对象，哪些只是观察者？
4. 释放后是否清空所有拥有者状态？
5. 是否存在越界写、越界读、重复释放或释放非堆地址？
6. 崩溃发生在程序逻辑、库函数还是分配器检查中？
7. 当前观察是否受 tcache、线程或环境变量影响？
8. 修复是否消除了根因，而不只是绕过某次崩溃？

下一篇：[常见堆漏洞与利用思路](common-heap-vulnerabilities.md)。
