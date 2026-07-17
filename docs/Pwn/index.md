# Pwn 介绍

!!! warning "合法与授权"
    Pwn 知识应用于 CTF、课程实验和经过明确授权的安全测试。不要对不属于自己的服务或程序实施攻击。

## Pwn 的起源
pwn 这个词，起源于黑阔的一句俚语，最开始是形容物理防御机制被炸掉的那一下“砰”或者“pong！”，总之，是一个拟声词，后来到了黑阔这里，他们把这个词拿来形容防火墙，服务器保护机制被破掉，获取服务器管理权限的那一下。

## CTFpwn 是什么
那么，CTFpwn是什么呢，他作为ctf竞赛的主方向之一，是二进制的一个分支，另外一个则是Reverse。Pwn题目的表现形式主要是通过分析出题人提供的由C编译的远程服务器文件，利用漏洞攻击nc上去的远程服务器，在获取服务器权限后拿到flag，所以在pwn中，flag是你拿到过远程服务器控制权限的证明，这也是CTF作为网络安全实战模拟的一种体现。获取flag，就是对获取服务器任意数据的一种模拟。

## 学习路线

Pwn 学习不应从“套 payload”开始，而应先理解程序运行时对象、内存边界和调试证据。建议按以下顺序阅读：

1. [栈的概念](stack-concepts.md)：理解线程栈、`rsp/rbp`、`call/ret`、栈帧、参数、局部变量和 ABI 对齐。
2. [栈溢出基础](stack-overflow-basics.md)：理解栈上越界写的根因、崩溃验证、常见保护和修复思路。
3. [堆的概念](heap-concepts.md)：理解动态分配、对象生命周期、glibc chunk、bin、tcache 和版本差异。
4. [常见堆漏洞与利用思路](common-heap-vulnerabilities.md)：理解 UAF、double free、heap overflow、越界读和现代缓解的关系。

## 配套工具

调试和脚本工具放在全局[工具](../Tools/index.md)栏目中维护：

- [GDB 在 Pwn 中的使用](../Tools/Pwn/GDB.md)
- [Pwntools 使用指南](../Tools/Pwn/Pwntools.md)
