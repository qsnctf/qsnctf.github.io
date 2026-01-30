# C++ 常量（Constants）

**常量**是指在程序执行期间 **值不会发生改变的数据** ，也称为 **字面量（Literal）** 。

常量可以是任何基本数据类型，例如：

- 整型
- 浮点型
- 字符型
- 字符串
- 布尔型

常量在使用方式上类似变量，但 **一旦定义，其值不可修改** 。

------

## 一、整数常量（Integer Literals）

整数常量可以用以下进制表示：

| 进制     | 前缀        | 示例   |
| -------- | ----------- | ------ |
| 十进制   | 无          | `100`  |
| 八进制   | `0`         | `012`  |
| 十六进制 | `0x` / `0X` | `0xFF` |

### 整数后缀

整数常量可以带后缀，用于指定类型：

- `U / u`：无符号整数（unsigned）
- `L / l`：长整数（long）

后缀可以组合，顺序不限。

**示例：**

```cpp
212         // 合法
215u        // 合法
0xFeeL      // 合法
078         // 非法：8 不是八进制数字
032UU       // 非法：重复后缀
```

### 不同形式的整数常量示例

```cpp
85          // 十进制
0213        // 八进制
0x4b        // 十六进制
30          // int
30u         // unsigned int
30l         // long
30ul        // unsigned long
```

------

## 二、浮点常量（Floating-point Literals）

浮点常量可以使用：

- **小数形式**
- **指数形式（科学计数法）**

### 合法的浮点常量

```cpp
3.14159
314159E-5L
```

### 非法的浮点常量

```cpp
510E        // 不完整的指数
210f        // 没有小数或指数
.e55        // 缺少整数或小数部分
```

------

## 三、布尔常量（Boolean Literals）

C++ 只有两个布尔常量：

```cpp
true
false
```

⚠️ 注意：
 不要简单地把 `true` 当作 `1`、`false` 当作 `0`，虽然在底层实现中可能如此，但**语义上它们是布尔值**。

------

## 四、字符常量（Character Literals）

字符常量使用**单引号 `' '`**括起来。

### 普通字符与宽字符

| 类型     | 示例   | 存储类型  |
| -------- | ------ | --------- |
| 普通字符 | `'x'`  | `char`    |
| 宽字符   | `L'x'` | `wchar_t` |

### 字符常量的形式

- 普通字符：`'a'`
- 转义字符：`'\n'`
- Unicode 字符：`'\u02C0'`

------

## 五、转义序列（Escape Sequences）

某些字符需要用反斜杠 `\` 表示特殊含义：

| 转义序列 | 含义         |
| -------- | ------------ |
| `\\`     | 反斜杠       |
| `\'`     | 单引号       |
| `\"`     | 双引号       |
| `\n`     | 换行         |
| `\t`     | 制表符       |
| `\r`     | 回车         |
| `\b`     | 退格         |
| `\a`     | 警报         |
| `\ooo`   | 八进制字符   |
| `\xhh`   | 十六进制字符 |

**示例：**

```cpp
#include <iostream>
using namespace std;

int main()
{
    cout << "Hello\tWorld\n\n";
    return 0;
}
```

**输出：**

```
Hello   World
```

------

## 六、字符串常量（String Literals）

字符串常量使用 **双引号 `" "`**括起来。

字符串可以包含：

- 普通字符
- 转义序列
- Unicode 字符

### 多行字符串

可以使用反斜杠 `\` 进行换行连接：

```cpp
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string greeting = "hello, runoob";
    cout << greeting << "\n";

    string greeting2 = "hello, \
runoob";
    cout << greeting2;

    return 0;
}
```

**输出：**

```cpp
hello, runoob
hello, runoob
```

------

## 七、定义常量的方式

C++ 中定义常量主要有两种方式：

1️⃣ 使用 `#define` 预处理器
 2️⃣ 使用 `const` 关键字（ **推荐** ）

------

### 1️⃣ 使用 `#define`

```cpp
#define identifier value
```

**示例：**

```cpp
#include <iostream>
using namespace std;

#define LENGTH 10
#define WIDTH  5
#define NEWLINE '\n'

int main()
{
    int area = LENGTH * WIDTH;
    cout << area << NEWLINE;
    return 0;
}
```

**输出：**

```
50
```

⚠️ 特点：

- 仅做文本替换
- 不进行类型检查
- 不受作用域限制

------

### 2️⃣ 使用 `const`（更安全）

```cpp
const type variable = value;
```

**示例：**

```cpp
#include <iostream>
using namespace std;

int main()
{
    const int LENGTH = 10;
    const int WIDTH  = 5;
    const char NEWLINE = '\n';

    int area = LENGTH * WIDTH;
    cout << area << NEWLINE;

    return 0;
}
```

**输出：**

```
50
```

✅ 优点：

- 有类型检查
- 遵守作用域规则
- 更安全、可调试性更好

------

## 八、本章小结

- 常量的值在程序运行期间 **不可改变**
- 常量包括：
  - 整数、浮点数、字符、字符串、布尔值
- 定义常量时：
  - **优先使用 `const`**
  - 常量名通常使用 **大写字母**（良好编程习惯）