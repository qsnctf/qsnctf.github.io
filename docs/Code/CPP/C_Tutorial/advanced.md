# C 进阶教程

## C 函数指针与回调函数

函数指针保存函数地址。

```c
int add(int a, int b) {
    return a + b;
}

int (*op)(int, int) = add;
```

回调函数是把函数作为参数传入另一个函数。

```c
void apply(int (*fn)(int, int)) {
    fn(1, 2);
}
```

标准库 `qsort` 就使用回调比较函数。

## C 共用体

共用体的所有成员共享同一段内存。

```c
union Value {
    int i;
    float f;
    char bytes[4];
};
```

共用体常用于节省空间或查看同一内存的不同解释方式，但要注意类型别名和可移植性问题。

## C 位域

位域用于在结构体中按 bit 存储字段。

```c
struct Flags {
    unsigned int read : 1;
    unsigned int write : 1;
    unsigned int exec : 1;
};
```

位域布局与实现相关，不适合作为跨平台二进制协议的唯一依据。

## C 输入 & 输出

标准输入输出位于 `<stdio.h>`。

```c
int x;
scanf("%d", &x);
printf("x=%d\n", x);
```

读取字符串时要限制长度：

```c
char buf[32];
scanf("%31s", buf);
```

## C 文件读写

```c
FILE *fp = fopen("data.txt", "r");
if (fp == NULL) {
    perror("fopen");
    return 1;
}
fclose(fp);
```

常用函数：

| 函数 | 含义 |
| ---- | ---- |
| `fopen` | 打开文件 |
| `fclose` | 关闭文件 |
| `fread` | 读取二进制数据 |
| `fwrite` | 写入二进制数据 |
| `fprintf` | 格式化写入 |
| `fgets` | 读取一行文本 |

## C 预处理器

预处理器在编译前处理宏、头文件和条件编译。

```c
#include <stdio.h>
#define MAX_SIZE 1024
```

条件编译：

```c
#ifdef DEBUG
printf("debug\n");
#endif
```

## C 头文件

头文件保存声明，源文件保存定义。

`math_utils.h`：

```c
#ifndef MATH_UTILS_H
#define MATH_UTILS_H

int add(int a, int b);

#endif
```

`math_utils.c`：

```c
#include "math_utils.h"

int add(int a, int b) {
    return a + b;
}
```

## C 强制类型转换

```c
double x = 3.14;
int n = (int)x;
```

强制类型转换可能截断数据、改变符号或破坏别名规则。不要用转换掩盖编译器警告。

## C 错误处理

C 常用返回值、`errno` 和输出参数报告错误。

```c
#include <errno.h>
#include <stdio.h>

FILE *fp = fopen("missing.txt", "r");
if (fp == NULL) {
    perror("fopen");
}
```

约定清晰的错误码比忽略错误更重要。

## C 递归

函数调用自身称为递归。

```c
int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}
```

递归必须有终止条件，否则会栈溢出。

## C 可变参数

可变参数使用 `<stdarg.h>`。

```c
#include <stdarg.h>

int sum(int count, ...) {
    va_list ap;
    va_start(ap, count);
    int total = 0;
    for (int i = 0; i < count; ++i) {
        total += va_arg(ap, int);
    }
    va_end(ap);
    return total;
}
```

`printf` 就是可变参数函数。

## C 内存管理

动态内存函数位于 `<stdlib.h>`。

```c
int *p = malloc(10 * sizeof *p);
if (p == NULL) {
    return 1;
}
free(p);
```

规则：

- 每次 `malloc`/`calloc`/`realloc` 成功后都要有对应 `free`。
- 不要重复 `free`。
- `free` 后不要继续使用指针。
- 计算大小时检查整数溢出。

## C 未定义行为

未定义行为（Undefined Behavior）表示标准不规定结果，编译器可以做任何假设。

常见 UB：

- 数组越界。
- 解引用空指针。
- 使用未初始化局部变量。
- 有符号整数溢出。
- 释放后继续使用。
- 格式化字符串参数类型不匹配。

调试建议：

```bash
cc -fsanitize=address,undefined -g main.c -o main
```

## C 命令行参数

```c
#include <stdio.h>

int main(int argc, char *argv[]) {
    for (int i = 0; i < argc; ++i) {
        printf("argv[%d]=%s\n", i, argv[i]);
    }
}
```

`argc` 是参数数量，`argv` 是参数字符串数组。

## C 安全函数

“安全函数”通常指带长度限制或更明确错误处理的函数。

危险示例：

```c
gets(buf); /* 不要使用 */
```

更安全：

```c
fgets(buf, sizeof buf, stdin);
```

字符串复制优先使用显式长度检查，不要盲目相信输入长度。
