# Java 面向对象

## Java 继承

继承使用 `extends`。

```java
class Animal {
    void speak() {}
}

class Dog extends Animal {
    @Override
    void speak() {
        System.out.println("wang");
    }
}
```

Java 只支持类的单继承，但接口可以多实现。

## Java Override/Overload

Override 是重写父类方法：

```java
@Override
void speak() {}
```

Overload 是方法重载，同名方法参数列表不同：

```java
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }
```

## Java 多态

父类引用可以指向子类对象。

```java
Animal animal = new Dog();
animal.speak();
```

运行时会调用实际对象的方法实现。

## Java 抽象类

抽象类可包含抽象方法和普通方法。

```java
abstract class Shape {
    abstract double area();
}
```

抽象类不能直接实例化。

## Java 封装

封装通过访问控制隐藏内部状态。

```java
class User {
    private String name;

    public String getName() {
        return name;
    }
}
```

不要把所有字段都暴露为 `public`。

## Java 接口

接口定义行为契约。

```java
interface Reader {
    String read();
}
```

实现接口：

```java
class FileReader implements Reader {
    public String read() {
        return "data";
    }
}
```

## Java 枚举

```java
enum Level {
    LOW,
    MEDIUM,
    HIGH
}
```

枚举适合表达有限状态集合。

## Java 包(package)

包用于组织类并避免命名冲突。

```java
package com.example.demo;
```

目录结构通常与包名对应。

## Java 反射

反射允许程序在运行时检查类、方法和字段。

```java
Class<?> clazz = Class.forName("java.lang.String");
System.out.println(clazz.getName());
```

反射常用于框架，但也会带来性能、可维护性和安全风险。
