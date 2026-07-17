# XXencoding

## 什么是 XXencoding？

XXencoding 是一种把二进制数据转换为可打印文本的编码方式，思想与 Base64、UUencode 类似。它每 3 个字节转换为 4 个可打印字符，方便在早期邮件、文本协议或只能传输可见字符的环境中传输二进制数据。

CTF 中如果看到类似 Base64 但字符集明显不同的文本，可以考虑 XXencoding。

## 字符集

XXencoding 使用 64 个字符表示 6 bit 数据，常见字符表为：

```text
+-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
```

对应索引：

| 索引范围 | 字符 |
| -------- | ---- |
| 0 | `+` |
| 1 | `-` |
| 2-11 | `0-9` |
| 12-37 | `A-Z` |
| 38-63 | `a-z` |

## 编码原理

XXencoding 与 Base64 的核心过程相似：

1. 每 3 个字节组成 24 bit。
2. 把 24 bit 切成 4 组，每组 6 bit。
3. 每组 6 bit 转成 `0-63` 的索引。
4. 用 XXencoding 字符表查表输出。

区别主要在于使用的 64 字符表不同。

## 文件格式特征

完整的 XXencoding 文件通常可能包含类似结构：

```text
begin 644 filename
...
end
```

中间每一行通常以长度字符开头，后面跟编码数据。CTF 题目也可能只给中间的编码正文，不给 `begin` 和 `end`。

## 与 Base64 的区别

| 项目 | Base64 | XXencoding |
| ---- | ------ | ---------- |
| 每组输入 | 3 字节 | 3 字节 |
| 每组输出 | 4 字符 | 4 字符 |
| 单字符承载 | 6 bit | 6 bit |
| 字符表 | `A-Z a-z 0-9 + /` | `+ - 0-9 A-Z a-z` |
| 常见填充 | `=` | 依实现而定 |

## CTF 识别要点

- 字符集可能包含 `+`、`-`、数字、大小写字母。
- 看起来像 Base64，但直接 Base64 解码失败。
- 可能出现 `begin`、`end` 等 UUencode 风格标记。
- 解码后可能得到压缩包、图片、文本或下一层编码。
