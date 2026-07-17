# Python __name__

## 概念与用途

解释器为每个模块设置 `__name__`。文件直接执行时值为 `"__main__"`，被导入时则为模块限定名。入口保护可以阻止导入模块时自动运行命令行流程。

## 核心语法

把主要逻辑放入 `main()`，最后判断 `if __name__ == "__main__"`。包内模块可用 `python -m package.module` 运行，以保持导入上下文一致。

```python
def main() -> int:
    print("当前模块名:", __name__)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

## 名称取值规则

| 场景 | `__name__` | 结果 |
| --- | --- | --- |
| `python app.py` | `"__main__"` | 执行入口 |
| `import app` | `"app"` | 不执行入口块 |
| `python -m pkg.app` | `"__main__"` | 保留包导入语义 |
| 包内被导入 | `"pkg.app"` | 可记录模块来源 |

## 示例：可测试的退出码

```python
def main(arguments: list[str]) -> int:
    if "--fail" in arguments:
        print("请求失败")
        return 2
    print("请求成功")
    return 0

print("测试成功路径:", main([]))
print("测试失败路径:", main(["--fail"]))
```

把参数作为值传给 `main()`，测试无需修改全局 `sys.argv`。真正入口再调用 `main(sys.argv[1:])` 并交给 `SystemExit`。

## 常见错误与工程注意

- 不要把可复用函数定义放进入口判断，否则导入后无法使用。
- `__name__` 两侧各有两个下划线，字符串必须准确写成 `"__main__"`。
- 返回整数退出码并交给 `SystemExit`，比在深层逻辑直接退出更易测试。
