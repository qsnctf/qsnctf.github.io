**ROT**（Rotate）密码是一种简单的替换密码，它将字母或数字按照固定步长循环替换。

常见的类型：

| 类型  | 说明                                              |
| ----- | ------------------------------------------------- |
| ROT13 | 字母按 13 位循环，A→N, B→O...                     |
| ROT5  | 数字按 5 位循环，0→5, 1→6...                      |
| ROT18 | 结合 ROT13 和 ROT5，对字母用 ROT13，对数字用 ROT5 |
| ROT47 | 对 ASCII 可打印字符（从 33 到 126）循环替换       |

 ROT5（数字）

**规则**：`new_digit = (digit + 5) % 10`

| 原始数字 | 加密后 |
| -------- | ------ |
| 0        | 5      |
| 1        | 6      |
| 2        | 7      |
| 3        | 8      |
| 4        | 9      |
| 5        | 0      |
| 6        | 1      |
| 7        | 2      |
| 8        | 3      |
| 9        | 4      |

**示例**：

```
输入: "2019"
输出: "7564"
```

## ROT13（字母）

**规则**：`new_letter = (ord(letter) - base + 13) % 26 + base`

| 原始字母 | 加密后 |
| -------- | ------ |
| A        | N      |
| B        | O      |
| M        | Z      |
| N        | A      |
| Z        | M      |

**示例**：

```
输入: "HelloWorld"
输出: "UryybJbeyq"
```

------

## ROT18（字母+数字）

**规则**：字母用 ROT13，数字用 ROT5

**示例**：

```
输入: "Hello123"
输出: "Uryyb678"
```

- H → U
- e → r
- l → y
- l → y
- o → b
- 1 → 6
- 2 → 7
- 3 → 8

------

## ROT47（ASCII可打印字符）

**规则**：对 `!` 到 `~` 的 ASCII 字符循环 +47

**示例**：

```
输入: "Hello 123!"
输出: "w6==@ (@C:"
```

- H → w
- e → 6
- l → =
- l → =
- o → @
- →   （空格不变）
- 1 → (
- 2 → @
- 3 → C
- ! → :

## Python 实现

这是一个通用 Python 函数，可以实现 ROT5/13/18/47 加密和解密（因为轮换对称，加密=解密）。

```python
def rot(text, method='ROT13'):
    result = ''
    for char in text:
        if method.upper() == 'ROT5' and char.isdigit():
            result += str((int(char) + 5) % 10)
        elif method.upper() == 'ROT13' and char.isalpha():
            if char.isupper():
                result += chr((ord(char) - ord('A') + 13) % 26 + ord('A'))
            else:
                result += chr((ord(char) - ord('a') + 13) % 26 + ord('a'))
        elif method.upper() == 'ROT18':
            if char.isdigit():
                result += str((int(char) + 5) % 10)
            elif char.isalpha():
                if char.isupper():
                    result += chr((ord(char) - ord('A') + 13) % 26 + ord('A'))
                else:
                    result += chr((ord(char) - ord('a') + 13) % 26 + ord('a'))
            else:
                result += char
        elif method.upper() == 'ROT47':
            if 33 <= ord(char) <= 126:
                result += chr(33 + ((ord(char) - 33 + 47) % 94))
            else:
                result += char
        else:
            result += char
    return result

# 测试
text = "Hello qsnctfer!"
print("ROT5:", rot(text, 'ROT5'))
print("ROT13:", rot(text, 'ROT13'))
print("ROT18:", rot(text, 'ROT18'))
print("ROT47:", rot(text, 'ROT47'))
```

------

## 使用逻辑总结

- ROT5 → 只作用数字
- ROT13 → 只作用字母
- ROT18 → ROT5 + ROT13
- ROT47 → ASCII 可打印字符轮换（数字+字母+符号）

> ROT18 可以看作 ROT13+ROT5 的组合，ROT47 可以视作一种更全面的“扩展 ROT”，包括字母、数字和符号。