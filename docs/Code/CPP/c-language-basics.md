# C 语言基础

本文使用 C17。C 程序由声明、表达式、语句和函数组成；类型决定对象如何存储以及哪些
操作有效。先掌握值与控制流，再进入[指针、内存与生命周期](pointers-memory-and-lifetime.md)。

## 程序结构

```c
#include <stdio.h>
int main(void) {
    int answer = 6 * 7;
    printf("answer = %d\n", answer);
    return 0;
}
```

- `#include` 由预处理器处理。
- `main(void)` 表示不接收参数；`int main()` 在 C 中表示参数未指定。
- 分号结束多数语句，大括号形成复合语句和块作用域。
- `//` 是单行注释，`/* ... */` 是不可嵌套的块注释。

## 基本类型

| 类别 | 常见类型 | 说明 |
| --- | --- | --- |
| 整数 | `char`、`short`、`int`、`long`、`long long` | 可加 `signed` 或 `unsigned` |
| 浮点 | `float`、`double`、`long double` | 范围与精度由实现给出 |
| 布尔 | `_Bool`，通常使用 `<stdbool.h>` 的 `bool` | 值为 0 或 1 |
| 无值 | `void` | 无返回值或无具体对象类型 |

标准不保证具体字节数。`sizeof` 返回 `size_t`：

```c
#include <limits.h>
#include <stdio.h>
int main(void) {
    printf("CHAR_BIT=%d, sizeof(int)=%zu\n", CHAR_BIT, sizeof(int));
    return 0;
}
```

`char`、`signed char`、`unsigned char` 是不同类型；普通 `char` 是否有符号由实现决定。
处理原始字节时通常使用 `unsigned char`。固定宽度整数见 `<stdint.h>`。
## 变量、初始化与常量
```c
int count = 0;
double ratio = 0.5;
const int limit = 100;
```

自动存储期局部变量若未初始化，其值不确定；读取这种值通常导致未定义行为。静态存储期
对象在程序开始前进行零初始化。
`const` 表示不能通过该左值修改对象，但不一定是编译期常量。枚举常量和字面量可用于
更多需要整数常量表达式的场景：

```c
enum { BUFFER_SIZE = 256 };
char buffer[BUFFER_SIZE];
```

整数可写为 `42`、`052`、`0x2a`；后两者分别为八进制和十六进制。浮点字面量默认是
`double`，如 `3.14`；`3.14f` 是 `float`。字符用单引号，字符串用双引号。

## 运算符与转换
常用运算符包括：
- 算术：`+ - * / %`
- 比较：`== != < <= > >=`
- 逻辑：`&& || !`
- 位运算：`& | ^ ~ << >>`
- 赋值：`= += -= *= /=`
- 条件：`condition ? a : b`
整数除法会舍去小数部分：`5 / 2` 得到 `2`。若需要浮点结果，至少一个操作数应为
浮点类型：`5.0 / 2.0`。
```c
unsigned int mask = 1u << 5;
if ((mask & 0x20u) != 0u) {
    puts("bit 5 is set");
}
```

位运算优先使用无符号类型。移位位数越界、对负数左移或产生不可表示的有符号结果都可能
导致未定义行为。
有符号与无符号混合运算会触发“通常算术转换”，负数可能转换成很大的无符号数：
```c
int value = -1;
size_t length = 10;
/* value < length 的结果可能与直觉不同。 */
```

比较前应确保两边语义和范围一致，不要用强制转换掩盖问题。
## 条件与循环
```c
if (score >= 60) {
    puts("pass");
} else {
    puts("retry");
}

for (int i = 0; i < 3; ++i) {
    printf("%d\n", i);
}
```

`while` 先判断再执行，`do ... while` 至少执行一次。`break` 退出最近一层循环或
`switch`，`continue` 进入下一次循环。

```c
switch (command) {
case 'q':
    puts("quit");
    break;
case 'h':
    puts("help");
    break;
default:
    puts("unknown");
    break;
}
```

忘记 `break` 会继续执行后续 `case`。若有意贯穿，应写清注释。
## 数组
```c
int values[] = {10, 20, 30, 40};
size_t count = sizeof(values) / sizeof(values[0]);

for (size_t i = 0; i < count; ++i) {
    printf("%d\n", values[i]);
}
```

数组长度固定且不记录边界。`values[i]` 等价于 `*(values + i)`；越界访问是未定义行为。
上述 `sizeof` 技巧只在数组仍是数组的作用域有效，传入函数后参数会调整为指针。
## C 字符串
C 字符串是以空字符 `\0` 结尾的 `char` 数组：
```c
char name[] = "alice";       /* 6 字节，包含结尾的 \0 */
const char *label = "user";  /* 不得修改字符串字面量 */
```

安全读取一行可使用 `fgets`：
```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char line[64];
    if (fgets(line, sizeof(line), stdin) == NULL) {
        return 1;
    }
    line[strcspn(line, "\n")] = '\0';
    printf("input: %s\n", line);
    return 0;
}
```

`strlen` 不包含结尾的 `\0`，且要求输入确实有终止符。不要使用 `gets`；它已从 C
标准删除，无法限制输入长度。

## 输入输出与格式

`printf` 的格式说明必须与实参类型匹配：

```c
int number = 7;
size_t bytes = sizeof(number);
printf("number=%d, bytes=%zu\n", number, bytes);
```

常见格式为 `%d`（`int`）、`%u`（`unsigned int`）、`%ld`（`long`）、`%f`
（`printf` 中的 `double`）、`%c`、`%s`、`%p`。打印指针时转换为 `void *`：
```c
printf("%p\n", (void *)&number);
```

`scanf` 容易因格式、空白和边界处理出错。面向文本协议时，优先整行读取后使用
`strtol` 等函数解析，并检查结束位置和范围。

## 结构体、枚举和类型别名
```c
typedef struct {
    int x;
    int y;
} Point;

enum Status {
    STATUS_OK,
    STATUS_INVALID,
    STATUS_IO_ERROR
};

int main(void) {
    Point p = {.x = 3, .y = 4};
    printf("(%d, %d)\n", p.x, p.y);
    return STATUS_OK;
}
```

结构体成员按声明顺序排列，但成员之间和末尾可能有填充字节。不要把结构体原始内存直接
当作稳定网络或文件格式；应逐字段序列化，并明确字节序与宽度。
## 预处理器
```c
#define ARRAY_COUNT(a) (sizeof(a) / sizeof((a)[0]))
```

宏是预处理阶段的文本替换，没有普通函数的类型检查，并可能重复求值参数。能用函数、
枚举或 `const` 表达时优先不用宏。条件编译常用于平台适配：
```c
#if defined(_WIN32)
/* Windows-specific code */
#else
/* POSIX-like code */
#endif
```

## 本章检查清单
- 局部变量定义时初始化。
- 数组索引使用与长度匹配的类型，并始终验证边界。
- 区分字符、字符串和原始字节。
- 检查输入函数与库函数返回值。
- 留意整数提升、有符号/无符号转换和溢出。
- 不假设类型大小、结构体布局或主机字节序。
下一篇：[C++ 语言基础](cpp-language-basics.md)。