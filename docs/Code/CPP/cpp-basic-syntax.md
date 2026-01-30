# C++基本语法

C++ 程序可以看作是 **对象的集合** ，这些对象通过相互调用各自的方法来完成协作与交互。下面我们简要介绍 **类（Class）** 、 **对象（Object）** 、 **方法（Method）** 以及 **实例变量（Instance Variable）** 的概念。

**对象（Object）**
 对象具有 **状态** 和 **行为** 。例如，一只狗的状态包括颜色、名字、品种等，行为包括摇尾巴、叫唤、进食等。对象是类的一个具体实例。

**类（Class）**
 类是对具有相同属性和行为的一类对象的抽象描述，可以理解为创建对象的模板或蓝图，用于定义对象的状态和行为。

**方法（Method）**
 方法本质上表示对象的一种行为。一个类可以包含多个方法。方法中可以编写程序逻辑，用于操作数据并完成特定功能。

**实例变量（Instance Variable）**
 每个对象都拥有一组独立的实例变量。对象的状态正是由这些实例变量的取值所决定的，不同对象之间的实例变量互不影响。

## C++程序结构

```cpp
#include <iostream>
using namespace std;

// main 函数是程序的入口，程序从这里开始执行
int main()
{
    // 向标准输出打印字符串 "Hello World"
    cout << "Hello World" << endl;

    // 返回 0，表示程序正常结束
    return 0;
}
```

接下来我们讲解一下上面这段程序：

`#include <iostream>`
 引入标准输入输出库，使程序可以使用 `cout`、`cin` 等输入输出功能。

`using namespace std;`
 使用标准命名空间，避免在使用 `cout` 等对象时反复写 `std::`。

`int main()`
 主函数，是 C++ 程序的执行入口。

`cout << "Hello World";`
 将字符串输出到控制台。

`return 0;`
 表示程序成功执行并正常退出。

## 编译和执行

接下来，我们来看如何将源代码保存为文件，并对其进行**编译和运行**。具体步骤如下：

1. **打开文本编辑器**（如 Notepad、VS Code、Vim 等），输入上述 C++ 代码。

2. **将文件保存为 `hello.cpp`**。

3. **打开命令提示符（终端）**，并切换到保存 `hello.cpp` 的目录。

4. 输入以下命令并按回车键，对源代码进行编译：

   ```
   g++ hello.cpp
   ```

   如果代码中没有错误，编译器将不会输出任何提示，并在当前目录下生成一个可执行文件：

   - 在 Linux / macOS 下通常为 `a.out`
   - 在 Windows（MinGW）下通常为 `a.exe`

5. **运行生成的可执行文件**：

   ```
   ./a.out
   ```

6. 屏幕上将显示如下输出结果：

   ```
   Hello World
   ```

**示例完整过程：**

```
$ g++ hello.cpp
$ ./a.out
Hello World
```

请确保：

- 系统环境变量中已正确配置 **g++ 编译器**；
- 当前终端所在目录中包含源文件 `hello.cpp`。

此外，在实际项目中，您还可以使用 **Makefile** 来管理和自动化 C/C++ 程序的编译过程，以提高开发效率。

## C++ 中的分号与语句块

在 C++ 中，**分号（`;`）是语句的结束符**。也就是说，每一条语句都必须以分号结束，用来标识一个逻辑语句的完成。

例如，下面是三条不同的语句：

```
x = y;
y = y + 1;
add(x, y);
```

### 语句块（Block）

**语句块**是由一对大括号 `{}` 包含的一组按逻辑组织的语句，通常用于函数体、条件语句或循环结构中。

例如：

```
{
    cout << "Hello World"; // 输出 Hello World
    return 0;
}
```

### 多条语句与换行

C++ **不以行末作为语句结束的标志**，而是以分号作为判断依据。因此，一行中可以书写多条语句：

```
x = y;
y = y + 1;
add(x, y);
```

等同于：

```
x = y; y = y + 1; add(x, y);
```

不过，为了提高代码的**可读性和可维护性**，通常建议一行只写一条语句。

------

## C++ 标识符

**标识符（Identifier）**用于标识变量、函数、类、模块或其他用户自定义的名称。

标识符的命名规则如下：

- 以字母（`A-Z`、`a-z`）或下划线（`_`）开头；
- 后续可以包含字母、数字（`0-9`）或下划线；
- 不能包含标点符号，如 `@`、`&`、`%` 等；
- C++ **区分大小写**，例如 `Manpower` 和 `manpower` 是两个不同的标识符。

下面是一些合法的标识符示例：

```
mohd        zara        abc         move_name   a_123
myname50    _temp       j           a23b9       retVal
```

------

## C++ 关键字（保留字）

关键字是 C++ 语言中具有特殊含义的**保留字**，不能用作变量名、函数名或其他标识符。

常见的 C++ 关键字包括：

```
asm         else        new         this
auto        enum        operator    throw
bool        explicit    private     true
break       export      protected   try
case        extern      public      typedef
catch       false       register    typeid
char        float       reinterpret_cast   typename
class       for         return      union
const       friend      short       unsigned
const_cast  goto        signed      using
continue    if          sizeof      virtual
default     inline      static      void
delete      int         static_cast volatile
do          long        struct      wchar_t
double      mutable     switch      while
dynamic_cast namespace template
```

完整关键字列表可参考：**C++ 关键字（保留字）完整介绍**。

------

## 三字符组（Trigraphs）

**三字符组**（又称三字符序列）是用于表示另一个字符的三字符组合，特点是**以两个问号 `??` 开头**。

三字符组在早期主要用于解决某些键盘无法输入特定字符的问题。虽然如今已经很少使用，但 C++ 标准仍然支持。

三字符组可以出现在代码的任何位置，包括字符串、字符常量、注释和预处理指令中。

常见的三字符组如下：

| 三字符组 | 替换字符 |
| -------- | -------- |
| ??=      | #        |
| ??/      | \        |
| ??'      | ^        |
| ??(      | [        |
| ??)      | ]        |
| ??!      | \|       |
| ??<      | {        |
| ??>      | }        |
| ??-      | ~        |

如果在源代码中需要连续出现两个问号，又不希望被解释为三字符组，可以使用以下方式：

- 字符串自动连接：`"...?""?..."`
- 转义序列：`"...?\?..."`

从 **Microsoft Visual C++ 2010** 开始，编译器默认不再自动替换三字符组。如需启用，可使用编译选项：

```
/Zc:trigraphs
```

`g++` 编译器仍然默认支持三字符组，但会给出编译警告。

------

## C++ 中的空格（Whitespace）

只包含空格或注释的行称为空白行，**C++ 编译器会完全忽略它们**。

在 C++ 中，空格用于表示：

- 空白符
- 制表符（Tab）
- 换行符
- 注释

空格的主要作用是**分隔语法元素**，以便编译器正确解析代码。例如：

```
int age;
```

在这里，`int` 和 `age` 之间必须至少有一个空格，否则编译器无法区分它们。

而在下面的语句中：

```
fruit = apples + oranges;   // 获取水果的总数
```

`fruit` 与 `=`，或 `=` 与 `apples` 之间的空格并不是必需的，但为了增强代码的**可读性**，通常建议合理使用空格。