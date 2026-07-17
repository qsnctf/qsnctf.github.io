# Python3 循环语句

> 本页是 `for`、`while`、`break/continue/else` 的基础总览。高级迭代模式见 [Python for 循环](../advanced/for-loop.md)，重试与状态循环见 [Python while 循环](../advanced/while-loop.md)。

## 概念与用途

`for` 遍历可迭代对象，`while` 在条件成立时重复执行。`break` 立即退出，`continue` 跳过当前轮；循环后的 `else` 仅在没有被 `break` 中止时执行。

## 核心语法

`range()` 生成整数序列，`enumerate()` 同时给出序号和值，`zip()` 并行遍历。循环变量无需提前声明。

| 结构 | 选择依据 | 常见搭配 |
| --- | --- | --- |
| `for` | 已有可迭代数据 | `enumerate`、`zip` |
| `while` | 次数未知，由状态决定 | 超时、最大次数 |
| `break` | 找到结果或无法继续 | 循环 `else` |
| `continue` | 当前项无须处理 | 前置过滤 |

```python
target = 17
for divisor in range(2, target):
    if target % divisor == 0:
        print("不是质数")
        break
else:
    print("是质数")
```

## 示例：同时遍历名称与分数

```python
names = ["Alice", "Bob", "Carol"]
scores = [91, 58, 83]

for index, (name, score) in enumerate(zip(names, scores, strict=True), start=1):
    if score < 60:
        print(index, name, "未通过")
        continue
    print(index, name, "通过", score)
```

基础循环应优先表达“遍历什么”，而不是维护手工下标。若循环主体超过一个屏幕或包含多个嵌套分支，应提取具名函数；若只是映射或过滤，可评估推导式，但复杂逻辑仍以普通循环为宜。

## 常见错误与工程注意

- `range` 右边界不包含在结果中。
- `while` 必须保证状态最终改变，并为外部轮询增加超时或最大次数。
- 不要在循环内重复执行可移到循环外的文件读取或网络连接初始化。
