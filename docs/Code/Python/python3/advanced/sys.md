# Python sys 模块

## 概念与用途

`sys` 暴露解释器和当前进程相关信息，包括命令行参数、模块搜索路径、标准流、退出码和平台。它适合命令行入口和运行环境诊断。

## 核心 API

`sys.argv` 保存参数，`sys.executable` 是解释器路径，`sys.path` 是模块搜索路径，`sys.stdin/out/err` 是标准流，`sys.exit()` 抛出 `SystemExit`。

```python
import sys

print("Python", sys.version_info[:3])
print("解释器", sys.executable)
print("字节序", sys.byteorder)
print("参数", sys.argv[1:])
```

## 常见错误与工程注意

- 复杂命令行不要手工解析 `sys.argv`，使用 `argparse` 提供校验和帮助。
- 随意修改 `sys.path` 会隐藏包结构问题，应正确安装项目或使用模块运行方式。
- 库函数不应随意调用 `sys.exit()`，应抛异常让应用入口决定退出码。
