# C++ 面向对象

## C++ 类 & 对象

类定义一种自定义类型，对象是类的实例。

```cpp
#include <string>

class User {
public:
    User(std::string name) : name_(std::move(name)) {}

    const std::string& name() const {
        return name_;
    }

private:
    std::string name_;
};
```

## C++ 继承

继承用于表达“is-a”关系。

```cpp
class Animal {
public:
    virtual ~Animal() = default;
    virtual void speak() const = 0;
};

class Dog : public Animal {
public:
    void speak() const override;
};
```

公共继承下，派生类对象可以当作基类对象使用。

## C++ 重载运算符和重载函数

函数重载：同名函数可以根据参数列表区分。

```cpp
int add(int a, int b);
double add(double a, double b);
```

运算符重载：让自定义类型支持自然语法。

```cpp
struct Vec2 {
    int x;
    int y;
};

Vec2 operator+(const Vec2& a, const Vec2& b) {
    return {a.x + b.x, a.y + b.y};
}
```

## C++ 多态

多态允许通过基类接口调用派生类行为。

```cpp
void call(const Animal& animal) {
    animal.speak();
}
```

运行时多态依赖虚函数。基类如果用于多态删除，应声明虚析构函数。

## C++ 数据抽象

抽象是隐藏实现细节，只暴露必要接口。

```cpp
class Counter {
public:
    void inc() { ++value_; }
    int value() const { return value_; }
private:
    int value_ = 0;
};
```

用户只需要知道 `inc` 和 `value`，不需要直接操作内部字段。

## C++ 数据封装

封装通过访问控制保护对象不变量。

| 访问控制 | 含义 |
| -------- | ---- |
| `public` | 外部可访问 |
| `protected` | 派生类可访问 |
| `private` | 类内部可访问 |

优先把数据成员设为 `private`，通过成员函数维护合法状态。

## C++ 接口（抽象类）

包含纯虚函数的类是抽象类，不能直接实例化。

```cpp
class Reader {
public:
    virtual ~Reader() = default;
    virtual std::string read() = 0;
};
```

接口适合解耦实现，但过度抽象会增加复杂度。小程序可以先用简单类型和函数表达逻辑。
