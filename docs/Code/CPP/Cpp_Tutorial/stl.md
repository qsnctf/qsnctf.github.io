# C++ STL 教程

## C++ STL 教程

STL（Standard Template Library）是 C++ 标准库中最常用的部分，主要包括容器、迭代器、算法和函数对象。

| 组成 | 示例 |
| ---- | ---- |
| 容器 | `vector`、`map`、`set` |
| 迭代器 | `begin()`、`end()` |
| 算法 | `sort`、`find`、`accumulate` |
| 函数对象 | `less`、lambda |

## C++ 导入标准库

使用标准库需要包含对应头文件：

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
```

标准库名称位于 `std` 命名空间：

```cpp
std::vector<int> values = {3, 1, 2};
std::sort(values.begin(), values.end());
```

不建议在头文件或全局作用域写：

```cpp
using namespace std;
```

## 容器选择

| 需求 | 推荐容器 |
| ---- | -------- |
| 随机访问、尾部增删 | `std::vector` |
| 头尾都要增删 | `std::deque` |
| 有序键值 | `std::map` |
| 快速哈希查找 | `std::unordered_map` |
| 去重有序集合 | `std::set` |
| 栈 | `std::stack` |
| 队列 | `std::queue` |

## 常用算法

```cpp
#include <algorithm>
#include <numeric>
#include <vector>

std::vector<int> v = {3, 1, 2};
std::sort(v.begin(), v.end());
auto it = std::find(v.begin(), v.end(), 2);
int sum = std::accumulate(v.begin(), v.end(), 0);
```

## C++ 有用的资源

- cppreference：https://en.cppreference.com/
- ISO C++：https://isocpp.org/
- Compiler Explorer：https://godbolt.org/
- CMake：https://cmake.org/

学习标准库时，建议优先查 cppreference，注意区分 C++11、C++17、C++20、C++23 的差异。
