# C++ OOP、STL 与 RAII

C++17 支持面向对象、泛型和函数式风格。高质量 C++ 不要求所有代码都写成类，而是选择
能清楚表达不变量、所有权和算法的最小抽象。

## 类与封装

```cpp
#include <stdexcept>
class Counter {
public:
    explicit Counter(int initial) : value_{initial} {
        if (initial < 0) {
            throw std::invalid_argument("negative counter");
        }
    }
    void increment() { ++value_; }
    int value() const { return value_; }
private:
    int value_{};
};
```

`private` 隐藏实现并保护类不变量，`public` 提供接口。成员函数末尾的 `const` 表示不会
通过该对象修改非 `mutable` 状态。`explicit` 防止单参数构造函数发生意外隐式转换。
初始化列表在进入构造函数体之前初始化成员。成员实际初始化顺序由类内声明顺序决定，
不是初始化列表书写顺序。
## 析构与 RAII
RAII 把资源的获取绑定到对象构造，把释放绑定到析构：
```cpp
#include <cstdio>
#include <memory>
#include <stdexcept>

struct FileCloser {
    void operator()(std::FILE* file) const noexcept {
        if (file != nullptr) {
            std::fclose(file);
        }
    }
};

using File = std::unique_ptr<std::FILE, FileCloser>;

File open_file(const char* path) {
    File file{std::fopen(path, "rb")};
    if (!file) {
        throw std::runtime_error("cannot open file");
    }
    return file;
}
```

无论正常返回还是异常传播，`File` 都会关闭文件。析构函数通常不应抛出异常。
锁也使用 RAII：
```cpp
std::mutex mutex;
{
    std::lock_guard<std::mutex> lock{mutex};
    // 临界区
}
```

## Rule of Zero 与 Rule of Five
类若只含标准值类型，通常无需手写析构、复制和移动操作，这就是 Rule of Zero：
```cpp
struct User {
    std::string name;
    std::vector<int> scores;
};
```

若类直接拥有不能自动管理的资源，可能需要定义：析构函数、复制构造、复制赋值、移动构造、
移动赋值，即 Rule of Five。更好的方案通常是先把资源封装进一个遵守 RAII 的成员。
`std::unique_ptr` 不可复制但可移动：

```cpp
auto first = std::make_unique<int>(42);
auto second = std::move(first);
// first 现在为空，second 拥有对象。
```

移动后的对象仍须可析构和可赋值，但其他状态由具体类型约定。不要假设所有移动都把对象
变成“空值”。

## 继承与多态

```cpp
#include <iostream>
#include <memory>
class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
};
class Rectangle final : public Shape {
public:
    Rectangle(double width, double height)
        : width_{width}, height_{height} {}
    double area() const override { return width_ * height_; }
private:
    double width_;
    double height_;
};
```

通过基类指针删除派生对象时，基类析构函数必须是虚函数。`override` 让编译器检查是否真的
重写虚函数，`final` 禁止继续派生或重写。

按值传递派生对象给基类会发生对象切片。多态接口通常使用 `Shape&`、`Shape*` 或拥有型
`std::unique_ptr<Shape>`。

继承表达 “is-a” 关系；仅为了复用实现时，组合通常更简单。虚调用、对象布局和 ABI 也会
增加耦合，CTF 中常见的虚表只是编译器实现多态的一种 ABI 机制。
## 模板
模板让同一算法适用于多个类型：
```cpp
template <typename T>
const T& maximum(const T& left, const T& right) {
    return left < right ? right : left;
}
```

模板通常在头文件中定义，因为实例化点需要看到完整定义。模板错误可能很长，应先找到最早
指出“不满足哪个操作”的诊断。
```cpp
template <typename Iterator>
int count_positive(Iterator first, Iterator last) {
    int count = 0;
    for (; first != last; ++first) {
        if (*first > 0) ++count;
    }
    return count;
}
```

这展示了迭代器抽象：算法依赖解引用、递增和比较，而不依赖具体容器。
## 常用容器
| 容器 | 特点 | 常见用途 |
| --- | --- | --- |
| `std::array<T, N>` | 固定长度、连续 | 编译期已知大小 |
| `std::vector<T>` | 动态长度、连续 | 默认序列容器 |
| `std::deque<T>` | 分段存储、两端高效 | 双端队列 |
| `std::list<T>` | 双向链表 | 需要稳定节点且频繁中间插入 |
| `std::map<K, V>` | 有序树，`O(log n)` | 有序键值查询 |
| `std::unordered_map<K, V>` | 哈希表，平均 `O(1)` | 无序键值查询 |
| `std::set<T>` | 有序唯一元素 | 集合与排序 |
不要只根据大 O 选择容器。连续存储的缓存局部性常使 `vector` 优于链表；哈希表最坏情况
不是常数时间，并且会受哈希质量和不可信输入影响。
## 迭代器与算法
```cpp
#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> values{4, 1, 3, 2};
    std::sort(values.begin(), values.end());

    const auto found = std::find(values.begin(), values.end(), 3);
    if (found != values.end()) {
        std::cout << "found at " << std::distance(values.begin(), found) << '\n';
    }
}
```

标准算法通常比手写循环更直接地表达意图。迭代器区间使用半开形式 `[first, last)`，
空区间自然表示为 `first == last`。
修改容器可能使迭代器失效。不要在范围 `for` 内随意 `push_back` 到正在遍历的 vector。
## 算法与 Lambda
```cpp
const int threshold = 10;
const auto count = std::count_if(values.begin(), values.end(),
    [threshold](int value) { return value >= threshold; });
```

按值捕获保存副本，按引用捕获依赖外部对象生命周期。异步任务、回调和保存到容器的 lambda
尤其要避免悬空引用。
## 智能指针
- `std::unique_ptr<T>`：唯一所有权，默认选择。
- `std::shared_ptr<T>`：引用计数共享所有权。
- `std::weak_ptr<T>`：观察 `shared_ptr` 管理的对象，不延长生命周期。
```cpp
std::vector<std::unique_ptr<Shape>> shapes;
shapes.push_back(std::make_unique<Rectangle>(3.0, 4.0));
```

不需要动态多态时，直接存对象通常更简单。不要从同一个裸指针构造多个独立
`shared_ptr`，那会形成多个控制块并可能重复删除。

## 异常安全

异常安全常分为：

- 基本保证：失败后对象仍有效且无资源泄漏。
- 强保证：失败后状态不变，如同操作未发生。
- 不抛出保证：操作承诺不抛异常，常标记 `noexcept`。

RAII 是这些保证的基础。先在临时对象上完成可能失败的工作，再提交状态，常能获得强保证。
移动构造标记 `noexcept` 还可能让容器扩容时选择移动而非复制。

## OOP 与 STL 检查清单

- 类维护清晰不变量，构造完成后对象即有效。
- 优先 Rule of Zero，不直接管理裸资源。
- 多态基类需要虚析构，重写函数写 `override`。
- 优先组合，确认继承确实表达替换关系。
- 默认序列容器先考虑 `vector`，再根据需求更换。
- 了解每次容器修改的迭代器失效规则。
- 唯一所有权使用 `unique_ptr`，不要滥用共享所有权。

下一篇：[C/C++ 安全与 CTF](c-cpp-security-and-ctf.md)。
