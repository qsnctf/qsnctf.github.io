# 函数与程序结构

函数把程序分解为可测试的单元，头文件和源文件把接口与实现分开。本章同时说明 C17 与C++17；代码块会标明语言。

## 声明、定义与调用

函数声明告诉编译器名称、返回类型和参数类型，定义提供函数体：

```c
int add(int left, int right);  /* 声明 */
int main(void) {
    return add(20, 22);
}
int add(int left, int right) { /* 定义 */
    return left + right;
}
```

C 中无参数函数应声明为 `function(void)`。C++ 中 `function()` 已明确表示无参数。返回类型为 `void` 的函数不返回值。

## 按值传递

C 和 C++ 的普通参数都按值传递，函数得到实参的副本：

```c
void increment(int value) {
    ++value;
}
```

调用 `increment(number)` 不会修改 `number`。C 要修改调用者对象，传入指针：

```c
#include <stdbool.h>
bool increment(int *value) {
    if (value == NULL) {
        return false;
    }
    ++*value;
    return true;
}
```

C++ 可用引用表达必需存在的可修改对象：

```cpp
void increment(int& value) {
    ++value;
}
```

指针适合表达“可为空”或需要指针运算的接口；引用适合表达“必须绑定一个对象”。

## 只读参数与复制成本

小型标量通常按值传递。C 中结构体可按指针只读传递：

```c
struct Point { int x; int y; };
int manhattan(const struct Point *point) {
    return point == NULL ? 0 : point->x + point->y;
}
```

C++ 中大型对象通常使用 `const T&`：

```cpp
#include <string>
bool is_empty(const std::string& text) {
    return text.empty();
}
```

不要为了“优化”把所有整数都改成引用；这可能降低可读性并增加别名问题。

## 数组参数

C 函数形参中的数组语法会调整为指针，长度信息不会传入：

```c
int sum(const int values[], size_t count) {
    int total = 0;
    for (size_t i = 0; i < count; ++i) {
        total += values[i];
    }
    return total;
}
```

接口必须同时接收长度，并说明长度单位。C++17 可使用迭代器、`std::array`、
`std::vector` 或模板保留数组长度；`std::span` 要到 C++20 才进入标准库。

```cpp
template <std::size_t N>int sum(const int (&values)[N]) {
    int total = 0;
    for (int value : values) {
        total += value;
    }
    return total;
}
```

## 返回值
不要返回局部对象的地址或引用：
```cpp
const int& bad() {
    int local = 42;
    return local; // 错误：函数结束后 local 已销毁
}
```

C++ 按值返回对象通常高效，编译器可执行复制消除，必要时使用移动语义：
```cpp
#include <string>

std::string greeting(const std::string& name) {
    return "hello, " + name;
}
```

C 可通过返回结构体、输出参数或状态码组合结果。对可能失败的函数，明确区分有效值与错误。
## 递归
```c
unsigned long long factorial(unsigned int n) {
    if (n <= 1u) {
        return 1u;
    }
    return n * factorial(n - 1u);
}
```

递归必须有可达的终止条件。每次调用通常消耗栈空间，深度由输入控制时可能栈耗尽；能用
迭代清晰表达时优先迭代。上例还会很快发生无符号回绕，因此生产接口应限制 `n`。
## 作用域、存储期与链接
- **块作用域**：名字从声明处到所在块结束可见。
- **文件作用域**：名字在函数外声明，从声明处到翻译单元结束可见。
- **自动存储期**：通常进入块时创建，离开块时结束。
- **静态存储期**：对象贯穿程序执行期。
- **外部链接**：名称可由其他翻译单元引用。
- **内部链接**：名称只属于当前翻译单元。
C 文件内私有函数可用 `static`：
```c
static int clamp_to_byte(int value) {
    if (value < 0) return 0;
    if (value > 255) return 255;
    return value;
}
```

C++17 也可将实现细节放进源文件的匿名命名空间。减少全局可见名称能降低耦合。
局部静态对象只初始化一次：
```cpp
int next_id() {
    static int id = 0;
    return ++id;
}
```

它的名字具有块作用域，对象却有静态存储期。多线程修改共享状态需要同步。
## 头文件
头文件放声明、类型定义和必要的内联/模板定义，不放普通非内联函数定义：
```c
#ifndef MATH_UTILS_H
#define MATH_UTILS_H

int add(int left, int right);

#endif
```

实现文件：
```c
#include "math_utils.h"

int add(int left, int right) {
    return left + right;
}
```

包含保护防止同一翻译单元重复包含。`#pragma once` 很常见，但不是 C17/C++17 标准的一部分。
头文件应能独立包含，即自行包含其声明所需的标准头。
## C++ 单一定义规则
C++ 的 One Definition Rule 要求程序中的实体满足规定的定义数量。常见错误包括：
- 在头文件定义普通全局变量，导致多个翻译单元重复定义。
- 在多个源文件给同一类提供不同定义。
- 模板定义只放在 `.cpp`，使用它的翻译单元看不到定义。
C++17 可在头文件使用内联变量：
```cpp
inline constexpr int max_packet_size = 4096;
```

普通全局变量通常在头文件写 `extern` 声明，并在一个源文件定义一次。
## `main` 参数
```c
#include <stdio.h>

int main(int argc, char *argv[]) {
    for (int i = 0; i < argc; ++i) {
        printf("argv[%d] = %s\n", i, argv[i]);
    }
    return 0;
}
```

`argc` 至少为 0；在常见托管环境中 `argv[0]` 表示程序名，但内容和形式依实现与启动方式。
命令行参数是不可信输入，转换数字时应检查完整字符串、范围和错误状态。

## 错误处理

C 常返回状态码并通过输出参数返回结果：

```c
#include <stdbool.h>
bool divide(int left, int right, int *result) {
    if (right == 0 || result == NULL) {
        return false;
    }
    *result = left / right;
    return true;
}
```

C++ 可以使用返回值、异常或封装状态的类型。无论选择哪种方式，都要记录调用者必须处理的失败，并保证失败路径同样释放资源。

## 设计建议

- 一个函数只承担一个清晰职责。
- 参数中表达可空性、只读性、长度和所有权。
- 检查库函数和系统调用返回值。
- 避免隐式共享的可变全局状态。
- 头文件保持自包含和最小依赖。
- 用小测试覆盖正常值、边界值和错误路径。

下一篇：[指针、内存与生命周期](pointers-memory-and-lifetime.md)。
