# 环境与构建

本文以 C17/C++17 为基线，介绍从源文件到可执行文件的完整过程。掌握构建流程有助于
定位“编译错误”“链接错误”和“运行错误”，也是理解 CTF 二进制文件的起点。

## 编译器选择

常见工具链如下：

| 平台 | C 编译器 | C++ 编译器 | 调试器 |
| --- | --- | --- | --- |
| Linux | GCC `gcc`、Clang `clang` | `g++`、`clang++` | GDB、LLDB |
| macOS | Apple Clang `clang` | `clang++` | LLDB |
| Windows | MSVC `cl` | MSVC `cl` | Visual Studio 调试器 |
| Windows | MinGW-w64 `gcc` | MinGW-w64 `g++` | GDB |

命令中的 `cc` 和 `c++` 常分别指向系统默认 C/C++ 编译器。不要用 `gcc` 直接链接
C++ 程序，因为它通常不会自动链接 C++ 标准库；使用 `g++` 或 `clang++`。

确认版本：

```bash
cc --version
c++ --version
```

MSVC 应在 “Developer PowerShell for Visual Studio” 中执行：

```powershell
cl
```

## 最小构建

保存下面的 C 程序为 `hello.c`：

```c
#include <stdio.h>
int main(void) {
    printf("value = %d\n", 42);
    return 0;
}
```

GCC 或 Clang：

```bash
cc -std=c17 -Wall -Wextra -Wpedantic hello.c -o hello
./hello
```

MSVC 的 C 模式对 C17 支持并不完整，可使用其已实现的标准特性：

```powershell
cl /std:c17 /W4 /Zi hello.c
.\hello.exe
```

C++17 程序使用 `.cpp` 后缀：

```bash
c++ -std=c++17 -Wall -Wextra -Wpedantic hello.cpp -o hello
```

```powershell
cl /std:c++17 /W4 /EHsc /Zi hello.cpp
```

## 从源码到程序

构建通常经历四步：

1. **预处理**：展开 `#include`、条件编译和宏。
2. **编译**：检查语言规则，将翻译单元转换为汇编或中间表示。
3. **汇编**：生成目标文件，例如 `.o` 或 `.obj`。
4. **链接**：解析跨文件符号和库，生成可执行文件或库。

查看中间结果：

```bash
cc -std=c17 -E main.c -o main.i
cc -std=c17 -S main.c -o main.s
cc -std=c17 -c main.c -o main.o
cc main.o -o app
```

`#include` 是文本包含，不是“导入一个已编译模块”。预处理后的一个源文件称为一个
**翻译单元**。
## 编译错误与链接错误
以下代码缺少声明，会在编译阶段失败：
```c
int main(void) {
    return add(1, 2);
}
```

若已有 `int add(int, int);` 声明但没有任何定义，编译可通过，链接会报告
`undefined reference` 或 `unresolved external symbol`。

多个翻译单元重复定义同一外部符号也会链接失败。声明、定义、链接属性详见
[函数与程序结构](functions-and-program-structure.md)。

## 推荐警告与模式

学习阶段建议让警告尽早暴露问题：

```bash
cc -std=c17 -Wall -Wextra -Wpedantic -Wconversion -Wshadow source.c
c++ -std=c++17 -Wall -Wextra -Wpedantic -Wconversion -Wshadow source.cpp
```

`-Werror` 会把警告变成错误，适合持续集成，但迁移旧项目时应谨慎。不要为消除警告
随意强制转换；先理解是否存在截断、符号变化或接口错误。
构建类型常用配置：
| 用途 | 建议选项 |
| --- | --- |
| 调试 | `-O0 -g3` 或 `-Og -g3` |
| 发布 | `-O2 -DNDEBUG` |
| 动态检查 | `-O1 -g -fsanitize=address,undefined` |
优化等级会改变指令和变量可见性。分析源码级错误时先用调试构建，研究发布二进制时再
观察优化后的行为。
## Sanitizer
GCC/Clang 可用动态检测器发现许多错误：
```bash
cc -std=c17 -O1 -g -fno-omit-frame-pointer \
  -fsanitize=address,undefined main.c -o app
./app
```

- AddressSanitizer：常见越界、释放后使用、重复释放。
- UndefinedBehaviorSanitizer：部分整数、移位、对齐和类型相关 UB。
- LeakSanitizer：部分平台上的内存泄漏。
Sanitizer 不是证明工具，只能检查实际执行到的路径，并且会改变内存布局和性能。
## 多文件构建
假设有 `main.c`、`math_utils.c` 与 `math_utils.h`：
```bash
cc -std=c17 -Wall -Wextra -c main.c -o main.o
cc -std=c17 -Wall -Wextra -c math_utils.c -o math_utils.o
cc main.o math_utils.o -o app
```

只修改 `main.c` 时，不必重新编译 `math_utils.c`。构建系统用于描述这种依赖关系。
## Make 最小示例
```makefile
CC := cc
CFLAGS := -std=c17 -Wall -Wextra -Wpedantic -O0 -g

app: main.o math_utils.o
	$(CC) $^ -o $@

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f app *.o
```

Makefile 的命令行开头必须是 Tab。Windows 原生命令环境下可以使用 CMake 或编译器
自带项目系统。
## CMake 最小示例
```cmake
cmake_minimum_required(VERSION 3.16)
project(demo LANGUAGES C CXX)

set(CMAKE_C_STANDARD 17)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(c_app main.c math_utils.c)
add_executable(cpp_app main.cpp)
```

构建时使用独立目录：
```bash
cmake -S . -B build
cmake --build build
```

不要把生成文件和源文件混在一起，也不要依赖 IDE 中未记录的个人配置。
## 调试器基础
GDB 示例：
```bash
gdb ./app
```

常用命令：
```text
break main       在 main 设置断点
run              启动程序
next             单步执行，不进入函数
step             单步并进入函数
print variable   打印表达式
backtrace        查看调用栈
x/16xb address   按十六进制查看 16 字节内存
continue         继续运行
quit             退出
```

调试时应关注“值为何产生”，而不只是手工把值改到能继续运行。
## 平台和 ABI
ABI 规定目标文件格式、调用约定、名称修饰、类型布局等二进制接口。同一份标准 C++
源码可跨平台编译，但不同 ABI 的目标文件通常不能直接混合链接。`sizeof(long)`、字节序、
路径格式和动态库机制也可能不同。
需要检查平台假设时使用编译期断言：
```c
#include <stdint.h>

_Static_assert(sizeof(uint32_t) == 4, "uint32_t must be 4 bytes");
```

C++17 对应写法是 `static_assert(...)`。
## 构建检查清单
- 明确选择 C17 或 C++17，不依赖默认语言版本。
- 开启警告，保持调试符号可用。
- 区分编译错误、链接错误和运行时错误。
- 第三方库的架构、运行库和 ABI 必须匹配。
- 用构建系统记录源文件、依赖、选项和测试。
- 发布构建与 sanitizer 构建分开验证。
下一篇：[C 语言基础](c-language-basics.md)。