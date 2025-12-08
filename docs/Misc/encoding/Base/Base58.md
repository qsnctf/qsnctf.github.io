Base58是用于Bitcoin中使用的一种独特的编码方式，主要用于产生Bitcoin的钱包地址。

在某些字体（尤其是等宽字体）和显示场景下，某些字符容易混淆：

- **数字 `0`** 和 **大写字母 `O`** 非常相似
- **大写字母 `I`** 和 **小写字母 `l`** 容易混淆
- **数字 `1`** 和 **小写字母 `l`** 在某些字体中几乎一样

- **不使用非字母数字字符**（`+`、`/`），这样：
  - 可以**双击全选**整个字符串
  - 不会在URL中引起解析问题
  - 不会在文本编辑器中被错误高亮
  - 不会在命令行中需要转义

## base58

典型的 Base58 字母表是（Bitcoin 中使用的）：

```
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
```

Ripple 版本

```
rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz
```

## 编码过程

从开头开始数有多少个 0x00 字节：

data = 00 00 01 23 AB ...

​             ↑ 第一个非 0x00

前导 0x00 的数量 = 2

这些前导零最后会变成前面的若干个 '1' 字符。

把字节串当作大整数 N **（大端）

把整串数据当作一个 **大端**（big-endian）整数：

N = int.from_bytes(data, byteorder="big")

此时 N 是一个很大的十进制整数。

不断除以 58，取余数

类似“十进制转十六进制”的过程，只不过这里的“进制”是 58：

```python
alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
encoded_digits = []
while N > 0:
	N, remainder = divmod(N, 58) # N = N // 58, remainder = N % 58
	encoded_digits.append(alphabet[remainder])
```

这里每个 remainder ∈ [0, 57]，映射到 Base58 字母表中的一个字符。

上一步获得的字符顺序是“低位在前”，需要反转：

```python
encoded_body = ''.join(reversed(encoded_digits)) 
```

最后处理前导零 → 前面补 '1'