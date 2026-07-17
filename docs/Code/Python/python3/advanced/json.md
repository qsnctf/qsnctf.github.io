# Python3 JSON

## 概念与用途

JSON 是跨语言数据交换格式，支持对象、数组、字符串、数字、布尔值和 null。Python 的 `json` 模块在 `dict/list/str/int/float/bool/None` 与 JSON 之间转换。

## 核心 API

`loads()`、`dumps()` 处理字符串，`load()`、`dump()` 处理文件对象。`ensure_ascii=False` 保留可读 Unicode，`indent` 控制展示格式。

```python
import json

text = '{"name": "Alice", "active": true}'
data = json.loads(text)
data["roles"] = ["reader", "writer"]
print(json.dumps(data, ensure_ascii=False, indent=2))
```

## 类型映射

| JSON | Python | 注意 |
| --- | --- | --- |
| object | dict | 键必须是字符串语义 |
| array | list | 不保证业务元素类型 |
| number | int/float | 大数和小数精度 |
| null | None | 与缺失字段不同 |

## 示例：精确解析小数

```python
import json
from decimal import Decimal

payload = '{"price": 0.1, "quantity": 3}'
record = json.loads(payload, parse_float=Decimal)
total = record["price"] * record["quantity"]
print(total, type(total).__name__)
```

`json` 是标准库，无需安装。序列化只解决表示问题，不验证业务 schema；API 边界可结合 dataclass/Pydantic 等方案检查必需字段、类型、范围和额外字段策略。

## 常见错误与工程注意

- JSON 不支持集合、字节、日期和任意对象，需要显式转换或自定义编码器。
- 不可信 JSON 应限制请求体大小和嵌套深度，解析成功不代表字段可信。
- 金额或高精度数字可通过 `parse_float=Decimal` 避免二进制浮点误差。
