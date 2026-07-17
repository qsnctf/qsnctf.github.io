# Python3 XML 解析

## 概念与用途

XML 以元素、属性和文本表达树形数据。标准库 `xml.etree.ElementTree` 可处理可信、规模适中的 XML，并支持路径查找和构造输出。

## 核心 API

`ET.fromstring()` 解析字符串，`ET.parse()` 解析文件，`findall()` 查询节点，`Element` 与 `SubElement` 构建文档。

```python
import xml.etree.ElementTree as ET

xml = "<users><user id='1'>Alice</user><user id='2'>Bob</user></users>"
root = ET.fromstring(xml)
for user in root.findall("user"):
    print(user.get("id"), user.text)
```

## API 与规模

| API | 适用输入 | 注意 |
| --- | --- | --- |
| `fromstring()` | 小型内存文本 | 一次构建整棵树 |
| `parse()` | 文件对象 | 仍构建整棵树 |
| `iterparse()` | 大型文档 | 处理后清理元素 |
| `tostring()` | 序列化元素 | 编码与 XML 声明 |

## 示例：构造 XML

```python
import xml.etree.ElementTree as ET

root = ET.Element("users")
user = ET.SubElement(root, "user", {"id": "1"})
user.text = "Alice & Bob"
payload = ET.tostring(root, encoding="unicode")
print(payload)
```

ElementTree 会正确转义文本，但不能替代 schema 校验。标准库无需安装；不可信 XML 推荐安装并使用 `defusedxml`，同时在接收层限制字节数和处理时间。

## 常见错误与安全注意

- 不可信 XML 可能触发实体扩展等攻击，使用 `defusedxml` 并限制输入大小。
- 命名空间会改变标签名称，查询时需提供前缀映射。
- 大文件应使用 `iterparse()` 流式处理并及时清理节点。
