# Python3 推导式

## 概念与用途

推导式以声明式方式构造列表、集合和字典，适合短小的映射与过滤。生成器表达式使用圆括号并惰性求值，适合只遍历一次的大数据流。

## 核心语法

基本形式为 `[表达式 for 变量 in 可迭代对象 if 条件]`。集合使用 `{expr ...}`，字典使用 `{key: value ...}`；多层推导式的顺序与嵌套循环一致。

```python
words = ["Python", "api", "security", "AI"]
lengths = {word.casefold(): len(word) for word in words if len(word) >= 3}
squares = (number * number for number in range(1, 6))
print(lengths)
print(sum(squares))
```

## 形式对照

| 形式 | 结果 | 是否惰性 |
| --- | --- | --- |
| `[x for x in source]` | list | 否 |
| `{x for x in source}` | set | 否 |
| `{k: v for ...}` | dict | 否 |
| `(x for x in source)` | generator | 是 |

## 示例：嵌套数据展平

```python
matrix = [[1, 2], [3, 4], [5]]
flat = [value for row in matrix for value in row]
coordinates = [(row, column) for row in range(2) for column in range(3)]
print(flat)
print(coordinates)
```

多层推导式按从左到右的嵌套循环顺序阅读。若需要暂停调试、统计错误或复用中间值，应改写为普通循环，不能用复杂推导式隐藏控制流。

## 常见错误与工程注意

- 包含复杂条件、副作用或多层嵌套时，普通循环更易维护。
- 生成器表达式只能消费一次，不要假设第二次遍历仍有数据。
- 不要仅为调用有副作用函数而创建无用列表。
