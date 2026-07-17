# Java 基础教程

## Java 简介

Java 的核心特点是跨平台、面向对象、拥有丰富标准库和成熟生态。Java 源码编译为 `.class` 字节码，由 JVM 执行。

第一个程序：

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

## Java 开发环境配置

安装 JDK 后检查版本：

```bash
java -version
javac -version
```

常见工具：

- JDK：编译器、运行时和基础工具。
- IntelliJ IDEA：常用 Java IDE。
- Maven/Gradle：项目构建与依赖管理。

## Java 基础语法

Java 程序以类为基本组织单位。

```java
public class Main {
    public static void main(String[] args) {
        int x = 10;
        System.out.println(x);
    }
}
```

要点：

- 文件名通常与 `public class` 类名一致。
- 语句以分号结尾。
- `{}` 表示代码块。
- `main` 方法是程序入口。

## Java 注释

```java
// 单行注释

/* 多行注释 */

/** 文档注释 */
```

文档注释可配合 `javadoc` 生成 API 文档。

## Java 对象和类

类是对象模板，对象是类的实例。

```java
class User {
    String name;

    User(String name) {
        this.name = name;
    }
}
```

创建对象：

```java
User user = new User("Alice");
```

## Java 基本数据类型

| 类型 | 含义 |
| ---- | ---- |
| `byte` | 8 位整数 |
| `short` | 16 位整数 |
| `int` | 32 位整数 |
| `long` | 64 位整数 |
| `float` | 单精度浮点数 |
| `double` | 双精度浮点数 |
| `char` | 16 位 Unicode 字符 |
| `boolean` | 布尔值 |

## Java 变量类型

常见变量类型：

- 局部变量。
- 实例变量。
- 静态变量。

```java
class Counter {
    static int total;
    int value;

    void inc() {
        int step = 1;
        value += step;
    }
}
```

## Java 变量命名规则

变量名可以包含字母、数字、下划线和 `$`，不能以数字开头，不能使用关键字。

推荐使用小驼峰：

```java
int userCount = 10;
```

类名推荐大驼峰：

```java
class UserService {}
```

## Java 修饰符

常见修饰符：

| 修饰符 | 含义 |
| ------ | ---- |
| `public` | 公开访问 |
| `private` | 类内部访问 |
| `protected` | 包内和子类访问 |
| `static` | 属于类 |
| `final` | 不可再赋值、不可继承或不可重写 |
| `abstract` | 抽象类或抽象方法 |

## Java 运算符

| 类型 | 示例 |
| ---- | ---- |
| 算术 | `+ - * / %` |
| 比较 | `== != < > <= >=` |
| 逻辑 | `&& || !` |
| 位运算 | `& | ^ ~ << >> >>>` |
| 赋值 | `= += -= *= /=` |

## Java 循环结构

```java
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

增强 for：

```java
for (String item : items) {
    System.out.println(item);
}
```

## Java 条件语句

```java
if (score >= 60) {
    System.out.println("pass");
} else {
    System.out.println("fail");
}
```

## Java switch case

```java
switch (level) {
    case 1:
        break;
    default:
        break;
}
```

新版本 Java 支持更简洁的 switch 表达式。

## Java Number & Math 类

包装类包括 `Integer`、`Long`、`Double` 等。`Math` 提供数学函数。

```java
int x = Integer.parseInt("123");
double y = Math.sqrt(9.0);
```

## Java Character 类

`Character` 提供字符判断和转换。

```java
Character.isDigit('1');
Character.toUpperCase('a');
```

## Java String 类

`String` 是不可变字符串。

```java
String s = "flag";
System.out.println(s.length());
```

频繁拼接字符串时优先使用 `StringBuilder`。

## Java StringBuffer

`StringBuffer` 是线程安全的可变字符串，`StringBuilder` 通常更快但非线程安全。

```java
StringBuffer sb = new StringBuffer();
sb.append("hello");
```

## Java 数组

```java
int[] nums = {1, 2, 3};
System.out.println(nums[0]);
```

数组长度固定，动态集合常用 `ArrayList`。

## Java 日期时间

现代 Java 推荐使用 `java.time`。

```java
import java.time.LocalDateTime;

LocalDateTime now = LocalDateTime.now();
```

## Java 正则表达式

```java
import java.util.regex.Pattern;

boolean ok = Pattern.matches("\\d+", "12345");
```

复杂正则要注意性能和回溯风险。

## Java 方法

```java
static int add(int a, int b) {
    return a + b;
}
```

Java 参数传递是值传递。对象引用本身也会被复制一份传入方法。

## Java 构造方法

构造方法用于创建对象时初始化状态。

```java
class Point {
    int x;
    int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
```

## Java Stream、File、IO

传统 IO：

```java
import java.io.File;

File file = new File("data.txt");
```

Java 8 Stream：

```java
list.stream()
    .filter(x -> x > 0)
    .forEach(System.out::println);
```

注意：这里的 Stream 和文件 IO 中的 InputStream/OutputStream 不是同一概念。

## Java Scanner 类

```java
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);
int n = scanner.nextInt();
```

`Scanner` 适合教学和简单输入，性能敏感场景可使用 `BufferedReader`。

## Java 异常处理

```java
try {
    int x = Integer.parseInt("abc");
} catch (NumberFormatException e) {
    System.out.println(e.getMessage());
} finally {
    // cleanup
}
```

异常分为受检异常和非受检异常。不要吞掉异常后不记录任何信息。
