# Java 高级教程

## Java 数据结构

Java 常用数据结构主要由集合框架提供，包括 List、Set、Map、Queue 等接口和实现。

## Java 集合框架

| 接口 | 常见实现 | 用途 |
| ---- | -------- | ---- |
| `List` | `ArrayList`、`LinkedList` | 有序可重复 |
| `Set` | `HashSet`、`TreeSet` | 不重复集合 |
| `Map` | `HashMap`、`TreeMap` | 键值映射 |
| `Queue` | `ArrayDeque`、`PriorityQueue` | 队列 |

## Java ArrayList

```java
ArrayList<String> list = new ArrayList<>();
list.add("a");
```

`ArrayList` 底层是动态数组，随机访问快。

## Java LinkedList

```java
LinkedList<Integer> list = new LinkedList<>();
list.addFirst(1);
```

`LinkedList` 可作为双端队列使用，但普通场景优先考虑 `ArrayList`。

## Java HashSet

```java
HashSet<String> set = new HashSet<>();
set.add("flag");
```

`HashSet` 不保证遍历顺序。

## Java HashMap

```java
HashMap<String, Integer> map = new HashMap<>();
map.put("a", 1);
```

键对象应正确实现 `equals` 和 `hashCode`。

## Java Iterator

```java
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    System.out.println(it.next());
}
```

遍历时删除元素应使用 `Iterator.remove()`。

## Java Object

所有类都直接或间接继承自 `Object`。

常见方法：

- `toString`
- `equals`
- `hashCode`
- `getClass`

## Java NIO Files

`java.nio.file.Files` 提供现代文件 API。

```java
Path path = Path.of("data.txt");
String text = Files.readString(path);
```

## Java 泛型

泛型让集合和类具备类型参数。

```java
List<String> names = new ArrayList<>();
```

泛型主要在编译期检查类型，运行时存在类型擦除。

## Java 序列化

实现 `Serializable` 可使用 Java 原生序列化。

```java
class User implements Serializable {}
```

不可信数据反序列化存在安全风险。实际项目中应谨慎使用 Java 原生反序列化。

## Java 网络编程

常见 API：

- `Socket`
- `ServerSocket`
- `HttpClient`

Java 11 HTTP 客户端示例：

```java
HttpClient client = HttpClient.newHttpClient();
```

## Java 发送邮件

发送邮件通常使用 Jakarta Mail。需要 SMTP 服务器、账号和授权码。

注意不要把邮箱密码或 Token 硬编码进仓库。

## Java 多线程编程

```java
Thread t = new Thread(() -> System.out.println("run"));
t.start();
```

常用并发工具位于 `java.util.concurrent`。

## Java Applet 基础

Applet 是早期浏览器中运行 Java 的技术，现代浏览器和 JDK 已基本弃用。学习时了解历史即可，不建议用于新项目。

## Java 文档注释

```java
/**
 * Adds two numbers.
 * @param a first number
 * @param b second number
 * @return sum
 */
int add(int a, int b) { return a + b; }
```

生成文档：

```bash
javadoc *.java
```

## Java 8 新特性

常见特性：

- Lambda 表达式。
- Stream API。
- `Optional`。
- 默认接口方法。
- 新日期时间 API。

## Java MySQL 连接

Java 连接 MySQL 通常使用 JDBC。

```java
Connection conn = DriverManager.getConnection(url, user, password);
```

生产代码应使用连接池，并使用预编译语句防止 SQL 注入。

## Java 9 新特性

常见特性：

- 模块系统 JPMS。
- JShell。
- 集合工厂方法。
- 改进的 Stream API。
