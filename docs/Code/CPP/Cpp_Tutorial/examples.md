# C++ 实例

## 读取整数并求和

```cpp
#include <iostream>

int main() {
    int a;
    int b;
    std::cin >> a >> b;
    std::cout << a + b << '\n';
}
```

## vector 排序

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {3, 1, 4, 1, 5};
    std::sort(v.begin(), v.end());
    for (int x : v) {
        std::cout << x << ' ';
    }
}
```

## map 计数

```cpp
#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> count;
    std::string word;
    while (std::cin >> word) {
        ++count[word];
    }
    for (const auto& [k, v] : count) {
        std::cout << k << ' ' << v << '\n';
    }
}
```

## 简单类

```cpp
#include <iostream>

class Counter {
public:
    void inc() { ++value_; }
    int value() const { return value_; }
private:
    int value_ = 0;
};

int main() {
    Counter c;
    c.inc();
    std::cout << c.value() << '\n';
}
```

## 文件复制

```cpp
#include <fstream>
#include <iostream>

int main() {
    std::ifstream in("input.txt", std::ios::binary);
    std::ofstream out("output.txt", std::ios::binary);
    out << in.rdbuf();
}
```
