# C++ 基础教程

## C++ 简介

C++ 由 C 语言发展而来，保留了底层内存控制能力，同时加入了类、对象、模板、异常、命名空间、标准库容器等特性。

常见应用场景：

- 系统软件、游戏引擎、图形图像处理。
- 高性能服务、数据库、编译器。
- 逆向、Pwn、CTF 二进制分析中的源码理解和利用实验。

第一个程序：

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, C++!\n";
    return 0;
}
```

## C++ 环境设置

常见编译器：

| 平台 | 编译器 |
| ---- | ------ |
| Windows | MSVC、MinGW-w64、Clang |
| Linux | GCC、Clang |
| macOS | Apple Clang |

Linux 安装 GCC：

```bash
sudo apt update
sudo apt install g++
```

编译：

```bash
g++ -std=c++17 main.cpp -o main
```

## C++ 基本语法

C++ 程序通常由头文件、函数、语句和表达式组成。

```cpp
#include <iostream>

int main() {
    int x = 10;
    std::cout << x << '\n';
    return 0;
}
```

要点：

- 语句通常以分号 `;` 结尾。
- `{}` 表示代码块。
- `main` 是程序入口函数。
- 标准库名称通常位于 `std` 命名空间下。

## C++ 注释

单行注释：

```cpp
// 这是单行注释
```

多行注释：

```cpp
/*
  这是多行注释
*/
```

注释应解释“为什么这样做”，不要重复代码表面含义。

## C++ 数据类型

常见基础类型：

| 类型 | 含义 |
| ---- | ---- |
| `bool` | 布尔值 |
| `char` | 字符 |
| `int` | 整数 |
| `float` | 单精度浮点数 |
| `double` | 双精度浮点数 |
| `void` | 无类型，常用于无返回值函数 |

固定宽度整数建议使用 `<cstdint>`：

```cpp
#include <cstdint>

std::int32_t a = 123;
std::uint64_t b = 456;
```

## C++ 变量类型

变量是有名字的对象。

```cpp
int age = 18;
double score = 99.5;
char grade = 'A';
bool ok = true;
```

现代 C++ 中可以使用 `auto` 让编译器推导类型：

```cpp
auto n = 42;       // int
auto text = "hi"; // const char*
```

## C++ 变量作用域

作用域决定名字在哪里可见。

```cpp
int global_value = 1;

int main() {
    int local_value = 2;
    {
        int block_value = 3;
    }
}
```

常见作用域：

- 全局作用域。
- 命名空间作用域。
- 函数作用域。
- 块作用域。
- 类作用域。

## C++ 常量

`const` 表示对象初始化后不可修改。

```cpp
const int max_count = 100;
```

`constexpr` 表示可在编译期求值：

```cpp
constexpr int square(int x) {
    return x * x;
}
```

优先使用 `const`、`constexpr`，避免使用宏定义常量。

## C++ 修饰符类型

整数类型可使用修饰符改变范围或符号性：

| 修饰符 | 示例 |
| ------ | ---- |
| `signed` | `signed int` |
| `unsigned` | `unsigned int` |
| `short` | `short int` |
| `long` | `long int` |
| `long long` | `long long int` |

注意无符号整数下溢会回绕，条件判断中要特别小心。

## C++ 存储类

常见存储相关关键字：

| 关键字 | 含义 |
| ------ | ---- |
| `static` | 静态存储期或内部链接 |
| `extern` | 声明外部定义 |
| `thread_local` | 线程局部对象 |
| `mutable` | 允许在 `const` 对象中修改成员 |

示例：

```cpp
static int counter = 0;
extern int shared_value;
thread_local int thread_id = 0;
```

## C++ 运算符

常见运算符：

| 类型 | 示例 |
| ---- | ---- |
| 算术 | `+ - * / %` |
| 比较 | `== != < > <= >=` |
| 逻辑 | `&& || !` |
| 位运算 | `& | ^ ~ << >>` |
| 赋值 | `= += -= *= /=` |
| 成员访问 | `. ->` |

位运算在 CTF、逆向和密码学实现中很常见。

## C++ 循环

`for` 循环：

```cpp
for (int i = 0; i < 5; ++i) {
    std::cout << i << '\n';
}
```

范围 `for`：

```cpp
for (int x : values) {
    std::cout << x << '\n';
}
```

`while` 循环：

```cpp
while (condition) {
    // ...
}
```

## C++ 判断

`if` 语句：

```cpp
if (score >= 60) {
    std::cout << "pass\n";
} else {
    std::cout << "fail\n";
}
```

`switch` 语句：

```cpp
switch (op) {
case 1:
    break;
default:
    break;
}
```

## C++ 函数

函数用于封装可复用逻辑。

```cpp
int add(int a, int b) {
    return a + b;
}
```

函数声明和定义可以分离：

```cpp
int add(int a, int b); // 声明
```

## C++ 数字

C++ 支持整数、浮点数和复数。数学函数位于 `<cmath>`。

```cpp
#include <cmath>

double x = std::sqrt(9.0);
double y = std::pow(2.0, 10.0);
```

随机数可使用 `<random>`，不要用简单取模生成安全随机数。

## C++ 数组

C 风格数组：

```cpp
int a[3] = {1, 2, 3};
```

现代 C++ 优先使用 `std::array` 或 `std::vector`：

```cpp
#include <array>
std::array<int, 3> a = {1, 2, 3};
```

## C++ 字符串

`std::string` 位于 `<string>`。

```cpp
#include <string>

std::string s = "flag";
s += "{demo}";
```

相比 C 字符串，`std::string` 会自动管理长度和内存。

## C++ 指针

指针保存对象地址。

```cpp
int x = 10;
int* p = &x;
std::cout << *p << '\n';
```

要避免空指针、悬空指针和越界访问。资源所有权优先使用智能指针。

## C++ 引用

引用是对象的别名，必须初始化。

```cpp
int x = 10;
int& ref = x;
ref = 20;
```

函数参数常用引用避免拷贝：

```cpp
void print(const std::string& s);
```

## C++ 日期 & 时间

传统 C 时间库位于 `<ctime>`，现代 C++ 时间库位于 `<chrono>`。

```cpp
#include <chrono>

auto now = std::chrono::system_clock::now();
```

计时常用：

```cpp
auto start = std::chrono::steady_clock::now();
// ...
auto end = std::chrono::steady_clock::now();
```

## C++ 基本的输入输出

`<iostream>` 提供标准输入输出。

```cpp
#include <iostream>

int n;
std::cin >> n;
std::cout << "n=" << n << '\n';
```

常见对象：

- `std::cin`：标准输入。
- `std::cout`：标准输出。
- `std::cerr`：标准错误。

## C++ 结构体(struct)

结构体用于组织多个字段。

```cpp
struct Point {
    int x;
    int y;
};

Point p{1, 2};
```

C++ 中 `struct` 和 `class` 的主要默认区别是成员访问权限：`struct` 默认 `public`，`class` 默认 `private`。

## C++ vector 容器

`std::vector` 是动态数组。

```cpp
#include <vector>

std::vector<int> v;
v.push_back(1);
v.push_back(2);
```

常用操作：

| 操作 | 含义 |
| ---- | ---- |
| `push_back` | 尾部添加 |
| `pop_back` | 删除尾部 |
| `size` | 元素数量 |
| `empty` | 是否为空 |
| `at` | 带边界检查访问 |

## C++ 数据结构

C++ 标准库提供了常用数据结构：

| 数据结构 | 容器 |
| -------- | ---- |
| 动态数组 | `std::vector` |
| 双端队列 | `std::deque` |
| 链表 | `std::list`、`std::forward_list` |
| 栈 | `std::stack` |
| 队列 | `std::queue` |
| 优先队列 | `std::priority_queue` |
| 集合 | `std::set`、`std::unordered_set` |
| 映射 | `std::map`、`std::unordered_map` |

做算法题和 CTF 脚本辅助时，熟悉这些容器会显著提高效率。
