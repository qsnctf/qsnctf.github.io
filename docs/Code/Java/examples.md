# Java 实例

## 读取输入并求和

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}
```

## ArrayList 排序

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>(List.of(3, 1, 2));
        Collections.sort(list);
        System.out.println(list);
    }
}
```

## HashMap 计数

```java
import java.util.*;

Map<String, Integer> count = new HashMap<>();
count.put("a", count.getOrDefault("a", 0) + 1);
```

## 读取文件

```java
import java.nio.file.*;

String text = Files.readString(Path.of("data.txt"));
System.out.println(text);
```

## 简单线程

```java
Thread t = new Thread(() -> System.out.println("hello"));
t.start();
t.join();
```
