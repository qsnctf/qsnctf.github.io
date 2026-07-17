# C++ 语言基础

本文使用 C++17。C++ 保留了底层控制能力，又提供引用、函数重载、类、模板和标准库。现代 C++ 的重点不是“用 `new` 代替 `malloc`”，而是用类型和 RAII 表达所有权。

## 程序与命名空间

```cpp
#include <iostream>
int main() {
    std::cout << "Hello, C++17!\n";
    return 0;
}
```

标准库名称位于 `std` 命名空间。教程和头文件中应显式写 `std::`。可以在很小的局部作用域引入单个名称：

```cpp
using std::cout;
cout << "local using declaration\n";
```

不要在头文件中写 `using namespace std;`，它会污染所有包含者的名称查找。

## 初始化

C++ 有多种初始化语法：

```cpp
int a = 1;
int b(2);
int c{3};
int d{};       // 值初始化为 0
```

花括号初始化能拒绝多数窄化转换：

```cpp
double pi = 3.14159;
// int bad{pi};  // 编译错误：可能丢失小数
int explicit_value = static_cast<int>(pi);
```

局部内置类型仍可能未初始化，优先在声明处给出有意义的初值。

## `const`、`constexpr` 与 `auto`

```cpp
const int runtime_limit = 100;
constexpr int compile_limit = 256;
auto count = 0;          // int
auto ratio = 0.5;        // double
```

`const` 表示通过该对象不能修改值；`constexpr` 要求可用于常量求值。`auto` 从初始化器
推导类型，不会让 C++ 变成动态类型语言。使用 `auto` 时仍应让表达式语义清楚。
```cpp
const auto bytes = data.size();
```

## 引用
引用是已有对象的别名，定义时必须绑定：
```cpp
int value = 10;int& ref = value;ref += 5;       // value 变为 15const int& view = value;
```

`const T&` 常用于避免复制且不允许函数修改实参。引用不是拥有者，也不能延长任意对象的
生命周期；返回局部变量的引用会产生悬空引用。

右值引用 `T&&` 支持移动语义，通常在资源管理类和泛型代码中使用，详见[C++ OOP、STL 与 RAII](cpp-oop-stl-and-raii.md)。

## 字符串

优先使用 `std::string` 管理可变文本：

```cpp
#include <iostream>
#include <string>
int main() {
    std::string name;
    std::getline(std::cin, name);
    std::cout << "hello, " << name << '\n';
}
```

`std::string` 管理存储并记录长度，但 `operator[]` 不检查边界；`at()` 会在越界时抛出
`std::out_of_range`。

```cpp
if (!name.empty()) {
    std::cout << name.at(0) << '\n';
}
```

`c_str()` 返回以 `\0` 结尾的只读指针，主要用于调用 C API。修改字符串后，先前取得的
指针可能失效。
## `std::vector`
`std::vector<T>` 是连续存储、可动态增长的序列：

```cpp
#include <iostream>
#include <vector>
int main() {
    std::vector<int> values{3, 1, 4};
    values.push_back(1);
    for (const int value : values) {
        std::cout << value << '\n';
    }
}
```

用 `size()` 获取元素数，用 `data()` 获取连续内存首地址。扩容可能使指针、引用和迭代器失效；不要在 `push_back` 后继续使用旧的元素地址，除非确认未发生重分配。

## 条件、循环和范围 `for`

C++ 的 `if`、`switch`、`while`、`for` 与 C 相似。范围 `for` 适合遍历容器：

```cpp
for (int& value : values) {
    value *= 2;
}
for (const int value : values) {
    std::cout << value << ' ';
}
```

当元素复制昂贵时使用 `const auto&`；若需要修改元素则使用 `auto&`。

C++17 支持带初始化语句的条件：

```cpp
if (const auto pos = name.find(':'); pos != std::string::npos) {
    std::cout << "colon at " << pos << '\n';
}
```

## 枚举与结构体

作用域枚举不会把枚举项泄漏到外层，也不会隐式转换为整数：

```cpp
enum class Status {
    ok,
    invalid,
    io_error
};
struct Point {
    int x{};
    int y{};
};
Point p{3, 4};
Status status = Status::ok;
```

`struct` 与 `class` 的主要语言差异是默认成员访问权限和默认继承权限；两者都能拥有
成员函数、构造函数和模板。
## 函数重载与默认参数
```cpp
int area(int width, int height) {
    return width * height;
}

double area(double width, double height) {
    return width * height;
}
```

重载由参数类型和数量区分，不能只靠返回类型。默认参数通常写在头文件的声明处：
```cpp
void log_message(const std::string& text, bool newline = true);
```

## 类型转换
C++ 的具名转换比 C 风格转换更明确：
- `static_cast<T>`：有语义关系的编译期转换，例如数值转换。
- `dynamic_cast<T>`：多态类层次中的运行时检查。
- `const_cast<T>`：增删 `const`/`volatile` 限定。
- `reinterpret_cast<T>`：低层重新解释，结果高度依赖平台和规则。
```cpp
double input = 12.8;int truncated = static_cast<int>(input);
```

强制转换不是验证。转换前必须确认范围、对齐、对象实际类型和生命周期。
## Lambda
Lambda 是可在表达式中定义的函数对象：
```cpp
#include <algorithm>
#include <vector>

std::vector<int> values{4, 1, 3, 2};std::sort(values.begin(), values.end(), [](int a, int b) {
    return a > b;
});
```

捕获列表 `[]` 控制如何访问外部变量。按引用捕获的对象必须比 lambda 的调用存活更久。
避免默认 `[&]` 跨越当前作用域保存，以免产生悬空引用。
## 异常基础
```cpp
#include <stdexcept>

int positive(int value) {
    if (value <= 0) {
        throw std::invalid_argument("value must be positive");
    }
    return value;
}
```

异常传播时，已构造的自动对象会依次析构，这使 RAII 能可靠清理资源。异常适合表示当前
层无法正常处理的失败；普通分支、输入校验和性能敏感接口也常使用返回值或结果类型。
## C 与 C++ 接口
C++ 名称通常会被修饰。调用 C ABI 的函数时在 C++ 侧使用：
```cpp
extern "C" int c_library_function(int value);
```

这只控制语言链接，不会自动解决类型布局、内存分配器或异常跨边界问题。C 接口应使用
双方 ABI 都明确支持的类型，并约定谁分配、谁释放。
## 本章检查清单
- 使用 C++17 编译，不把 `.cpp` 当 C 文件处理。
- 优先花括号初始化、`std::string` 和 `std::vector`。
- 只在需要时使用 `auto`，保持类型语义可读。
- 引用和指针默认不拥有对象，必须确认生命周期。
- 使用具名转换，并在转换前验证范围和前置条件。
- 不在头文件中使用 `using namespace`。
下一篇：[函数与程序结构](functions-and-program-structure.md)。