**PHP**（Hypertext Preprocessor）是一种用于 **Web 开发的服务器端脚本语言**，主要用于生成动态网页内容，是当前最常用的后端语言之一。PHP 可以嵌入到 HTML 中执行，常用于网站开发、API、内容管理系统等。

- 官网：PHP
- 创建者：Rasmus Lerdorf
- 首次发布：1995 年
- 类型：解释型、弱类型、服务器端语言

## 为什么PHP叫PHP？而不是其他的？

PHP 最初并不叫现在的名字，而是：

> **Personal Home Page Tools**

1994 年，Rasmus Lerdorf 为了管理自己的个人网站，写了一些 CGI 脚本工具，这些工具用来：

- 统计访问量
- 处理表单
- 生成网页内容

他把这些工具叫做：

```
Personal Home Page Tools
```

简称：

```
PHP
```

随着 PHP 被越来越多人使用，功能越来越强，原来的名字不再合适，于是重新定义为：

```
PHP: Hypertext Preprocessor
```

注意：

> 这是一个 **递归缩写（Recursive Acronym）**

类似于：

- GNU = GNU's Not Unix
- WINE = Wine Is Not an Emulator
- PHP = PHP Hypertext Preprocessor

## PHP的特点

### 专门为 Web 设计

PHP 可以直接嵌入 HTML：

```
<?php
echo "Hello World";
?>
```

网页中可以写：

```
<h1><?php echo "Hello"; ?></h1>
```

### 开源免费

PHP 是开源软件，由社区维护。

### 跨平台

PHP 可以运行在：

- Linux
- Windows
- macOS
- Unix

常见组合：

| 组合  | 含义                           |
| ----- | ------------------------------ |
| LAMP  | Linux + Apache + MySQL + PHP   |
| WAMP  | Windows + Apache + MySQL + PHP |
| XAMPP | 跨平台集成环境                 |

### 支持多种数据库

PHP 支持：

- MySQL
- PostgreSQL
- SQLite
- Oracle
- MongoDB

最常见组合：

- PHP + MySQL

MySQL：MySQL