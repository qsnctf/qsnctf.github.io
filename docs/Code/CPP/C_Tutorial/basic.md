# C 基础教程

## C 简介

C 语言由 Dennis Ritchie 在 20 世纪 70 年代设计，最初用于编写 Unix。它语法简洁、运行高效，能直接操作地址、字节和内存布局。

第一个 C 程序：

```c
#include <stdio.h>

int main(void) {
    printf("Hello, C!\n");
    return 0;
}
```

## C 环境设置

常见编译器：

| 平台 | 编译器 |
| ---- | ------ |
| Windows | MSVC、MinGW-w64、Clang |
| Linux | GCC、Clang |
| macOS | Apple Clang |

Ubuntu 安装 GCC：

```bash
sudo apt update
sudo apt install build-essential
```

编译：

```bash
gcc -std=c17 main.c -o main
```

## C VScode

VS Code 适合配合 C/C++ 扩展使用。

常用扩展：

- C/C++。
- Code Runner。
- CMake Tools。

建议仍然先学会命令行编译，避免只会点击运行按钮而不理解编译和链接过程。

## C 程序结构

典型 C 程序由预处理指令、全局声明、函数定义组成。

```c
#include <stdio.h>

int add(int a, int b);

int main(void) {
    printf("%d\n", add(1, 2));
    return 0;
}

int add(int a, int b) {
    return a + b;
}
```

## C 基础语法

要点：

- 语句通常以分号 `;` 结束。
- `{}` 表示代码块。
- `main` 是程序入口。
- 变量使用前需要声明。
- C 区分大小写。

## C 数据类型

常见类型：

| 类型 | 含义 |
| ---- | ---- |
| `char` | 字符或小整数 |
| `short` | 短整数 |
| `int` | 整数 |
| `long` | 长整数 |
| `float` | 单精度浮点数 |
| `double` | 双精度浮点数 |
| `void` | 无类型 |

固定宽度整数使用 `<stdint.h>`：

```c
#include <stdint.h>

int32_t a = 1;
uint64_t b = 2;
```

## C 变量

变量声明示例：

```c
int count = 10;
double ratio = 0.5;
char ch = 'A';
```

变量必须在生命周期内使用，未初始化局部变量的值是不确定的。

## C 常量

`const` 常量：

```c
const int max_count = 100;
```

宏常量：

```c
#define BUFFER_SIZE 1024
```

优先使用 `const` 或枚举表达常量，宏没有类型检查。

## C 存储类

常见存储类说明符：

| 关键字 | 含义 |
| ------ | ---- |
| `auto` | 自动存储期，局部变量默认行为 |
| `register` | 建议放入寄存器，现代编译器通常忽略 |
| `static` | 静态存储期或内部链接 |
| `extern` | 引用外部定义 |

示例：

```c
static int counter = 0;
extern int shared_value;
```

## C 运算符

| 类型 | 示例 |
| ---- | ---- |
| 算术 | `+ - * / %` |
| 比较 | `== != < > <= >=` |
| 逻辑 | `&& || !` |
| 位运算 | `& | ^ ~ << >>` |
| 赋值 | `= += -= *= /=` |
| 地址/解引用 | `& *` |

位运算常用于掩码、协议解析、逆向和密码学实现。

## C 判断

```c
if (score >= 60) {
    puts("pass");
} else {
    puts("fail");
}
```

`switch`：

```c
switch (op) {
case 1:
    break;
default:
    break;
}
```

## C 循环

`for`：

```c
for (int i = 0; i < 10; ++i) {
    printf("%d\n", i);
}
```

`while`：

```c
while (condition) {
    /* ... */
}
```

`do while`：

```c
do {
    /* ... */
} while (condition);
```

## C 函数

函数用于封装逻辑。

```c
int add(int a, int b) {
    return a + b;
}
```

声明：

```c
int add(int a, int b);
```

## C 作用域规则

作用域决定名字可见范围。

```c
int global_value = 1;

void f(void) {
    int local_value = 2;
    {
        int block_value = 3;
    }
}
```

不要把所有变量都放到全局作用域，会增加维护和测试难度。

## C 数组

数组是一段连续元素。

```c
int a[3] = {1, 2, 3};
```

访问数组必须保证下标合法。越界访问是未定义行为。

## C enum(枚举)

枚举用于定义一组命名整数常量。

```c
enum Color {
    RED,
    GREEN,
    BLUE
};
```

默认从 0 开始递增，也可以显式赋值。

## C 指针

指针保存地址。

```c
int x = 10;
int *p = &x;
printf("%d\n", *p);
```

指针常见风险：

- 空指针解引用。
- 悬空指针。
- 越界访问。
- 类型别名问题。

## C 字符串

C 字符串是以 `\0` 结尾的字符数组。

```c
char s[] = "flag";
```

`strlen` 统计 `\0` 前的字符数：

```c
#include <string.h>
size_t len = strlen(s);
```

使用字符串函数时必须保证缓冲区足够大。

## C 结构体

结构体用于组织多个字段。

```c
struct Point {
    int x;
    int y;
};

struct Point p = {1, 2};
```

结构体在二进制协议、文件格式和逆向分析中非常重要。

## C typedef

`typedef` 可以给类型起别名。

```c
typedef struct Point {
    int x;
    int y;
} Point;
```

使用：

```c
Point p = {1, 2};
```
