# C/C++ 安全与 CTF

本文面向安全编码、代码审计和授权 CTF 环境，只讲漏洞原理、可控实验、检测与防护。不要把这些知识用于未获授权的系统，也不要把竞赛中的假设直接套到真实生产环境。

## 安全分析模型

审计一个 C/C++ 程序时，依次回答：

1. 哪些数据来自文件、网络、环境变量、命令行或用户？
2. 数据在哪一步从字节变成长度、索引、指针或对象？
3. 每个缓冲区的容量、当前长度和终止方式是什么？
4. 整数转换、加法和乘法是否可能改变范围？
5. 谁拥有资源，所有观察者何时失效？
6. 失败路径是否保持状态一致并释放资源？
7. 编译器和平台的 ABI、字节序、对齐假设是什么？

安全问题往往不是单一危险函数造成的，而是多个正确性假设组合后失效。

## 缓冲区越界

下面的错误在 `length > capacity` 时写出边界：

```c
void unsafe_copy(char *destination, const char *source, size_t length) {
    for (size_t i = 0; i < length; ++i) {
        destination[i] = source[i];
    }
}
```

接口没有表达目标容量和源可读长度。更安全的版本显式接收两者：

```c
#include <stdbool.h>
#include <stddef.h>
#include <string.h>
bool copy_bytes(void *destination, size_t destination_size,
                const void *source, size_t source_size) {
    if (source_size > destination_size) {
        return false;
    }
    if (source_size != 0) {
        memcpy(destination, source, source_size);
    }
    return true;
}
```

`memcpy` 不能处理重叠区域，重叠时使用 `memmove`。任何库函数都无法弥补错误的长度来源。
C++ 优先使用 `std::vector`、`std::array`、`std::string` 和迭代器区间。
## 字符串终止与截断
C 字符串必须有 `\0`。固定缓冲区读取后，应确认是否读到完整一行：
```c
char line[64];if (fgets(line, sizeof(line), stdin) == NULL) {
    return INPUT_ERROR;
}

if (strchr(line, '\n') == NULL && !feof(stdin)) {
    /* 输入被截断：消费剩余字符或拒绝该记录。 */
    return INPUT_TOO_LONG;
}
```

仅仅“不会溢出”还不够；静默截断可能改变路径、标识符或认证数据的含义。
## 格式化字符串
格式字符串控制 `printf` 如何读取后续参数。不可信文本不能直接作为格式：
```c
printf(user_text);       /* 错误 */printf("%s", user_text); /* 正确：数据只按字符串输出 */
```

启用 `-Wformat=2`，并尽量让格式字符串为字面量。`snprintf` 可限制输出容量，但仍要检查
返回值：返回值大于等于容量表示发生截断。
## 整数溢出与长度计算
分配 `count * element_size` 前先检查：
```c
#include <stdint.h>
#include <stdlib.h>

void *allocate_array(size_t count, size_t element_size) {
    if (element_size != 0 && count > SIZE_MAX / element_size) {
        return NULL;
    }
    return malloc(count * element_size);
}
```

无符号整数按模回绕，这是良定义行为，但对长度计算通常仍是逻辑漏洞。有符号整数溢出是
未定义行为。还要检查：
- 从较宽类型转换到较窄类型是否截断。
- 负数转换为 `size_t` 是否变成巨大正数。
- `offset + length` 是否在比较前已经溢出。
- 两个来自不可信输入的尺寸相乘是否超过地址空间。
更稳妥的边界判断常写成 `length <= capacity - offset`，前提是先验证
`offset <= capacity`。

## 释放后使用与重复释放

```c
free(buffer);
buffer[0] = 0; /* 未定义行为：对象已不存在 */
```

常见根因包括所有权不清、错误路径重复清理、容器重分配后保存旧地址和异步回调捕获引用。防护重点：

- C 接口文档明确所有权转移和借用期限。
- C 使用单一清理路径，释放后不再访问任何别名。
- C++ 使用值语义和 `std::unique_ptr`。
- 容器修改后重新取得指针、引用和迭代器。
- 使用 AddressSanitizer 覆盖正常与失败路径。

把一个局部指针设为 `NULL` 或 `nullptr` 只能减少该变量被误用的机会，不能修复其他别名。

## 未初始化数据与信息泄露

未初始化局部变量、结构体填充字节和部分填充的输出缓冲区可能携带旧数据：

```c
struct Record record = {0};
record.id = 7;
```

初始化结构体能减少风险，但不要直接把内存布局发送到网络或写入稳定文件格式。应逐字段编码，明确长度、字节序和允许值，同时避免输出未使用的填充字节。

## 解析不可信整数

不要只用 `atoi`，它不能可靠报告错误。使用 `strtol` 并检查完整结果：

```c
#include <errno.h>
#include <limits.h>
#include <stdbool.h>
#include <stdlib.h>
bool parse_int(const char *text, int *result) {
    char *end = NULL;
    errno = 0;
    long value = strtol(text, &end, 10);
    if (text == end || *end != '\0' || errno == ERANGE ||
        value < INT_MIN || value > INT_MAX) {
        return false;
    }
    *result = (int)value;
    return true;
}
```

若允许末尾空白，应显式跳过规定的空白，而不是忽略任意多余字符。

## 二进制格式与字节序

解析文件或协议时，不要把外部字节直接转换为结构体指针：这会涉及对齐、填充、有效类型、字节序和长度问题。逐字节解码更可控：

```c
#include <stdint.h>
uint32_t read_u32_be(const unsigned char bytes[4]) {
    return ((uint32_t)bytes[0] << 24) |
           ((uint32_t)bytes[1] << 16) |
           ((uint32_t)bytes[2] << 8) |
           (uint32_t)bytes[3];
}
```

在读取字段前先确认剩余长度，解析器内部最好维护当前位置与总长度，并让每次读取返回成功或失败。深层嵌套、递归长度和压缩数据还需要资源上限，防止内存或 CPU 耗尽。

## 命令、路径与环境

不要把不可信文本拼接进 shell 命令。优先调用不经过 shell 的进程 API，并把程序名与参数分开传递。处理文件时还要考虑路径遍历、符号链接、竞态、权限和临时文件安全。

读取环境变量或配置后仍需校验；“来自本机”不等于可信，CTF 程序尤其常通过环境改变加载、区域设置或运行行为。

## 编译期加固

开发构建建议：

```bash
cc -std=c17 -O1 -g -Wall -Wextra -Wpedantic -Wconversion \
  -Wshadow -Wformat=2 -fsanitize=address,undefined source.c -o app
```

Linux 上的发布加固选项依编译器和发行版而异，常见概念包括：

- Stack canary：检测部分栈破坏。
- NX/DEP：让数据页默认不可执行。
- ASLR：随机化进程地址布局。
- PIE：使主程序可参与地址随机化。
- RELRO：加强部分重定位表的写保护。
- `_FORTIFY_SOURCE`：在满足优化等条件时加强部分库调用检查。

这些是纵深防御，不会使越界或 UAF 变成正确代码。最终二进制是否启用取决于工具链、链接方式、操作系统和装载器，应检查构建产物而不是只看命令行。

## CTF 二进制基础

授权 CTF 中需要理解：

- ELF、PE 等文件格式以及代码段、数据段、重定位和符号。
- 调用约定：参数、返回值、寄存器保存责任和栈对齐。
- 小端/大端、补码整数、指针宽度和结构体布局。
- 动态链接、导入表、符号解析和 ABI 名称修饰。
- 编译优化如何内联函数、删除变量或重排代码。

反汇编展示的是某个编译器针对某个 ABI 生成的实现，不是 C/C++ 抽象机本身。分析时把机器指令与源码规则对应起来，不能从一次编译结果推导所有平台。

可在自己编译的无害程序上练习：

```bash
cc -std=c17 -O0 -g sample.c -o sample
objdump -d sample
gdb ./sample
```

观察 `main`、函数调用、局部变量和数组布局即可，不需要构造针对外部目标的自动化载荷。

## 测试与模糊测试

安全测试应覆盖：

- 空输入、单字节输入和刚好达到容量的输入。
- 超长输入、最大/最小整数、负数和非法编码。
- 截断文件、重复字段、未知枚举值和深层嵌套。
- 每个分配、读取、写入和解析步骤的失败路径。
- Debug、Release、sanitizer 和至少两个编译器配置。

模糊测试器能自动生成输入探索解析路径，但目标函数必须设置内存、时间和递归限制。发现崩溃后应最小化样例、用 sanitizer 定位根因、添加回归测试，再修复所有同类路径。

## 审计清单

- 所有外部长度都在使用前验证，并在算术前检查溢出。
- 每次数组、指针和迭代器访问都能证明位于有效范围。
- 格式字符串固定，文本只作为数据参数。
- C 字符串有终止符，截断作为显式错误处理。
- 分配与释放匹配，所有权和借用期限清楚。
- 不读取未初始化对象、填充字节或已结束生命周期的对象。
- 整数符号、宽度和转换符合协议语义。
- 错误路径不泄漏资源，也不留下半更新状态。
- 构建启用警告、sanitizer、测试和适合平台的加固。

完成本篇后可返回[学习路线](index.md)复习各主题，或回看[指针、内存与生命周期](pointers-memory-and-lifetime.md)巩固所有权与 UB。
