# Python3 函数

## 概念与用途

函数封装可复用行为，明确输入、输出与异常边界。Python 函数是一等对象，可赋值、传参和返回；参数支持位置、关键字、默认值及可变数量形式。

## 核心语法

`/` 前参数仅限位置，`*` 后参数仅限关键字；`*args` 收集额外位置参数，`**kwargs` 收集额外关键字参数。没有显式 `return` 时返回 `None`。

| 形式 | 含义 | 适用场景 |
| --- | --- | --- |
| `def f(a, b=0)` | 位置或关键字参数 | 普通公开接口 |
| `def f(a, /)` | 仅限位置 | 参数名不属于 API 契约 |
| `def f(*, timeout)` | 仅限关键字 | 强调调用含义，避免位置传错 |
| `*args` / `**kwargs` | 收集额外参数 | 转发、适配器；不应掩盖模糊接口 |

```python
def build_url(host: str, /, path: str = "", *, secure: bool = True) -> str:
    scheme = "https" if secure else "http"
    return f"{scheme}://{host}/{path.lstrip('/')}"

print(build_url("example.com", "docs", secure=True))
```

## 示例：修复可变默认参数

默认值在函数定义时只求值一次。下面使用 `None` 明确表示“调用者没有提供列表”，从而让每次调用得到独立容器。

```python
def add_tag(tag: str, tags: list[str] | None = None) -> list[str]:
    result = [] if tags is None else list(tags)
    result.append(tag)
    return result

print(add_tag("python"))
print(add_tag("security"))
original = ["docs"]
print(add_tag("api", original), original)
```

函数参数和返回值应表达稳定契约。若“找不到”属于正常结果，可返回 `None`；若输入违反前置条件，应抛出具体异常。不要同时用 `None` 表示未找到、解析失败和权限不足。

## 设计边界

- 纯函数只依赖参数并返回结果，容易测试和并发复用；文件、网络、时间等副作用应尽量放在边界层。
- 闭包适合保存少量配置；状态复杂、有多个操作时通常应使用类。
- `return a, b` 实际返回元组。公开返回字段较多时可使用 `dataclass` 或 `NamedTuple`。
- `*args` 和 `**kwargs` 转发时要保留参数语义，不能静默吞掉拼写错误。

## 常见错误与工程注意

- 可变默认参数应写成 `None`，再在函数内创建新容器。
- 函数职责过多、参数过多通常说明边界需要重构。
- 捕获异常后不要返回含糊的 `None`，应定义清晰失败契约。
