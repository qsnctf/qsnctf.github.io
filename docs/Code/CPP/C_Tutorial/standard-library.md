# C 标准库

## C 标准库 - 参考手册

C 标准库提供输入输出、字符串处理、数学函数、内存管理、时间、错误处理、可变参数等基础能力。使用标准库需要包含对应头文件。

## C 标准库 - assert.h

`<assert.h>` 提供 `assert`，用于调试期断言。

```c
#include <assert.h>
assert(ptr != NULL);
```

定义 `NDEBUG` 后断言会被禁用。

## C 标准库 - ctype.h

`<ctype.h>` 提供字符分类和转换函数。

| 函数 | 含义 |
| ---- | ---- |
| `isdigit` | 是否数字 |
| `isalpha` | 是否字母 |
| `isspace` | 是否空白 |
| `tolower` | 转小写 |
| `toupper` | 转大写 |

## C 标准库 - errno.h

`<errno.h>` 定义 `errno` 和错误码。很多库函数失败时会设置 `errno`。

```c
if (fp == NULL) {
    perror("fopen");
}
```

## C 标准库 - float.h

`<float.h>` 定义浮点类型范围和精度宏，如 `FLT_MAX`、`DBL_MAX`。

## C 标准库 - limits.h

`<limits.h>` 定义整数类型范围，如 `INT_MAX`、`CHAR_BIT`。

## C 标准库 - locale.h

`<locale.h>` 提供本地化设置。

```c
#include <locale.h>
setlocale(LC_ALL, "");
```

## C 标准库 - math.h

`<math.h>` 提供数学函数。

| 函数 | 含义 |
| ---- | ---- |
| `sqrt` | 平方根 |
| `pow` | 幂 |
| `sin` / `cos` | 三角函数 |
| `fabs` | 浮点绝对值 |

Linux 下使用数学库可能需要链接 `-lm`。

## C 标准库 - setjmp.h

`<setjmp.h>` 提供 `setjmp` 和 `longjmp`，用于非局部跳转。它会破坏普通控制流，可读性差，应谨慎使用。

## C 标准库 - signal.h

`<signal.h>` 提供信号处理。

```c
#include <signal.h>
signal(SIGINT, handler);
```

信号处理函数中可安全调用的函数非常有限。

## C 标准库 - stdarg.h

`<stdarg.h>` 用于可变参数函数，核心宏包括 `va_list`、`va_start`、`va_arg`、`va_end`。

## C 标准库 - stddef.h

`<stddef.h>` 定义 `size_t`、`ptrdiff_t`、`NULL`、`offsetof` 等基础类型和宏。

## C 标准库 - stdio.h

`<stdio.h>` 提供标准输入输出。

| 函数 | 含义 |
| ---- | ---- |
| `printf` | 格式化输出 |
| `scanf` | 格式化输入 |
| `fgets` | 读取一行 |
| `fopen` | 打开文件 |
| `fread` | 读取二进制数据 |
| `fwrite` | 写入二进制数据 |

## C 标准库 - stdlib.h

`<stdlib.h>` 提供内存管理、转换、排序、随机数等函数。

| 函数 | 含义 |
| ---- | ---- |
| `malloc` / `free` | 动态内存分配和释放 |
| `calloc` / `realloc` | 动态内存管理 |
| `atoi` / `strtol` | 字符串转数字 |
| `qsort` | 排序 |
| `bsearch` | 二分查找 |
| `exit` | 退出程序 |

## C 标准库 - string.h

`<string.h>` 提供字符串和内存操作。

| 函数 | 含义 |
| ---- | ---- |
| `strlen` | 字符串长度 |
| `strcmp` | 字符串比较 |
| `strcpy` | 字符串复制 |
| `strncpy` | 限长复制 |
| `memcpy` | 内存复制 |
| `memmove` | 可重叠内存移动 |
| `memset` | 设置内存 |

## C 标准库 - time.h

`<time.h>` 提供时间函数。

```c
time_t now = time(NULL);
```

常用函数包括 `time`、`clock`、`localtime`、`strftime`。

## C 标准库 <stdbool.h>

`<stdbool.h>` 提供 `bool`、`true`、`false`。

```c
#include <stdbool.h>
bool ok = true;
```

## C 标准库 <stdint.h>

`<stdint.h>` 提供固定宽度整数类型，如 `int8_t`、`uint32_t`、`int64_t`。

## C 标准库 <inttypes.h>

`<inttypes.h>` 提供固定宽度整数的格式化宏。

```c
#include <inttypes.h>
printf("%" PRIu64 "\n", value);
```

## C 标准库 <complex.h>

`<complex.h>` 提供复数类型和函数。

```c
#include <complex.h>
double complex z = 1.0 + 2.0 * I;
```

## C 标准库 <tgmath.h>

`<tgmath.h>` 提供类型泛型数学宏，可根据参数类型选择对应数学函数。

## C 标准库 <fenv.h>

`<fenv.h>` 提供浮点环境控制，如舍入模式和浮点异常标志。普通业务代码较少使用，数值计算和底层库中更常见。
