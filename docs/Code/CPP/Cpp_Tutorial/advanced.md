# C++ 高级教程

## C++ 文件和流

文件输入输出使用 `<fstream>`。

```cpp
#include <fstream>
#include <string>

std::ifstream in("input.txt");
std::string line;
while (std::getline(in, line)) {
    // process line
}
```

输出文件：

```cpp
std::ofstream out("output.txt");
out << "hello\n";
```

## C++ 异常处理

异常用于报告无法在当前层处理的错误。

```cpp
#include <stdexcept>

int divide(int a, int b) {
    if (b == 0) {
        throw std::invalid_argument("division by zero");
    }
    return a / b;
}
```

捕获异常：

```cpp
try {
    divide(1, 0);
} catch (const std::exception& e) {
    std::cerr << e.what() << '\n';
}
```

## C++ 动态内存

手动分配：

```cpp
int* p = new int(42);
delete p;
```

现代 C++ 优先使用 RAII、容器和智能指针：

```cpp
#include <memory>

auto p = std::make_unique<int>(42);
```

常见风险包括内存泄漏、重复释放、释放后使用、越界访问。

## C++ 命名空间

命名空间用于避免名称冲突。

```cpp
namespace crypto {
int xor_byte(int a, int b) {
    return a ^ b;
}
}
```

使用：

```cpp
auto x = crypto::xor_byte(1, 2);
```

头文件中不要使用 `using namespace std;`。

## C++ 模板

模板支持泛型编程。

```cpp
template <typename T>
T max_value(T a, T b) {
    return a > b ? a : b;
}
```

类模板：

```cpp
template <typename T>
class Box {
public:
    explicit Box(T value) : value_(value) {}
private:
    T value_;
};
```

STL 容器和算法大量使用模板。

## C++ 预处理器

预处理器在编译前处理宏、条件编译和头文件包含。

```cpp
#include <iostream>
#define BUFFER_SIZE 1024
```

头文件保护：

```cpp
#ifndef DEMO_H
#define DEMO_H

// declarations

#endif
```

现代项目也常用：

```cpp
#pragma once
```

## C++ 信号处理

`<csignal>` 提供信号处理接口。

```cpp
#include <csignal>
#include <iostream>

void handler(int sig) {
    std::cout << "signal: " << sig << '\n';
}

int main() {
    std::signal(SIGINT, handler);
}
```

信号处理函数中能安全调用的操作有限，生产代码需谨慎。

## C++ 多线程

`<thread>` 提供线程支持。

```cpp
#include <thread>
#include <iostream>

void work() {
    std::cout << "work\n";
}

int main() {
    std::thread t(work);
    t.join();
}
```

共享数据需要同步：

```cpp
#include <mutex>

std::mutex m;
```

常见并发工具包括 `std::mutex`、`std::condition_variable`、`std::future`、`std::atomic`。

## C++ Web 编程

C++ 标准库不直接提供 Web 框架。常见选择：

| 场景 | 库/框架 |
| ---- | ------- |
| HTTP 客户端 | libcurl、Boost.Beast |
| HTTP 服务端 | Drogon、Crow、Boost.Beast |
| JSON | nlohmann/json、RapidJSON |
| 网络异步 | Boost.Asio |

Web 编程要重点关注输入校验、超时、并发、日志和错误处理。
