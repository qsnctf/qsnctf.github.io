# C++ 标准库

## C++ 标准库

C++ 标准库提供输入输出、容器、算法、字符串、时间、线程、智能指针、类型工具等能力。下面按头文件列出常见用途。

## 输入输出与格式化

| 头文件 | 用途 |
| ------ | ---- |
| `<iostream>` | 标准输入输出：`cin`、`cout`、`cerr` |
| `<fstream>` | 文件输入输出：`ifstream`、`ofstream` |
| `<sstream>` | 字符串流：`stringstream` |
| `<iomanip>` | 输出格式控制：`setw`、`setprecision` |
| `<cstdio>` | C 风格 IO：`printf`、`scanf`、`FILE` |

示例：

```cpp
#include <iostream>
#include <iomanip>

std::cout << std::fixed << std::setprecision(2) << 3.14159 << '\n';
```

## 顺序容器

| 头文件 | 用途 |
| ------ | ---- |
| `<array>` | 固定长度数组 `std::array` |
| `<vector>` | 动态数组 `std::vector` |
| `<list>` | 双向链表 `std::list` |
| `<forward_list>` | 单向链表 `std::forward_list` |
| `<deque>` | 双端队列 `std::deque` |

## 容器适配器

| 头文件 | 用途 |
| ------ | ---- |
| `<stack>` | 栈 `std::stack` |
| `<queue>` | 队列 `std::queue` |
| `<queue>` | 优先队列 `std::priority_queue` |

`priority_queue` 没有单独的 `<priority_queue>` 头文件，包含 `<queue>` 即可。

## 关联容器

| 头文件 | 用途 |
| ------ | ---- |
| `<set>` | 有序集合 `std::set`、`std::multiset` |
| `<unordered_set>` | 哈希集合 `std::unordered_set` |
| `<map>` | 有序映射 `std::map`、`std::multimap` |
| `<unordered_map>` | 哈希映射 `std::unordered_map` |

## 算法与迭代器

| 头文件 | 用途 |
| ------ | ---- |
| `<algorithm>` | 排序、查找、复制、变换等算法 |
| `<iterator>` | 迭代器工具 |
| `<functional>` | 函数对象、比较器、`std::function` |
| `<numeric>` | 数值算法，如 `accumulate` |

## 数值与数学

| 头文件 | 用途 |
| ------ | ---- |
| `<complex>` | 复数 |
| `<valarray>` | 数值数组 |
| `<cmath>` | 数学函数 |
| `<cstdlib>` | C 通用工具、随机数、转换等 |
| `<cstdint>` | 固定宽度整数 |
| `<climits>` | 整数类型范围宏 |
| `<cfloat>` | 浮点类型范围宏 |
| `<numbers>` | C++20 数学常量，如 `std::numbers::pi` |

## 字符串、正则与本地化

| 头文件 | 用途 |
| ------ | ---- |
| `<string>` | `std::string`、`std::wstring` |
| `<regex>` | 正则表达式 |
| `<locale>` | 本地化支持 |
| `<codecvt>` | 字符编码转换，C++17 后弃用但旧代码常见 |
| `<cwchar>` | 宽字符 C 接口 |

## 时间与并发

| 头文件 | 用途 |
| ------ | ---- |
| `<ctime>` | C 风格时间接口 |
| `<chrono>` | 现代时间库 |
| `<thread>` | 线程 |
| `<mutex>` | 互斥锁 |
| `<condition_variable>` | 条件变量 |
| `<future>` | 异步任务、future/promise |
| `<atomic>` | 原子操作 |

## 类型、异常与内存

| 头文件 | 用途 |
| ------ | ---- |
| `<type_traits>` | 类型萃取 |
| `<typeinfo>` | RTTI 类型信息 |
| `<exception>` | 异常基类 |
| `<stdexcept>` | 标准异常类型 |
| `<memory>` | 智能指针、分配器 |
| `<new>` | `new` 相关接口 |
| `<utility>` | `pair`、`move`、`forward` |
| `<random>` | 随机数库 |
| `<cassert>` | 断言 `assert` |

## 头文件速查

| 标题 | 说明 |
| ---- | ---- |
| C++ `<iostream>` | 标准输入输出流 |
| C++ `<fstream>` | 文件流 |
| C++ `<sstream>` | 字符串流 |
| C++ `<iomanip>` | IO 格式化 |
| C++ `<array>` | 固定长度数组 |
| C++ `<vector>` | 动态数组 |
| C++ `<list>` | 双向链表 |
| C++ `<forward_list>` | 单向链表 |
| C++ `<deque>` | 双端队列 |
| C++ `<stack>` | 栈适配器 |
| C++ `<queue>` | 队列与优先队列 |
| C++ `<priority_queue>` | 概念上属于优先队列，实际包含 `<queue>` |
| C++ `<set>` | 有序集合 |
| C++ `<unordered_set>` | 哈希集合 |
| C++ `<map>` | 有序映射 |
| C++ `<unordered_map>` | 哈希映射 |
| C++ `<bitset>` | 固定位集合 |
| C++ `<algorithm>` | 通用算法 |
| C++ `<iterator>` | 迭代器工具 |
| C++ `<functional>` | 函数对象和可调用包装 |
| C++ `<numeric>` | 数值算法 |
| C++ `<complex>` | 复数 |
| C++ `<valarray>` | 数值数组 |
| C++ `<cmath>` | 数学函数 |
| C++ `<string>` | 字符串 |
| C++ `<regex>` | 正则表达式 |
| C++ `<ctime>` | C 时间接口 |
| C++ `<chrono>` | 现代时间库 |
| C++ `<thread>` | 线程 |
| C++ `<mutex>` | 互斥锁 |
| C++ `<condition_variable>` | 条件变量 |
| C++ `<future>` | 异步结果 |
| C++ `<atomic>` | 原子操作 |
| C++ `<type_traits>` | 类型萃取 |
| C++ `<typeinfo>` | 类型信息 |
| C++ `<exception>` | 异常基类 |
| C++ `<stdexcept>` | 标准异常 |
| C++ `<cstdio>` | C 标准 IO |
| C++ `<cstdint>` | 固定宽度整数 |
| C++ `<memory>` | 智能指针 |
| C++ `<new>` | 动态分配相关 |
| C++ `<utility>` | 工具组件 |
| C++ `<random>` | 随机数 |
| C++ `<locale>` | 本地化 |
| C++ `<codecvt>` | 编码转换旧接口 |
| C++ `<cassert>` | 断言 |
| C++ `<cwchar>` | 宽字符 C 接口 |
| C++ `<climits>` | 整数范围 |
| C++ `<cfloat>` | 浮点范围 |
| C++ `<cstdlib>` | C 通用工具 |
| C++ `<numbers>` | 数学常量，C++20 |
