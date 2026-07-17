# Python subprocess 模块

## 概念与用途

`subprocess` 创建外部进程、传递参数并捕获标准流，适合调用编译器、系统工具和独立程序。参数列表能绕开 Shell 解析，通常是最安全可靠的方式。

## 核心 API

`subprocess.run()` 覆盖大多数同步调用；`check=True` 在非零退出码时抛异常，`capture_output=True` 捕获输出，`text=True` 进行文本解码，`timeout` 限制运行时间。

```python
import subprocess
import sys

result = subprocess.run(
    [sys.executable, "-c", "print(sum(range(5)))"],
    check=True,
    capture_output=True,
    text=True,
    timeout=5,
)
print(result.stdout.strip())
```

## 常见错误与安全注意

- 用户输入参与命令时避免 `shell=True`，也不要手工拼接整条命令字符串。
- 捕获无限输出可能耗尽内存，大数据应重定向到文件或流式处理。
- 超时后还需考虑子进程创建的后代进程和平台差异。
