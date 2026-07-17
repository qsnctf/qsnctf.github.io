# 指针、内存与生命周期

指针保存对象或函数的地址。它本身只是一个值，不自动说明地址是否有效、数组有多长、
对象由谁拥有。大多数 C/C++ 内存错误都来自这些隐含前置条件被破坏。

## 地址与解引用

```c
#include <stdio.h>
int main(void) {
    int value = 42;
    int *pointer = &value;
    *pointer = 7;
    printf("%d\n", value);
    return 0;
}
```

`&value` 取得地址，`*pointer` 访问所指对象。只有指针指向其类型允许访问且生命周期内的
对象时，解引用才有效。
空指针不指向对象：C 使用 `NULL`，C++ 优先使用 `nullptr`。
```cpp
int* pointer = nullptr;
if (pointer != nullptr) {
    std::cout << *pointer << '\n';
}
```

不要通过解引用空指针来“测试它是否有效”，解引用本身已经是未定义行为。
## 指针与数组
数组在许多表达式中转换为首元素指针：
```c
int values[] = {10, 20, 30};
int *begin = values;
int second = *(begin + 1);
```

指针算术只在同一数组对象及其“尾后位置”范围内有定义。尾后指针可比较或作为循环终点，
但不能解引用。
```c
for (int *it = values; it != values + 3; ++it) {
    printf("%d\n", *it);
}
```

数组不是指针：`sizeof(values)` 是整个数组大小，而 `sizeof(begin)` 是指针大小。
## `const` 的位置
```c
const int *read_only;       /* 不能通过指针修改 int */
int *const fixed_pointer = &value; /* 指针自身不能改指向 */
const int *const both = &value;
```

从标识符向外读声明有助于理解。`const` 不是所有权机制，也不能保证对象不会被其他别名修改。
## `void *` 与对象表示
C 中 `void *` 可与对象指针隐式转换，常用于通用接口；C++ 要求显式转换回来。
`void *` 不能直接解引用，因为没有指向类型和步长信息。

任意对象的字节表示可通过 `unsigned char *` 查看：

```c
unsigned int value = 0x12345678u;
const unsigned char *bytes = (const unsigned char *)&value;
for (size_t i = 0; i < sizeof(value); ++i) {
    printf("%02x ", bytes[i]);
}
```

输出顺序依赖字节序。查看表示不等于可以用任意不相关类型指针重解释对象；有效类型、严格
别名和对齐规则限制了合法访问。

## 存储期与生命周期

常见对象位置可粗略理解为：

| 类别 | 典型对象 | 结束时间 |
| --- | --- | --- |
| 自动存储期 | 普通局部变量 | 离开块 |
| 静态存储期 | 全局、命名空间、局部 `static` | 程序结束 |
| 线程存储期 | `_Thread_local` / `thread_local` | 线程结束 |
| 动态分配 | `malloc` 或 `new` 获得的存储 | 显式释放或所有者析构 |

“栈”和“堆”是常见实现术语，标准核心规则是存储期、对象生命周期和访问是否合法。

```c
int *bad_address(void) {
    int local = 42;
    return &local; /* 返回后悬空 */
}
```

指针值可能仍看似不变，但所指对象已经不存在，不能解引用。

## C 动态内存

```c
#include <stddef.h>
#include <stdlib.h>
int *make_values(size_t count) {
    if (count > SIZE_MAX / sizeof(int)) {
        return NULL;
    }
    int *values = malloc(count * sizeof(*values));
    if (values == NULL && count != 0) {
        return NULL;
    }
    return values;
}
```

调用者负责 `free(values)`。`malloc` 返回未初始化存储，`calloc` 会对字节清零，但全零
位模式不应被泛化为所有类型的任意语义值。

`realloc` 可能移动分配：

```c
int *temporary = realloc(values, new_count * sizeof(*values));
if (temporary != NULL) {
    values = temporary;
}
```

直接写 `values = realloc(...)` 会在失败时丢失原指针。调整大小前仍须检查乘法溢出。
以下配对不可混用：
- `malloc` / `calloc` / `realloc` 对应 `free`。
- C++ `new` 对应 `delete`。
- C++ `new[]` 对应 `delete[]`。
释放后应停止使用所有指向该对象的指针。把其中一个指针设为空不会修复其他别名。
## C 的统一清理路径
C 没有析构函数，多资源函数可使用单一清理出口：
```c
#include <stdio.h>
#include <stdlib.h>

int process(const char *path) {
    int status = -1;
    FILE *file = fopen(path, "rb");
    unsigned char *buffer = NULL;

    if (file == NULL) goto cleanup;
    buffer = malloc(4096);
    if (buffer == NULL) goto cleanup;

    /* 使用 file 和 buffer；每一步都检查结果。 */
    status = 0;

cleanup:
    free(buffer);
    if (file != NULL) fclose(file);
    return status;
}
```

这种受控的 `goto cleanup` 能避免错误路径遗漏释放，与跳转进入未初始化区域完全不同。
## C++ 所有权与 RAII
C++ 应优先使用值、容器和智能指针：
```cpp
#include <memory>
#include <vector>

std::vector<int> values(100, 0);
auto number = std::make_unique<int>(42);
```

`std::vector` 自动管理数组，`std::unique_ptr` 表示唯一所有权。离开作用域时析构函数释放
资源，即使函数通过异常退出也是如此。

`std::shared_ptr` 表示共享所有权，但有引用计数成本，循环引用还会泄漏；只在确实共享
生命周期时使用，以 `std::weak_ptr` 打破非拥有关系。
原始指针和引用在现代 C++ 中通常表示观察者：它们不负责释放，且必须短于所有者寿命。
## 复制、移动与失效
复制拥有资源的裸指针可能导致两个对象重复释放。资源类应遵守 Rule of Zero：把资源交给
标准容器、字符串或智能指针，让编译器生成正确的复制/移动操作。
容器操作可能使观察者失效：
```cpp
std::vector<int> values{1, 2, 3};
int* first = &values[0];
values.push_back(4);
// first 可能已经悬空，因为 vector 可能重分配。
```

每种容器有不同的迭代器失效规则，修改容器前应查明规则。
## 常见未定义行为
- 数组、字符串或容器越界。
- 解引用空指针、悬空指针或未对齐指针。
- 读取未初始化的自动变量。
- 有符号整数溢出或非法移位。
- 重复释放、释放非动态分配地址、错误匹配分配与释放函数。
- 通过不允许的类型访问对象表示。
- C++ 中使用生命周期已结束的对象或错误调用析构。
UB 不保证崩溃，也不保证可重复。编译器警告、sanitizer 和测试能发现一部分问题，但正确
设计所有权、边界和类型才是根本。
## 内存检查清单
- 每个指针都能回答：可为空吗、指向几个元素、能修改吗、拥有吗、有效到何时？
- 长度使用元素数还是字节数必须明确。
- 分配前检查加法和乘法溢出。
- 每次分配都有唯一、可达且匹配的释放责任。
- C++ 优先值语义、容器和 `std::unique_ptr`。
- 修改容器后重新评估指针、引用和迭代器是否有效。
下一篇：[C++ OOP、STL 与 RAII](cpp-oop-stl-and-raii.md)。