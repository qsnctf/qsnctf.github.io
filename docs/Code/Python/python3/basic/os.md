# Python3 OS

## 概念与用途

`os` 提供环境变量、进程信息和底层文件系统操作，`pathlib` 提供面向对象的路径 API。新代码通常用 `Path` 处理路径，仅在需要环境和平台能力时使用 `os`。

## 核心 API

常用成员包括 `os.environ`、`os.getcwd()`、`os.replace()` 和 `os.walk()`；`Path.exists()`、`mkdir()`、`iterdir()`、`read_text()` 与 `/` 运算符用于跨平台路径操作。

```python
import os
from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory() as directory:
    output = Path(directory) / "reports"
    output.mkdir()
    (output / "result.txt").write_text(os.name, encoding="utf-8")
    print([path.name for path in output.iterdir()])
```

## API 边界

| 需求 | 推荐 API | 原因 |
| --- | --- | --- |
| 路径拼接 | `Path / name` | 跨平台 |
| 环境变量 | `os.environ.get` | 区分配置来源 |
| 原子替换 | `os.replace` | 同文件系统可靠替换 |
| 递归遍历 | `Path.rglob`/`os.walk` | 控制规模和链接 |

## 示例：读取必需环境变量

```python
import os

def required_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"缺少环境变量 {name}")
    return value

os.environ["DEMO_MODE"] = "test"
print(required_env("DEMO_MODE"))
```

环境变量都是字符串，布尔和数字必须显式解析。遍历不可信目录时要考虑符号链接、权限变化和竞态，检查后再操作并不能自动消除 TOCTOU 风险。

## 常见错误与工程注意

- 不要手工用 `/` 或 `\\` 拼路径，使用 `Path` 或 `os.path.join()`。
- 外部文件名可能包含 `..` 或绝对路径，写入前必须限制在预期根目录内。
- 环境变量中的密钥不要打印到日志或错误页面。
