# C 语言教程

C 语言是一门接近底层的通用编程语言，常用于操作系统、嵌入式、编译器、网络服务和安全研究。学习 C 能帮助你理解内存、指针、数据布局、函数调用和二进制程序行为。

本教程以 C17 为主要参考标准，示例尽量使用标准 C，避免依赖特定编译器扩展。

## 学习目录

### C 教程

1. [C 简介](basic.md)
2. [C 环境设置](basic.md)
3. [C VScode](basic.md)
4. [C 程序结构](basic.md)
5. [C 基础语法](basic.md)
6. [C 数据类型](basic.md)
7. [C 变量](basic.md)
8. [C 常量](basic.md)
9. [C 存储类](basic.md)
10. [C 运算符](basic.md)
11. [C 判断](basic.md)
12. [C 循环](basic.md)
13. [C 函数](basic.md)
14. [C 作用域规则](basic.md)
15. [C 数组](basic.md)
16. [C enum 枚举](basic.md)
17. [C 指针](basic.md)
18. [C 函数指针与回调函数](advanced.md)
19. [C 字符串](basic.md)
20. [C 结构体](basic.md)
21. [C 共用体](advanced.md)
22. [C 位域](advanced.md)
23. [C typedef](basic.md)
24. [C 输入 & 输出](advanced.md)
25. [C 文件读写](advanced.md)
26. [C 预处理器](advanced.md)
27. [C 头文件](advanced.md)
28. [C 强制类型转换](advanced.md)
29. [C 错误处理](advanced.md)
30. [C 递归](advanced.md)
31. [C 可变参数](advanced.md)
32. [C 内存管理](advanced.md)
33. [C 未定义行为](advanced.md)
34. [C 命令行参数](advanced.md)
35. [C 安全函数](advanced.md)
36. [C 排序算法](algorithms-and-projects.md)
37. [C 项目工程结构](algorithms-and-projects.md)
38. [C 语言实例](examples.md)
39. [C 经典100例](classic-100.md)
40. [C 测验](quiz.md)

### C 标准库

1. [C 标准库 - 参考手册](standard-library.md)
2. [C 标准库 - assert.h](standard-library.md)
3. [C 标准库 - ctype.h](standard-library.md)
4. [C 标准库 - errno.h](standard-library.md)
5. [C 标准库 - float.h](standard-library.md)
6. [C 标准库 - limits.h](standard-library.md)
7. [C 标准库 - locale.h](standard-library.md)
8. [C 标准库 - math.h](standard-library.md)
9. [C 标准库 - setjmp.h](standard-library.md)
10. [C 标准库 - signal.h](standard-library.md)
11. [C 标准库 - stdarg.h](standard-library.md)
12. [C 标准库 - stddef.h](standard-library.md)
13. [C 标准库 - stdio.h](standard-library.md)
14. [C 标准库 - stdlib.h](standard-library.md)
15. [C 标准库 - string.h](standard-library.md)
16. [C 标准库 - time.h](standard-library.md)
17. [C 标准库 - stdbool.h](standard-library.md)
18. [C 标准库 - stdint.h](standard-library.md)
19. [C 标准库 - inttypes.h](standard-library.md)
20. [C 标准库 - complex.h](standard-library.md)
21. [C 标准库 - tgmath.h](standard-library.md)
22. [C 标准库 - fenv.h](standard-library.md)

## 编译命令

```bash
cc -std=c17 -Wall -Wextra -Wpedantic main.c -o main
./main
```

调试构建建议开启符号信息和动态检查：

```bash
cc -std=c17 -O0 -g3 -Wall -Wextra -Wpedantic main.c -o main
cc -std=c17 -O1 -g -fsanitize=address,undefined main.c -o main
```
