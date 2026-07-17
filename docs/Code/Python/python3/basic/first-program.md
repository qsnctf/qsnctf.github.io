# Python3 编程第一步

## 概念与用途

第一个完整程序应体现输入、校验、处理和输出，而不只是打印固定文本。把逻辑放入函数并设置入口，能使代码既可直接执行又可被测试导入。

## 核心语法

`input()` 总返回字符串；函数用 `def` 定义，`return` 返回结果。入口保护 `if __name__ == "__main__"` 防止导入时自动运行交互逻辑。

```python
def celsius_to_fahrenheit(value: float) -> float:
    return value * 9 / 5 + 32

def main() -> None:
    raw = input("摄氏温度: ")
    celsius = float(raw)
    print(f"华氏温度: {celsius_to_fahrenheit(celsius):.1f}")

if __name__ == "__main__":
    main()
```

## 程序分层

| 层次 | 职责 | 测试方式 |
| --- | --- | --- |
| 输入层 | 读取和解析文本 | 无效输入样本 |
| 业务函数 | 执行转换规则 | 直接函数断言 |
| 输出层 | 格式化给用户 | 快照或字符串断言 |
| 入口 | 组装并设置退出码 | 子进程/CLI 测试 |

## 示例：对核心函数做断言

```python
def celsius_to_fahrenheit(value: float) -> float:
    return value * 9 / 5 + 32

assert celsius_to_fahrenheit(0) == 32
assert celsius_to_fahrenheit(100) == 212
assert celsius_to_fahrenheit(-40) == -40
print("全部断言通过")
```

示例程序发展为真实工具后，应使用 `argparse`、日志和自动测试，而不是不断向顶层交互代码增加分支。核心计算函数应尽量不读取终端，便于复用。

## 常见错误与工程注意

- 用户输入可能为空或不是数字，实际程序应捕获 `ValueError` 并允许重试。
- 不要把业务逻辑全部写在顶层，否则难以测试和复用。
- 浮点格式化只影响显示，不会改变内部计算误差。
