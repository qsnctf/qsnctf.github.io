# C++ 数据类型

在使用编程语言进行开发时，需要通过 **变量** 来存储和操作数据。
 变量本质上是 **内存中一块存储空间的名字** ，当创建变量时，系统会根据变量的 **数据类型** 为其分配相应大小的内存，并决定该内存中可以存储的数据形式。

由于程序中可能需要处理不同类型的数据（如字符、整数、浮点数、布尔值等），C++ 提供了丰富的数据类型来满足不同需求。

------

## 一、C++ 基本内置类型

C++ 提供了一组基本的内置数据类型，如下所示：

| 类型     | 关键字    |
| -------- | --------- |
| 布尔型   | `bool`    |
| 字符型   | `char`    |
| 整型     | `int`     |
| 浮点型   | `float`   |
| 双浮点型 | `double`  |
| 无类型   | `void`    |
| 宽字符型 | `wchar_t` |

### 关于 `wchar_t`

`wchar_t` 用于表示宽字符，常用于存储 Unicode 字符。
 在早期实现中，它通常定义为：

```
typedef short int wchar_t;
```

但 **在现代 C++ 中，`wchar_t` 是一种独立的内置类型** ，其大小（2 或 4 字节）取决于平台和编译器。

------

## 二、类型修饰符

某些基本类型可以使用 **类型修饰符** 进行修饰：

| 修饰符     | 说明                 | 示例                   |
| ---------- | -------------------- | ---------------------- |
| `signed`   | 有符号类型（默认）   | `signed int x = -10;`  |
| `unsigned` | 无符号类型           | `unsigned int y = 10;` |
| `short`    | 短整型               | `short int z = 100;`   |
| `long`     | 长整型               | `long int a = 100000;` |
| `const`    | 常量，值不可修改     | `const int b = 5;`     |
| `volatile` | 变量可能被意外修改   | `volatile int c = 10;` |
| `mutable`  | const 对象中仍可修改 | `mutable int counter;` |

> ⚠️ 注意：
>
> - 默认情况下，`int`、`short`、`long` 都是 `signed`
> - `long` 和 `int` 的大小 **与平台和编译器有关**

------

## 三、常见数据类型大小与范围（典型 64 位系统）

> 不同系统和编译器可能存在差异，下表为常见情况（1 字节 = 8 位）：

| 类型          | 大小（字节） | 取值范围              |
| ------------- | ------------ | --------------------- |
| `bool`        | 1            | `true` / `false`      |
| `char`        | 1            | -128 ~ 127 或 0 ~ 255 |
| `short`       | 2            | -32768 ~ 32767        |
| `int`         | 4            | -2³¹ ~ 2³¹-1          |
| `long`        | 8            | -2⁶³ ~ 2⁶³-1          |
| `long long`   | 8            | -9.22e18 ~ 9.22e18    |
| `float`       | 4            | ~6–7 位有效数字       |
| `double`      | 8            | ~15 位有效数字        |
| `long double` | 8 / 12 / 16  | 依平台而定            |

------

## 四、查看数据类型大小示例

可使用 `sizeof` 运算符与 `numeric_limits` 查看类型信息：

```
#include <iostream>
#include <limits>

using namespace std;

int main()
{
    cout << "int size: " << sizeof(int) << endl;
    cout << "int max: " << numeric_limits<int>::max() << endl;
    cout << "int min: " << numeric_limits<int>::min() << endl;
    return 0;
}
```

- `sizeof(T)`：返回类型占用的字节数
- `numeric_limits<T>`：返回类型的数值范围

------

## 五、派生数据类型

| 类型   | 描述           | 示例                            |
| ------ | -------------- | ------------------------------- |
| 数组   | 相同类型的集合 | `int a[5];`                     |
| 指针   | 存储地址       | `int* p;`                       |
| 引用   | 变量别名       | `int& r = x;`                   |
| 函数   | 函数类型       | `int f(int);`                   |
| 结构体 | 多成员数据     | `struct Point {int x,y;};`      |
| 类     | 面向对象类型   | `class MyClass {};`             |
| 联合体 | 共用内存       | `union Data {int i; float f;};` |
| 枚举   | 常量集合       | `enum Color {RED, GREEN};`      |

------

## 六、类型别名

### `typedef`

```
typedef int MyInt;
MyInt a = 10;
```

### `using`（推荐，C++11）

```
using MyInt = int;
```

------

## 七、枚举类型（enum）

枚举用于定义**有限个取值的常量集合**：

```
enum Color { red, green, blue };
Color c = blue;
```

默认从 0 开始递增，也可指定初值：

```
enum Color { red, green = 5, blue }; // blue == 6
```

------

## 八、类型转换（C++ 四种强制转换）

### `static_cast`

- 编译期转换
- 不做运行时检查

```
int i = 10;
float f = static_cast<float>(i);
```

------

###  `dynamic_cast`

- 运行时类型检查
- 仅用于**多态类型**
- 向下转型安全

```
Derived* d = dynamic_cast<Derived*>(basePtr);
```

失败时：

- 指针：返回 `nullptr`
- 引用：抛出 `std::bad_cast`

------

###  `const_cast`

- 用于去除 `const` 限定

```
const int x = 10;
int& y = const_cast<int&>(x);
```

⚠️ 修改原本的 const 对象 → **未定义行为**

------

### `reinterpret_cast`

- 纯比特级重新解释
- 最危险，慎用

```
int i = 10;
float& f = reinterpret_cast<float&>(i);
```

------

## 九、总结建议

- 优先使用 **明确大小和含义的类型**
- 避免滥用 `reinterpret_cast`
- 枚举、`using`、`auto` 能显著提高代码可读性
- 类型大小 **永远不要硬编码假设**